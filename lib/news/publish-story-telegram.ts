import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsArticleUrl } from "@/lib/site-url";
import { requestLightningOwnerApproval } from "@/lib/news/lightning-approval";
import {
  LIGHTNING_MAX_PER_DAY,
  LIGHTNING_MIN_STORY_SCORE,
  buildLightningTelegramHtml,
  isLightningAwaitingOwner,
  isLightningImmigrationText,
  type LightningThreadsPayload,
} from "@/lib/news/story-lightning";
import {
  formatThreadsPaste,
  reshapeNewsForThreadsRepost,
} from "@/lib/news/threads-repost-style";

function hasTelegramBotToken(): boolean {
  return Boolean((process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim());
}

export async function countLightningTelegramToday(supabase: SupabaseClient): Promise<number> {
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select("telegram_message_ids")
    .eq("format", "story")
    .eq("status", "published")
    .gte("published_at", since)
    .limit(80);

  if (error) {
    console.warn("[telegram:lightning] count failed:", error.message);
    return 0;
  }

  return (data ?? []).filter((row) => {
    const ids = (row.telegram_message_ids ?? []) as number[];
    return ids.length > 0;
  }).length;
}

export type PublishStoryTelegramParams = {
  supabase: SupabaseClient;
  slug: string;
  topic: NewsTopicConfig;
  title: string;
  excerpt: string;
  sourceLabel: string;
  gateText: string;
  storyScore: number;
  dryRun?: boolean;
  remainingToday?: number;
  llmReason?: string;
  /** Optional body paragraphs for Threads reshape. */
  paragraphs?: string[];
};

export type PublishStoryTelegramResult = {
  /** True only after owner approved and channel post succeeded (not used in queue path). */
  published: boolean;
  /** Draft sent to owner DM for approval. */
  awaitingApproval: boolean;
  skipped: boolean;
  reason?: string;
  html?: string;
  messageIds?: number[];
};

/**
 * Build #молния draft and ask owner in DM (no auto channel publish).
 * Channel post happens only after ✅ via news-bot webhook.
 */
export async function publishStoryLightningToTelegram(
  params: PublishStoryTelegramParams
): Promise<PublishStoryTelegramResult> {
  if (params.storyScore < LIGHTNING_MIN_STORY_SCORE) {
    return { published: false, awaitingApproval: false, skipped: true, reason: "score" };
  }
  if (!isLightningImmigrationText(params.gateText)) {
    return {
      published: false,
      awaitingApproval: false,
      skipped: true,
      reason: "not-lightning-immigration",
    };
  }

  const remaining =
    params.remainingToday ??
    Math.max(0, LIGHTNING_MAX_PER_DAY - (await countLightningTelegramToday(params.supabase)));
  if (remaining <= 0) {
    return { published: false, awaitingApproval: false, skipped: true, reason: "daily-cap" };
  }

  const countryRu = (params.topic.countryRu || params.topic.countryEn || "").trim();
  if (!countryRu) {
    return { published: false, awaitingApproval: false, skipped: true, reason: "missing-country" };
  }

  const reshaped = await reshapeNewsForThreadsRepost({
    countryRu,
    title: params.title,
    excerpt: params.excerpt,
    bodyPreview: (params.paragraphs ?? []).slice(0, 3).join("\n"),
  });

  const title = reshaped?.headline || params.title;
  const slides = reshaped?.slides;
  const excerpt = slides?.join("\n\n") || params.excerpt;

  const html = buildLightningTelegramHtml({
    flag: params.topic.flag,
    countryRu,
    title,
    excerpt,
    articleUrl: newsArticleUrl(params.slug),
    sourceLabel: params.sourceLabel,
    slides,
  });

  const threadsPaste = reshaped ? formatThreadsPaste(reshaped, countryRu) : undefined;
  const pageUrl = newsArticleUrl(params.slug);
  const threadsPayload: LightningThreadsPayload | null = reshaped
    ? {
        v: 1,
        headline: reshaped.headline,
        slides: reshaped.slides,
        countryRu,
        ...(params.topic.flag ? { flag: params.topic.flag } : {}),
        pageUrl,
      }
    : null;

  if (params.dryRun) {
    const req = await requestLightningOwnerApproval({
      supabase: params.supabase,
      slug: params.slug,
      html,
      llmReason: params.llmReason,
      threadsPaste,
      threadsPayload,
      dryRun: true,
    });
    return {
      published: false,
      awaitingApproval: true,
      skipped: true,
      reason: req.reason,
      html,
    };
  }

  if (!hasTelegramBotToken()) {
    console.warn("[telegram:lightning] bot token missing — skip");
    return {
      published: false,
      awaitingApproval: false,
      skipped: true,
      reason: "bot token missing",
      html,
    };
  }

  if (!process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim()) {
    return {
      published: false,
      awaitingApproval: false,
      skipped: true,
      reason: "TELEGRAM_PRIVATE_CHAT_ID missing",
      html,
    };
  }

  // Avoid stacking many pending DMs — one awaiting approval at a time
  // (includes partial: TG done / Threads wait, or Threads done / TG wait).
  const { data: existingRows } = await params.supabase
    .from("emigro_news_digests")
    .select("slug, threads_text")
    .eq("format", "story")
    .not("threads_text", "is", null)
    .limit(40);
  const existingPending = (existingRows ?? []).find(
    (row) =>
      row.slug !== params.slug &&
      isLightningAwaitingOwner(row.threads_text as string | null)
  );
  if (existingPending?.slug) {
    return {
      published: false,
      awaitingApproval: false,
      skipped: true,
      reason: `pending-other:${existingPending.slug}`,
      html,
    };
  }

  const req = await requestLightningOwnerApproval({
    supabase: params.supabase,
    slug: params.slug,
    html,
    llmReason: params.llmReason,
    threadsPaste,
    threadsPayload,
    dryRun: false,
  });

  if (!req.ok) {
    return {
      published: false,
      awaitingApproval: false,
      skipped: false,
      reason: req.reason,
      html,
    };
  }

  console.log(`[telegram:lightning] awaiting owner approval for ${params.slug}`);
  return {
    published: false,
    awaitingApproval: true,
    skipped: false,
    reason: "awaiting-owner",
    html,
  };
}

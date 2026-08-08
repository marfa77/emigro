import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsArticleUrl } from "@/lib/site-url";
import { publishNewsHtmlToChannel } from "@/lib/telegram";
import {
  LIGHTNING_MAX_PER_DAY,
  LIGHTNING_MIN_STORY_SCORE,
  buildLightningTelegramHtml,
  isLightningImmigrationText,
} from "@/lib/news/story-lightning";

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
  /** Combined EN title+snippet+lead used for gate */
  gateText: string;
  storyScore: number;
  dryRun?: boolean;
  /** Pre-checked remaining daily budget (channel-wide). */
  remainingToday?: number;
};

export type PublishStoryTelegramResult = {
  published: boolean;
  skipped: boolean;
  reason?: string;
  html?: string;
  messageIds?: number[];
};

/** Publish strict immigration story tile to @Emigro_news with #молния. */
export async function publishStoryLightningToTelegram(
  params: PublishStoryTelegramParams
): Promise<PublishStoryTelegramResult> {
  if (params.storyScore < LIGHTNING_MIN_STORY_SCORE) {
    return { published: false, skipped: true, reason: "score" };
  }
  if (!isLightningImmigrationText(params.gateText)) {
    return { published: false, skipped: true, reason: "not-lightning-immigration" };
  }

  const remaining =
    params.remainingToday ??
    Math.max(0, LIGHTNING_MAX_PER_DAY - (await countLightningTelegramToday(params.supabase)));
  if (remaining <= 0) {
    return { published: false, skipped: true, reason: "daily-cap" };
  }

  const html = buildLightningTelegramHtml({
    flag: params.topic.flag,
    countryRu: params.topic.countryRu,
    title: params.title,
    excerpt: params.excerpt,
    articleUrl: newsArticleUrl(params.slug),
    sourceLabel: params.sourceLabel,
  });

  if (params.dryRun) {
    console.log(`[telegram:lightning] dry-run ${params.slug}\n${html}`);
    return { published: false, skipped: true, reason: "dry-run", html };
  }

  if (!hasTelegramBotToken()) {
    console.warn("[telegram:lightning] bot token missing — skip");
    return { published: false, skipped: true, reason: "bot token missing", html };
  }

  try {
    const messageIds = await publishNewsHtmlToChannel(html);
    await params.supabase
      .from("emigro_news_digests")
      .update({
        telegram_html: html,
        telegram_message_ids: messageIds,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", params.slug);

    console.log(
      `[telegram:lightning] published ${params.slug} → ${process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news"}`
    );
    return { published: true, skipped: false, html, messageIds };
  } catch (e) {
    console.error(
      `[telegram:lightning] failed ${params.slug}:`,
      e instanceof Error ? e.message : e
    );
    return {
      published: false,
      skipped: false,
      reason: e instanceof Error ? e.message : String(e),
      html,
    };
  }
}

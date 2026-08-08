import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsTopicConfig } from "@/lib/news/topics";
import type { Prep2GoArticle } from "@/lib/news/prep2go-fetch";
import { buildThreadsFromSiteDigest } from "@/lib/news/threads";
import { validateThreadsQuality } from "@/lib/news/quality";
import { stripGoogleSourceMentionsFromText } from "@/lib/news/article-resolve";
import { assertPrep2GoFactCheck } from "@/lib/news/fact-check";
import {
  GUIDE_CB_OK_PREFIX,
  GUIDE_CB_SKIP_PREFIX,
} from "@/lib/news/run-guide-telegram-queue";
import { newsTelegramChannelUrl, sendOwnerTelegramHtmlWithButtons } from "@/lib/telegram";
import { newsArticleUrl } from "@/lib/site-url";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

export type PublishDigestTelegramParams = {
  supabase: SupabaseClient;
  slug: string;
  topic: NewsTopicConfig;
  weekStart: string;
  weekEnd: string;
  title: string;
  excerpt: string;
  keyTakeaways: string[];
  contentBlocks: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
    source_name?: string;
    source_url?: string;
    story_title?: string;
  }>;
  sourceLinks: Array<{ title: string; url: string }>;
  sourceArticle?: Prep2GoArticle;
  /**
   * Site digest already passed the LLM grounded check in this import.
   * Threads are derived deterministically from that digest, so publish path can
   * avoid a second LLM call while still running deterministic fact checks.
   */
  siteFactCheckPassed?: boolean;
  skipTelegram?: boolean;
};

export type PublishDigestTelegramResult = {
  threadsText: string | null;
  channelPublished: boolean;
  awaitingApproval: boolean;
  ownerDmSent: boolean;
  skipped: boolean;
  reason?: string;
};

function hasTelegramBotToken(): boolean {
  return Boolean((process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim());
}

/** Build threads text, persist to digest row, request owner DM approval (no auto channel). */
export async function publishDigestToTelegram(
  params: PublishDigestTelegramParams
): Promise<PublishDigestTelegramResult> {
  if (params.skipTelegram) {
    return {
      threadsText: null,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: "skipTelegram",
    };
  }

  if (!hasTelegramBotToken()) {
    console.warn("[telegram] EMIGRO_NEWS_BOT_TOKEN / TELEGRAM_BOT_TOKEN missing — skipping publish");
    return {
      threadsText: null,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: "bot token missing",
    };
  }

  if (!process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim()) {
    return {
      threadsText: null,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: "TELEGRAM_PRIVATE_CHAT_ID missing",
    };
  }

  const channelUrl = newsTelegramChannelUrl();
  const siteArticleUrl = newsArticleUrl(params.slug);
  const threadsText = stripGoogleSourceMentionsFromText(
    buildThreadsFromSiteDigest({
      topic: params.topic,
      weekFrom: new Date(params.weekStart),
      weekEnd: new Date(params.weekEnd),
      channelUrl,
      siteArticleUrl,
      title: params.title,
      excerpt: params.excerpt,
      keyTakeaways: params.keyTakeaways,
      contentBlocks: params.contentBlocks,
      sourceLinks: params.sourceLinks,
    })
  );

  const qualityErrors = validateThreadsQuality({ threadsText, topic: params.topic.key });
  if (qualityErrors.length > 0) {
    console.warn(`[telegram] threads QA (non-blocking): ${qualityErrors.join("; ")}`);
  }
  if (!params.sourceArticle) {
    console.warn("[telegram] fact-check skipped: no source article");
  } else {
    try {
      await assertPrep2GoFactCheck({
        stage: "telegram_threads",
        article: params.sourceArticle,
        topic: params.topic,
        weekStart: params.weekStart,
        weekEnd: params.weekEnd,
        sourceLinks: params.sourceLinks,
        threadsText,
        useLlm: !params.siteFactCheckPassed,
      });
    } catch (e) {
      console.warn(
        "[telegram] threads fact-check (non-blocking):",
        e instanceof Error ? e.message : e
      );
    }
  }

  const { error: updateError } = await params.supabase
    .from("emigro_news_digests")
    .update({ threads_text: threadsText, updated_at: new Date().toISOString() })
    .eq("slug", params.slug);

  if (updateError) {
    console.warn(`[telegram] failed to save threads_text for ${params.slug}:`, updateError.message);
  }

  const { data: pending } = await params.supabase
    .from("guide_telegram_drafts")
    .select("id, slug")
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  if (pending?.id) {
    console.log(`[telegram] skip digest DM — pending draft exists (${pending.slug})`);
    return {
      threadsText,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: `pending-exists:${pending.slug}`,
    };
  }

  const { data: row, error } = await params.supabase
    .from("guide_telegram_drafts")
    .insert({
      slug: params.slug,
      title: params.title,
      html: threadsText,
      status: "pending",
      publish_mode: "threads",
      meta: {
        flag: params.topic.flag,
        countryRu: params.topic.countryRu,
        digestSlug: params.slug,
      },
      factcheck_notes: `digest:${params.topic.key}`,
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error(`[telegram] draft insert failed for ${params.slug}:`, error?.message);
    return {
      threadsText,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: `insert:${error?.message || "unknown"}`,
    };
  }

  const id = row.id as string;
  const preview = escapeTelegramHtml(threadsText.slice(0, 3200));
  const preface = [
    `📰 <b>Согласование дайджеста</b>`,
    `<code>${escapeTelegramHtml(params.slug)}</code>`,
    `${escapeTelegramHtml(params.topic.flag || "")} ${escapeTelegramHtml(params.topic.countryRu || params.topic.key)}`,
    "",
    "— черновик —",
    "",
    `<pre>${preview}</pre>`,
    "",
    "— — —",
    "✅ в канал · ❌ пропуск",
  ].join("\n");

  const dm = await sendOwnerTelegramHtmlWithButtons(preface.slice(0, 4096), [
    [
      { text: "✅ В канал", callback_data: `${GUIDE_CB_OK_PREFIX}${id}` },
      { text: "❌ Пропуск", callback_data: `${GUIDE_CB_SKIP_PREFIX}${id}` },
    ],
  ]);

  if (!dm.success) {
    await params.supabase
      .from("guide_telegram_drafts")
      .update({
        status: "skipped",
        factcheck_notes: dm.error,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);
    return {
      threadsText,
      channelPublished: false,
      awaitingApproval: false,
      ownerDmSent: false,
      skipped: true,
      reason: `dm:${dm.error}`,
    };
  }

  console.log(`[telegram] awaiting owner approval for digest ${params.slug} id=${id}`);
  return {
    threadsText,
    channelPublished: false,
    awaitingApproval: true,
    ownerDmSent: true,
    skipped: false,
    reason: "awaiting-owner",
  };
}

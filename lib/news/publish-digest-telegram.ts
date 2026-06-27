import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { buildThreadsFromSiteDigest } from "@/lib/news/threads";
import {
  deleteTelegramChannelMessages,
  newsTelegramChannelUrl,
  publishNewsDigestToChannel,
} from "@/lib/telegram";
import { newsArticleUrl } from "@/lib/site-url";

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
  skipTelegram?: boolean;
};

export type PublishDigestTelegramResult = {
  threadsText: string | null;
  channelPublished: boolean;
  ownerDmSent: boolean;
  skipped: boolean;
  reason?: string;
};

function hasTelegramBotToken(): boolean {
  return Boolean((process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim());
}

/** Build threads text, persist to digest row, publish to @Emigro_news. */
export async function publishDigestToTelegram(
  params: PublishDigestTelegramParams
): Promise<PublishDigestTelegramResult> {
  if (params.skipTelegram) {
    return { threadsText: null, channelPublished: false, ownerDmSent: false, skipped: true, reason: "skipTelegram" };
  }

  if (!hasTelegramBotToken()) {
    console.warn("[telegram] EMIGRO_NEWS_BOT_TOKEN / TELEGRAM_BOT_TOKEN missing — skipping publish");
    return {
      threadsText: null,
      channelPublished: false,
      ownerDmSent: false,
      skipped: true,
      reason: "bot token missing",
    };
  }

  const channelUrl = newsTelegramChannelUrl();
  const siteArticleUrl = newsArticleUrl(params.slug);
  const threadsText = buildThreadsFromSiteDigest({
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
  });

  const { error: updateError } = await params.supabase
    .from("emigro_news_digests")
    .update({ threads_text: threadsText, updated_at: new Date().toISOString() })
    .eq("slug", params.slug);

  if (updateError) {
    console.warn(`[telegram] failed to save threads_text for ${params.slug}:`, updateError.message);
  }

  const { data: existing } = await params.supabase
    .from("emigro_news_digests")
    .select("telegram_message_ids")
    .eq("slug", params.slug)
    .maybeSingle();

  const previousIds = (existing?.telegram_message_ids ?? []) as number[];
  if (previousIds.length > 0) {
    try {
      const { deleted, failed } = await deleteTelegramChannelMessages(previousIds);
      console.log(`[telegram] deleted ${deleted.length}/${previousIds.length} previous messages for ${params.slug}`);
      if (failed.length) {
        console.warn(
          `[telegram] delete failed for ${params.slug}:`,
          failed.map((f) => `${f.messageId}: ${f.error}`).join("; ")
        );
      }
    } catch (e) {
      console.warn(
        `[telegram] could not delete previous messages for ${params.slug}:`,
        e instanceof Error ? e.message : e
      );
    }
  }

  let channelPublished = false;
  let messageIds: number[] = [];
  try {
    messageIds = await publishNewsDigestToChannel(threadsText, {
      flag: params.topic.flag,
      countryRu: params.topic.countryRu,
    });
    channelPublished = true;
    console.log(
      `[telegram] published to ${process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news"}: ${params.slug}`
    );

    await params.supabase
      .from("emigro_news_digests")
      .update({ telegram_message_ids: messageIds, updated_at: new Date().toISOString() })
      .eq("slug", params.slug);
  } catch (e) {
    console.error(
      `[telegram] channel publish failed for ${params.slug}:`,
      e instanceof Error ? e.message : e
    );
  }

  return { threadsText, channelPublished, ownerDmSent: false, skipped: false };
}

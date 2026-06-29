#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getNewsTopic } from "../lib/news/topics";
import { buildThreadsThreadFromDigestHtml, buildThreadsFromSiteDigest } from "../lib/news/threads";
import { validateThreadsQuality } from "../lib/news/quality";
import {
  deleteTelegramChannelMessages,
  newsTelegramChannelUrl,
  publishNewsDigestToChannel,
} from "../lib/telegram";
import { newsArticleUrl } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const slugArg = process.argv[2];
  const skipPublish = process.argv.includes("--dry-run");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, key);

  const { data: digest } = slugArg
    ? await supabase.from("emigro_news_digests").select("*").eq("slug", slugArg).maybeSingle()
    : await supabase
        .from("emigro_news_digests")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (!digest) {
    console.error("Digest not found");
    process.exit(1);
  }

  const topic = await getNewsTopic(digest.topic_key);
  if (!topic) {
    console.error(`Unknown topic_key: ${digest.topic_key}`);
    process.exit(1);
  }

  const channelUrl = newsTelegramChannelUrl();
  const siteArticleUrl = newsArticleUrl(digest.slug);
  const threadsText =
    buildThreadsFromSiteDigest({
      topic,
      weekFrom: new Date(digest.week_start),
      weekEnd: new Date(digest.week_end),
      channelUrl,
      siteArticleUrl,
      title: digest.title,
      excerpt: digest.excerpt,
      keyTakeaways: digest.key_takeaways ?? [],
      contentBlocks: digest.content_blocks ?? [],
      sourceLinks: digest.source_links ?? [],
    }) ||
    buildThreadsThreadFromDigestHtml({
      topic,
      digestHtml: digest.telegram_html || "",
      weekFrom: new Date(digest.week_start),
      weekEnd: new Date(digest.week_end),
      channelUrl,
      siteArticleUrl,
      sourceLinks: digest.source_links ?? [],
      fallbackTakeaways: digest.key_takeaways,
      fallbackExcerpt: digest.excerpt,
    });

  const qualityErrors = validateThreadsQuality({ threadsText, topic: digest.topic_key });
  if (qualityErrors.length) {
    throw new Error(`Threads digest failed QA: ${qualityErrors.join("; ")}`);
  }

  console.log("\n=== THREADS PREVIEW ===\n");
  console.log(threadsText);
  console.log("\n=== POST COUNT ===", threadsText.split(/\n\n(?=\d+\/\d+\n)/).length);

  await supabase
    .from("emigro_news_digests")
    .update({ threads_text: threadsText, updated_at: new Date().toISOString() })
    .eq("id", digest.id);

  if (skipPublish) {
    console.log("\n[dry-run] skipping Telegram publish");
    return;
  }

  const previousIds = (digest.telegram_message_ids ?? []) as number[];
  if (previousIds.length > 0) {
    try {
      const { deleted, failed } = await deleteTelegramChannelMessages(previousIds);
      console.log(`[telegram] deleted ${deleted.length}/${previousIds.length} previous messages`);
      if (failed.length) {
        console.warn("[telegram] delete failures:", failed);
      }
    } catch (e) {
      console.warn("[telegram] delete:", e instanceof Error ? e.message : e);
    }
  } else {
    console.warn("[telegram] no stored message_ids — cannot delete previous channel post automatically");
  }

  try {
    const messageIds = await publishNewsDigestToChannel(threadsText, {
      flag: topic.flag,
      countryRu: topic.countryRu,
    });
    await supabase
      .from("emigro_news_digests")
      .update({ telegram_message_ids: messageIds, updated_at: new Date().toISOString() })
      .eq("id", digest.id);
    console.log(`Published readable digest to ${process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news"}`);
    console.log(`[telegram] message_ids:`, messageIds);
  } catch (e) {
    console.warn("[telegram] channel:", e instanceof Error ? e.message : e);
  }

  console.log(`Digest text for ${digest.slug} (${topic.key})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

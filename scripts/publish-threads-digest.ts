#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getNewsTopic } from "../lib/news/topics";
import { buildThreadsThreadFromDigestHtml, buildThreadsFromSiteDigest } from "../lib/news/threads";
import { publishNewsDigestToChannel, sendNewsDigestThreadsDm } from "../lib/telegram";
import { newsArticleUrl } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const slugArg = process.argv[2];
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

  const articleUrl = newsArticleUrl(digest.slug);
  const threadsText =
    digest.threads_text ||
    buildThreadsFromSiteDigest({
      topic,
      weekFrom: new Date(digest.week_start),
      weekEnd: new Date(digest.week_end),
      articleUrl,
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
      articleUrl,
      fallbackTakeaways: digest.key_takeaways,
      fallbackExcerpt: digest.excerpt,
    });

  if (!digest.threads_text) {
    await supabase.from("emigro_news_digests").update({ threads_text: threadsText }).eq("id", digest.id);
  }

  try {
    await publishNewsDigestToChannel(threadsText, { flag: topic.flag, countryRu: topic.countryRu });
    console.log(`Published readable digest to ${process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news"}`);
  } catch (e) {
    console.warn("[telegram] channel:", e instanceof Error ? e.message : e);
  }

  await sendNewsDigestThreadsDm(threadsText);
  console.log(`Digest text for ${digest.slug} (${topic.key})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

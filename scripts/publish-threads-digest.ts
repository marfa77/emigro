#!/usr/bin/env npx tsx
/**
 * Rebuild Threads text for a digest and queue owner DM approval (default).
 * Emergency direct channel publish: --force-publish
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { getNewsTopic } from "../lib/news/topics";
import { publishDigestToTelegram } from "../lib/news/publish-digest-telegram";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const slugArg = args[0];
  const dryRun = process.argv.includes("--dry-run");
  const forcePublish = process.argv.includes("--force-publish");

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

  if (forcePublish) {
    console.warn("⚠️ --force-publish: direct channel post (bypass approval)");
    const { publishNewsDigestToChannel } = await import("../lib/telegram");
    const threads =
      (digest.threads_text as string) ||
      "Missing threads_text — run without --force-publish first to rebuild.";
    if (!digest.threads_text) {
      console.error(threads);
      process.exit(1);
    }
    if (dryRun) {
      console.log(threads);
      return;
    }
    const messageIds = await publishNewsDigestToChannel(threads, {
      flag: topic.flag,
      countryRu: topic.countryRu,
    });
    await supabase
      .from("emigro_news_digests")
      .update({ telegram_message_ids: messageIds, updated_at: new Date().toISOString() })
      .eq("id", digest.id);
    console.log("Published:", messageIds);
    return;
  }

  const result = await publishDigestToTelegram({
    supabase,
    slug: digest.slug,
    topic,
    weekStart: digest.week_start,
    weekEnd: digest.week_end,
    title: digest.title,
    excerpt: digest.excerpt,
    keyTakeaways: digest.key_takeaways ?? [],
    contentBlocks: digest.content_blocks ?? [],
    sourceLinks: digest.source_links ?? [],
    skipTelegram: dryRun,
  });

  console.log(JSON.stringify(result, null, 2));
  if (result.threadsText) {
    console.log("\n=== THREADS PREVIEW ===\n");
    console.log(result.threadsText);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

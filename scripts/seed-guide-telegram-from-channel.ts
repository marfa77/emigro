#!/usr/bin/env npx tsx
/**
 * Mark SEO guides already linked from public @Emigro_news as published
 * so news:guide-promo never re-queues them.
 *
 * Walks the full t.me/s preview (`?before=`), not just the latest ~20 posts.
 *
 *   npx tsx scripts/seed-guide-telegram-from-channel.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import {
  CHANNEL_PREVIEW_URL,
  fetchChannelPostedGuideSlugs,
  rememberChannelGuideSlugs,
} from "../lib/news/guide-telegram-posted";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, ""),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const slugs = await fetchChannelPostedGuideSlugs();
  console.log(`Found ${slugs.length} guide links on ${CHANNEL_PREVIEW_URL}`);
  const inserted = await rememberChannelGuideSlugs(supabase, slugs);
  console.log(JSON.stringify({ inserted, scanned: slugs.length, slugs }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

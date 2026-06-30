#!/usr/bin/env npx tsx
/**
 * List latest Prep2Go news from Supabase (or RSS fallback).
 *
 * Usage:
 *   npx tsx scripts/list-prep2go-db-news.ts
 *   npx tsx scripts/list-prep2go-db-news.ts --limit=10
 */
import { config } from "dotenv";
import { resolve } from "path";
import {
  fetchPrep2GoListingItems,
  isPrep2GoDbConfigured,
  prep2GoListingSource,
} from "../lib/news/prep2go-db-fetch";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseLimit(): number {
  const arg = process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const n = arg ? Number(arg) : 5;
  return Number.isFinite(n) && n > 0 ? Math.min(50, Math.floor(n)) : 5;
}

async function main() {
  const limit = parseLimit();
  const dbConfigured = isPrep2GoDbConfigured();

  console.log(`Prep2Go Supabase (news_digests): ${dbConfigured ? "configured" : "missing env"}`);
  if (!dbConfigured) {
    console.log(
      "Set PREP2GO_SUPABASE_URL + PREP2GO_SUPABASE_ANON_KEY (CIPLE A2 project, not Emigro)"
    );
  }

  const items = await fetchPrep2GoListingItems(limit);
  console.log(`Source: ${prep2GoListingSource()}`);
  console.log(`Latest ${items.length} article(s):\n`);

  for (const item of items) {
    console.log(`- ${item.weekEnd} | ${item.topicKey}`);
    console.log(`  slug: ${item.prep2goSlug}`);
    console.log(`  title: ${item.title.slice(0, 100)}${item.title.length > 100 ? "…" : ""}`);
    console.log(`  url: ${item.link}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

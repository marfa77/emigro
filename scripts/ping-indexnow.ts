#!/usr/bin/env npx tsx
/** Ping IndexNow — Yandex first, then api.indexnow.org and Bing. Audience: ru-RU / Yandex Search. */
import { config } from "dotenv";
import { resolve } from "path";
import sitemap from "../app/sitemap";
import {
  pingIndexNow,
  getIndexNowKey,
  indexNowKeyFileUrl,
  type IndexNowPingResult,
} from "../lib/seo/indexnow";
import { publicSiteUrl } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function toProductionUrl(url: string, origin: string): string {
  try {
    const parsed = new URL(url);
    return `${origin}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function summarizeYandex(results: IndexNowPingResult[]): void {
  const yandex = results.filter((r) => r.primary);
  const ok = yandex.filter((r) => r.ok).length;
  const failed = yandex.filter((r) => !r.ok);

  console.log("\n--- Yandex IndexNow summary ---");
  if (yandex.length === 0) {
    console.log("No Yandex pings recorded.");
    return;
  }
  console.log(`Batches OK: ${ok}/${yandex.length}`);
  if (failed.length) {
    for (const r of failed) {
      console.log(`  FAILED: status ${r.status || "network error"}`);
    }
  } else {
    console.log("All Yandex batches accepted (HTTP 200/202).");
  }
  console.log("Verify in Yandex Webmaster → Индексирование → IndexNow");
}

async function main() {
  const key = getIndexNowKey();
  if (!key) {
    console.error("INDEXNOW_KEY is not set. Add it to .env.local (see .env.example).");
    process.exit(1);
  }

  const origin = publicSiteUrl();
  const entries = await sitemap();
  const urls = Array.from(
    new Set(entries.map((e) => toProductionUrl(e.url, origin)))
  ).sort();

  console.log(`Origin: ${origin}`);
  console.log(`Key file: ${indexNowKeyFileUrl(origin)}`);
  console.log(`Primary: Yandex (https://yandex.com/indexnow)`);
  console.log(`Pinging IndexNow for ${urls.length} URLs…\n`);

  const allResults: IndexNowPingResult[] = [];
  const chunkSize = 100;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    console.log(`Batch ${Math.floor(i / chunkSize) + 1}: ${chunk.length} URLs`);
    const batchResults = await pingIndexNow(chunk);
    allResults.push(...batchResults);
    if (i + chunkSize < urls.length) await sleep(2000);
  }

  summarizeYandex(allResults);
  console.log("\nDone. Secondary: Bing Webmaster / api.indexnow.org (optional check).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

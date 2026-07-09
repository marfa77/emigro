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
import { pingGoogleSitemap } from "../lib/seo/google-sitemap";
import { publicSiteUrl } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

/** Preserve satellite subdomain canonical URLs; rewrite only same-origin paths to www. */
function toProductionUrl(url: string, origin: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".emigro.online") && parsed.hostname !== new URL(origin).hostname) {
      return url;
    }
    return `${origin}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function groupUrlsByHost(urls: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const url of urls) {
    try {
      const host = new URL(url).hostname;
      const list = groups.get(host) ?? [];
      list.push(url);
      groups.set(host, list);
    } catch {
      console.warn("[indexnow] skip invalid URL:", url);
    }
  }
  return groups;
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
  const byHost = groupUrlsByHost(urls);

  console.log(`Origin: ${origin}`);
  console.log(`Key file: ${indexNowKeyFileUrl(origin)}`);
  console.log(`Primary: Yandex (https://yandex.com/indexnow)`);
  console.log(`Pinging IndexNow for ${urls.length} URLs across ${byHost.size} host(s)…\n`);

  const allResults: IndexNowPingResult[] = [];
  const chunkSize = 100;
  for (const [host, hostUrls] of byHost) {
    console.log(`Host: ${host} (${hostUrls.length} URLs)`);
    for (let i = 0; i < hostUrls.length; i += chunkSize) {
      const chunk = hostUrls.slice(i, i + chunkSize);
      console.log(`  Batch ${Math.floor(i / chunkSize) + 1}: ${chunk.length} URLs`);
      const batchResults = await pingIndexNow(chunk);
      allResults.push(...batchResults);
      if (i + chunkSize < hostUrls.length) await sleep(2000);
    }
  }

  summarizeYandex(allResults);

  const sitemapUrl = `${origin}/sitemap.xml`;
  const googleOk = await pingGoogleSitemap(sitemapUrl);
  if (googleOk) {
    console.log("\nGoogle sitemap ping sent. Verify in Search Console → Sitemaps.");
  } else if (process.env.PING_GOOGLE_SITEMAP === "1" || process.env.PING_GOOGLE_SITEMAP === "true") {
    console.log("\nGoogle sitemap ping failed or returned non-OK status.");
  } else {
    console.log("\nGoogle sitemap ping skipped (set PING_GOOGLE_SITEMAP=1 to enable).");
  }

  console.log("\nDone. Secondary: Bing Webmaster / api.indexnow.org (optional check).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

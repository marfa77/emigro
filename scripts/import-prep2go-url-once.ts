#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { importOnePrep2GoItem } from "../lib/news/import-prep2go";
import {
  topicKeyFromPrep2GoSlug,
  weekEndFromPrep2GoSlug,
  type Prep2GoRssItem,
} from "../lib/news/prep2go-fetch";
import { revalidateNewsPages } from "../lib/news/revalidate-cache";
import { pingIndexNow } from "../lib/seo/indexnow";
import { newsArticleUrl, publicSiteUrl } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const URL =
  process.argv.find((a) => a.startsWith("http")) ??
  "https://www.prep2go.study/news/portugal-citizenship-residency-news-2026-06-29";
const force = process.argv.includes("--force");

async function extractTitle(link: string): Promise<string> {
  const res = await fetch(link, {
    headers: { "User-Agent": "EmigroNewsImport/1.0 (+https://www.emigro.online)", Accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const og = html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  return (og ?? title ?? "Prep2Go weekly news").replace(/\s*\|\s*Prep2go\.study\s*$/i, "").trim();
}

async function main() {
  const prep2goSlug = URL.split("/news/").pop()?.replace(/\/$/, "") ?? "";
  const topicKey = topicKeyFromPrep2GoSlug(prep2goSlug);
  const weekEnd = weekEndFromPrep2GoSlug(prep2goSlug);
  if (!topicKey || !weekEnd) throw new Error(`Cannot parse URL: ${URL}`);

  const title = await extractTitle(URL);
  const item: Prep2GoRssItem = {
    title,
    link: URL,
    pubDate: new Date().toISOString(),
    excerpt: "",
    topicKey,
    weekEnd,
    prep2goSlug,
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase env missing");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Importing: ${URL}`);
  console.log(`Expected slug: ${topicKey}-relocation-news-${weekEnd}\n`);

  const result = await importOnePrep2GoItem(item, { dryRun: false, force, supabase });

  if (result.status === "imported") {
    await revalidateNewsPages([result.emigroSlug]);
    const site = publicSiteUrl();
    await pingIndexNow([`${site}/ru/news`, newsArticleUrl(result.emigroSlug)]);
  }

  const { data: row } = await supabase
    .from("emigro_news_digests")
    .select("slug, title, telegram_message_ids, status")
    .eq("slug", result.emigroSlug)
    .maybeSingle();

  console.log("\n=== Result ===");
  console.log(JSON.stringify({ result, db: row }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

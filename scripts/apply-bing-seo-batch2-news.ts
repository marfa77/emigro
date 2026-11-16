#!/usr/bin/env npx tsx
/**
 * Bing/Yandex batch 2 — persist news SEO in Supabase (stories live in DB, not git).
 *   npx tsx scripts/apply-bing-seo-batch2-news.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getNewsDisplaySeoTitle } from "../lib/news/digests";
import { fitNewsSeoTitleAbsolute } from "../lib/seo";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const EXPLICIT: Record<string, { seo_title: string; seo_description?: string }> = {
  "sweden-story-2026-08-31-ea8jvq": {
    seo_title: "Выборы в Швеции 2026: 31 августа",
    seo_description:
      "Выборы в Швеции 31 августа 2026: что партии обещают иностранцам по иммиграции, разрешениям на работу, налогам и социальным выплатам.",
  },
};

async function patchSchengenDuplicateTitles() {
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select("slug, seo_title, title, country, topic_key, format, week_end")
    .eq("status", "published");
  if (error) throw error;

  const topicCountry = new Map<string, string>();
  const { data: topics } = await supabase.from("emigro_news_topics").select("key, country_ru");
  for (const t of topics ?? []) {
    topicCountry.set(t.key as string, t.country_ru as string);
  }

  let patched = 0;
  for (const row of data ?? []) {
    const seo = (row.seo_title || row.title || "").trim();
    if (!/^пересмотр шенгенских виз/i.test(seo)) continue;
    const countryRu = topicCountry.get(row.topic_key as string) || (row.country as string);
    if (!countryRu) continue;
    const nextTitle = `Пересмотр шенгенских виз: ${countryRu}`;
    const display = getNewsDisplaySeoTitle(
      {
        format: "story",
        slug: row.slug as string,
        seo_title: nextTitle,
        title: row.title as string,
        week_end: (row.week_end as string) ?? "",
        country: countryRu,
      },
      countryRu,
    );
    void display;
    if (seo === nextTitle || seo.toLowerCase().includes(countryRu.toLowerCase())) continue;
    const { error: upErr } = await supabase
      .from("emigro_news_digests")
      .update({ seo_title: nextTitle, updated_at: new Date().toISOString() })
      .eq("slug", row.slug as string);
    if (upErr) throw upErr;
    console.log("[schengen-dedupe]", row.slug, "→", nextTitle);
    patched++;
  }
  return patched;
}

async function main() {
  for (const [slug, patch] of Object.entries(EXPLICIT)) {
    const { error } = await supabase
      .from("emigro_news_digests")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    if (error) throw new Error(`${slug}: ${error.message}`);
    const display = fitNewsSeoTitleAbsolute(
      getNewsDisplaySeoTitle(
        { format: "story", slug, seo_title: patch.seo_title, title: patch.seo_title, week_end: "", country: "" },
        "Швеция",
      ),
    );
    console.log("[patch]", slug, "display title:", display);
  }
  const n = await patchSchengenDuplicateTitles();
  console.log("done — schengen duplicate patches:", n);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
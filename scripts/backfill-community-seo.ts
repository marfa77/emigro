/**
 * Normalize seo_title / seo_description on published community notes (AEO 145–160).
 *
 *   npm run portugal:backfill-seo
 *   npx tsx scripts/backfill-community-seo.ts --country=spain
 *   npx tsx scripts/backfill-community-seo.ts --country=all
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { fitMetaDescription, fitSeoTitlePart } from "@/lib/seo";
import { createServerClient } from "@/lib/supabase/server";

const SEO_DESC_MIN = 145;
const SEO_DESC_MAX = 160;

async function main() {
  const countryArg = process.argv.find((a) => a.startsWith("--country="))?.split("=")[1] ?? "portugal";
  const countries =
    countryArg === "all" ? (["portugal", "spain"] as const) : ([countryArg] as ("portugal" | "spain")[]);

  const supabase = createServerClient();
  let updated = 0;
  let checked = 0;

  for (const country_key of countries) {
    const { data, error } = await supabase
      .from("community_notes")
      .select("id, slug, title, excerpt, quick_answer, seo_title, seo_description, content_kind")
      .eq("country_key", country_key)
      .eq("status", "published")
      .eq("content_kind", "guide");

    if (error) throw new Error(error.message);

    for (const row of data ?? []) {
      checked += 1;
      const seo_title = fitSeoTitlePart(String(row.seo_title || row.title));
      const seo_description = fitMetaDescription(
        String(row.seo_description || row.excerpt || row.quick_answer),
        SEO_DESC_MIN,
        SEO_DESC_MAX
      );

      const prevLen = String(row.seo_description ?? "").length;
      if (seo_title === row.seo_title && seo_description === row.seo_description) {
        if (prevLen < SEO_DESC_MIN || prevLen > SEO_DESC_MAX) {
          console.log(`[seo] ${row.slug} still off-range after fit: ${prevLen}`);
        }
        continue;
      }

      const { error: upErr } = await supabase
        .from("community_notes")
        .update({ seo_title, seo_description, updated_at: new Date().toISOString() })
        .eq("id", row.id);

      if (upErr) {
        console.warn(`[seo] ${row.slug}: ${upErr.message}`);
      } else {
        updated += 1;
        console.log(`[seo] ${country_key}/${row.slug}: ${prevLen} → ${seo_description.length} chars`);
      }
    }
  }

  console.log(`[seo] checked ${checked}, updated ${updated} (target ${SEO_DESC_MIN}–${SEO_DESC_MAX})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

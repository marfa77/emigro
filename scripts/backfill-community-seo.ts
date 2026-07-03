/**
 * Normalize seo_title / seo_description on published community notes (AEO 150–160).
 */
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { fitMetaDescription, fitSeoTitlePart } from "@/lib/seo";
import { createServerClient } from "@/lib/supabase/server";

async function main() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select("id, slug, title, excerpt, quick_answer, seo_title, seo_description")
    .eq("country_key", "portugal")
    .eq("status", "published");

  if (error) throw new Error(error.message);

  let updated = 0;
  for (const row of data ?? []) {
    const seo_title = fitSeoTitlePart(String(row.seo_title || row.title));
    const seo_description = fitMetaDescription(
      String(row.seo_description || row.excerpt || row.quick_answer)
    );

    if (seo_title === row.seo_title && seo_description === row.seo_description) continue;

    const { error: upErr } = await supabase
      .from("community_notes")
      .update({ seo_title, seo_description, updated_at: new Date().toISOString() })
      .eq("id", row.id);

    if (upErr) {
      console.warn(`[seo] ${row.slug}: ${upErr.message}`);
    } else {
      updated += 1;
      console.log(`[seo] ${row.slug} → desc ${seo_description.length} chars`);
    }
  }

  console.log(`[seo] updated ${updated} notes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

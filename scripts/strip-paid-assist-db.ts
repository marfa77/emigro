/**
 * One-off (2026-11-19): rewrite community_notes rows that still mention the paid Route Check (€129)
 * to the free specialist match, using the same rules as the render-time filter. Updates only the
 * text fields that actually change.
 *
 *   npx tsx scripts/strip-paid-assist-db.ts --dry-run
 *   npx tsx scripts/strip-paid-assist-db.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createAdminClient } from "@/lib/admin/supabase";
import { stripPaidAssist } from "@/lib/community-notes/strip-paid-assist";

const FIELDS = ["title", "excerpt", "quick_answer", "key_takeaways", "body_sections", "body_paragraphs", "faq", "seo_title", "seo_description"] as const;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("community_notes").select(`id, slug, country_key, ${FIELDS.join(", ")}`);
  if (error) throw error;
  let updated = 0;
  for (const row of data ?? []) {
    const patch: Record<string, unknown> = {};
    for (const field of FIELDS) {
      const before = (row as Record<string, unknown>)[field];
      if (before == null) continue;
      const after = stripPaidAssist(before);
      if (JSON.stringify(after) !== JSON.stringify(before)) patch[field] = after;
    }
    if (Object.keys(patch).length === 0) continue;
    updated++;
    console.log(`${dryRun ? "[dry-run] " : ""}${row.country_key}/${row.slug}: ${Object.keys(patch).join(", ")}`);
    if (!dryRun) {
      const { error: upErr } = await supabase.from("community_notes").update(patch).eq("id", row.id);
      if (upErr) console.log(`  ERROR ${upErr.message}`);
    }
  }
  console.log(`${dryRun ? "would update" : "updated"} ${updated} row(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

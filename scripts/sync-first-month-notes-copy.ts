/**
 * One-off (2026-11-11): push the plain-Russian title and excerpt of the two "first 30 days"
 * satellite notes from the repo into community_notes. Touches only title + excerpt of these two rows.
 *
 *   npx tsx scripts/sync-first-month-notes-copy.ts            # writes
 *   npx tsx scripts/sync-first-month-notes-copy.ts --dry-run  # prints only
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createAdminClient } from "@/lib/admin/supabase";
import { PERVYE_30_GUIDE } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { PERVYE_30_PHUKET_GUIDE } from "@/lib/community-notes/guides/thailand-pervye-30-dnej-phuket";

const dryRun = process.argv.includes("--dry-run");

const ROWS = [
  { country: "spain", slug: PERVYE_30_GUIDE.slug, title: PERVYE_30_GUIDE.title, excerpt: PERVYE_30_GUIDE.excerpt },
  { country: "thailand", slug: PERVYE_30_PHUKET_GUIDE.slug, title: PERVYE_30_PHUKET_GUIDE.title, excerpt: PERVYE_30_PHUKET_GUIDE.excerpt },
];

async function main() {
  const supabase = createAdminClient();
  for (const row of ROWS) {
    if (dryRun) {
      console.log(`[dry-run] ${row.country}/${row.slug}\n  ${row.title}\n  ${row.excerpt}`);
      continue;
    }
    const { data, error } = await supabase
      .from("community_notes")
      .update({ title: row.title, excerpt: row.excerpt })
      .eq("slug", row.slug)
      .eq("country_key", row.country)
      .select("slug");
    console.log(`${row.country}/${row.slug}: ${error ? `ERROR ${error.message}` : `updated ${data?.length ?? 0} row(s)`}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

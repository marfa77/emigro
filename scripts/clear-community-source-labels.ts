/**
 * Clear source_label on published notes (remove @chatlisboa attribution line).
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createServerClient } from "@/lib/supabase/server";

async function main() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .update({ source_label: null, updated_at: new Date().toISOString() })
    .eq("country_key", "portugal")
    .not("source_label", "is", null)
    .select("slug");

  if (error) throw new Error(error.message);
  console.log(`[clear-source-label] updated ${data?.length ?? 0} notes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

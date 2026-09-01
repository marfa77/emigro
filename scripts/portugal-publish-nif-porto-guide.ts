/**
 * Publish Porto/Norte NIF guide; archive legacy Lisboa-centric slug.
 *
 *   npm run portugal:publish-nif-porto-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  NIF_PORTO_GUIDE,
  NIF_PORTO_GUIDE_SLUG,
  NIF_PORTO_LEGACY_SLUG,
} from "@/lib/community-notes/guides/nif-porto";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";
import { createServerClient } from "@/lib/supabase/server";

async function archiveLegacy() {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("community_notes")
    .select("id")
    .eq("slug", NIF_PORTO_LEGACY_SLUG)
    .maybeSingle();
  if (!existing) {
    console.log(`[archive] legacy ${NIF_PORTO_LEGACY_SLUG} not found — skip`);
    return;
  }
  const { error } = await supabase
    .from("community_notes")
    .update({
      status: "archived",
      updated_at: now,
      excerpt: `Переписано под Porto/Norte → /notes/${NIF_PORTO_GUIDE_SLUG}`,
    })
    .eq("id", existing.id);
  if (error) throw new Error(`archive legacy: ${error.message}`);
  console.log(`[archive] ${NIF_PORTO_LEGACY_SLUG}`);
}

async function main() {
  await publishHandGuide({ ...NIF_PORTO_GUIDE });
  await archiveLegacy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

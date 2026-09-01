/**
 * Archive thin household / one-shot notes (returns, free STCP, Via Verde tip, NIF address Q&A).
 *
 *   npx tsx scripts/portugal-archive-thin-household-notes.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { ARCHIVE_SLUGS } from "@/lib/community-notes/editorial-filter";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { createServerClient } from "@/lib/supabase/server";

const THIN_SLUGS = [
  "vozvrat-remont-tovarov-portugaliya-2026",
  "porto-free-public-transport-guide",
  "via-verde-transponder-replacement-portugal",
  "smena-adresa-nif-financas-2026",
] as const;

async function main() {
  for (const slug of THIN_SLUGS) {
    if (!ARCHIVE_SLUGS.has(slug)) {
      throw new Error(`${slug} missing from ARCHIVE_SLUGS — add it before archiving`);
    }
  }

  const supabase = createServerClient();
  const now = new Date().toISOString();
  const excerpt =
    "Снято с публикации: узкая бытовая / one-shot тема. См. системные гайды коридора.";

  for (const slug of THIN_SLUGS) {
    const { data: existing } = await supabase
      .from("community_notes")
      .select("id, status")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      console.log(`[archive] ${slug} not in DB — skip`);
      continue;
    }
    if (existing.status === "archived") {
      console.log(`[archive] ${slug} already archived`);
      continue;
    }

    const { error } = await supabase
      .from("community_notes")
      .update({ status: "archived", updated_at: now, excerpt })
      .eq("id", existing.id);
    if (error) throw new Error(`${slug}: ${error.message}`);
    console.log(`[archive] ${slug}`);
  }

  try {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug ?? "(none)");
  } catch (e) {
    console.warn("[spotlight] skipped:", e instanceof Error ? e.message : e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

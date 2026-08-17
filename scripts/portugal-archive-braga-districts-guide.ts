/**
 * Archive Braga districts guide — removed from the Portugal satellite.
 *
 *   npm run portugal:archive-braga-districts-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { BRAGA_DISTRICTS_GUIDE_SLUG } from "@/lib/community-notes/guides/braga-districts-life";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { createServerClient } from "@/lib/supabase/server";

async function main() {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("community_notes")
    .select("id, status")
    .eq("slug", BRAGA_DISTRICTS_GUIDE_SLUG)
    .maybeSingle();

  if (!existing) {
    console.log(`[archive] ${BRAGA_DISTRICTS_GUIDE_SLUG} not in DB — nothing to do`);
    return;
  }

  if (existing.status === "archived") {
    console.log(`[archive] ${BRAGA_DISTRICTS_GUIDE_SLUG} already archived`);
  } else {
    const { error } = await supabase
      .from("community_notes")
      .update({
        status: "archived",
        updated_at: now,
        excerpt:
          "Гайд снят с публикации. Обзор районов агломерации — в гайде по Porto.",
      })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    console.log(`[archive] ${BRAGA_DISTRICTS_GUIDE_SLUG}`);
  }

  try {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug);
  } catch (e) {
    console.warn("[spotlight] skipped:", e instanceof Error ? e.message : e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

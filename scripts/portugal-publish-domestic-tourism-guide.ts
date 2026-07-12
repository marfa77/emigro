/**
 * Publish / update domestic tourism guide on portugal.emigro.online
 *
 *   npm run portugal:publish-domestic-tourism-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { DOMESTIC_TOURISM_NORTE_GUIDE } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import { createServerClient } from "@/lib/supabase/server";

async function main() {
  const guide = DOMESTIC_TOURISM_NORTE_GUIDE;
  const errors = validateNoteDraft({
    content_kind: guide.content_kind,
    slug: guide.slug,
    seo_title: guide.seo_title,
    seo_description: guide.seo_description,
    quick_answer: guide.quick_answer,
    body_sections: guide.body_sections,
    body_paragraphs: guide.body_paragraphs,
    faq: guide.faq,
    key_takeaways: guide.key_takeaways,
    official_links: guide.official_links,
  });
  if (errors.length > 0) {
    throw new Error(`Quality gate: ${errors.join("; ")}`);
  }

  const supabase = createServerClient();
  const now = new Date().toISOString();

  const row = {
    ...guide,
    country_key: "portugal",
    city: "porto",
    status: "published" as const,
    published_at: now,
    updated_at: now,
  };

  const { data: existing } = await supabase
    .from("community_notes")
    .select("id, published_at")
    .eq("slug", guide.slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("community_notes")
      .update({ ...row, published_at: existing.published_at ?? now })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    console.log(`[publish] updated ${guide.slug}`);
  } else {
    const { error } = await supabase.from("community_notes").insert(row);
    if (error) throw new Error(error.message);
    console.log(`[publish] created ${guide.slug}`);
  }

  const spotlight = await refreshDailySpotlight("portugal");
  console.log("[spotlight]", spotlight?.note_slug);
  const { path: ogPath } = await ensureNoteOgImage(guide);
  console.log(`[og-image] ${ogPath}`);
  console.log(`\nURL: ${communityNotePublicUrl(guide.slug)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

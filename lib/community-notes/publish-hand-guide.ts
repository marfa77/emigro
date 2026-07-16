/**
 * Shared publish helper for hand-curated Portugal guides.
 */
import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { applyReadabilityToDraft } from "@/lib/community-notes/editorial-readability";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { ensureSectionVoiceClose } from "@/lib/community-notes/voice-transforms";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote } from "@/lib/community-notes/types";

export async function publishHandGuide(raw: Omit<CommunityNote, "id" | "created_at" | "updated_at">) {
  const readable = applyReadabilityToDraft(raw);
  const body_sections = (readable.body_sections ?? []).map(ensureSectionVoiceClose);
  const guide = {
    ...readable,
    body_sections,
    body_paragraphs: flattenBodySections(body_sections),
  };

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
    city: guide.city ?? "lisbon",
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

  try {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug);
  } catch (e) {
    console.warn("[spotlight] skipped:", e instanceof Error ? e.message : e);
  }
  const { path: ogPath } = await ensureNoteOgImage(guide);
  console.log(`[og-image] ${ogPath}`);
  console.log(`\nSatellite URL: ${communityNotePublicUrl(guide.slug)}`);
  console.log(`Pillar URL: https://www.emigro.online/ru/guides/${guide.slug}`);
}

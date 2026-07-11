import type { CommunityNote } from "@/lib/community-notes/types";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { PORTUGAL_EDITORIAL_SEED } from "@/lib/community-notes/publish-seed";

export type SatelliteCountryKey = "portugal" | "spain";

/** Fallback when Supabase has no published notes yet. */
export const PORTUGAL_NOTE_SEED: CommunityNote[] = PORTUGAL_EDITORIAL_SEED.map((note, i) => ({
  id: `seed-${i}`,
  slug: note.slug,
  country_key: "portugal",
  city: "lisbon",
  category: note.category,
  content_kind: note.content_kind,
  title: note.title,
  excerpt: note.excerpt,
  seo_title: note.seo_title,
  seo_description: note.seo_description,
  quick_answer: note.quick_answer,
  body_paragraphs: note.body_paragraphs,
  body_sections: note.body_sections ?? [],
  key_takeaways: note.key_takeaways ?? [],
  faq: note.faq,
  official_links: note.official_links,
  source_channel: "chatlisboa+por_tugal",
  source_label: null,
  topic_tags: note.topic_tags,
  hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
  status: "published" as const,
  published_at: "2026-07-03T10:00:00.000Z",
  created_at: "2026-07-03T10:00:00.000Z",
  updated_at: "2026-07-03T10:00:00.000Z",
}));

/** Spain hub has no editorial seed yet — never fall back to Portugal notes. */
export const SPAIN_NOTE_SEED: CommunityNote[] = [];

export function noteSeedFallback(countryKey: string): CommunityNote[] {
  if (countryKey === "spain") return SPAIN_NOTE_SEED;
  return PORTUGAL_NOTE_SEED;
}

/**
 * Backfill OG/hero WebPs for published Spain community notes (Pexels Photos API).
 *
 *   npm run spain:generate-note-images
 *   npm run spain:generate-note-images -- nie-empadronamiento-poryadok-2026
 *   npm run spain:generate-note-images -- --force
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { SPAIN_EDITORIAL_SEED } from "@/lib/community-notes/guides/spain-editorial-index";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";

const CURATED_NOTES: CommunityNote[] = SPAIN_EDITORIAL_SEED.map((note, i) => ({
  id: `seed-es-${i}`,
  slug: note.slug,
  country_key: "spain",
  city: "valencia",
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
  source_channel: "valenforum+spain_granitsa+spainchats",
  source_label: "editorial:spain-seed",
  topic_tags: note.topic_tags,
  hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
  status: "published" as const,
  published_at: "2026-07-11T10:00:00.000Z",
  created_at: "2026-07-11T10:00:00.000Z",
  updated_at: "2026-07-11T10:00:00.000Z",
}));

async function resolveNotes(slugs: string[]): Promise<CommunityNote[]> {
  if (slugs.length === 0) {
    const published = await getPublishedCommunityNotes("spain");
    if (published.length > 0) return published;
    console.warn("[note-og] no published Spain notes in DB — using editorial seed");
    return CURATED_NOTES;
  }

  const notes: CommunityNote[] = [];
  for (const slug of slugs) {
    const fromDb = await getPublishedCommunityNoteBySlug(slug, "spain");
    if (fromDb) {
      notes.push(fromDb);
      continue;
    }
    const curated = CURATED_NOTES.find((g) => g.slug === slug);
    if (curated) {
      notes.push(curated);
      continue;
    }
    console.warn(`[note-og] unknown slug "${slug}" — skipping`);
  }
  return notes;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugs = args.filter((a) => !a.startsWith("--"));

  const notes = await resolveNotes(slugs);
  if (notes.length === 0) {
    console.log("[note-og] nothing to generate");
    return;
  }

  let generated = 0;
  for (const note of notes) {
    const { path, generated: wasGenerated } = await ensureNoteOgImage(note, { force });
    if (wasGenerated && path.startsWith("/images/community-notes/")) generated++;
  }

  console.log(`[note-og] done — ${notes.length} note(s), ${generated} with custom image`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

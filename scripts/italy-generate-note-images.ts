/**
 * Backfill OG/hero WebPs for published Italy community notes (Pexels Photos API).
 *
 *   npm run italy:generate-note-images
 *   npm run italy:generate-note-images -- codice-fiscale-milano-2026
 *   npm run italy:generate-note-images -- --force
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  getPublishedCommunityNoteBySlugUncached,
  getPublishedCommunityNotesUncached,
} from "@/lib/community-notes/queries";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { ITALY_EDITORIAL_SEED } from "@/lib/community-notes/guides/italy-editorial-index";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";

const CURATED_NOTES: CommunityNote[] = ITALY_EDITORIAL_SEED.map((note, i) => ({
  id: `seed-it-${i}`,
  slug: note.slug,
  country_key: "italy",
  city: "milan",
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
  source_channel: "milanru+forum_italy",
  source_label: "editorial:italy-seed",
  topic_tags: note.topic_tags,
  hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
  status: "published" as const,
  published_at: "2026-09-06T10:00:00.000Z",
  created_at: "2026-09-06T10:00:00.000Z",
  updated_at: "2026-09-06T10:00:00.000Z",
}));

async function resolveNotes(slugs: string[]): Promise<CommunityNote[]> {
  if (slugs.length === 0) {
    try {
      const published = await getPublishedCommunityNotesUncached("italy");
      if (published.length > 0) return published;
    } catch (e) {
      console.warn("[note-og] DB list failed:", e instanceof Error ? e.message : e);
    }
    console.warn("[note-og] no published Italy notes in DB — using editorial seed");
    return CURATED_NOTES;
  }

  const notes: CommunityNote[] = [];
  for (const slug of slugs) {
    try {
      const fromDb = await getPublishedCommunityNoteBySlugUncached(slug, "italy");
      if (fromDb) {
        notes.push(fromDb);
        continue;
      }
    } catch (e) {
      console.warn(`[note-og] DB lookup failed for ${slug}:`, e instanceof Error ? e.message : e);
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

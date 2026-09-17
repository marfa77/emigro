/**
 * Backfill unique OG/hero WebPs for Thailand community guides.
 *
 *   npm run thailand:generate-note-images
 *   npm run thailand:generate-note-images -- pervye-30-dnej-phuket-2026
 *   npm run thailand:generate-note-images -- --force
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  getPublishedCommunityNoteBySlugUncached,
  getPublishedCommunityNotesUncached,
} from "@/lib/community-notes/queries";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { THAILAND_EDITORIAL_SEED } from "@/lib/community-notes/guides/thailand-editorial-index";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";

const CURATED_NOTES: CommunityNote[] = THAILAND_EDITORIAL_SEED.map((note, index) => ({
  id: `seed-th-${index}`,
  slug: note.slug,
  country_key: "thailand",
  city: "phuket",
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
  source_channel: "nashi_phuket_chat+Pkhuket2+phuket_expats",
  source_label: "editorial:thailand-seed",
  topic_tags: note.topic_tags,
  hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
  status: "published" as const,
  published_at: "2026-09-17T10:00:00.000Z",
  created_at: "2026-09-17T10:00:00.000Z",
  updated_at: "2026-09-17T10:00:00.000Z",
}));

async function resolveNotes(slugs: string[]): Promise<CommunityNote[]> {
  if (slugs.length === 0) {
    try {
      const published = await getPublishedCommunityNotesUncached("thailand");
      if (published.length > 0) return published;
    } catch (error) {
      console.warn("[note-og] DB list failed:", error instanceof Error ? error.message : error);
    }
    console.warn("[note-og] no published Thailand notes in DB — using editorial seed");
    return CURATED_NOTES;
  }

  const notes: CommunityNote[] = [];
  for (const slug of slugs) {
    try {
      const fromDb = await getPublishedCommunityNoteBySlugUncached(slug, "thailand");
      if (fromDb) {
        notes.push(fromDb);
        continue;
      }
    } catch (error) {
      console.warn(`[note-og] DB lookup failed for ${slug}:`, error instanceof Error ? error.message : error);
    }
    const curated = CURATED_NOTES.find((guide) => guide.slug === slug);
    if (curated) notes.push(curated);
    else console.warn(`[note-og] unknown slug "${slug}" — skipping`);
  }
  return notes;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const slugs = args.filter((arg) => !arg.startsWith("--"));
  const notes = await resolveNotes(slugs);
  if (notes.length === 0) {
    console.log("[note-og] nothing to generate");
    return;
  }

  let generated = 0;
  for (const note of notes) {
    const result = await ensureNoteOgImage(note, { force });
    if (result.generated && result.path.startsWith("/images/community-notes/")) generated += 1;
  }
  console.log(`[note-og] done — ${notes.length} note(s), ${generated} with custom image`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

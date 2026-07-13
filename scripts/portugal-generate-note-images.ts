/**
 * Backfill OG/hero WebPs for published community notes (Pexels Photos API).
 *
 *   npm run portugal:generate-note-images
 *   npm run portugal:generate-note-images -- mashina-portugaliya-kupit-arenda-import-2026
 *   npm run portugal:generate-note-images -- --force
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { CAR_PORTUGAL_GUIDE } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { INTERNATIONAL_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/international-schools-portugal";
import { LAND_BUILD_NORTE_GUIDE } from "@/lib/community-notes/guides/land-build-norte-portugal";
import { APARTMENT_BUY_NORTE_GUIDE } from "@/lib/community-notes/guides/apartment-buy-norte-portugal";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { DOMESTIC_TOURISM_NORTE_GUIDE } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { PORTUGAL_REGIONS_EXPAT_GUIDE } from "@/lib/community-notes/guides/portugal-regions-expat-guide";
import { TOLLS_FINES_ACCIDENTS_GUIDE } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunityNote } from "@/lib/community-notes/types";

const CURATED_GUIDES: CommunityNote[] = [
  CAR_PORTUGAL_GUIDE as CommunityNote,
  DRIVING_LICENSE_EXCHANGE_GUIDE as CommunityNote,
  INTERNATIONAL_SCHOOLS_GUIDE as CommunityNote,
  PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE as CommunityNote,
  LAND_BUILD_NORTE_GUIDE as CommunityNote,
  APARTMENT_BUY_NORTE_GUIDE as CommunityNote,
  TOLLS_FINES_ACCIDENTS_GUIDE as CommunityNote,
  DOMESTIC_TOURISM_NORTE_GUIDE as CommunityNote,
  PORTUGAL_REGIONS_EXPAT_GUIDE as CommunityNote,
];

async function resolveNotes(slugs: string[]): Promise<Array<Pick<CommunityNote, "slug" | "topic_tags" | "title">>> {
  if (slugs.length === 0) {
    const published = await getPublishedCommunityNotes("portugal");
    if (published.length > 0) return published;
    console.warn("[note-og] no published notes in DB — using curated guides");
    return CURATED_GUIDES;
  }

  const notes: Array<Pick<CommunityNote, "slug" | "topic_tags" | "title">> = [];
  for (const slug of slugs) {
    const fromDb = await getPublishedCommunityNoteBySlug(slug, "portugal");
    if (fromDb) {
      notes.push(fromDb);
      continue;
    }
    const curated = CURATED_GUIDES.find((g) => g.slug === slug);
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
    const before = force ? null : note.slug;
    const { path, generated: wasGenerated } = await ensureNoteOgImage(note, { force });
    if (wasGenerated && path.startsWith("/images/community-notes/")) generated++;
    void before;
  }

  console.log(`[note-og] done — ${notes.length} note(s), ${generated} with custom image`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

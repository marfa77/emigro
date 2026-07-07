import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { CommunityNote } from "@/lib/community-notes/types";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const PEXELS_API = "https://api.pexels.com/v1/search";
const NOTE_IMAGES_DIR = "public/images/community-notes";

/** Topic → landscape Pexels queries (Norte / Porto bias where relevant). */
export const TOPIC_PHOTO_QUERIES: Record<string, string[]> = {
  nif: ["porto portugal office documents", "tax documents desk", "portugal bureaucracy"],
  aima: ["immigration office queue", "passport documents portugal", "government building portugal"],
  arenda: ["porto apartment balcony", "rent apartment keys", "portugal city apartment"],
  bank: ["bank counter portugal", "portuguese bank office", "credit card payment"],
  sns: ["hospital portugal entrance", "healthcare clinic modern", "pharmacy portugal"],
  ciple: ["portugal language school", "classroom study books", "university library portugal"],
  transport: ["porto metro train", "portugal train station", "porto tram"],
  sim: ["mobile phone store", "sim card smartphone", "telecom shop"],
  school: ["international school portugal", "porto school building", "children classroom"],
  auto: ["portugal highway driving", "car road porto", "portugal car rental"],
  general: ["porto portugal skyline", "douro river porto", "norte portugal landscape"],
  portugal: ["porto portugal city", "douro river bridge", "braga portugal"],
};

/** Slug-specific overrides for hand-curated guides. */
const SLUG_PHOTO_QUERIES: Record<string, string[]> = {
  "mashina-portugaliya-kupit-arenda-import-2026": [
    "car driving portugal highway",
    "porto car street",
    "car dealership showroom",
  ],
  "zamena-voditelskih-prav-portugaliya-2026": [
    "driving license documents",
    "road portugal car",
    "driving test car",
  ],
  "mezhdunarodnye-shkoly-portugaliya-2026": [
    "international school portugal",
    "school porto building",
    "children school playground",
  ],
};

type PexelsPhotoSrc = {
  landscape?: string;
  large?: string;
};

type PexelsSearchResponse = {
  photos?: Array<{
    id: number;
    src: PexelsPhotoSrc;
  }>;
};

export function noteOgImagePublicPath(slug: string): string {
  return `/images/community-notes/${slug}.webp`;
}

export function noteOgImageFilePath(slug: string): string {
  return path.join(process.cwd(), NOTE_IMAGES_DIR, `${slug}.webp`);
}

export function hasNoteOgImage(slug: string): boolean {
  const dest = noteOgImageFilePath(slug);
  return fs.existsSync(dest) && fs.statSync(dest).size > 20_000;
}

/** Returns local OG path when cached on disk, otherwise site default. */
export function resolveNoteOgImage(note: Pick<CommunityNote, "slug">): string {
  if (hasNoteOgImage(note.slug)) return noteOgImagePublicPath(note.slug);
  return DEFAULT_OG_IMAGE;
}

export function queriesForNote(note: Pick<CommunityNote, "slug" | "topic_tags">): string[] {
  const slugQueries = SLUG_PHOTO_QUERIES[note.slug] ?? [];
  const primaryTag = note.topic_tags[0]?.toLowerCase();
  const topicQueries = primaryTag ? (TOPIC_PHOTO_QUERIES[primaryTag] ?? []) : [];
  const general = TOPIC_PHOTO_QUERIES.general;
  return Array.from(new Set([...slugQueries, ...topicQueries, ...general]));
}

async function searchPexelsPhoto(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    per_page: "8",
  });

  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    console.warn(`[note-og] Pexels search failed (${res.status}) for "${query}"`);
    return null;
  }

  const json = (await res.json()) as PexelsSearchResponse;
  for (const photo of json.photos ?? []) {
    const url = photo.src?.landscape || photo.src?.large;
    if (url) return url;
  }
  return null;
}

async function downloadPhoto(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo download failed (${res.status}): ${url}`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const input = Buffer.from(await res.arrayBuffer());
  await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .webp({ quality: 82 })
    .toFile(destPath);
}

export type EnsureNoteOgImageOptions = {
  force?: boolean;
  /** Delay after a successful Pexels download (rate limit courtesy). */
  rateLimitMs?: number;
};

/**
 * Downloads a landscape photo from Pexels, converts to 1200×630 WebP at public/images/community-notes/{slug}.webp.
 * Skips when file exists unless force=true. Returns the resolved OG path.
 */
export async function ensureNoteOgImage(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title">,
  options: EnsureNoteOgImageOptions = {}
): Promise<string> {
  const { force = false, rateLimitMs = 350 } = options;

  if (!force && hasNoteOgImage(note.slug)) {
    return noteOgImagePublicPath(note.slug);
  }

  const queries = queriesForNote(note);
  for (const query of queries) {
    const url = await searchPexelsPhoto(query);
    if (!url) continue;

    try {
      await downloadPhoto(url, noteOgImageFilePath(note.slug));
      if (hasNoteOgImage(note.slug)) {
        console.log(`[note-og] ${note.slug}: "${query}"`);
        if (rateLimitMs > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
        return noteOgImagePublicPath(note.slug);
      }
    } catch (error) {
      console.warn(`[note-og] download error for "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  if (!process.env.PEXELS_API_KEY?.trim()) {
    console.warn(`[note-og] ${note.slug}: no PEXELS_API_KEY`);
  } else {
    console.warn(`[note-og] ${note.slug}: no photo found`);
  }
  return resolveNoteOgImage(note);
}

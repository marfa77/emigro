import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { CommunityNote } from "@/lib/community-notes/types";
import { appendCommittedNoteOgSlug, COMMITTED_NOTE_OG_SLUGS } from "@/lib/community-notes/note-og-slugs";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

/** Spain hub card fallback when no committed/dynamic hero exists. */
export const SPAIN_DEFAULT_OG_IMAGE = "/images/og/corridor-spain.jpg";

/** Curated static OG paths for Spain editorial slugs (non-guide kinds + hero API fallback). */
/** Distinct pillar OG JPG per Spain editorial slug (no shared vnj-ispaniya for all). */
export const SPAIN_SLUG_STATIC_FALLBACKS: Record<string, string> = {
  "nie-empadronamiento-poryadok-2026": "/images/og/guide-vnj-ispaniya-2026.jpg",
  "tie-cita-extranjeria-valencia-2026": "/images/og/guide-otkaz-v-natsionalnoy-vize-konsulstvo-2026.jpg",
  "dnv-uge-konsulstvo-2026": "/images/og/guide-digital-nomad-portugaliya-ispaniya-italiya-2026.jpg",
  "arenda-valencia-idealista-2026": "/images/og/guide-pervye-30-dnej-v-ispanii-2026.jpg",
  "bank-iban-nerezident-ispaniya-2026": "/images/og/guide-bank-i-iban-dlya-rossiyan-v-evrope-2026.jpg",
  "beckham-autonomo-mify-2026": "/images/og/guide-grazhdanstvo-portugaliya-ispaniya-2026.jpg",
  "pervye-30-dnej-v-ispanii-satelit-2026": "/images/og/guide-portugaliya-vs-ispaniya-vnj-2026.jpg",
};

const PEXELS_API = "https://api.pexels.com/v1/search";
const NOTE_IMAGES_DIR = "public/images/community-notes";
const MIN_WEBP_BYTES = 20_000;

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

/** Topic → landscape Pexels queries (Valencia / Spain bias). */
export const SPAIN_TOPIC_PHOTO_QUERIES: Record<string, string[]> = {
  nie: ["nie spain documents desk", "empadronamiento office spain", "valencia city hall"],
  tie: ["extranjeria office spain", "immigration documents spain", "residence card spain"],
  arenda: ["valencia apartment balcony", "rent apartment keys spain", "idealista apartment spain"],
  bank: ["bank counter spain", "spanish bank office", "credit card payment desk"],
  dnv: ["digital nomad laptop spain", "remote work valencia", "coworking space spain"],
  uge: ["spanish consulate building", "visa documents desk", "immigration spain"],
  autonomo: ["freelancer laptop cafe spain", "self employed spain office", "tax documents desk"],
  general: ["valencia spain skyline", "spain cityscape sunset", "barcelona architecture"],
  spain: ["valencia spain city", "spain travel landscape", "madrid skyline"],
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
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026": [
    "porto foz douro family",
    "braga portugal city",
    "portugal family neighborhood",
  ],
  "pokupka-zemli-postroyka-doma-norte-portugaliya-2026": [
    "portugal countryside house",
    "construction land plot",
    "norte portugal landscape",
  ],
  "kupit-kvartiru-portugaliya-norte-2026": [
    "porto apartment building modern",
    "new apartment construction portugal",
    "real estate keys apartment",
  ],
  "klimat-norte-zhara-vlazhnost-plesen-zima-2026": [
    "porto apartment window rain",
    "dehumidifier home interior",
    "portugal winter apartment cozy",
  ],
  "regiony-portugalii-ekspaty-klimat-tseny-2026": [
    "portugal map regions landscape",
    "douro river porto skyline",
    "lisbon algarve portugal coast",
  ],
  "meditsina-norte-sns-chastnaya-stomatologiya-2026": [
    "hospital porto portugal exterior",
    "healthcare clinic modern europe",
    "dental clinic dentist office",
  ],
  "zamena-zagranpasporta-portugaliya-2026": [
    "passport documents desk",
    "embassy building lisbon",
    "travel documents passport",
  ],
  "elektromobil-tesla-v-portugalii-2026": [
    "tesla electric car charging",
    "ev charging station",
    "electric car portugal highway",
  ],
  "nie-empadronamiento-poryadok-2026": [
    "nie spain document",
    "empadronamiento valencia",
    "spanish bureaucracy office",
  ],
  "tie-cita-extranjeria-valencia-2026": [
    "extranjeria spain queue",
    "tie card spain",
    "immigration office valencia",
  ],
  "dnv-uge-konsulstvo-2026": [
    "digital nomad valencia beach",
    "spanish consulate visa",
    "remote work spain laptop",
  ],
  "arenda-valencia-idealista-2026": [
    "valencia apartment interior",
    "rent keys apartment spain",
    "valencia balcony city view",
  ],
  "bank-iban-nerezident-ispaniya-2026": [
    "bank office spain",
    "iban documents desk",
    "spanish bank counter",
  ],
  "beckham-autonomo-mify-2026": [
    "freelancer laptop spain",
    "tax form documents desk",
    "valencia coworking",
  ],
  "pervye-30-dnej-v-ispanii-satelit-2026": [
    "valencia spain arrival",
    "new city expat spain",
    "valencia street cafe",
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

/** Runtime hero endpoint (Vercel) when WebP is not yet committed to public/. */
export function noteOgImageDynamicPath(slug: string): string {
  return `/api/community-notes/hero/${slug}`;
}

export function noteOgImageFilePath(slug: string): string {
  return path.join(process.cwd(), NOTE_IMAGES_DIR, `${slug}.webp`);
}

export function hasNoteOgImageFile(slug: string): boolean {
  const dest = noteOgImageFilePath(slug);
  return fs.existsSync(dest) && fs.statSync(dest).size > MIN_WEBP_BYTES;
}

export function hasNoteOgImage(slug: string): boolean {
  if (COMMITTED_NOTE_OG_SLUGS.has(slug)) return true;
  return hasNoteOgImageFile(slug);
}

function canWriteNoteOgImages(): boolean {
  try {
    const dir = path.join(process.cwd(), NOTE_IMAGES_DIR);
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, ".write-probe");
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

function noteCountryKey(note: Pick<CommunityNote, "country_key">): "portugal" | "spain" {
  return note.country_key === "spain" ? "spain" : "portugal";
}

function spainSlugFallback(slug: string): string {
  return SPAIN_SLUG_STATIC_FALLBACKS[slug] ?? SPAIN_DEFAULT_OG_IMAGE;
}

/** Returns static, dynamic, or default OG path for a note. */
export function resolveNoteOgImage(
  note: Pick<CommunityNote, "slug" | "content_kind" | "country_key">
): string {
  if (hasNoteOgImage(note.slug)) return noteOgImagePublicPath(note.slug);
  if (note.content_kind === "guide") return noteOgImageDynamicPath(note.slug);
  if (noteCountryKey(note) === "spain") return spainSlugFallback(note.slug);
  return DEFAULT_OG_IMAGE;
}

/** Card/list thumbnail — always a displayable static or committed path (no dynamic API). */
export function resolveNoteCardImage(
  note: Pick<CommunityNote, "slug" | "content_kind" | "country_key">
): string {
  if (hasNoteOgImage(note.slug)) return noteOgImagePublicPath(note.slug);
  if (noteCountryKey(note) === "spain") return spainSlugFallback(note.slug);
  if (note.content_kind === "guide") return noteOgImageDynamicPath(note.slug);
  return DEFAULT_OG_IMAGE;
}

function queriesFromTitle(title: string | undefined, countryKey: "portugal" | "spain"): string[] {
  if (!title?.trim()) return [];
  const cleaned = title
    .replace(/[«»"—–\-:,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length < 8) return [];
  const short = cleaned.slice(0, 72);
  const place = countryKey === "spain" ? "spain" : "portugal";
  return [`${short} ${place}`, `${place} ${short.slice(0, 48)}`];
}

function queriesFromSlug(slug: string, countryKey: "portugal" | "spain"): string[] {
  const stem = slug.replace(/-20\d{2}$/, "");
  const skip =
    countryKey === "spain"
      ? /^(ispaniya|ispanii|gid|guide|spain|satelit)$/
      : /^(portugaliya|portugalii|gid|guide)$/;
  const words = stem.split("-").filter((w) => w.length > 3 && !skip.test(w));
  if (words.length === 0) return [];
  const place = countryKey === "spain" ? "spain" : "portugal";
  return [`${place} ${words.slice(0, 4).join(" ")}`];
}

export function queriesForNote(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "country_key">
): string[] {
  const countryKey = noteCountryKey(note);
  const topicMap = countryKey === "spain" ? SPAIN_TOPIC_PHOTO_QUERIES : TOPIC_PHOTO_QUERIES;
  const slugQueries = SLUG_PHOTO_QUERIES[note.slug] ?? [];
  const titleQueries = queriesFromTitle(note.title, countryKey);
  const slugKeywordQueries = queriesFromSlug(note.slug, countryKey);
  const primaryTag = note.topic_tags[0]?.toLowerCase();
  const topicQueries = primaryTag ? (topicMap[primaryTag] ?? []) : [];
  const general = topicMap.general;
  return Array.from(new Set([...slugQueries, ...titleQueries, ...slugKeywordQueries, ...topicQueries, ...general]));
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

async function photoUrlToWebpBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Photo download failed (${res.status}): ${url}`);
  const input = Buffer.from(await res.arrayBuffer());
  return sharp(input).resize(1200, 630, { fit: "cover", position: "center" }).webp({ quality: 82 }).toBuffer();
}

async function downloadPhoto(url: string, destPath: string): Promise<void> {
  const webp = await photoUrlToWebpBuffer(url);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, webp);
}

/** Generate 1200×630 WebP from Pexels without writing to disk. */
export async function generateNoteOgWebp(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "country_key">
): Promise<Buffer | null> {
  const queries = queriesForNote(note);
  for (const query of queries) {
    const url = await searchPexelsPhoto(query);
    if (!url) continue;
    try {
      const webp = await photoUrlToWebpBuffer(url);
      if (webp.length >= MIN_WEBP_BYTES) {
        console.log(`[note-og] ${note.slug}: generated from "${query}"`);
        return webp;
      }
    } catch (error) {
      console.warn(`[note-og] buffer error for "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  if (!process.env.PEXELS_API_KEY?.trim()) {
    console.warn(`[note-og] ${note.slug}: no PEXELS_API_KEY`);
  } else {
    console.warn(`[note-og] ${note.slug}: no photo found`);
  }
  return null;
}

export type EnsureNoteOgImageOptions = {
  force?: boolean;
  /** Delay after a successful Pexels download (rate limit courtesy). */
  rateLimitMs?: number;
};

export type EnsureNoteOgImageResult = {
  path: string;
  generated: boolean;
  manifestAppended: boolean;
};

/**
 * Downloads a landscape photo from Pexels, converts to 1200×630 WebP at public/images/community-notes/{slug}.webp.
 * On read-only hosts (Vercel) skips disk write and returns the dynamic hero API path.
 */
export async function ensureNoteOgImage(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "content_kind" | "country_key">,
  options: EnsureNoteOgImageOptions = {}
): Promise<EnsureNoteOgImageResult> {
  const { force = false, rateLimitMs = 350 } = options;

  if (!force && hasNoteOgImage(note.slug)) {
    return { path: noteOgImagePublicPath(note.slug), generated: false, manifestAppended: false };
  }

  const writable = canWriteNoteOgImages();
  const queries = queriesForNote(note);

  for (const query of queries) {
    const url = await searchPexelsPhoto(query);
    if (!url) continue;

    try {
      if (writable) {
        await downloadPhoto(url, noteOgImageFilePath(note.slug));
        if (hasNoteOgImageFile(note.slug)) {
          const manifestAppended = appendCommittedNoteOgSlug(note.slug);
          console.log(`[note-og] ${note.slug}: saved "${query}"`);
          if (rateLimitMs > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
          return { path: noteOgImagePublicPath(note.slug), generated: true, manifestAppended };
        }
      } else {
        const webp = await photoUrlToWebpBuffer(url);
        if (webp.length >= MIN_WEBP_BYTES) {
          console.log(`[note-og] ${note.slug}: generated (dynamic) "${query}"`);
          if (rateLimitMs > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
          return {
            path: resolveNoteOgImage(note),
            generated: true,
            manifestAppended: false,
          };
        }
      }
    } catch (error) {
      console.warn(`[note-og] download error for "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  return { path: resolveNoteOgImage(note), generated: false, manifestAppended: false };
}

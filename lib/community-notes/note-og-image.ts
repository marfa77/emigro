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
const PEXELS_PHOTO_API = "https://api.pexels.com/v1/photos";
const NOTE_IMAGES_DIR = "public/images/community-notes";
const MIN_WEBP_BYTES = 20_000;

/**
 * Pinned Pexels photo IDs — curated stock only (no AI, no random first hit).
 * Verify on pexels.com/photo/{id}/ before adding.
 */
const SLUG_PEXELS_PHOTO_IDS: Record<string, number> = {
  // Application form at desk — agendamento / consulate paperwork
  "zapis-v-konsulstvo-portugaliya-2026": 8441786,
  // Passport + notebook on wooden desk
  "zamena-zagranpasporta-portugaliya-2026": 164645,
};

/** Topic → landscape Pexels queries (Norte / Porto bias where relevant). */
export const TOPIC_PHOTO_QUERIES: Record<string, string[]> = {
  nif: ["porto portugal tax office documents", "portuguese financas desk paperwork", "nif documents portugal desk"],
  aima: ["immigration office portugal queue", "residence permit documents portugal", "aima immigration portugal building"],
  arenda: ["porto apartment balcony rent", "apartment keys portugal", "porto city apartment interior"],
  bank: ["portuguese bank office counter", "iban bank documents desk", "bank card payment portugal"],
  sns: ["hospital portugal exterior", "healthcare clinic europe modern", "pharmacy portugal storefront"],
  ciple: ["portugal language school classroom", "adult language class books", "portuguese study desk books"],
  transport: ["porto metro train station", "porto tram yellow", "porto public bus city"],
  sim: ["smartphone sim card desk", "fiber internet router home", "telecom store portugal"],
  school: ["international school portugal campus", "porto school building exterior", "children classroom europe"],
  auto: ["portugal highway car driving", "porto street parked car", "car rental portugal airport"],
  general: ["porto portugal ribeira skyline", "douro river porto bridge", "braga portugal city square"],
  portugal: ["porto portugal cityscape", "douro river porto", "lisbon portugal alfama"],
};

/** Topic → landscape Pexels queries (Valencia / Spain bias). */
export const SPAIN_TOPIC_PHOTO_QUERIES: Record<string, string[]> = {
  nie: ["spain government documents desk", "valencia city hall exterior", "spanish id documents paperwork"],
  tie: ["spain immigration office queue", "residence card spain documents", "extranjeria office spain"],
  arenda: ["valencia apartment balcony", "apartment keys spain rent", "valencia flat interior sunny"],
  bank: ["spanish bank office counter", "iban bank documents spain", "credit card desk europe"],
  dnv: ["digital nomad laptop valencia cafe", "remote work spain coworking", "valencia beach laptop work"],
  uge: ["spanish consulate building", "visa application documents desk", "passport visa stamp desk"],
  autonomo: ["freelancer laptop cafe spain", "tax documents desk europe", "valencia coworking space"],
  general: ["valencia spain skyline", "spain mediterranean cityscape", "barcelona architecture street"],
  spain: ["valencia spain city", "madrid spain skyline", "spain travel landscape"],
};

/**
 * Map RU/PT title + slug tokens → English stock queries.
 * Pexels search is English-first; Cyrillic titles return irrelevant junk.
 */
const TITLE_CONCEPT_QUERIES: Array<{ re: RegExp; queries: string[] }> = [
  {
    re: /aima|внж|residenc|imigr|миграц|titulo|título|agora|renova/i,
    queries: [
      "immigration office portugal documents",
      "residence permit card desk europe",
      "portuguese government building queue",
    ],
  },
  {
    re: /кондиционер|climatiz|air.?cond|климат.*кондиц|iva.*климат/i,
    queries: [
      "air conditioner wall apartment europe",
      "split ac home interior portugal",
      "summer apartment cooling europe",
    ],
  },
  {
    re: /музей|museum|cultura|культурн/i,
    queries: ["museum portugal lisbon interior", "art museum gallery europe", "museum exhibition hall portugal"],
  },
  {
    re: /беремен|prenatal|пособи|abono|maternity|род[ыа]|матер/i,
    queries: ["maternity hospital europe", "pregnant woman doctor clinic", "newborn hospital ward europe"],
  },
  {
    re: /аренд|arrendamento|rent|зумер|young.*porto|porto.*young/i,
    queries: ["porto apartment interior rent", "young couple apartment keys", "porto loft apartment balcony"],
  },
  {
    re: /транспорт|metro|автобус|stcp|tram|бесплатн.*проезд|проезд.*бесплатн/i,
    queries: ["porto metro train", "porto yellow tram", "porto city bus public transport"],
  },
  {
    re: /соцвзнос|segurança social|seguranca social|social security|взнос.*соц/i,
    queries: ["social security office europe", "payroll tax documents desk", "government office portugal paperwork"],
  },
  {
    re: /ребенк|ребёнк|child|car.?seat|детск.*авто|забыть.*машин/i,
    queries: ["child car seat safety", "family car portugal highway", "toddler car seat interior"],
  },
  {
    re: /политик|министр|парламент|невеш|assembleia|правительств/i,
    queries: ["lisbon parliament building", "portugal government building lisbon", "assembleia da republica lisbon"],
  },
  {
    re: /via.?verde|транспондер|toll|платн.*дорог|штраф.*дорог/i,
    queries: ["portugal highway toll road", "car driving a1 portugal", "highway toll booth europe"],
  },
  {
    re: /паспорт|passport|загран|консул/i,
    queries: ["passport documents desk", "embassy building exterior europe", "travel passport stamp desk"],
  },
  {
    re: /nif|finanç|financas|налог/i,
    queries: ["tax documents desk portugal", "portuguese financas office", "tax paperwork europe desk"],
  },
  {
    re: /sns|медицин|здоров|стомат|clinic|больниц/i,
    queries: ["hospital portugal exterior", "modern clinic waiting room europe", "dentist office europe"],
  },
  {
    re: /банк|iban|сч[её]т|conta/i,
    queries: ["bank office portugal counter", "iban bank card desk", "portuguese bank interior"],
  },
  {
    re: /школ|school|учеб/i,
    queries: ["international school portugal campus", "school building porto exterior", "classroom children europe"],
  },
  {
    re: /машин|carro|tesla|электро|водител|прав/i,
    queries: ["car portugal highway", "electric car charging portugal", "driving license documents desk"],
  },
  {
    re: /квартир|купить|недвиж|imóvel|imovel|земля|дом/i,
    queries: ["porto apartment building modern", "portugal house exterior norte", "real estate keys apartment"],
  },
  {
    re: /туриз|douro|algarve|выходн/i,
    queries: ["douro river valley portugal", "porto ribeira tourism", "algarve portugal coast"],
  },
];

/** Slug-specific overrides for hand-curated guides + recent news. */
const SLUG_PHOTO_QUERIES: Record<string, string[]> = {
  "mashina-portugaliya-kupit-arenda-import-2026": [
    "car driving portugal highway",
    "porto car street",
    "car dealership showroom europe",
  ],
  "zamena-voditelskih-prav-portugaliya-2026": [
    "driving license documents desk",
    "road portugal car driving",
    "driving test car europe",
  ],
  "mezhdunarodnye-shkoly-portugaliya-2026": [
    "international school portugal campus",
    "porto school building exterior",
    "children school playground europe",
  ],
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026": [
    "porto foz douro waterfront",
    "braga portugal city square",
    "portugal family neighborhood street",
  ],
  "pokupka-zemli-postroyka-doma-norte-portugaliya-2026": [
    "portugal countryside house",
    "construction land plot europe",
    "norte portugal rural landscape",
  ],
  "kupit-kvartiru-portugaliya-norte-2026": [
    "porto apartment building modern",
    "new apartment construction portugal",
    "real estate keys apartment europe",
  ],
  "klimat-norte-zhara-vlazhnost-plesen-zima-2026": [
    "porto apartment window rain",
    "dehumidifier home interior",
    "portugal winter apartment cozy",
  ],
  "regiony-portugalii-ekspaty-klimat-tseny-2026": [
    "portugal landscape regions aerial",
    "douro river porto skyline",
    "algarve portugal coast cliffs",
  ],
  "meditsina-norte-sns-chastnaya-stomatologiya-2026": [
    "hospital porto portugal exterior",
    "healthcare clinic modern europe",
    "dental clinic dentist office",
  ],
  "zamena-zagranpasporta-portugaliya-2026": [
    "passport documents on wooden desk",
    "hand holding open passport stamps",
    "visa application form desk",
  ],
  "zapis-v-konsulstvo-portugaliya-2026": [
    "visa application form desk",
    "passport documents on wooden desk",
    "appointment calendar documents desk",
  ],
  "prodlenie-vnzh-portugaliya-aima-2026": [
    "immigration office queue europe",
    "residence permit card documents",
    "government building portugal documents",
  ],
  "elektromobil-tesla-v-portugalii-2026": [
    "tesla electric car charging station",
    "ev charging station europe",
    "electric car portugal highway",
  ],
  "porto-free-public-transport-guide": [
    "porto metro train station",
    "porto yellow tram street",
    "porto public transport bus",
  ],
  "aima-residence-card-sent-abroad-2026": [
    "residence permit card documents desk",
    "immigration office portugal paperwork",
    "passport and id documents desk",
  ],
  "iva-climatizacao-portugal-2026": [
    "air conditioner wall apartment europe",
    "split ac home interior summer",
    "portugal apartment balcony heat",
  ],
  "politicheskiy-krizis-ministr-neves-portugalia": [
    "lisbon parliament building portugal",
    "assembleia da republica lisbon",
    "portugal government building exterior",
  ],
  "social-security-contributions-portugal-risk-2026": [
    "social security office europe paperwork",
    "payroll tax documents desk",
    "portuguese government office interior",
  ],
  "car-child-safety-rules-portugal-2026": [
    "child car seat safety europe",
    "family car interior child seat",
    "toddler car seat portugal",
  ],
  "aima-centro-aristides-de-sousa-mendes-porto-2026": [
    "porto portugal modern office building",
    "immigration office portugal exterior",
    "porto city government building",
  ],
  "free-museums-portugal-changes-2026": [
    "museum portugal lisbon interior",
    "art museum gallery portugal",
    "museum exhibition hall europe",
  ],
  "abono-prenatal-automatico-portugal-2026": [
    "maternity clinic pregnant woman europe",
    "prenatal care doctor office",
    "hospital maternity ward europe",
  ],
  "arrendamento-jovem-porto-2026": [
    "porto apartment interior young renters",
    "porto loft apartment balcony",
    "apartment keys porto portugal",
  ],
  "maternity-care-law-change-portugal-2026": [
    "maternity hospital europe",
    "newborn hospital portugal",
    "pregnant woman healthcare clinic",
  ],
  "via-verde-transponder-replacement-portugal": [
    "portugal highway toll road",
    "car driving portugal motorway",
    "highway toll booth europe",
  ],
  "nie-empadronamiento-poryadok-2026": [
    "spain government documents desk",
    "valencia city hall exterior",
    "spanish bureaucracy paperwork",
  ],
  "tie-cita-extranjeria-valencia-2026": [
    "spain immigration office queue",
    "residence card spain documents",
    "extranjeria office spain",
  ],
  "dnv-uge-konsulstvo-2026": [
    "digital nomad laptop valencia",
    "spanish consulate building",
    "remote work spain coworking",
  ],
  "arenda-valencia-idealista-2026": [
    "valencia apartment interior",
    "rent keys apartment spain",
    "valencia balcony city view",
  ],
  "bank-iban-nerezident-ispaniya-2026": [
    "bank office spain counter",
    "iban documents desk europe",
    "spanish bank interior",
  ],
  "beckham-autonomo-mify-2026": [
    "freelancer laptop spain cafe",
    "tax form documents desk",
    "valencia coworking space",
  ],
  "pervye-30-dnej-v-ispanii-satelit-2026": [
    "valencia spain city arrival",
    "valencia street cafe spain",
    "new city expat spain luggage",
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
  // Vercel has no VPS-written WebP — warm via dynamic hero for any kind.
  if (noteCountryKey(note) === "portugal" || note.content_kind === "guide") {
    return noteOgImageDynamicPath(note.slug);
  }
  if (noteCountryKey(note) === "spain") return spainSlugFallback(note.slug);
  return DEFAULT_OG_IMAGE;
}

/** Card/list thumbnail — prefer committed WebP, else dynamic hero (not the shared default). */
export function resolveNoteCardImage(
  note: Pick<CommunityNote, "slug" | "content_kind" | "country_key">
): string {
  if (hasNoteOgImage(note.slug)) return noteOgImagePublicPath(note.slug);
  if (noteCountryKey(note) === "spain") {
    if (note.content_kind === "guide") return noteOgImageDynamicPath(note.slug);
    return spainSlugFallback(note.slug);
  }
  return noteOgImageDynamicPath(note.slug);
}

function queriesFromTitleConcepts(title: string | undefined, slug: string): string[] {
  const haystack = `${title ?? ""} ${slug.replace(/-/g, " ")}`;
  const out: string[] = [];
  for (const { re, queries } of TITLE_CONCEPT_QUERIES) {
    if (re.test(haystack)) out.push(...queries);
  }
  return out;
}

/** English keyword queries from slug tokens (never Cyrillic — Pexels is EN-first). */
function queriesFromSlug(slug: string, countryKey: "portugal" | "spain"): string[] {
  const stem = slug.replace(/-20\d{2}$/, "");
  const place = countryKey === "spain" ? "spain" : "portugal";
  const TOKEN_EN: Record<string, string> = {
    aima: "immigration office",
    residence: "residence permit",
    card: "id card documents",
    nif: "tax documents",
    arenda: "apartment rent",
    arrendamento: "apartment rent",
    sns: "hospital clinic",
    bank: "bank office",
    transport: "public transport",
    metro: "metro train",
    auto: "car highway",
    car: "car driving",
    child: "child car seat",
    safety: "car safety",
    museum: "museum gallery",
    museums: "museum portugal",
    free: "public museum",
    maternity: "maternity hospital",
    prenatal: "prenatal care",
    abono: "family benefits office",
    climatizacao: "air conditioner",
    iva: "tax invoice documents",
    social: "social security office",
    security: "government paperwork",
    contributions: "payroll tax documents",
    passport: "passport documents",
    via: "highway toll",
    verde: "portugal motorway",
    transponder: "toll road car",
    porto: "porto city",
    braga: "braga portugal",
    joven: "young apartment",
    young: "young renters apartment",
  };
  const skip = new Set([
    "portugaliya",
    "portugalii",
    "portugal",
    "ispaniya",
    "ispanii",
    "spain",
    "gid",
    "guide",
    "satelit",
    "rules",
    "change",
    "changes",
    "risk",
    "sent",
    "abroad",
    "law",
    "care",
  ]);
  const mapped = stem
    .split("-")
    .filter((w) => w.length > 2 && !skip.has(w) && !/^\d+$/.test(w))
    .map((w) => TOKEN_EN[w] ?? null)
    .filter((w): w is string => Boolean(w));
  if (mapped.length === 0) return [];
  return [`${place} ${mapped.slice(0, 3).join(" ")}`];
}

export function queriesForNote(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "country_key">
): string[] {
  const countryKey = noteCountryKey(note);
  const topicMap = countryKey === "spain" ? SPAIN_TOPIC_PHOTO_QUERIES : TOPIC_PHOTO_QUERIES;
  const slugQueries = SLUG_PHOTO_QUERIES[note.slug] ?? [];
  const conceptQueries = queriesFromTitleConcepts(note.title, note.slug);
  const slugKeywordQueries = queriesFromSlug(note.slug, countryKey);

  // Prefer relocant topics; skip geo-only tags that drown relevance (portugal/spain).
  const topicQueries = note.topic_tags
    .map((t) => t.toLowerCase())
    .filter((t) => t !== "portugal" && t !== "spain" && t !== "lisboa" && t !== "porto")
    .flatMap((t) => topicMap[t] ?? [])
    .slice(0, 6);

  const general = topicMap.general;
  // Order: curated slug → title concepts → slug tokens → topic → general fallback.
  return Array.from(
    new Set([...slugQueries, ...conceptQueries, ...slugKeywordQueries, ...topicQueries, ...general])
  );
}

async function fetchPexelsPhotoById(photoId: number): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch(`${PEXELS_PHOTO_API}/${photoId}`, {
    headers: { Authorization: apiKey },
  });
  if (!res.ok) {
    console.warn(`[note-og] Pexels photo ${photoId} failed (${res.status})`);
    return null;
  }
  const json = (await res.json()) as { src?: { landscape?: string; large?: string } };
  return json.src?.landscape || json.src?.large || null;
}

async function searchPexelsPhoto(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  // Never send Cyrillic to Pexels — returns irrelevant stock.
  if (/[А-Яа-яЁё]/.test(query)) {
    console.warn(`[note-og] skip Cyrillic Pexels query: "${query.slice(0, 48)}"`);
    return null;
  }

  const params = new URLSearchParams({
    query,
    orientation: "landscape",
    locale: "en-US",
    per_page: "12",
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

/** Resolve stock photo URL: pinned Pexels id first, then search queries. */
async function resolvePexelsPhotoUrl(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "country_key">
): Promise<{ url: string; label: string } | null> {
  const pinnedId = SLUG_PEXELS_PHOTO_IDS[note.slug];
  if (pinnedId) {
    const url = await fetchPexelsPhotoById(pinnedId);
    if (url) return { url, label: `pexels:${pinnedId}` };
  }
  for (const query of queriesForNote(note)) {
    const url = await searchPexelsPhoto(query);
    if (url) return { url, label: query };
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

/** Fetch 1200×630 WebP from Pexels stock (pinned id or search) without writing to disk. */
export async function generateNoteOgWebp(
  note: Pick<CommunityNote, "slug" | "topic_tags" | "title" | "country_key">
): Promise<Buffer | null> {
  const resolved = await resolvePexelsPhotoUrl(note);
  if (!resolved) {
    if (!process.env.PEXELS_API_KEY?.trim()) {
      console.warn(`[note-og] ${note.slug}: no PEXELS_API_KEY`);
    } else {
      console.warn(`[note-og] ${note.slug}: no photo found`);
    }
    return null;
  }
  try {
    const webp = await photoUrlToWebpBuffer(resolved.url);
    if (webp.length >= MIN_WEBP_BYTES) {
      console.log(`[note-og] ${note.slug}: stock from "${resolved.label}"`);
      return webp;
    }
  } catch (error) {
    console.warn(`[note-og] buffer error for "${resolved.label}":`, error instanceof Error ? error.message : error);
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
 * Downloads a landscape photo from Pexels stock, converts to 1200×630 WebP at public/images/community-notes/{slug}.webp.
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
  const resolved = await resolvePexelsPhotoUrl(note);
  if (!resolved) {
    return { path: resolveNoteOgImage(note), generated: false, manifestAppended: false };
  }

  try {
    if (writable) {
      await downloadPhoto(resolved.url, noteOgImageFilePath(note.slug));
      if (hasNoteOgImageFile(note.slug)) {
        const manifestAppended = appendCommittedNoteOgSlug(note.slug);
        console.log(`[note-og] ${note.slug}: saved stock "${resolved.label}"`);
        if (rateLimitMs > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
        return { path: noteOgImagePublicPath(note.slug), generated: true, manifestAppended };
      }
    } else {
      const webp = await photoUrlToWebpBuffer(resolved.url);
      if (webp.length >= MIN_WEBP_BYTES) {
        console.log(`[note-og] ${note.slug}: stock (dynamic) "${resolved.label}"`);
        if (rateLimitMs > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
        return {
          path: resolveNoteOgImage(note),
          generated: true,
          manifestAppended: false,
        };
      }
    }
  } catch (error) {
    console.warn(`[note-og] download error for "${resolved.label}":`, error instanceof Error ? error.message : error);
  }

  return { path: resolveNoteOgImage(note), generated: false, manifestAppended: false };
}

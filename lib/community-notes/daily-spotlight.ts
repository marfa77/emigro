import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { CONTENT_KIND_EMOJI, CONTENT_KIND_LABELS, hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import { portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";
import { createServerClient } from "@/lib/supabase/server";

export type DailySpotlight = {
  id: string;
  country_key: string;
  spotlight_date: string;
  note_slug: string;
  content_kind: ContentKind;
  headline: string;
  threads_text: string;
  note_url: string;
  updated_at: string;
};

const SPOTLIGHT_TZ = process.env.EMIGRO_ANALYTICS_TIMEZONE?.trim() || "Europe/Lisbon";

/** Prefer guides published within this window; fall back to 30 days if empty. */
const RECENT_CANDIDATE_DAYS = 14;
const FALLBACK_CANDIDATE_DAYS = 30;

/** Skip notes featured in the last N days so the tile rotates. */
const SPOTLIGHT_COOLDOWN_DAYS = 7;

const KIND_SCORE: Record<ContentKind, number> = {
  news: 100,
  lifehack: 90,
  guide: 80,
  tip: 65,
  qa: 40,
};

/** Relocation topics readers care about most on the hub. */
const TOPIC_SCORE: Record<string, number> = {
  nif: 35,
  aima: 35,
  arenda: 30,
  bank: 25,
  sns: 22,
  ciple: 22,
  transport: 12,
  auto: 12,
  sim: 10,
  pets: 10,
  general: 0,
};

function publishedOnDate(iso: string | null, dateStr: string): boolean {
  if (!iso) return false;
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: SPOTLIGHT_TZ }).format(new Date(iso));
  return day === dateStr;
}

function ageInDays(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

function primaryTopic(note: CommunityNote): string {
  return note.topic_tags.find((t) => t !== "portugal" && t !== "lisboa") ?? "general";
}

function scoreNote(
  note: CommunityNote,
  recentSpotlightSlugs: Set<string>,
  today: string,
  maxAgeDays: number
): number {
  if (recentSpotlightSlugs.has(note.slug)) return -1;
  if (!note.published_at) return -1;

  const ageDays = ageInDays(note.published_at);
  if (ageDays > maxAgeDays) return -1;

  // Recency dominates so fresh guides beat older enriched NIF/AIMA checklists.
  let score = Math.max(0, maxAgeDays - ageDays) * 50;
  if (publishedOnDate(note.published_at, today)) score += 120;

  score += KIND_SCORE[note.content_kind] ?? 30;
  score += TOPIC_SCORE[primaryTopic(note)] ?? 0;

  if (note.body_sections.length >= 4) score += 20;
  if (note.key_takeaways.length >= 3) score += 15;
  if (note.faq.length >= 4) score += 10;

  return score;
}

function compareRankedNotes(
  a: { note: CommunityNote; score: number },
  b: { note: CommunityNote; score: number }
): number {
  if (b.score !== a.score) return b.score - a.score;
  const aTime = new Date(a.note.published_at ?? 0).getTime();
  const bTime = new Date(b.note.published_at ?? 0).getTime();
  return bTime - aTime;
}

function spotlightBody(note: CommunityNote): string {
  if (note.key_takeaways.length >= 2) {
    return note.key_takeaways
      .slice(0, 3)
      .map((t) => `• ${t.trim()}`)
      .join("\n");
  }
  const hook = note.quick_answer.trim().replace(/\s+/g, " ");
  return hook.length > 320 ? `${hook.slice(0, 317).trim()}…` : hook;
}

export function buildThreadsText(note: CommunityNote, noteUrl: string): string {
  const emoji = CONTENT_KIND_EMOJI[note.content_kind];
  const body = spotlightBody(note);

  const tagParts = note.hashtags
    .slice(0, 3)
    .map((t) => `#${hashtagLabel(normalizeHashtag(t)).replace(/\s+/g, "")}`)
    .filter((t) => t.length > 1);

  tagParts.push("#Португалия", "#Порту");
  const uniqueTags = Array.from(new Set(tagParts)).slice(0, 5).join(" ");

  return `${emoji} ${note.title}\n\n${body}\n\n→ ${noteUrl}\n\n${uniqueTags}`;
}

function todayInTz(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SPOTLIGHT_TZ }).format(new Date());
}

function formatSpotlightDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: SPOTLIGHT_TZ,
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function formatSpotlightDateLabel(isoDate: string): string {
  return formatSpotlightDate(isoDate);
}

function pickBestNote(
  notes: CommunityNote[],
  recentSpotlightSlugs: Set<string>,
  today: string
): CommunityNote | null {
  if (notes.length === 0) return null;

  for (const maxAgeDays of [RECENT_CANDIDATE_DAYS, FALLBACK_CANDIDATE_DAYS]) {
    const ranked = notes
      .map((note) => ({ note, score: scoreNote(note, recentSpotlightSlugs, today, maxAgeDays) }))
      .filter((x) => x.score >= 0)
      .sort(compareRankedNotes);

    if (ranked[0]) return ranked[0].note;
  }

  return notes[0] ?? null;
}

function satellitePublicUrl(countryKey: string, path: string): string {
  if (countryKey === "spain") return spainSatellitePublicUrl(path);
  return portugalSatellitePublicUrl(path);
}

function sanitizeSpotlightUrl(url: string, slug: string, countryKey: string): string {
  if (/localhost|127\.0\.0\.1/.test(url)) {
    return satellitePublicUrl(countryKey, `/notes/${slug}`);
  }
  return url;
}

function sanitizeThreadsText(text: string, slug: string, countryKey: string): string {
  const publicUrl = satellitePublicUrl(countryKey, `/notes/${slug}`);
  return text.replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/[^\s]+/g, publicUrl);
}

function mapSpotlight(row: Record<string, unknown>): DailySpotlight {
  const slug = String(row.note_slug);
  const countryKey = String(row.country_key);
  return {
    id: String(row.id),
    country_key: countryKey,
    spotlight_date: String(row.spotlight_date),
    note_slug: slug,
    content_kind: (row.content_kind as ContentKind) ?? "tip",
    headline: String(row.headline),
    threads_text: sanitizeThreadsText(String(row.threads_text), slug, countryKey),
    note_url: sanitizeSpotlightUrl(String(row.note_url), slug, countryKey),
    updated_at: String(row.updated_at),
  };
}

async function getRecentSpotlightSlugs(countryKey: string, today: string): Promise<Set<string>> {
  const supabase = createServerClient();
  const start = new Date(`${today}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - SPOTLIGHT_COOLDOWN_DAYS);
  const startStr = start.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("community_daily_spotlight")
    .select("note_slug")
    .eq("country_key", countryKey)
    .gte("spotlight_date", startStr)
    .lt("spotlight_date", today);

  return new Set((data ?? []).map((row) => String(row.note_slug)));
}

function isSpotlightStillBest(
  storedSlug: string,
  notes: CommunityNote[],
  recentSpotlightSlugs: Set<string>,
  today: string
): boolean {
  const best = pickBestNote(notes, recentSpotlightSlugs, today);
  return best?.slug === storedSlug;
}

/** Pick today's best note and persist Threads-ready copy. Idempotent per calendar day. */
export async function refreshDailySpotlight(countryKey = "portugal"): Promise<DailySpotlight | null> {
  ensurePortugalCronEnv();
  const today = todayInTz();
  const notes = await getPublishedCommunityNotes(countryKey);
  const recentSpotlightSlugs = await getRecentSpotlightSlugs(countryKey, today);
  const note = pickBestNote(notes, recentSpotlightSlugs, today);
  if (!note) return null;

  const noteUrl = satellitePublicUrl(countryKey, `/notes/${note.slug}`);
  const threadsText = buildThreadsText(note, noteUrl);
  const headline = `${CONTENT_KIND_LABELS[note.content_kind]} дня`;

  const supabase = createServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("community_daily_spotlight")
    .upsert(
      {
        country_key: countryKey,
        spotlight_date: today,
        note_slug: note.slug,
        note_id: note.id.startsWith("seed-") ? null : note.id,
        content_kind: note.content_kind,
        headline,
        threads_text: threadsText,
        note_url: noteUrl,
        updated_at: now,
      },
      { onConflict: "country_key,spotlight_date" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapSpotlight(data);
}

export async function getDailySpotlight(countryKey = "portugal"): Promise<DailySpotlight | null> {
  const today = todayInTz();

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("community_daily_spotlight")
      .select("*")
      .eq("country_key", countryKey)
      .eq("spotlight_date", today)
      .maybeSingle();

    if (error) {
      if (/community_daily_spotlight/.test(error.message)) return null;
      console.warn("[spotlight] load failed:", error.message);
      return refreshDailySpotlight(countryKey);
    }

    if (data) {
      const stored = mapSpotlight(data);
      const [notes, recentSpotlightSlugs] = await Promise.all([
        getPublishedCommunityNotes(countryKey),
        getRecentSpotlightSlugs(countryKey, today),
      ]);
      if (isSpotlightStillBest(stored.note_slug, notes, recentSpotlightSlugs, today)) {
        return stored;
      }
      return refreshDailySpotlight(countryKey);
    }
    return refreshDailySpotlight(countryKey);
  } catch {
    return null;
  }
}

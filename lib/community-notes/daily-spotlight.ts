import { CONTENT_KIND_EMOJI, CONTENT_KIND_LABELS, hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import { portugalSatelliteUrl } from "@/lib/site-url";
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

const KIND_SCORE: Record<ContentKind, number> = {
  news: 100,
  lifehack: 85,
  tip: 75,
  qa: 45,
  guide: 35,
};

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

function scoreNote(note: CommunityNote, yesterdaySlug: string | null): number {
  if (yesterdaySlug && note.slug === yesterdaySlug) return -1;

  let score = KIND_SCORE[note.content_kind] ?? 30;
  if (!note.published_at) return score;

  const ageHours = (Date.now() - new Date(note.published_at).getTime()) / 3_600_000;
  if (ageHours <= 24) score += 60;
  else if (ageHours <= 72) score += 35;
  else if (ageHours <= 168) score += 15;

  if (note.content_kind === "news") score += 20;
  return score;
}

export function buildThreadsText(note: CommunityNote, noteUrl: string): string {
  const emoji = CONTENT_KIND_EMOJI[note.content_kind];
  const hook = note.quick_answer.trim().replace(/\s+/g, " ");
  const body =
    hook.length > 320 ? `${hook.slice(0, 317).trim()}…` : hook;

  const tagParts = note.hashtags
    .slice(0, 3)
    .map((t) => `#${hashtagLabel(normalizeHashtag(t)).replace(/\s+/g, "")}`)
    .filter((t) => t.length > 1);

  tagParts.push("#Португалия", "#Лиссабон");
  const uniqueTags = Array.from(new Set(tagParts)).slice(0, 5).join(" ");

  return `${emoji} ${note.title}\n\n${body}\n\n→ ${noteUrl}\n\n${uniqueTags}`;
}

function pickBestNote(notes: CommunityNote[], yesterdaySlug: string | null): CommunityNote | null {
  if (notes.length === 0) return null;

  const ranked = notes
    .map((note) => ({ note, score: scoreNote(note, yesterdaySlug) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.note ?? notes[0] ?? null;
}

function mapSpotlight(row: Record<string, unknown>): DailySpotlight {
  return {
    id: String(row.id),
    country_key: String(row.country_key),
    spotlight_date: String(row.spotlight_date),
    note_slug: String(row.note_slug),
    content_kind: (row.content_kind as ContentKind) ?? "tip",
    headline: String(row.headline),
    threads_text: String(row.threads_text),
    note_url: String(row.note_url),
    updated_at: String(row.updated_at),
  };
}

async function getYesterdaySlug(countryKey: string, today: string): Promise<string | null> {
  const supabase = createServerClient();
  const yesterday = new Date(`${today}T12:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("community_daily_spotlight")
    .select("note_slug")
    .eq("country_key", countryKey)
    .eq("spotlight_date", yStr)
    .maybeSingle();

  return data?.note_slug ? String(data.note_slug) : null;
}

/** Pick today's best note and persist Threads-ready copy. Idempotent per calendar day. */
export async function refreshDailySpotlight(countryKey = "portugal"): Promise<DailySpotlight | null> {
  const today = todayInTz();
  const notes = await getPublishedCommunityNotes(countryKey);
  const yesterdaySlug = await getYesterdaySlug(countryKey, today);
  const note = pickBestNote(notes, yesterdaySlug);
  if (!note) return null;

  const noteUrl = portugalSatelliteUrl(`/notes/${note.slug}`);
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

    if (data) return mapSpotlight(data);
    return refreshDailySpotlight(countryKey);
  } catch {
    return null;
  }
}

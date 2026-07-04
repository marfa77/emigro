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
  sim: 10,
  pets: 10,
  general: 0,
};

function publishedOnDate(iso: string | null, dateStr: string): boolean {
  if (!iso) return false;
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: SPOTLIGHT_TZ }).format(new Date(iso));
  return day === dateStr;
}

function primaryTopic(note: CommunityNote): string {
  return note.topic_tags.find((t) => t !== "portugal" && t !== "lisboa") ?? "general";
}

function scoreNote(note: CommunityNote, yesterdaySlug: string | null, today: string): number {
  if (yesterdaySlug && note.slug === yesterdaySlug) return -1;

  let score = KIND_SCORE[note.content_kind] ?? 30;
  score += TOPIC_SCORE[primaryTopic(note)] ?? 0;

  if (publishedOnDate(note.published_at, today)) score += 100;
  else if (note.published_at) {
    const ageHours = (Date.now() - new Date(note.published_at).getTime()) / 3_600_000;
    if (ageHours <= 24) score += 50;
    else if (ageHours <= 72) score += 25;
    else if (ageHours <= 168) score += 10;
  }

  if (note.body_sections.length >= 4) score += 20;
  if (note.key_takeaways.length >= 3) score += 15;
  if (note.faq.length >= 4) score += 10;

  return score;
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

  tagParts.push("#Португалия", "#Лиссабон");
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

function pickBestNote(notes: CommunityNote[], yesterdaySlug: string | null, today: string): CommunityNote | null {
  if (notes.length === 0) return null;

  const ranked = notes
    .map((note) => ({ note, score: scoreNote(note, yesterdaySlug, today) }))
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
  const note = pickBestNote(notes, yesterdaySlug, today);
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

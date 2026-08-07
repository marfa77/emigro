import { unstable_cache } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import {
  finalizeCommunityNote,
  mergePublishedNotesWithSeed,
} from "@/lib/community-notes/normalize-note";
import { isCommunityNotesSeedOnly, noteSeedFallback } from "@/lib/community-notes/seed";
import type { CommunityNote, CommunitySignalIngest } from "@/lib/community-notes/types";
import { filterRelocantSignals } from "@/lib/satellite/portugal";

/** List/hub/sitemap — skip fat body/faq JSON that blows micro statement_timeout. */
const COMMUNITY_NOTE_LIST_COLUMNS = [
  "id",
  "slug",
  "country_key",
  "city",
  "category",
  "content_kind",
  "title",
  "excerpt",
  "seo_title",
  "seo_description",
  "quick_answer",
  "key_takeaways",
  "source_channel",
  "source_label",
  "topic_tags",
  "hashtags",
  "status",
  "published_at",
  "created_at",
  "updated_at",
].join(",");

/**
 * Load published notes from Supabase. Throws on error/empty so callers (and
 * `unstable_cache`) never persist the 4-note seed stub that Googlebot indexes as thin.
 */
async function fetchPublishedCommunityNotesFromDb(countryKey: string): Promise<CommunityNote[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select(COMMUNITY_NOTE_LIST_COLUMNS)
    .eq("country_key", countryKey)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(80);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  if (rows.length === 0) {
    throw new Error(`community_notes empty for ${countryKey}`);
  }

  const notes = rows.map((row) => finalizeCommunityNote(row, countryKey));
  const merged = mergePublishedNotesWithSeed(notes, countryKey);
  if (isCommunityNotesSeedOnly(merged)) {
    throw new Error(`community_notes seed-only for ${countryKey}`);
  }
  return merged;
}

/** Direct DB load for cron/CLI — falls back to seed when DB is down. */
export async function getPublishedCommunityNotesUncached(
  countryKey = "portugal",
): Promise<CommunityNote[]> {
  try {
    return await fetchPublishedCommunityNotesFromDb(countryKey);
  } catch (e) {
    console.warn("[community-notes] fallback to seed:", e);
    return noteSeedFallback(countryKey);
  }
}

/**
 * Cached list for hub/sitemap/tags.
 * Failures are not written into the Data Cache (throw inside `unstable_cache`).
 * One uncached retry, then seed for soft UX — indexable surfaces must call
 * {@link requirePublishedCommunityNotes} instead.
 */
export async function getPublishedCommunityNotes(countryKey = "portugal"): Promise<CommunityNote[]> {
  try {
    return await unstable_cache(
      () => fetchPublishedCommunityNotesFromDb(countryKey),
      ["community-notes", countryKey],
      {
        revalidate: CACHE_REVALIDATE.communityNotes,
        tags: [CACHE_TAGS.communityNotes, `${CACHE_TAGS.communityNotes}-${countryKey}`],
      },
    )();
  } catch (first) {
    console.warn("[community-notes] cache miss/error, retry uncached:", first);
    try {
      return await fetchPublishedCommunityNotesFromDb(countryKey);
    } catch (e) {
      console.warn("[community-notes] fallback to seed (uncached):", e);
      return noteSeedFallback(countryKey);
    }
  }
}

/**
 * For SEO surfaces (hub, sitemap): never render/list seed-only stubs.
 * Throws after retry so Next returns 5xx and Google retries instead of indexing thin HTML.
 */
export async function requirePublishedCommunityNotes(
  countryKey = "portugal",
): Promise<CommunityNote[]> {
  const notes = await getPublishedCommunityNotes(countryKey);
  if (!isCommunityNotesSeedOnly(notes)) return notes;

  try {
    return await fetchPublishedCommunityNotesFromDb(countryKey);
  } catch (e) {
    console.error("[community-notes] refusing seed-only for indexable surface:", e);
    throw new Error(`Community notes unavailable for ${countryKey}`);
  }
}

export async function getPublishedCommunityNotesByHashtag(
  tag: string,
  countryKey = "portugal",
): Promise<CommunityNote[]> {
  const normalized = normalizeHashtag(tag);
  const all = await getPublishedCommunityNotes(countryKey);
  return all.filter((n) => n.hashtags.some((h) => normalizeHashtag(h) === normalized));
}

async function fetchPublishedCommunityNoteBySlugUncached(
  slug: string,
  countryKey: string,
): Promise<CommunityNote | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("community_notes")
      .select("*")
      .eq("slug", slug)
      .eq("country_key", countryKey)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      return noteSeedFallback(countryKey).find((n) => n.slug === slug) ?? null;
    }
    return finalizeCommunityNote(data, countryKey);
  } catch {
    return noteSeedFallback(countryKey).find((n) => n.slug === slug) ?? null;
  }
}

export async function getPublishedCommunityNoteBySlugUncached(
  slug: string,
  countryKey = "portugal",
): Promise<CommunityNote | null> {
  return fetchPublishedCommunityNoteBySlugUncached(slug, countryKey);
}

export async function getPublishedCommunityNoteBySlug(
  slug: string,
  countryKey = "portugal",
): Promise<CommunityNote | null> {
  return unstable_cache(
    () => fetchPublishedCommunityNoteBySlugUncached(slug, countryKey),
    ["community-note-by-slug", countryKey, slug],
    {
      revalidate: CACHE_REVALIDATE.communityNotes,
      tags: [CACHE_TAGS.communityNotes, `${CACHE_TAGS.communityNotes}-${countryKey}`, `community-note-${slug}`],
    },
  )();
}

export async function ingestCommunitySignals(
  signals: CommunitySignalIngest[],
): Promise<{ received: number; inserted: number; skipped: number }> {
  const relocantSignals = filterRelocantSignals(signals);
  const ownedSkipped = signals.length - relocantSignals.length;
  const supabase = createServerClient();
  let inserted = 0;
  let skipped = ownedSkipped;

  for (const signal of relocantSignals) {
    const row = {
      channel_username: signal.channel_username.replace(/^@/, ""),
      channel_title: signal.channel_title ?? null,
      message_id: signal.message_id,
      post_url: signal.post_url ?? null,
      text: signal.text.trim(),
      topic_hints: signal.topic_hints ?? [],
      content_kind: signal.content_kind ?? "tip",
      hashtags: signal.hashtags ?? [],
      city: signal.city ?? "porto",
      country_key: signal.country_key ?? "portugal",
      posted_at: signal.posted_at,
      status: "new",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("community_signals").upsert(row, {
      onConflict: "channel_username,message_id",
      ignoreDuplicates: true,
    });

    if (error) {
      if (/duplicate key|23505/.test(error.message)) {
        skipped += 1;
      } else {
        throw new Error(error.message);
      }
    } else {
      inserted += 1;
    }
  }

  return { received: signals.length, inserted, skipped };
}

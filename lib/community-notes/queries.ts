import { unstable_cache } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import {
  finalizeCommunityNote,
  mergePublishedNotesWithSeed,
} from "@/lib/community-notes/normalize-note";
import { noteSeedFallback } from "@/lib/community-notes/seed";
import type { CommunityNote, CommunitySignalIngest } from "@/lib/community-notes/types";
import { filterRelocantSignals } from "@/lib/satellite/portugal";

async function fetchPublishedCommunityNotesUncached(countryKey: string): Promise<CommunityNote[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("community_notes")
      .select("*")
      .eq("country_key", countryKey)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(80);

    if (error) {
      if (/community_notes/.test(error.message)) {
        return noteSeedFallback(countryKey);
      }
      console.warn("[community-notes] load failed:", error.message);
      return noteSeedFallback(countryKey);
    }

    const notes = (data ?? []).map((row) => finalizeCommunityNote(row, countryKey));
    return notes.length > 0 ? mergePublishedNotesWithSeed(notes, countryKey) : noteSeedFallback(countryKey);
  } catch (e) {
    console.warn("[community-notes] fallback to seed:", e);
    return noteSeedFallback(countryKey);
  }
}

export async function getPublishedCommunityNotes(countryKey = "portugal"): Promise<CommunityNote[]> {
  return unstable_cache(
    () => fetchPublishedCommunityNotesUncached(countryKey),
    ["community-notes", countryKey],
    {
      revalidate: CACHE_REVALIDATE.communityNotes,
      tags: [CACHE_TAGS.communityNotes, `${CACHE_TAGS.communityNotes}-${countryKey}`],
    },
  )();
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

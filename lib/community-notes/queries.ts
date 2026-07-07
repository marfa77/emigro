import { createServerClient } from "@/lib/supabase/server";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import { PORTUGAL_NOTE_SEED } from "@/lib/community-notes/seed";
import type { CommunityNote, CommunitySignalIngest, ContentKind } from "@/lib/community-notes/types";

function mapNote(row: Record<string, unknown>): CommunityNote {
  return {
    id: String(row.id),
    slug: String(row.slug),
    country_key: String(row.country_key),
    city: String(row.city),
    category: String(row.category),
    content_kind: (row.content_kind as ContentKind) ?? "guide",
    title: String(row.title),
    excerpt: String(row.excerpt),
    seo_title: String(row.seo_title),
    seo_description: String(row.seo_description),
    quick_answer: String(row.quick_answer),
    body_paragraphs: (row.body_paragraphs as string[]) ?? [],
    body_sections: (row.body_sections as CommunityNote["body_sections"]) ?? [],
    key_takeaways: (row.key_takeaways as string[]) ?? [],
    faq: (row.faq as CommunityNote["faq"]) ?? [],
    official_links: (row.official_links as CommunityNote["official_links"]) ?? [],
    source_channel: (row.source_channel as string | null) ?? null,
    source_label: (row.source_label as string | null) ?? null,
    topic_tags: (row.topic_tags as string[]) ?? [],
    hashtags: (row.hashtags as string[]) ?? [],
    status: row.status as CommunityNote["status"],
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getPublishedCommunityNotes(countryKey = "portugal"): Promise<CommunityNote[]> {
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
        return PORTUGAL_NOTE_SEED;
      }
      console.warn("[community-notes] load failed:", error.message);
      return PORTUGAL_NOTE_SEED;
    }

    const notes = (data ?? []).map(mapNote);
    return notes.length > 0 ? notes : PORTUGAL_NOTE_SEED;
  } catch (e) {
    console.warn("[community-notes] fallback to seed:", e);
    return PORTUGAL_NOTE_SEED;
  }
}

export async function getPublishedCommunityNotesByHashtag(
  tag: string,
  countryKey = "portugal"
): Promise<CommunityNote[]> {
  const normalized = normalizeHashtag(tag);
  const all = await getPublishedCommunityNotes(countryKey);
  return all.filter((n) => n.hashtags.some((h) => normalizeHashtag(h) === normalized));
}

export async function getPublishedCommunityNoteBySlug(
  slug: string,
  countryKey = "portugal"
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
      return PORTUGAL_NOTE_SEED.find((n) => n.slug === slug) ?? null;
    }
    return mapNote(data);
  } catch {
    return PORTUGAL_NOTE_SEED.find((n) => n.slug === slug) ?? null;
  }
}

export async function ingestCommunitySignals(
  signals: CommunitySignalIngest[]
): Promise<{ received: number; inserted: number; skipped: number }> {
  const supabase = createServerClient();
  let inserted = 0;
  let skipped = 0;

  for (const signal of signals) {
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

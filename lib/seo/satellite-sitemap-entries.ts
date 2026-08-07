import type { MetadataRoute } from "next";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import { MIN_TAG_NOTES_INDEXABLE } from "@/lib/seo/thin-content";
import { portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";

type SatelliteCountry = "portugal" | "spain";

function publicUrl(country: SatelliteCountry, path: string): string {
  return country === "portugal" ? portugalSatellitePublicUrl(path) : spainSatellitePublicUrl(path);
}

/** Sitemap entries for one satellite host only (same-host URLs). */
export async function buildSatelliteSitemapEntries(
  country: SatelliteCountry,
): Promise<MetadataRoute.Sitemap> {
  // Refuse seed-only lists — a 4-URL stub sitemap triggers GSC "Temporary processing error"
  // / thin discovery. Prefer 5xx so Google retries when Supabase is up.
  const notes = await requirePublishedCommunityNotes(country);
  const tagCounts = new Map<string, number>();
  for (const note of notes) {
    for (const t of note.hashtags) {
      const tag = normalizeHashtag(t);
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const newestNoteDate = notes.reduce<string | undefined>((latest, note) => {
    const candidate = note.updated_at || note.published_at || undefined;
    if (!candidate) return latest;
    if (!latest) return candidate;
    return Date.parse(candidate) > Date.parse(latest) ? candidate : latest;
  }, undefined);

  return [
    {
      url: publicUrl(country, "/"),
      ...(newestNoteDate ? { lastModified: newestNoteDate } : {}),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: publicUrl(country, "/llms"),
      ...(newestNoteDate ? { lastModified: newestNoteDate } : {}),
      changeFrequency: "daily",
      priority: 0.5,
    },
    ...notes.map((note) => ({
      url: publicUrl(country, `/notes/${note.slug}`),
      lastModified: note.updated_at || note.published_at || undefined,
      changeFrequency: "weekly" as const,
      priority: note.content_kind === "news" ? 0.85 : 0.75,
    })),
    ...Array.from(tagCounts.entries())
      .filter(([, count]) => count >= MIN_TAG_NOTES_INDEXABLE)
      .map(([tag]) => ({
        url: publicUrl(country, `/tag/${encodeURIComponent(tag)}`),
        ...(newestNoteDate ? { lastModified: newestNoteDate } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })),
  ];
}

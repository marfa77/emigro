import { unstable_cache } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import { corridorSlugToSegment } from "@/lib/corridor/paths";

async function fetchPublishedCorridorSegmentsUncached(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_corridors")
    .select("slug, url_segment, publish_status")
    .eq("is_published", true)
    .in("publish_status", ["in_development", "active"]);

  if (error) {
    console.warn("[corridors] segments load failed:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.url_segment || corridorSlugToSegment(row.slug))
    .filter((s): s is string => Boolean(s));
}

async function fetchActiveCorridorSegmentsUncached(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_corridors")
    .select("slug, url_segment, publish_status")
    .eq("is_published", true)
    .eq("publish_status", "active");

  if (error) {
    console.warn("[corridors] active segments load failed:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.url_segment || corridorSlugToSegment(row.slug))
    .filter((s): s is string => Boolean(s));
}

/** URL segments for corridors visible on site (in_development or active). */
export async function getPublishedCorridorSegments(): Promise<string[]> {
  return unstable_cache(fetchPublishedCorridorSegmentsUncached, ["corridor-segments-published"], {
    revalidate: CACHE_REVALIDATE.corridorSegments,
    tags: [CACHE_TAGS.corridorSegments, CACHE_TAGS.corridors],
  })();
}

/** URL segments for full corridors (active only — wizard, programs). */
export async function getActiveCorridorSegments(): Promise<string[]> {
  return unstable_cache(fetchActiveCorridorSegmentsUncached, ["corridor-segments-active"], {
    revalidate: CACHE_REVALIDATE.corridorSegments,
    tags: [CACHE_TAGS.corridorSegments, CACHE_TAGS.corridors],
  })();
}

export function corridorStaticParamsFromSegments(segments: string[]) {
  return segments.map((country) => ({ country }));
}

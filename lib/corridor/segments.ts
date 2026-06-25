import { createServerClient } from "@/lib/supabase/server";
import { corridorSlugToSegment } from "@/lib/corridor/paths";

/** URL segments for corridors visible on site (in_development or active). */
export async function getPublishedCorridorSegments(): Promise<string[]> {
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

/** URL segments for full corridors (active only — wizard, programs). */
export async function getActiveCorridorSegments(): Promise<string[]> {
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

export function corridorStaticParamsFromSegments(segments: string[]) {
  return segments.map((country) => ({ country }));
}

import { corridorLandingPath, corridorWizardPath, corridorDigestPath, programPath } from "@/lib/corridor/paths";
import { guidePath, listGuides } from "@/lib/guides/load";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getActiveNewsTopics } from "@/lib/news/topics";
import { pageUrl } from "@/lib/seo";
import { QUERY_LONG_TAIL_TARGETS } from "@/lib/seo/query-longtail";
import { portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";

export const revalidate = 3600;

export async function GET() {
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const guides = listGuides();

  const urls = new Set<string>([
    pageUrl("/llms.txt"),
    pageUrl("/llms-full.txt"),
    pageUrl("/api/v1/meta/contributor-guide"),
    pageUrl("/api/v1/meta/ingest-schema"),
    pageUrl("/api/v1/facts/corridors"),
    pageUrl("/ru/wizard"),
    pageUrl("/ru/guides"),
    portugalSatellitePublicUrl("/llms"),
    spainSatellitePublicUrl("/llms"),
    ...QUERY_LONG_TAIL_TARGETS.filter((t) => t.path).map((t) => pageUrl(t.path!)),
  ]);

  for (const topic of fullCorridors) {
    const slug = topic.corridorSlug!;
    urls.add(pageUrl(corridorLandingPath(slug)));
    urls.add(pageUrl(corridorWizardPath(slug)));
    urls.add(pageUrl(corridorDigestPath(slug)));
    urls.add(pageUrl(`/api/v1/facts/corridors/${slug}`));
    const corridor = await getCorridorBySlug(slug);
    for (const p of corridor?.programs ?? []) {
      urls.add(pageUrl(programPath(slug, p.slug)));
      urls.add(pageUrl(`/api/v1/facts/programs/${p.slug}`));
    }
  }

  for (const guide of guides) {
    urls.add(pageUrl(guidePath(guide.slug)));
  }

  const [portugalNotes, spainNotes] = await Promise.all([
    getPublishedCommunityNotes("portugal"),
    getPublishedCommunityNotes("spain"),
  ]);
  urls.add(portugalSatellitePublicUrl("/"));
  urls.add(spainSatellitePublicUrl("/"));
  for (const note of portugalNotes) {
    urls.add(portugalSatellitePublicUrl(`/notes/${note.slug}`));
  }
  for (const note of spainNotes) {
    urls.add(spainSatellitePublicUrl(`/notes/${note.slug}`));
  }
  const portugalTags = new Set<string>();
  for (const note of portugalNotes) {
    for (const t of note.hashtags) portugalTags.add(normalizeHashtag(t));
  }
  const spainTags = new Set<string>();
  for (const note of spainNotes) {
    for (const t of note.hashtags) spainTags.add(normalizeHashtag(t));
  }
  for (const tag of Array.from(portugalTags)) {
    urls.add(portugalSatellitePublicUrl(`/tag/${encodeURIComponent(tag)}`));
  }
  for (const tag of Array.from(spainTags)) {
    urls.add(spainSatellitePublicUrl(`/tag/${encodeURIComponent(tag)}`));
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...Array.from(urls).map((url) => `  <url><loc>${url}</loc></url>`),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

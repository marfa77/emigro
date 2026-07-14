import { getPublishedNewsDigests } from "@/lib/news/digests";
import { newsArticleUrl } from "@/lib/site-url";

export const revalidate = 3600;

const RECENT_DAYS = 7;
const MAX_URLS = 500;

/** Freshness feed for Google re-crawl (Barakhlo recent.xml pattern). */
export async function GET() {
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const digests = await getPublishedNewsDigests();
  const recent = digests
    .filter((d) => {
      const ts = new Date(d.updated_at || d.published_at || 0).getTime();
      return !Number.isNaN(ts) && ts >= cutoff;
    })
    .slice(0, MAX_URLS);

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...recent.map((d) => {
      const loc = newsArticleUrl(d.slug);
      const lastmod = d.updated_at || d.published_at;
      return lastmod
        ? `  <url><loc>${loc}</loc><lastmod>${new Date(lastmod).toISOString()}</lastmod></url>`
        : `  <url><loc>${loc}</loc></url>`;
    }),
    "</urlset>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

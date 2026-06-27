export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/** Canonical production origin for SEO pings (never localhost). */
export function publicSiteUrl(): string {
  const local = SITE_URL;
  if (local && !/localhost|127\.0\.0\.1/.test(local)) return local;
  return (process.env.EMIGRO_PUBLIC_SITE_URL || "https://www.emigro.online").replace(/\/$/, "");
}

/** @deprecated use publicSiteUrl */
export function publicNewsSiteUrl(): string {
  return publicSiteUrl();
}

export const NEWS_HUB_PATH = "/ru/news";

/** @deprecated use newsHubUrl('portugal') */
export const CORRIDOR_NEWS_BASE = `${SITE_URL}${NEWS_HUB_PATH}?country=portugal`;

export function newsHubUrl(country?: string): string {
  const base = publicSiteUrl();
  return country ? `${base}${NEWS_HUB_PATH}?country=${country}` : `${base}${NEWS_HUB_PATH}`;
}

export function newsArticleUrl(slug: string): string {
  return `${publicSiteUrl()}/ru/news/${slug}`;
}

export function newsFeedUrl(country?: string): string {
  const base = publicSiteUrl();
  return country
    ? `${base}/ru/news/feed.xml?country=${country}`
    : `${base}/ru/news/feed.xml`;
}

const LOCALHOST_FALLBACK = "http://localhost:3000";
const PRODUCTION_FALLBACK = "https://www.emigro.online";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/.test(url);
}

/** Dev/runtime origin (may be localhost). */
export const SITE_URL = stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || LOCALHOST_FALLBACK);

/** Canonical public origin for SEO, sitemap, robots, and schema (never localhost in production). */
export function publicSiteUrl(): string {
  const publicEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (publicEnv && !isLocalhostUrl(publicEnv)) return stripTrailingSlash(publicEnv);

  const serverEnv = process.env.EMIGRO_PUBLIC_SITE_URL?.trim();
  if (serverEnv) return stripTrailingSlash(serverEnv);

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing canonical site URL: set NEXT_PUBLIC_SITE_URL or EMIGRO_PUBLIC_SITE_URL in production"
    );
  }

  return PRODUCTION_FALLBACK;
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

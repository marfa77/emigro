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

const PORTUGAL_SATELLITE_SUBDOMAIN = "https://portugal.emigro.online";
const PORTUGAL_SATELLITE_PATH = "/satellite/portugal";

/** Use subdomain only when DNS is live (`PORTUGAL_SATELLITE_USE_SUBDOMAIN=true`). */
function portugalSatelliteOrigin(): string {
  if (process.env.PORTUGAL_SATELLITE_USE_SUBDOMAIN === "true") {
    return PORTUGAL_SATELLITE_SUBDOMAIN;
  }
  const publicEnv = process.env.EMIGRO_PUBLIC_SITE_URL?.trim();
  if (publicEnv && !isLocalhostUrl(publicEnv)) {
    return `${stripTrailingSlash(publicEnv)}${PORTUGAL_SATELLITE_PATH}`;
  }
  if (process.env.NODE_ENV === "production") {
    return `${publicSiteUrl()}${PORTUGAL_SATELLITE_PATH}`;
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site && !isLocalhostUrl(site)) {
    return `${stripTrailingSlash(site)}${PORTUGAL_SATELLITE_PATH}`;
  }
  return `${LOCALHOST_FALLBACK}${PORTUGAL_SATELLITE_PATH}`;
}

/** Canonical URL for Portugal satellite pages (www path until subdomain DNS is configured). */
export function portugalSatelliteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  const origin = portugalSatelliteOrigin();
  if (origin.endsWith(PORTUGAL_SATELLITE_PATH)) {
    return `${origin}${normalized === "/" ? "" : normalized}`;
  }
  return `${origin}${normalized === "/" ? "" : normalized}`;
}

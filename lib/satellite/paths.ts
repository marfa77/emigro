import {
  italySatelliteSubdomainEnabled,
  portugalSatelliteHubPublicUrl,
  portugalSatellitePublicUrl,
  portugalSatelliteSubdomainEnabled,
  publicSiteUrl,
  spainSatelliteSubdomainEnabled,
  thailandSatelliteSubdomainEnabled,
} from "@/lib/site-url";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";

/*
 * These helpers are only called from satellite routes/components (app/satellite/**,
 * components/satellite/**), which in production render only on their own subdomain
 * (www /satellite/* 301s there). So "subdomain mode on" == "we are on the satellite
 * host", and short paths are correct. Reading headers() here instead made every page
 * that imported them render per request and skip the CDN cache.
 */
function onPortugalSatelliteHost(): boolean {
  return portugalSatelliteSubdomainEnabled();
}

function onSpainSatelliteHost(): boolean {
  return spainSatelliteSubdomainEnabled();
}

function onItalySatelliteHost(): boolean {
  return italySatelliteSubdomainEnabled();
}

function onThailandSatelliteHost(): boolean {
  return thailandSatelliteSubdomainEnabled();
}

/** Absolute URL on www.emigro.online — use for links from satellite subdomains. */
export function mainSiteUrl(path = ""): string {
  const normalized = path.startsWith("/") || !path ? path : `/${path}`;
  return `${publicSiteUrl()}${normalized}`;
}

export function satelliteHubPath(countryKey: SatelliteCountryKey = "portugal"): string {
  if (countryKey === "spain") {
    return onSpainSatelliteHost() ? "/" : "/satellite/spain";
  }
  if (countryKey === "italy") {
    return onItalySatelliteHost() ? "/" : "/satellite/italy";
  }
  if (countryKey === "thailand") {
    return onThailandSatelliteHost() ? "/" : "/satellite/thailand";
  }
  if (countryKey === "portugal") {
    return onPortugalSatelliteHost() ? "/" : portugalSatelliteHubPublicUrl();
  }
  return "/satellite/portugal";
}

export function satelliteNotePath(slug: string, countryKey: SatelliteCountryKey = "portugal"): string {
  if (countryKey === "spain") {
    return onSpainSatelliteHost() ? `/notes/${slug}` : `/satellite/spain/notes/${slug}`;
  }
  if (countryKey === "italy") {
    return onItalySatelliteHost() ? `/notes/${slug}` : `/satellite/italy/notes/${slug}`;
  }
  if (countryKey === "thailand") {
    return onThailandSatelliteHost() ? `/notes/${slug}` : `/satellite/thailand/notes/${slug}`;
  }
  if (onPortugalSatelliteHost()) return `/notes/${slug}`;
  return portugalSatellitePublicUrl(`/notes/${slug}`);
}

export function satelliteTagPath(tag: string, countryKey: SatelliteCountryKey = "portugal"): string {
  const encoded = encodeURIComponent(tag.replace(/^#/, "").trim().toLowerCase());
  if (countryKey === "spain") {
    return onSpainSatelliteHost() ? `/tag/${encoded}` : `/satellite/spain/tag/${encoded}`;
  }
  if (countryKey === "italy") {
    return onItalySatelliteHost() ? `/tag/${encoded}` : `/satellite/italy/tag/${encoded}`;
  }
  if (countryKey === "thailand") {
    return onThailandSatelliteHost() ? `/tag/${encoded}` : `/satellite/thailand/tag/${encoded}`;
  }
  if (countryKey === "portugal") {
    if (onPortugalSatelliteHost()) return `/tag/${encoded}`;
    return portugalSatellitePublicUrl(`/tag/${encoded}`);
  }
  return `/satellite/portugal/tag/${encoded}`;
}

/** Home hub — short path on subdomain, full path on www. */
export function portugalHubPath(): string {
  return satelliteHubPath("portugal");
}

/** Note article path that works on both hosts without leaving www when DNS is stale. */
export function portugalNotePath(slug: string): string {
  return satelliteNotePath(slug, "portugal");
}

/** Tag filter path on both hosts. */
export function portugalTagPath(tag: string): string {
  return satelliteTagPath(tag, "portugal");
}

/** Event calendar — short path on the Portugal satellite host, absolute from www. */
export function portugalCalendarPath(slug?: string): string {
  if (onPortugalSatelliteHost()) {
    const base = "/calendar";
    return slug ? `${base}/${slug}` : base;
  }
  return portugalSatellitePublicUrl(slug ? `/calendar/${slug}` : "/calendar");
}

export function spainHubPath(): string {
  return satelliteHubPath("spain");
}

export function spainNotePath(slug: string): string {
  return satelliteNotePath(slug, "spain");
}

export function spainTagPath(tag: string): string {
  return satelliteTagPath(tag, "spain");
}

export function italyHubPath(): string {
  return satelliteHubPath("italy");
}

export function italyNotePath(slug: string): string {
  return satelliteNotePath(slug, "italy");
}

export function italyTagPath(tag: string): string {
  return satelliteTagPath(tag, "italy");
}

export function thailandHubPath(): string {
  return satelliteHubPath("thailand");
}

export function thailandNotePath(slug: string): string {
  return satelliteNotePath(slug, "thailand");
}

export function thailandTagPath(tag: string): string {
  return satelliteTagPath(tag, "thailand");
}

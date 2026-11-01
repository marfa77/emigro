import { headers } from "next/headers";
import { PORTUGAL_HUB_HOST, PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE_HOST } from "@/lib/satellite/spain";
import { ITALY_SATELLITE_HOST } from "@/lib/satellite/italy";
import { THAILAND_SATELLITE_HOST } from "@/lib/satellite/thailand";
import { portugalSatelliteHubPublicUrl, portugalSatellitePublicUrl, publicSiteUrl } from "@/lib/site-url";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";

function requestHost(): string {
  return headers().get("host")?.split(":")[0] ?? "";
}

function onPortugalSatelliteHost(): boolean {
  const host = requestHost();
  return host === PORTUGAL_SATELLITE_HOST || host === PORTUGAL_HUB_HOST;
}

function onPortugalHubHost(): boolean {
  return requestHost() === PORTUGAL_HUB_HOST;
}

function onPortugalNotesHost(): boolean {
  return requestHost() === PORTUGAL_SATELLITE_HOST;
}

function onSpainSatelliteHost(): boolean {
  return requestHost() === SPAIN_SATELLITE_HOST;
}

function onItalySatelliteHost(): boolean {
  return requestHost() === ITALY_SATELLITE_HOST;
}

function onThailandSatelliteHost(): boolean {
  return requestHost() === THAILAND_SATELLITE_HOST;
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
    if (onPortugalHubHost()) return "/";
    // From notes host or www — absolute hub (porto) so we don't bounce portugal `/` → porto.
    if (onPortugalNotesHost()) return portugalSatelliteHubPublicUrl();
    return portugalSatelliteHubPublicUrl();
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
  // Always absolute on portugal notes host — hub (porto) must not serve /notes without 301.
  if (onPortugalHubHost()) return portugalSatellitePublicUrl(`/notes/${slug}`);
  if (onPortugalNotesHost()) return `/notes/${slug}`;
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
    if (onPortugalNotesHost()) return `/tag/${encoded}`;
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

/** Event calendar — short path on the Portugal notes host, absolute from hub/www. */
export function portugalCalendarPath(slug?: string): string {
  if (onPortugalNotesHost()) {
    const base = "/calendar";
    return slug ? `${base}/${slug}` : base;
  }
  const abs = portugalSatellitePublicUrl(slug ? `/calendar/${slug}` : "/calendar");
  return abs;
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

import { headers } from "next/headers";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE_HOST } from "@/lib/satellite/spain";
import { publicSiteUrl } from "@/lib/site-url";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";

function requestHost(): string {
  return headers().get("host")?.split(":")[0] ?? "";
}

function onPortugalSatelliteHost(): boolean {
  return requestHost() === PORTUGAL_SATELLITE_HOST;
}

function onSpainSatelliteHost(): boolean {
  return requestHost() === SPAIN_SATELLITE_HOST;
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
  return onPortugalSatelliteHost() ? "/" : "/satellite/portugal";
}

export function satelliteNotePath(slug: string, countryKey: SatelliteCountryKey = "portugal"): string {
  if (countryKey === "spain") {
    return onSpainSatelliteHost() ? `/notes/${slug}` : `/satellite/spain/notes/${slug}`;
  }
  return onPortugalSatelliteHost() ? `/notes/${slug}` : `/satellite/portugal/notes/${slug}`;
}

export function satelliteTagPath(tag: string, countryKey: SatelliteCountryKey = "portugal"): string {
  const encoded = encodeURIComponent(tag.replace(/^#/, "").trim().toLowerCase());
  if (countryKey === "spain") {
    return onSpainSatelliteHost() ? `/tag/${encoded}` : `/satellite/spain/tag/${encoded}`;
  }
  return onPortugalSatelliteHost() ? `/tag/${encoded}` : `/satellite/portugal/tag/${encoded}`;
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

export function spainHubPath(): string {
  return satelliteHubPath("spain");
}

export function spainNotePath(slug: string): string {
  return satelliteNotePath(slug, "spain");
}

export function spainTagPath(tag: string): string {
  return satelliteTagPath(tag, "spain");
}

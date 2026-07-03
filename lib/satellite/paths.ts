import { headers } from "next/headers";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";

function requestHost(): string {
  return headers().get("host")?.split(":")[0] ?? "";
}

function onSatelliteHost(): boolean {
  return requestHost() === PORTUGAL_SATELLITE_HOST;
}

/** Home hub — short path on subdomain, full path on www. */
export function portugalHubPath(): string {
  return onSatelliteHost() ? "/" : "/satellite/portugal";
}

/** Note article path that works on both hosts without leaving www when DNS is stale. */
export function portugalNotePath(slug: string): string {
  return onSatelliteHost() ? `/notes/${slug}` : `/satellite/portugal/notes/${slug}`;
}

/** Tag filter path on both hosts. */
export function portugalTagPath(tag: string): string {
  const encoded = encodeURIComponent(tag.replace(/^#/, "").trim().toLowerCase());
  return onSatelliteHost() ? `/tag/${encoded}` : `/satellite/portugal/tag/${encoded}`;
}

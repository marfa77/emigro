import { headers } from "next/headers";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE_HOST } from "@/lib/satellite/spain";

export type PublicHostKind = "www" | "portugal-satellite" | "spain-satellite";

/** Host of the current request (sitemap/robots). Build/CLI without Host → www. */
export function publicHostKind(): PublicHostKind {
  try {
    const host = headers().get("host")?.split(":")[0]?.toLowerCase() ?? "";
    if (host === PORTUGAL_SATELLITE_HOST) return "portugal-satellite";
    if (host === SPAIN_SATELLITE_HOST) return "spain-satellite";
  } catch {
    /* headers() unavailable outside request (tests / some build paths) */
  }
  return "www";
}

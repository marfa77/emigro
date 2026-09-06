import { newsIndexPath } from "@/lib/news/topics";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { italySatelliteUrl } from "@/lib/site-url";

export const ITALY_CORRIDOR_SLUG = "ru-speaking-to-italy";
export const ITALY_URL_SEGMENT = "italy";

export type ItalyHubTab = "hub" | "route" | "news" | "digest" | "practice" | "market";

/** Canonical URLs — single source for nav, tiles, intel links. */
export const italyHubPaths = {
  landing: "/ru/italy",
  wizard: "/ru/italy/wizard",
  digest: "/ru/italy/digest",
  news: newsIndexPath(ITALY_URL_SEGMENT),
} as const;

/** Canonical Italy satellite entry (respects ITALY_SATELLITE_USE_SUBDOMAIN). */
export function italySatelliteHubUrl(): string {
  return italySatelliteUrl("/");
}

export function isItalyHubTopic(topic: { key?: string; urlSegment?: string }): boolean {
  return topic.urlSegment === ITALY_URL_SEGMENT || topic.key === ITALY_URL_SEGMENT;
}

export { ITALY_SATELLITE };

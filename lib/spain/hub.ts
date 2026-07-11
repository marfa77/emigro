import { newsIndexPath } from "@/lib/news/topics";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { spainSatelliteUrl } from "@/lib/site-url";

export const SPAIN_CORRIDOR_SLUG = "ru-speaking-to-spain";
export const SPAIN_URL_SEGMENT = "spain";

/** Canonical URLs — single source for nav, tiles, intel links. */
export const spainHubPaths = {
  landing: "/ru/spain",
  wizard: "/ru/spain/wizard",
  digest: "/ru/spain/digest",
  news: newsIndexPath(SPAIN_URL_SEGMENT),
} as const;

/** Canonical Spain satellite entry (respects SPAIN_SATELLITE_USE_SUBDOMAIN). */
export function spainSatelliteHubUrl(): string {
  return spainSatelliteUrl("/");
}

export function isSpainHubTopic(topic: { key?: string; urlSegment?: string }): boolean {
  return topic.urlSegment === SPAIN_URL_SEGMENT || topic.key === SPAIN_URL_SEGMENT;
}

export { SPAIN_SATELLITE };

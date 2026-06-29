import { TRANSIT_HUBS } from "@/lib/transit-hubs";

/** Prepositional case for «в …» on corridor landing pages. */
const CORRIDOR_SEGMENT_PREPOSITIONAL: Record<string, string> = {
  portugal: "Португалии",
  spain: "Испании",
  france: "Франции",
  italy: "Италии",
  germany: "Германии",
  netherlands: "Нидерландах",
  scandinavia: "Скандинавии",
  poland: "Польше",
  czechia: "Чехии",
  austria: "Австрии",
};

const COUNTRY_SEGMENT_PREPOSITIONAL: Record<string, string> = {
  ...CORRIDOR_SEGMENT_PREPOSITIONAL,
  ...Object.fromEntries(TRANSIT_HUBS.map((hub) => [hub.slug, hub.countryPrepositionalRu])),
};

/** First /ru/* segment that is not a country corridor or transit hub. */
const NON_COUNTRY_SEGMENTS = new Set([
  "news",
  "guides",
  "wizard",
  "partners",
  "assist",
  "contact",
  "community",
  "terms",
  "privacy",
  "cookies",
  "ukraine",
  "admin",
]);

export type PartnerRecruitmentBannerCopy =
  | { scope: "global" }
  | { scope: "local"; countryPrepositional: string };

export function resolvePartnerRecruitmentBanner(pathname: string): PartnerRecruitmentBannerCopy {
  const segment = pathname.match(/^\/ru\/([^/?#]+)/)?.[1];
  if (!segment || NON_COUNTRY_SEGMENTS.has(segment)) {
    return { scope: "global" };
  }

  const countryPrepositional = COUNTRY_SEGMENT_PREPOSITIONAL[segment];
  if (!countryPrepositional) {
    return { scope: "global" };
  }

  return { scope: "local", countryPrepositional };
}

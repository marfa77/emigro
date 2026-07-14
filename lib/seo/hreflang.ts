import type { Metadata } from "next";
import { pageUrl } from "@/lib/seo";

/** ISO2 for `ru-{XX}` hreflang on corridor / transit pages (Barakhlo pattern). */
const COUNTRY_SEGMENT_ISO: Record<string, string> = {
  portugal: "PT",
  spain: "ES",
  france: "FR",
  italy: "IT",
  germany: "DE",
  netherlands: "NL",
  scandinavia: "SE",
  poland: "PL",
  czechia: "CZ",
  austria: "AT",
  serbia: "RS",
  armenia: "AM",
  uae: "AE",
  thailand: "TH",
  indonesia: "ID",
  georgia: "GE",
  turkey: "TR",
  montenegro: "ME",
  kazakhstan: "KZ",
};

export function corridorHreflangTag(countrySegment: string): string | null {
  const iso = COUNTRY_SEGMENT_ISO[countrySegment.toLowerCase()];
  return iso ? `ru-${iso}` : null;
}

/**
 * ru + ru-RU + ru-{country} + x-default — targets «русский в Португалии» etc.
 * Same canonical URL; region tag signals diaspora audience (Barakhlo pattern).
 */
export function hreflangAlternates(path: string, countrySegment?: string): Metadata["alternates"] {
  const url = pageUrl(path);
  const regionTag = countrySegment ? corridorHreflangTag(countrySegment) : null;
  const languages: Record<string, string> = {
    ru: url,
    "ru-RU": url,
    "x-default": url,
  };
  if (regionTag) languages[regionTag] = url;
  return { canonical: url, languages };
}

/** Paginated list pages: page > 1 → noindex, follow (Barakhlo pattern). */
export function paginationRobots(page: number): Metadata["robots"] | undefined {
  if (page > 1) return { index: false, follow: true };
  return undefined;
}

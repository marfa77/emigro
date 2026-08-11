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
  sweden: "SE",
  norway: "NO",
  finland: "FI",
  denmark: "DK",
  poland: "PL",
  czechia: "CZ",
  austria: "AT",
  greece: "GR",
  cyprus: "CY",
  hungary: "HU",
  malta: "MT",
  bulgaria: "BG",
  croatia: "HR",
  slovenia: "SI",
  estonia: "EE",
  serbia: "RS",
  armenia: "AM",
  uae: "AE",
  thailand: "TH",
  indonesia: "ID",
  georgia: "GE",
  turkey: "TR",
  montenegro: "ME",
  kazakhstan: "KZ",
  uruguay: "UY",
  ecuador: "EC",
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

/**
 * Spanish locale pages — do not invent RU↔ES pairs until true translations exist.
 * originIso → es-UY (etc.); destinationIso → es-ES.
 */
export function esHreflangAlternates(
  path: string,
  opts?: { originIso?: string; destinationIso?: string },
): Metadata["alternates"] {
  const url = pageUrl(path);
  const languages: Record<string, string> = {
    es: url,
    "x-default": url,
  };
  if (opts?.originIso) languages[`es-${opts.originIso.toUpperCase()}`] = url;
  if (opts?.destinationIso) languages[`es-${opts.destinationIso.toUpperCase()}`] = url;
  return { canonical: url, languages };
}

/**
 * French Afrique → France pages — never emit ru/ru-RU on /fr URLs.
 * originIso → fr-MA (etc.); destinationIso → fr-FR.
 */
export function frHreflangAlternates(
  path: string,
  opts?: { originIso?: string; destinationIso?: string },
): Metadata["alternates"] {
  const url = pageUrl(path);
  const languages: Record<string, string> = {
    fr: url,
    "x-default": url,
  };
  if (opts?.originIso) languages[`fr-${opts.originIso.toUpperCase()}`] = url;
  if (opts?.destinationIso) languages[`fr-${opts.destinationIso.toUpperCase()}`] = url;
  return { canonical: url, languages };
}

/** Paginated list pages: page > 1 → noindex, follow (Barakhlo pattern). */
export function paginationRobots(page: number): Metadata["robots"] | undefined {
  if (page > 1) return { index: false, follow: true };
  return undefined;
}

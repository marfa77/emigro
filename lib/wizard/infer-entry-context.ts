import { COUNTRY_ACCENTS } from "@/lib/brand/country-accents";
import { loadGuide } from "@/lib/guides/load";

export type EntryType = "guide" | "corridor" | "news" | "hub" | "unknown";

export type InferredEntryContext = {
  interestCountriesRu: string[];
  entrySource?: string;
  entryType: EntryType;
};

const TOPIC_TO_COUNTRY_RU: Record<string, string> = {
  europe: "Европа",
  ...Object.fromEntries(
    Object.entries(COUNTRY_ACCENTS).map(([key, value]) => [key, value.label])
  ),
};

const SLUG_COUNTRY_HEURISTICS: Array<{ pattern: RegExp; countryRu: string }> = [
  { pattern: /portugal/i, countryRu: "Португалия" },
  { pattern: /ispan/i, countryRu: "Испания" },
  { pattern: /german/i, countryRu: "Германия" },
  { pattern: /ital/i, countryRu: "Италия" },
  { pattern: /franc/i, countryRu: "Франция" },
  { pattern: /niderland|netherland/i, countryRu: "Нидерланды" },
  { pattern: /skandinav/i, countryRu: "Скандинавия" },
  { pattern: /evrop/i, countryRu: "Европа" },
];

const NON_CORRIDOR_SEGMENTS = new Set([
  "guides",
  "news",
  "wizard",
  "contact",
  "partners",
  "privacy",
  "terms",
  "cookies",
]);

function topicKeyToCountryRu(key: string): string | undefined {
  const normalized = key.trim().toLowerCase();
  return TOPIC_TO_COUNTRY_RU[normalized];
}

function mapTopicKeys(keys?: string[]): string[] {
  if (!keys?.length) return [];
  return unique(keys.map(topicKeyToCountryRu).filter(Boolean) as string[]);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function inferCountriesFromSlug(slug: string): string[] {
  return unique(
    SLUG_COUNTRY_HEURISTICS.filter(({ pattern }) => pattern.test(slug)).map(({ countryRu }) => countryRu)
  );
}

function parseUrl(input?: string): { pathname: string; searchParams: URLSearchParams } | null {
  if (!input?.trim()) return null;
  try {
    const url = input.startsWith("http") ? new URL(input) : new URL(input, "https://www.emigro.online");
    return { pathname: url.pathname, searchParams: url.searchParams };
  } catch {
    return null;
  }
}

function guideEntrySource(title: string): string {
  const short = title.split(":")[0]?.trim() || title;
  return `гайд: ${short}`;
}

function inferFromPath(pathname: string, searchParams: URLSearchParams): InferredEntryContext {
  const guideMatch = pathname.match(/^\/ru\/guides\/([^/]+)\/?$/);
  if (guideMatch) {
    const slug = guideMatch[1];
    const guide = loadGuide(slug);
    if (guide) {
      return {
        interestCountriesRu: mapTopicKeys(guide.topic_keys),
        entrySource: guideEntrySource(guide.title),
        entryType: "guide",
      };
    }

    const fromSlug = inferCountriesFromSlug(slug);
    if (fromSlug.length) {
      return {
        interestCountriesRu: fromSlug,
        entrySource: `гайд: ${slug}`,
        entryType: "guide",
      };
    }

    return { interestCountriesRu: [], entrySource: `гайд: ${slug}`, entryType: "guide" };
  }

  const corridorMatch = pathname.match(/^\/ru\/([^/]+)/);
  if (corridorMatch) {
    const segment = corridorMatch[1].toLowerCase();
    if (!NON_CORRIDOR_SEGMENTS.has(segment)) {
      const countryRu = topicKeyToCountryRu(segment);
      if (countryRu) {
        return {
          interestCountriesRu: [countryRu],
          entrySource: `коридор ${countryRu}`,
          entryType: "corridor",
        };
      }
    }
  }

  if (pathname.startsWith("/ru/news")) {
    const countryParam = searchParams.get("country") ?? searchParams.get("topic");
    const countryRu = countryParam ? topicKeyToCountryRu(countryParam) : undefined;
    return {
      interestCountriesRu: countryRu ? [countryRu] : [],
      entrySource: countryRu ? `новости: ${countryRu}` : "новости",
      entryType: "news",
    };
  }

  if (pathname === "/ru" || pathname.startsWith("/ru/wizard")) {
    const interest = searchParams.get("interest");
    return {
      interestCountriesRu: interest
        ? unique(interest.split(",").map((key) => topicKeyToCountryRu(key)).filter(Boolean) as string[])
        : [],
      entrySource: "hub wizard",
      entryType: "hub",
    };
  }

  return { interestCountriesRu: [], entryType: "unknown" };
}

function collectInterestKeys(input: {
  interestKeys?: string[];
  pagePath?: string;
  referer?: string;
}): string[] {
  const keys = [...(input.interestKeys ?? [])];

  for (const raw of [input.pagePath, input.referer]) {
    const parsed = parseUrl(raw);
    const interest = parsed?.searchParams.get("interest");
    if (interest) keys.push(...interest.split(","));
  }

  return keys.map((key) => key.trim().toLowerCase()).filter(Boolean);
}

export function inferEntryContext(input: {
  referer?: string;
  pagePath?: string;
  interestKeys?: string[];
}): InferredEntryContext {
  const parsedReferer = parseUrl(input.referer);
  const parsedPage = parseUrl(input.pagePath);

  const fromReferer = parsedReferer
    ? inferFromPath(parsedReferer.pathname, parsedReferer.searchParams)
    : null;
  const fromPage = parsedPage ? inferFromPath(parsedPage.pathname, parsedPage.searchParams) : null;

  const inferred =
    fromReferer && fromReferer.entryType !== "hub" && fromReferer.entryType !== "unknown"
      ? fromReferer
      : fromPage && fromPage.entryType !== "unknown"
        ? fromPage
        : fromReferer ?? fromPage ?? { interestCountriesRu: [], entryType: "unknown" as const };

  const explicitCountries = collectInterestKeys(input)
    .map(topicKeyToCountryRu)
    .filter(Boolean) as string[];

  return {
    ...inferred,
    interestCountriesRu: unique([...(inferred.interestCountriesRu ?? []), ...explicitCountries]),
  };
}

export function topicKeysToCountriesRu(keys: string[]): string[] {
  return mapTopicKeys(keys);
}

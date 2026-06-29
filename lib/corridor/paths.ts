/** Maps corridor slug → public URL segment under /ru/[country]. */
export const CORRIDOR_SLUG_TO_SEGMENT: Record<string, string> = {
  "ru-speaking-to-portugal": "portugal",
  "ru-speaking-to-spain": "spain",
  "ru-speaking-to-france": "france",
  "ru-speaking-to-italy": "italy",
  "ru-speaking-to-germany": "germany",
  "ru-speaking-to-netherlands": "netherlands",
  "ru-speaking-to-scandinavia": "scandinavia",
  "ru-speaking-to-poland": "poland",
  "ru-speaking-to-czechia": "czechia",
  "ru-speaking-to-austria": "austria",
};

/** Maps program destination ISO2 → public URL segment (shared by SSG and program pages). */
export const ISO2_TO_SEGMENT: Record<string, string> = {
  PT: "portugal",
  ES: "spain",
  FR: "france",
  IT: "italy",
  DE: "germany",
  NL: "netherlands",
  SE: "scandinavia",
  DK: "scandinavia",
  NO: "scandinavia",
  FI: "scandinavia",
  PL: "poland",
  CZ: "czechia",
  AT: "austria",
};

export const ACTIVE_CORRIDOR_SLUGS = Object.keys(CORRIDOR_SLUG_TO_SEGMENT);

export function corridorSlugToSegment(corridorSlug: string): string | null {
  return CORRIDOR_SLUG_TO_SEGMENT[corridorSlug] ?? null;
}

export function destinationIso2ToSegment(iso2: string): string | null {
  return ISO2_TO_SEGMENT[iso2.toUpperCase()] ?? null;
}

export function corridorLandingPath(corridorSlug: string): string {
  const segment = corridorSlugToSegment(corridorSlug);
  if (!segment) return "/ru";
  return `/ru/${segment}`;
}

export function corridorWizardPath(corridorSlug: string): string {
  return `${corridorLandingPath(corridorSlug)}/wizard`;
}

export function corridorResultsPath(corridorSlug: string): string {
  return `${corridorLandingPath(corridorSlug)}/results`;
}

export function corridorDigestPath(corridorSlug: string): string {
  return `${corridorLandingPath(corridorSlug)}/digest`;
}

export const HUB_WIZARD_PATH = "/ru/wizard";
export const HUB_WIZARD_RESULTS_PATH = "/ru/wizard/results";

export function programPath(corridorSlug: string, programSlug: string): string {
  return `${corridorLandingPath(corridorSlug)}/programs/${programSlug}`;
}

/** @deprecated use programPath(corridorSlug, programSlug) */
export function programPathLegacy(programSlug: string): string {
  if (programSlug.startsWith("portugal-")) return `/ru/portugal/programs/${programSlug}`;
  if (programSlug.startsWith("spain-")) return `/ru/spain/programs/${programSlug}`;
  if (programSlug.startsWith("france-")) return `/ru/france/programs/${programSlug}`;
  if (programSlug.startsWith("italy-")) return `/ru/italy/programs/${programSlug}`;
  if (programSlug.startsWith("germany-")) return `/ru/germany/programs/${programSlug}`;
  if (programSlug.startsWith("netherlands-")) return `/ru/netherlands/programs/${programSlug}`;
  if (programSlug.startsWith("poland-")) return `/ru/poland/programs/${programSlug}`;
  if (programSlug.startsWith("czechia-")) return `/ru/czechia/programs/${programSlug}`;
  if (programSlug.startsWith("austria-")) return `/ru/austria/programs/${programSlug}`;
  if (programSlug.startsWith("sweden-") || programSlug.startsWith("denmark-") || programSlug.startsWith("nordic-")) {
    return `/ru/scandinavia/programs/${programSlug}`;
  }
  return `/ru/programs/${programSlug}`;
}

import { pingIndexNow } from "@/lib/seo/indexnow";

/** Ping IndexNow (Yandex first) after publishes; optional Google sitemap ping. */
export async function pingSearchEnginesSitemap(sitemapUrl: string, updatedUrls?: string[]): Promise<void> {
  if (updatedUrls?.length) {
    await pingIndexNow(updatedUrls);
  }

  if (process.env.PING_GOOGLE_SITEMAP === "1") {
    const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    try {
      await fetch(googlePing, { method: "GET", signal: AbortSignal.timeout(8000) });
      console.info("[seo] Google sitemap ping (optional):", sitemapUrl);
    } catch (e) {
      console.warn("[seo] Google sitemap ping failed:", e instanceof Error ? e.message : e);
    }
  }
}

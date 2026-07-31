/**
 * Canonical registry of Emigro corridors — single source of truth for slugs,
 * URL segments, destinations, and feature flags. Derive maps from here; do not
 * duplicate corridor lists in other files.
 */

export type CorridorRegistryEntry = {
  slug: string;
  segment: string;
  /** Destination country ISO2 codes served by this corridor URL */
  destinationIso2: readonly string[];
  titleEn: string;
  titleRu: string;
  /** Published on site (landing, digest) */
  active: boolean;
  /** Full corridor: wizard, programs, results */
  wizardEnabled: boolean;
  /** Listed on Emigro Assist country picker */
  assistEligible: boolean;
};

export const CORRIDOR_REGISTRY: readonly CorridorRegistryEntry[] = [
  {
    slug: "ru-speaking-to-portugal",
    segment: "portugal",
    destinationIso2: ["PT"],
    titleEn: "Russian-speaking → Portugal",
    titleRu: "Русскоязычные → Португалия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-spain",
    segment: "spain",
    destinationIso2: ["ES"],
    titleEn: "Russian-speaking → Spain",
    titleRu: "Русскоязычные → Испания",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-france",
    segment: "france",
    destinationIso2: ["FR"],
    titleEn: "Russian-speaking → France",
    titleRu: "Русскоязычные → Франция",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-italy",
    segment: "italy",
    destinationIso2: ["IT"],
    titleEn: "Russian-speaking → Italy",
    titleRu: "Русскоязычные → Италия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-germany",
    segment: "germany",
    destinationIso2: ["DE"],
    titleEn: "Russian-speaking → Germany",
    titleRu: "Русскоязычные → Германия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-netherlands",
    segment: "netherlands",
    destinationIso2: ["NL"],
    titleEn: "Russian-speaking → Netherlands",
    titleRu: "Русскоязычные → Нидерланды",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-sweden",
    segment: "sweden",
    destinationIso2: ["SE"],
    titleEn: "Russian-speaking → Sweden",
    titleRu: "Русскоязычные → Швеция",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-norway",
    segment: "norway",
    destinationIso2: ["NO"],
    titleEn: "Russian-speaking → Norway",
    titleRu: "Русскоязычные → Норвегия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-finland",
    segment: "finland",
    destinationIso2: ["FI"],
    titleEn: "Russian-speaking → Finland",
    titleRu: "Русскоязычные → Финляндия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-denmark",
    segment: "denmark",
    destinationIso2: ["DK"],
    titleEn: "Russian-speaking → Denmark",
    titleRu: "Русскоязычные → Дания",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-poland",
    segment: "poland",
    destinationIso2: ["PL"],
    titleEn: "Russian-speaking → Poland",
    titleRu: "Русскоязычные → Польша",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-czechia",
    segment: "czechia",
    destinationIso2: ["CZ"],
    titleEn: "Russian-speaking → Czechia",
    titleRu: "Русскоязычные → Чехия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-austria",
    segment: "austria",
    destinationIso2: ["AT"],
    titleEn: "Russian-speaking → Austria",
    titleRu: "Русскоязычные → Австрия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-greece",
    segment: "greece",
    destinationIso2: ["GR"],
    titleEn: "Russian-speaking → Greece",
    titleRu: "Русскоязычные → Греция",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-cyprus",
    segment: "cyprus",
    destinationIso2: ["CY"],
    titleEn: "Russian-speaking → Cyprus",
    titleRu: "Русскоязычные → Кипр",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-hungary",
    segment: "hungary",
    destinationIso2: ["HU"],
    titleEn: "Russian-speaking → Hungary",
    titleRu: "Русскоязычные → Венгрия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-malta",
    segment: "malta",
    destinationIso2: ["MT"],
    titleEn: "Russian-speaking → Malta",
    titleRu: "Русскоязычные → Мальта",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-bulgaria",
    segment: "bulgaria",
    destinationIso2: ["BG"],
    titleEn: "Russian-speaking → Bulgaria",
    titleRu: "Русскоязычные → Болгария",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-croatia",
    segment: "croatia",
    destinationIso2: ["HR"],
    titleEn: "Russian-speaking → Croatia",
    titleRu: "Русскоязычные → Хорватия",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-slovenia",
    segment: "slovenia",
    destinationIso2: ["SI"],
    titleEn: "Russian-speaking → Slovenia",
    titleRu: "Русскоязычные → Словения",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
  {
    slug: "ru-speaking-to-estonia",
    segment: "estonia",
    destinationIso2: ["EE"],
    titleEn: "Russian-speaking → Estonia",
    titleRu: "Русскоязычные → Эстония",
    active: true,
    wizardEnabled: true,
    assistEligible: true,
  },
] as const;

function buildSlugToSegment(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const c of CORRIDOR_REGISTRY) {
    if (c.active) map[c.slug] = c.segment;
  }
  return map;
}

function buildIso2ToSegment(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const c of CORRIDOR_REGISTRY) {
    if (!c.active) continue;
    for (const iso2 of c.destinationIso2) {
      map[iso2] = c.segment;
    }
  }
  return map;
}

/** Maps corridor slug → public URL segment under /ru/[country]. */
export const CORRIDOR_SLUG_TO_SEGMENT: Record<string, string> = buildSlugToSegment();

/** Maps program destination ISO2 → public URL segment. */
export const ISO2_TO_SEGMENT: Record<string, string> = buildIso2ToSegment();

/** Active corridor slugs (published on site). */
export const ACTIVE_CORRIDOR_SLUGS: string[] = CORRIDOR_REGISTRY.filter((c) => c.active).map(
  (c) => c.slug
);

/** Corridors eligible for Emigro Assist country picker. */
export const ASSIST_CORRIDOR_SLUGS: string[] = CORRIDOR_REGISTRY.filter((c) => c.assistEligible).map(
  (c) => c.slug
);

/** Corridors with full wizard + programs. */
export const WIZARD_CORRIDOR_SLUGS: string[] = CORRIDOR_REGISTRY.filter((c) => c.wizardEnabled).map(
  (c) => c.slug
);

export function getCorridorEntry(slug: string): CorridorRegistryEntry | undefined {
  return CORRIDOR_REGISTRY.find((c) => c.slug === slug);
}

export function getCorridorBySegment(segment: string): CorridorRegistryEntry | undefined {
  return CORRIDOR_REGISTRY.find((c) => c.segment === segment);
}

export function corridorSlugForSegment(segment: string): string | null {
  return getCorridorBySegment(segment)?.slug ?? null;
}

export type AssistCountryOption = {
  value: string;
  label: string;
  corridorSlug: string;
};

/** Country picker options for Emigro Assist — derived from registry. */
export function getAssistCountryOptions(): AssistCountryOption[] {
  return CORRIDOR_REGISTRY.filter((c) => c.assistEligible).map((c) => ({
    value: c.segment,
    label: c.titleRu.replace(/^Русскоязычные → /, ""),
    corridorSlug: c.slug,
  }));
}

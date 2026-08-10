/**
 * Spanish-speaking LATAM → España y Portugal.
 * Origins expand (UY, EC, …); destinations stay ES then PT — not a mini EU grid.
 * SEO + product surface under `/es`. Pillars only + covers/OG. See docs/ES_SEO_CORRIDOR.md.
 *
 * Wizard Phase 1 reuses `ru-speaking-to-spain` / `ru-speaking-to-portugal` program rules
 * with UY/EC passport eligibility (hub_audience=latam).
 */

export const ES_CORRIDOR_FAMILY = "es-speaking-latam-to-europe" as const;

/** Product destinations for LATAM contour (deep ES, then PT). */
export const ES_DESTINATIONS = ["ES", "PT"] as const;

export const ES_UY_SPAIN_CORRIDOR = {
  slug: "es-speaking-uruguay-to-spain",
  audienceLanguage: "es" as const,
  passports: ["UY"] as const,
  destinations: ["ES"] as const,
  expansionFamily: ES_CORRIDOR_FAMILY,
  nextOrigins: ["PY", "AR", "MX", "CO", "VE"] as const,
  nextDestinations: ["PT"] as const,
  title: "Uruguay → España",
  titleLong: "Residencia en España para uruguayos",
} as const;

/** Second niche wedge: higher demand than UY, far less SEO saturation than MX/AR/CO/VE. */
export const ES_EC_SPAIN_CORRIDOR = {
  slug: "es-speaking-ecuador-to-spain",
  audienceLanguage: "es" as const,
  passports: ["EC"] as const,
  destinations: ["ES"] as const,
  expansionFamily: ES_CORRIDOR_FAMILY,
  nextOrigins: ["PY", "PE", "AR", "MX", "CO", "VE"] as const,
  nextDestinations: ["PT"] as const,
  title: "Ecuador → España",
  titleLong: "Residencia en España para ecuatorianos",
  /** Unlike UY, short Schengen stays usually need a visa — key differentiator in copy. */
  shortStayVisaLikely: true,
} as const;

export const ES_ACTIVE_CORRIDORS = [ES_UY_SPAIN_CORRIDOR, ES_EC_SPAIN_CORRIDOR] as const;

export const ES_PATHS = {
  home: "/es",
  guides: "/es/guides",
  uruguay: "/es/uruguay",
  ecuador: "/es/ecuador",
  spain: "/es/spain",
  portugal: "/es/portugal",
  wizard: "/es/wizard",
  wizardResults: "/es/wizard/results",
  contact: "/es/contact",
  privacy: "/es/privacy",
  terms: "/es/terms",
} as const;

/** Canonical ES pillars only — keep this list short. */
export const ES_PILLAR_GUIDE_SLUGS = [
  "residencia-espana-desde-uruguay-2026",
  "residencia-espana-desde-ecuador-2026",
  "visa-nomada-digital-espana-latam-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

/** @deprecated use ES_PILLAR_GUIDE_SLUGS */
export const ES_SEED_GUIDE_SLUGS = ES_PILLAR_GUIDE_SLUGS;

export const ES_UY_GUIDE_SLUGS = [
  "residencia-espana-desde-uruguay-2026",
  "visa-nomada-digital-espana-latam-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

export const ES_EC_GUIDE_SLUGS = [
  "residencia-espana-desde-ecuador-2026",
  "visa-nomada-digital-espana-latam-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

export const ES_DN_CANONICAL_SLUG = "visa-nomada-digital-espana-latam-2026" as const;

export function esGuidePath(slug: string): string {
  return `/es/guides/${slug}`;
}

export function isEsPillarGuideSlug(slug: string): boolean {
  return (ES_PILLAR_GUIDE_SLUGS as readonly string[]).includes(slug);
}

/**
 * Spanish-speaking LATAM → Europe — seed wedges + expansion rails.
 * Data-light config (no DB corridor pack yet). SEO surface under `/es`.
 */

export const ES_CORRIDOR_FAMILY = "es-speaking-latam-to-europe" as const;

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
  contact: "/es/contact",
  privacy: "/es/privacy",
  terms: "/es/terms",
} as const;

export const ES_SEED_GUIDE_SLUGS = [
  "residencia-espana-desde-uruguay-2026",
  "visa-nomada-digital-espana-uruguayos-2026",
  "residencia-espana-desde-ecuador-2026",
  "visa-nomada-digital-espana-ecuatorianos-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

export const ES_UY_GUIDE_SLUGS = [
  "residencia-espana-desde-uruguay-2026",
  "visa-nomada-digital-espana-uruguayos-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

export const ES_EC_GUIDE_SLUGS = [
  "residencia-espana-desde-ecuador-2026",
  "visa-nomada-digital-espana-ecuatorianos-2026",
  "primeros-30-dias-en-espana-2026",
] as const;

export function esGuidePath(slug: string): string {
  return `/es/guides/${slug}`;
}

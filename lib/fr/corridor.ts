/**
 * Francophone Africa → France.
 * Origins: MA, DZ, TN, SN (Phase 1). Destination: France first — not a mini EU grid.
 * See docs/FR_SEO_CORRIDOR.md.
 */

export const FR_CORRIDOR_FAMILY = "fr-speaking-africa-to-europe" as const;

export const FR_DESTINATIONS = ["FR"] as const;

export const FR_MA_FRANCE_CORRIDOR = {
  slug: "fr-speaking-maroc-to-france",
  audienceLanguage: "fr" as const,
  passports: ["MA"] as const,
  destinations: ["FR"] as const,
  expansionFamily: FR_CORRIDOR_FAMILY,
  nextOrigins: ["DZ", "TN", "SN", "CI"] as const,
  title: "Maroc → France",
  titleLong: "Résidence en France pour Marocains",
  shortStayVisaLikely: true,
} as const;

export const FR_DZ_FRANCE_CORRIDOR = {
  slug: "fr-speaking-algerie-to-france",
  audienceLanguage: "fr" as const,
  passports: ["DZ"] as const,
  destinations: ["FR"] as const,
  expansionFamily: FR_CORRIDOR_FAMILY,
  nextOrigins: ["MA", "TN", "SN"] as const,
  title: "Algérie → France",
  titleLong: "Résidence en France pour Algériens",
  shortStayVisaLikely: true,
} as const;

export const FR_TN_FRANCE_CORRIDOR = {
  slug: "fr-speaking-tunisie-to-france",
  audienceLanguage: "fr" as const,
  passports: ["TN"] as const,
  destinations: ["FR"] as const,
  expansionFamily: FR_CORRIDOR_FAMILY,
  nextOrigins: ["MA", "DZ", "SN"] as const,
  title: "Tunisie → France",
  titleLong: "Résidence en France pour Tunisiens",
  shortStayVisaLikely: true,
} as const;

export const FR_SN_FRANCE_CORRIDOR = {
  slug: "fr-speaking-senegal-to-france",
  audienceLanguage: "fr" as const,
  passports: ["SN"] as const,
  destinations: ["FR"] as const,
  expansionFamily: FR_CORRIDOR_FAMILY,
  nextOrigins: ["CI", "CM", "MA"] as const,
  title: "Sénégal → France",
  titleLong: "Résidence en France pour Sénégalais",
  shortStayVisaLikely: true,
} as const;

export const FR_ACTIVE_CORRIDORS = [
  FR_MA_FRANCE_CORRIDOR,
  FR_DZ_FRANCE_CORRIDOR,
  FR_TN_FRANCE_CORRIDOR,
  FR_SN_FRANCE_CORRIDOR,
] as const;

export const FR_PATHS = {
  home: "/fr",
  guides: "/fr/guides",
  maroc: "/fr/maroc",
  algerie: "/fr/algerie",
  tunisie: "/fr/tunisie",
  senegal: "/fr/senegal",
  france: "/fr/france",
  wizard: "/fr/wizard",
  wizardResults: "/fr/wizard/results",
  assist: "/fr/assist",
  contact: "/fr/contact",
  privacy: "/fr/privacy",
  terms: "/fr/terms",
} as const;

export const FR_PILLAR_GUIDE_SLUGS = [
  "residence-france-depuis-maroc-2026",
  "residence-france-depuis-algerie-2026",
  "residence-france-depuis-tunisie-2026",
  "residence-france-depuis-senegal-2026",
  "residence-france-afrique-francophone-2026",
  "passeport-talent-france-afrique-2026",
  "naturalisation-france-afrique-2026",
] as const;

export const FR_SHARED_GUIDE_SLUGS = [
  "residence-france-afrique-francophone-2026",
  "passeport-talent-france-afrique-2026",
  "naturalisation-france-afrique-2026",
] as const;

export const FR_MA_GUIDE_SLUGS = [
  "residence-france-depuis-maroc-2026",
  ...FR_SHARED_GUIDE_SLUGS,
] as const;

export const FR_DZ_GUIDE_SLUGS = [
  "residence-france-depuis-algerie-2026",
  ...FR_SHARED_GUIDE_SLUGS,
] as const;

export const FR_TN_GUIDE_SLUGS = [
  "residence-france-depuis-tunisie-2026",
  ...FR_SHARED_GUIDE_SLUGS,
] as const;

export const FR_SN_GUIDE_SLUGS = [
  "residence-france-depuis-senegal-2026",
  ...FR_SHARED_GUIDE_SLUGS,
] as const;

export function frGuidePath(slug: string): string {
  return `/fr/guides/${slug}`;
}

export function isFrPillarGuideSlug(slug: string): boolean {
  return (FR_PILLAR_GUIDE_SLUGS as readonly string[]).includes(slug);
}

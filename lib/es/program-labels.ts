import { ES_PATHS, esGuidePath } from "@/lib/es/corridor";

/** Spanish titles for programs surfaced by the LATAM hub wizard. */
export const ES_PROGRAM_TITLE_BY_SLUG: Record<string, string> = {
  "spain-digital-nomad": "España — nómada digital (teletrabajo)",
  "spain-non-lucrative": "España — residencia no lucrativa",
  "spain-family-reunification": "España — reagrupación familiar",
  "spain-residence-by-investment": "España — residencia por inversión (cerrada)",
  "spain-student-visa": "España — visado de estudios",
  "portugal-d8-digital-nomad": "Portugal D8 — nómada digital",
  "portugal-d7-passive-income": "Portugal D7 — ingresos pasivos",
  "portugal-family-reunification": "Portugal — reagrupación familiar",
  "portugal-golden-visa": "Portugal — Golden Visa (ARI)",
  "portugal-student-visa-d4": "Portugal — visado de estudiante D4",
};

export function esProgramTitle(slug: string, fallbackRu: string): string {
  return ES_PROGRAM_TITLE_BY_SLUG[slug] ?? fallbackRu;
}

export function esCountryLabel(segment: string, fallback: string): string {
  if (segment === "spain") return "España";
  if (segment === "portugal") return "Portugal";
  return fallback;
}

/** Prefer ES hubs / pillars; RU program cards remain available as deep detail. */
export function esLatamProgramHref(segment: string, programSlug: string): string {
  if (programSlug === "spain-digital-nomad") {
    return esGuidePath("visa-nomada-digital-espana-latam-2026");
  }
  if (programSlug === "spain-non-lucrative" || programSlug.startsWith("spain-")) {
    return ES_PATHS.spain;
  }
  if (segment === "portugal" || programSlug.startsWith("portugal-")) {
    return ES_PATHS.portugal;
  }
  return ES_PATHS.home;
}

export function esLatamLandingHref(segment: string): string {
  if (segment === "portugal") return ES_PATHS.portugal;
  if (segment === "spain") return ES_PATHS.spain;
  return ES_PATHS.home;
}

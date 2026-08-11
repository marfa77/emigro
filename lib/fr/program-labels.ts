import { FR_PATHS, frGuidePath } from "@/lib/fr/corridor";

/** French titles for programs surfaced by the Afrique → France hub wizard. */
export const FR_PROGRAM_TITLE_BY_SLUG: Record<string, string> = {
  "france-talent-salarie": "France — Talent / salarié qualifié",
  "france-vls-ts-visiteur": "France — VLS-TS visiteur",
  "france-family-reunification": "France — regroupement familial",
  "france-student-visa": "France — visa étudiant",
};

export function frProgramTitle(slug: string, fallbackRu: string): string {
  return FR_PROGRAM_TITLE_BY_SLUG[slug] ?? fallbackRu;
}

export function frCountryLabel(segment: string, fallback: string): string {
  if (segment === "france") return "France";
  return fallback;
}

/** Prefer FR hubs / pillars; RU program cards remain as deep detail. */
export function frAfriqueProgramHref(segment: string, programSlug: string): string {
  if (programSlug === "france-talent-salarie") {
    return frGuidePath("passeport-talent-france-afrique-2026");
  }
  if (programSlug === "france-vls-ts-visiteur" || programSlug.startsWith("france-")) {
    if (programSlug === "france-student-visa" || programSlug === "france-family-reunification") {
      return frGuidePath("residence-france-afrique-francophone-2026");
    }
    return FR_PATHS.france;
  }
  if (segment === "france") return FR_PATHS.france;
  return FR_PATHS.home;
}

export function frAfriqueLandingHref(segment: string): string {
  if (segment === "france") return FR_PATHS.france;
  return FR_PATHS.home;
}

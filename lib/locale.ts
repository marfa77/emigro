/** Public site locales. RU is primary; ES is the Spanish-speaking → Europe corridor surface. */
export type SiteLocale = "ru" | "es";

/** UI chrome that still accepts unused EN stubs in a few components. */
export type UiLocale = SiteLocale | "en";

export type GuideLocale = SiteLocale;

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "ru" || value === "es";
}

export function localeHomePath(locale: SiteLocale): string {
  return `/${locale}`;
}

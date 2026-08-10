/** Public site locales. RU primary; ES = LATAM→Europe; FR = Afrique francophone→France. */
export type SiteLocale = "ru" | "es" | "fr";

/** UI chrome that still accepts unused EN stubs in a few components. */
export type UiLocale = SiteLocale | "en";

export type GuideLocale = SiteLocale;

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "ru" || value === "es" || value === "fr";
}

export function localeHomePath(locale: SiteLocale): string {
  return `/${locale}`;
}

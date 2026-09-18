/**
 * Compose "country — program" without duplicating country when title_ru
 * already starts with it (e.g. "Испания — digital nomad", "Португалия D8 — …").
 */
export function formatCountryProgramLabel(
  countryRu: string | null | undefined,
  programTitleRu: string | null | undefined
): string {
  const country = (countryRu ?? "").trim();
  const title = (programTitleRu ?? "").trim();
  if (!country) return title;
  if (!title) return country;
  if (title === country) return country;

  const next = title[country.length] ?? "";
  if (title.startsWith(country) && (next === "" || /[\s—–:\-]/.test(next))) {
    return title;
  }

  return `${country} — ${title}`;
}

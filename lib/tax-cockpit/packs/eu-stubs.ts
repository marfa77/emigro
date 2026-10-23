import type { CountryPack } from "./types";

/**
 * Remaining EU members after PT and IT (those two have complete packs).
 * Day rule: cockpit default. The count is only an orienter.
 * complete: false → engine yellow only, never green or red.
 * 183 is a common headline figure, not a statement of that country's statute.
 */

const STUB_NOTES = [
  "Pack incomplete: порог 183 дня — только ориентир, не выжимка местного закона. Уверенный зелёный и красный по этой стране не ставим — нужен консультант.",
];

const STUB_QUESTIONS = [
  "Какой местный тест резидентства кроме ориентира «около 183 дней» — жильё, семья, работа, прописка?",
  "Налоговый год совпадает с календарным или дни надо переложить на другой период?",
];

const EU_STUB_COUNTRIES: ReadonlyArray<{ iso2: string; nameRu: string }> = [
  { iso2: "AT", nameRu: "Австрия" },
  { iso2: "BE", nameRu: "Бельгия" },
  { iso2: "BG", nameRu: "Болгария" },
  { iso2: "HR", nameRu: "Хорватия" },
  { iso2: "CY", nameRu: "Кипр" },
  { iso2: "CZ", nameRu: "Чехия" },
  { iso2: "DK", nameRu: "Дания" },
  { iso2: "EE", nameRu: "Эстония" },
  { iso2: "FI", nameRu: "Финляндия" },
  { iso2: "FR", nameRu: "Франция" },
  { iso2: "DE", nameRu: "Германия" },
  { iso2: "GR", nameRu: "Греция" },
  { iso2: "HU", nameRu: "Венгрия" },
  { iso2: "IE", nameRu: "Ирландия" },
  { iso2: "LV", nameRu: "Латвия" },
  { iso2: "LT", nameRu: "Литва" },
  { iso2: "LU", nameRu: "Люксембург" },
  { iso2: "MT", nameRu: "Мальта" },
  { iso2: "NL", nameRu: "Нидерланды" },
  { iso2: "PL", nameRu: "Польша" },
  { iso2: "RO", nameRu: "Румыния" },
  { iso2: "SK", nameRu: "Словакия" },
  { iso2: "SI", nameRu: "Словения" },
  { iso2: "ES", nameRu: "Испания" },
  { iso2: "SE", nameRu: "Швеция" },
];

export const EU_STUB_PACKS: CountryPack[] = EU_STUB_COUNTRIES.map((country) => ({
  iso2: country.iso2,
  nameRu: country.nameRu,
  complete: false,
  presenceThresholdDays: 183,
  thresholdCompare: "gte",
  notesRu: STUB_NOTES,
  tieBreakerQuestionsRu: STUB_QUESTIONS,
}));

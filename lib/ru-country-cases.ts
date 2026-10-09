/** Russian case forms for country names used in templates («в Норвегии», «по Кипру», «для Франции»). */

type CountryCases = {
  genitive: string;
  dative: string;
  accusative: string;
  prepositional: string;
  /** Preposition for location: «в», «во» or «на». */
  locative?: "в" | "во" | "на";
};

const EXPLICIT: Record<string, CountryCases> = {
  Нидерланды: { genitive: "Нидерландов", dative: "Нидерландам", accusative: "Нидерланды", prepositional: "Нидерландах" },
  Филиппины: { genitive: "Филиппин", dative: "Филиппинам", accusative: "Филиппины", prepositional: "Филиппинах", locative: "на" },
  Мальдивы: { genitive: "Мальдив", dative: "Мальдивам", accusative: "Мальдивы", prepositional: "Мальдивах", locative: "на" },
  "Индонезия / Бали": {
    genitive: "Индонезии и Бали",
    dative: "Индонезии и Бали",
    accusative: "Индонезию и Бали",
    prepositional: "Индонезии и на Бали",
  },
  "Южная Корея": { genitive: "Южной Кореи", dative: "Южной Корее", accusative: "Южную Корею", prepositional: "Южной Корее" },
  "Новая Зеландия": {
    genitive: "Новой Зеландии",
    dative: "Новой Зеландии",
    accusative: "Новую Зеландию",
    prepositional: "Новой Зеландии",
  },
  "Шри-Ланка": { genitive: "Шри-Ланки", dative: "Шри-Ланке", accusative: "Шри-Ланку", prepositional: "Шри-Ланке", locative: "на" },
};

const INDECLINABLE = new Set(["Перу", "Чили", "Марокко", "Монако", "Сан-Марино", "Бали", "Того", "Кюрасао"]);

const ON_ISLAND = new Set(["Кипр", "Мальта", "Бали", "Пхукет", "Куба", "Ямайка", "Маврикий", "Кюрасао"]);

const VOWELS = "аеёиоуыэюяАЕЁИОУЫЭЮЯ";

function declineSingleWord(name: string): Omit<CountryCases, "locative"> | null {
  const same = { genitive: name, dative: name, accusative: name, prepositional: name };
  if (INDECLINABLE.has(name) || /^[А-ЯЁA-Z]{2,}$/.test(name)) return same;

  if (name.endsWith("ия")) {
    const stem = name.slice(0, -2);
    return { genitive: `${stem}ии`, dative: `${stem}ии`, accusative: `${stem}ию`, prepositional: `${stem}ии` };
  }
  if (name.endsWith("ея")) {
    const stem = name.slice(0, -2);
    return { genitive: `${stem}еи`, dative: `${stem}ее`, accusative: `${stem}ею`, prepositional: `${stem}ее` };
  }
  if (name.endsWith("а")) {
    const stem = name.slice(0, -1);
    const genitiveEnding = /[гкхжшчщ]$/.test(stem) ? "и" : "ы";
    return {
      genitive: `${stem}${genitiveEnding}`,
      dative: `${stem}е`,
      accusative: `${stem}у`,
      prepositional: `${stem}е`,
    };
  }
  if (name.endsWith("й") || name.endsWith("ь")) {
    const stem = name.slice(0, -1);
    return { genitive: `${stem}я`, dative: `${stem}ю`, accusative: name, prepositional: `${stem}е` };
  }
  if (/[бвгдзклмнпрстфхжшчщц]$/.test(name)) {
    return { genitive: `${name}а`, dative: `${name}у`, accusative: name, prepositional: `${name}е` };
  }
  return null;
}

function resolveCases(name: string): CountryCases | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const explicit = EXPLICIT[trimmed];
  if (explicit) return explicit;
  if (/\s/.test(trimmed)) return null;
  const declined = declineSingleWord(trimmed);
  if (!declined) return null;
  return { ...declined, locative: ON_ISLAND.has(trimmed) ? "на" : undefined };
}

function preposition(cases: CountryCases, form: string): "в" | "во" | "на" {
  if (cases.locative) return cases.locative;
  const first = form.charAt(0);
  const second = form.charAt(1);
  return /[ВвФф]/.test(first) && second && !VOWELS.includes(second) ? "во" : "в";
}

export function ruCountryGenitive(name: string): string {
  return resolveCases(name)?.genitive ?? name;
}

export function ruCountryDative(name: string): string {
  return resolveCases(name)?.dative ?? name;
}

export function ruCountryAccusative(name: string): string {
  return resolveCases(name)?.accusative ?? name;
}

export function ruCountryPrepositional(name: string): string {
  return resolveCases(name)?.prepositional ?? name;
}

/** «в Норвегии», «во Франции», «на Кипре». */
export function ruCountryIn(name: string): string {
  const cases = resolveCases(name);
  if (!cases) return `в ${name}`;
  return `${preposition(cases, cases.prepositional)} ${cases.prepositional}`;
}

/** Direction: «в Норвегию», «во Францию», «на Кипр». */
export function ruCountryTo(name: string): string {
  const cases = resolveCases(name);
  if (!cases) return `в ${name}`;
  return `${preposition(cases, cases.accusative)} ${cases.accusative}`;
}

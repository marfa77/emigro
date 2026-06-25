export type ProviderCategory =
  | "legal"
  | "relocation"
  | "translation"
  | "photos"
  | "language_courses";

export type ProviderExam = {
  topicKey: string;
  label: string;
};

export type ServiceProvider = {
  id: string;
  name: string;
  taglineRu: string;
  descriptionRu: string;
  url: string;
  category: ProviderCategory;
  corridorSlugs?: string[];
  topicKeys?: string[];
  examsRu?: ProviderExam[];
  ctaLabelRu: string;
};

export const PREP2GO_TOPIC_KEYS = ["portugal", "spain", "france", "italy", "germany"] as const;

const CATEGORY_ORDER: ProviderCategory[] = [
  "language_courses",
  "relocation",
  "legal",
  "translation",
  "photos",
];

export const PROVIDER_CATEGORY_LABELS_RU: Record<ProviderCategory, string> = {
  language_courses: "Подготовка к языку",
  relocation: "Релокация",
  legal: "Юридические сервисы",
  translation: "Переводы",
  photos: "Фото и документы",
};

const PREP2GO_EXAMS: ProviderExam[] = [
  { topicKey: "portugal", label: "CIPLE A2" },
  { topicKey: "spain", label: "DELE A2" },
  { topicKey: "france", label: "DELF B2" },
  { topicKey: "italy", label: "CELI B1" },
  { topicKey: "germany", label: "DTZ B1" },
];

const PROVIDERS: ServiceProvider[] = [
  {
    id: "prep2go",
    name: "Prep2Go",
    taglineRu: "Подготовка к языковым экзаменам для гражданства EU",
    descriptionRu:
      "Prep2Go — онлайн-подготовка к экзаменам для гражданства: CIPLE A2 (Португалия), DELE A2 (Испания), DELF B2 (Франция), CELI B1 (Италия), DTZ B1 (Германия). Mock-тесты, карточки, формат реального экзамена.",
    url: "https://www.prep2go.study",
    category: "language_courses",
    corridorSlugs: [
      "ru-speaking-to-portugal",
      "ru-speaking-to-spain",
      "ru-speaking-to-france",
      "ru-speaking-to-italy",
      "ru-speaking-to-germany",
    ],
    topicKeys: [...PREP2GO_TOPIC_KEYS],
    examsRu: PREP2GO_EXAMS,
    ctaLabelRu: "На Prep2Go.study",
  },
  {
    id: "ei-migration-portugal",
    name: "Ei! Assessoria Migratória",
    taglineRu: "Релокация и ВНЖ в Португалии",
    descriptionRu:
      "Первая миграционная компания в Португалии: визы, ВНЖ, сопровождение на SEF/AIMA, налоговый представитель и стратегия переезда. С 2014 года — более 4500 клиентов из 60 стран.",
    url: "https://eimigrante.pt/en/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-portugal"],
    topicKeys: ["portugal"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "ots-relocation-portugal",
    name: "OTS Relocation",
    taglineRu: "Релокация и ВНЖ в Португалии",
    descriptionRu:
      "360°-релокация «под ключ»: визы и резиденция, налоги, жильё, адаптация семьи и бизнеса. Один менеджер на весь процесс переезда в Португалию.",
    url: "https://www.otsrelocation.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-portugal"],
    topicKeys: ["portugal"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "relomar-spain",
    name: "Relomar",
    taglineRu: "Релокация и ВНЖ в Испании",
    descriptionRu:
      "Релокация частных клиентов и семей: визы, NIE/TIE, жильё, школы и переезд. Работают в Мадриде, Барселоне, Валенсии, Малаге и других городах Испании.",
    url: "https://www.relomar.com/en/relocation/private/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-spain"],
    topicKeys: ["spain"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "bqgat-spain",
    name: "BQgat Relocation",
    taglineRu: "Релокация и ВНЖ в Испании",
    descriptionRu:
      "Агентство из Барселоны: визы, жильё, страховка и адаптация. Покрывают Барселону, Мадрид, Валенсию, Малагу и другие города — для сотрудников и частных переездов.",
    url: "https://bqgatrelocation.com/en/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-spain"],
    topicKeys: ["spain"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "your-friend-in-paris",
    name: "Your Friend in Paris",
    taglineRu: "Релокация и ВНЖ во Франции",
    descriptionRu:
      "Парижское агентство полного цикла: визы и titre de séjour, поиск жилья, банк, школы и административные процедуры. Работают с клиентами из США, Канады, Австралии и других стран.",
    url: "https://yourfriendinparis.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-france"],
    topicKeys: ["france"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "come-live-in-france",
    name: "Come Live in France",
    taglineRu: "Релокация и ВНЖ во Франции",
    descriptionRu:
      "CLIF помогает с визами, жильём, банком, медстраховкой и адаптацией по всей Франции — Париж, Лион, Ницца, Бордо и другие города. Более 3000 клиентов из 50+ стран.",
    url: "https://comeliveinfrance.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-france"],
    topicKeys: ["france"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "relo-moving-italy",
    name: "Relo-Moving",
    taglineRu: "Релокация и ВНЖ в Италии",
    descriptionRu:
      "360°-релокация в Италии: визы, permesso di soggiorno, регистрация, жильё и переезд. Офисы в Риме и Милане, сопровождение частных клиентов и компаний.",
    url: "https://www.relo-moving.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-italy"],
    topicKeys: ["italy"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "impatria-italy",
    name: "Impatria",
    taglineRu: "Релокация и ВНЖ в Италии",
    descriptionRu:
      "Единая точка контакта для переезда: визы, налоги, недвижимость и юридическое сопровождение. Программы для разных профилей — от digital nomad до инвестиционного резидентства.",
    url: "https://impatria.com/en/services/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-italy"],
    topicKeys: ["italy"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "progedo-germany",
    name: "PROGEDO",
    taglineRu: "Релокация и ВНЖ в Германии",
    descriptionRu:
      "Один из крупнейших relocation-провайдеров Германии: визы, Aufenthaltstitel, жильё и интеграция. Более 30 лет опыта и 45 000 успешных переездов по всей стране.",
    url: "https://www.relocation.de/en/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-germany"],
    topicKeys: ["germany"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "archer-relocation-germany",
    name: "Archer Relocation",
    taglineRu: "Релокация и ВНЖ в Германии",
    descriptionRu:
      "Персональная релокация в Берлин, Мюнхен, Гамбург и другие города: визы, Anmeldung, жильё и страховка. С 2015 года помогают специалистам и семьям переезжать в Германию.",
    url: "https://www.archer-relocation.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-germany"],
    topicKeys: ["germany"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "rsh-netherlands",
    name: "RSH Relocation Services Holland",
    taglineRu: "Релокация и ВНЖ в Нидерландах",
    descriptionRu:
      "Независимое агентство с 35-летним опытом: иммиграция, поиск жилья, регистрация в gemeente, школы и банк. Работают по всей стране — Амстердам, Гаага, Роттердам, Utrecht.",
    url: "https://relocation-holland.nl/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-netherlands"],
    topicKeys: ["netherlands"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "we4expats-netherlands",
    name: "WE4EXPATS",
    taglineRu: "Релокация и ВНЖ в Нидерландах",
    descriptionRu:
      "Команда бывших экспатов в Амстердаме: визы IND, жильё, 30%-ruling, регистрация и адаптация. Поддержка на английском, французском, испанском, русском и других языках.",
    url: "https://www.we4expats.nl/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-netherlands"],
    topicKeys: ["netherlands"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "nordic-relocation-scandinavia",
    name: "Nordic Relocation",
    taglineRu: "Релокация и ВНЖ в Скандинавии",
    descriptionRu:
      "С 1993 года — destination-сервисы в Швеции: work permit, жильё, школы и адаптация. Офисы в Стокгольме, Гётеборге и Lund; сертификат EuRA Global Quality Seal.",
    url: "https://nrgab.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-scandinavia"],
    topicKeys: ["scandinavia"],
    ctaLabelRu: "Сайт агентства",
  },
  {
    id: "relocation-scandinavia",
    name: "Relocation Scandinavia",
    taglineRu: "Релокация и ВНЖ в Скандинавии",
    descriptionRu:
      "Персональная релокация в Данию и страны Севера: жильё, регистрация, школы и культурная адаптация. Один консультант ведёт клиента от планирования до первых месяцев в стране.",
    url: "https://www.relocationscandinavia.com/",
    category: "relocation",
    corridorSlugs: ["ru-speaking-to-scandinavia"],
    topicKeys: ["scandinavia"],
    ctaLabelRu: "Сайт агентства",
  },
];

function categoryRank(category: ProviderCategory): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function uniqueById(providers: ServiceProvider[]): ServiceProvider[] {
  const seen = new Set<string>();
  return providers.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function sortProvidersByCategory(providers: ServiceProvider[]): ServiceProvider[] {
  return [...providers].sort((a, b) => categoryRank(a.category) - categoryRank(b.category));
}

export function filterCompactProviders(providers: ServiceProvider[]): ServiceProvider[] {
  const sorted = sortProvidersByCategory(providers);
  const languageCourses = sorted.filter((p) => p.category === "language_courses");
  const firstRelocation = sorted.find((p) => p.category === "relocation");
  return firstRelocation ? [...languageCourses, firstRelocation] : languageCourses;
}

export function groupProvidersByCategory(
  providers: ServiceProvider[]
): { category: ProviderCategory; providers: ServiceProvider[] }[] {
  const sorted = sortProvidersByCategory(providers);
  const groups: { category: ProviderCategory; providers: ServiceProvider[] }[] = [];

  for (const provider of sorted) {
    const last = groups[groups.length - 1];
    if (last?.category === provider.category) {
      last.providers.push(provider);
    } else {
      groups.push({ category: provider.category, providers: [provider] });
    }
  }

  return groups;
}

export function getAllProviders(): ServiceProvider[] {
  return [...PROVIDERS];
}

export function getProviderById(id: string): ServiceProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getProvidersForCorridor(slug: string): ServiceProvider[] {
  return sortProvidersByCategory(PROVIDERS.filter((p) => p.corridorSlugs?.includes(slug)));
}

export function getProvidersForTopic(topicKey: string): ServiceProvider[] {
  return sortProvidersByCategory(PROVIDERS.filter((p) => p.topicKeys?.includes(topicKey)));
}

export function getProvidersForContext(opts: {
  corridorSlug?: string;
  topicKey?: string;
  compact?: boolean;
}): ServiceProvider[] {
  const byCorridor = opts.corridorSlug ? getProvidersForCorridor(opts.corridorSlug) : [];
  const byTopic = opts.topicKey ? getProvidersForTopic(opts.topicKey) : [];
  const merged = uniqueById([...byCorridor, ...byTopic]);
  return opts.compact ? filterCompactProviders(merged) : sortProvidersByCategory(merged);
}

export function getExamLabelForTopic(provider: ServiceProvider, topicKey: string): string | undefined {
  return provider.examsRu?.find((exam) => exam.topicKey === topicKey)?.label;
}

export function findFirstProviderTopicKey(topicKeys: string[]): string | undefined {
  for (const key of topicKeys) {
    if (getProvidersForTopic(key).length > 0) return key;
  }
  return undefined;
}

export function corridorSlugForTopic(topicKey: string): string {
  return `ru-speaking-to-${topicKey}`;
}

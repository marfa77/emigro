import type { Metadata } from "next";
import type { Corridor, DigestItem, ProgramDetail } from "@/lib/types";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { countryCardImage, countryOgImage } from "@/lib/brand/country-accents";
import { fitMetaDescription, fitSeoTitlePart, hreflangAlternates, pageMetadata, pageUrl } from "@/lib/seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";

const SCHEMA_DATE_FALLBACK = "2026-06-01T00:00:00.000Z";

/** Latest verification date from source/digest fields; deterministic fallback when absent. */
export function latestVerifiedIso(dates: (string | null | undefined)[]): string {
  const valid = dates.filter((d): d is string => Boolean(d)).sort();
  const latest = valid.at(-1);
  if (!latest) return SCHEMA_DATE_FALLBACK;
  const parsed = new Date(latest);
  return Number.isNaN(parsed.getTime()) ? SCHEMA_DATE_FALLBACK : parsed.toISOString();
}

export function corridorDigestLastModified(corridor: Corridor): string {
  return latestVerifiedIso(corridor.digest.map((item) => item.last_verified));
}

export function programLastModified(program: ProgramDetail): string {
  return latestVerifiedIso(program.sources.map((source) => source.last_verified));
}

export function verifiedDateToLastModified(iso: string): Date | undefined {
  if (iso === SCHEMA_DATE_FALLBACK) return undefined;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export type FaqItem = { question: string; answer: string };

const PASSPORT_LABELS: Record<string, string> = {
  RU: "Россия",
  BY: "Беларусь",
  UA: "Украина",
  KZ: "Казахстан",
};

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  LABOR: "работа / удалёнка",
  CAPITAL: "капитал / пассивный доход",
  BOND: "семья / воссоединение",
  STUDY: "учёба / студенческая виза",
};

const PASSPORT_STATUS_LABELS: Record<string, string> = {
  eligible: "подача доступна",
  partial: "зависит от консульства подачи",
  ineligible: "маршрут недоступен",
};

function fitDescription(text: string, min = 120, max = 160): string {
  return fitMetaDescription(text, min, max);
}

function fitTitle(text: string, max = 52): string {
  return fitSeoTitlePart(text, max);
}

function programTypeLabel(type: string): string {
  return PROGRAM_TYPE_LABELS[type] ?? type.toLowerCase();
}

function passportLabel(iso2: string): string {
  return PASSPORT_LABELS[iso2] ?? iso2;
}

function keyRequirement(program: ProgramDetail): string | null {
  const income = program.requirements.find((r) =>
    /доход|средств|зарплат|income|salary/i.test(r.label_ru)
  );
  return income?.value_text ?? income?.label_ru ?? program.requirements[0]?.value_text ?? null;
}

function timelineSummary(program: ProgramDetail): string | null {
  if (program.timeline.length === 0) return null;
  const parts = program.timeline
    .map((s) => s.duration_text)
    .filter(Boolean)
    .slice(0, 3);
  return parts.length > 0 ? parts.join(" → ") : program.timeline.map((s) => s.title_ru).join(" → ");
}

function passportSummary(program: ProgramDetail): string {
  if (program.passportEligibility.length === 0) {
    return "Подача зависит от паспорта и юрисдикции консульства; официальные требования программы сверяются с источниками на странице.";
  }
  const statuses = program.passportEligibility
    .map((p) => `${passportLabel(p.passport_iso2)}: ${PASSPORT_STATUS_LABELS[p.status] ?? p.status}`)
    .join("; ");
  const lastVerified = program.sources
    .map((source) => source.last_verified)
    .filter(Boolean)
    .sort()
    .at(-1);
  const verification = lastVerified
    ? ` Проверено по официальным требованиям: ${lastVerified}; консульская юрисдикция остаётся операционным ограничением.`
    : " Проверено по официальным требованиям программы; консульская юрисдикция остаётся операционным ограничением.";
  return `${statuses}.${verification}`;
}

export function programPagePath(topic: NewsTopicConfig, programSlug: string): string {
  return `${topic.sitePaths!.landing}/programs/${programSlug}`;
}

export function digestPagePath(topic: NewsTopicConfig): string {
  return topic.sitePaths!.guide!;
}

export function buildProgramQuickAnswer(program: ProgramDetail, topic: NewsTopicConfig): string {
  const threshold = keyRequirement(program);
  const type = programTypeLabel(program.program_type);
  const parts = [
    `${program.title_ru} — маршрут ВНЖ в ${topic.countryRu} для русскоязычных с паспортами RU/BY/UA/KZ (${type}).`,
    threshold ? `Ключевой порог: ${threshold}.` : program.summary_ru,
    `Проверьте свой профиль в wizard коридора ${topic.countryRu} или hub wizard Emigro.`,
  ];
  return parts.join(" ");
}

export function buildProgramFaq(program: ProgramDetail, topic: NewsTopicConfig): FaqItem[] {
  const threshold = keyRequirement(program);
  const timeline = timelineSummary(program);
  const costs = program.costs
    .slice(0, 3)
    .map((c) => `${c.label_ru}: ${c.amount_text ?? (c.amount_eur ? `€${c.amount_eur}` : "уточняйте")}`)
    .join("; ");

  const employmentRule = program.requirements.find((r) =>
    /работ|employment|трудов|удалён/i.test(r.label_ru)
  );

  const items: FaqItem[] = [
    {
      question: `Кому подходит ${program.title_ru}?`,
      answer: `${program.summary_ru} Программа относится к типу «${programTypeLabel(program.program_type)}» в коридоре ${topic.countryRu}.`,
    },
    {
      question: `Какой финансовый порог для ${topic.countryRu} в 2026?`,
      answer: threshold
        ? `${threshold}. Точные расчёты зависят от состава семьи и требований консульства — сверяйте с официальными источниками на странице.`
        : `Смотрите блок «Требования» и официальные источники — пороги обновляются индексами и правилами ${topic.countryRu}.`,
    },
    {
      question: `Сколько занимает оформление ВНЖ по этой программе?`,
      answer: timeline
        ? `Типичные этапы: ${timeline}. Сроки консульства и выдачи карты резидента добавляют 1–6 месяцев.`
        : `Срок зависит от подготовки досье и очереди консульства; закладывайте от 3 до 9 месяцев на первичный маршрут.`,
    },
    {
      question: `С какими паспортами можно подавать?`,
      answer: passportSummary(program),
    },
    {
      question: employmentRule
        ? `Можно ли работать или удалённо по этому маршруту?`
        : `Какие ограничения по деятельности в ${topic.countryRu}?`,
      answer: employmentRule?.value_text
        ? `${employmentRule.label_ru}: ${employmentRule.value_text}`
        : `Смотрите требования программы и официальные источники — ограничения по работе различаются по типу ВНЖ.`,
    },
    {
      question: `Какие расходы заложить на старт?`,
      answer: costs || `Смотрите блок «Ориентировочные расходы» — консульские сборы, страховка и продления зависят от семьи.`,
    },
  ];

  return items.slice(0, 6);
}

export function buildProgramLlmFacts(program: ProgramDetail, topic: NewsTopicConfig): string[] {
  const facts = [
    `Программа: ${program.title_ru} (${topic.countryRu}, 2026).`,
    `Тип маршрута: ${programTypeLabel(program.program_type)}.`,
    program.summary_ru,
    keyRequirement(program) ? `Порог: ${keyRequirement(program)}.` : null,
    timelineSummary(program) ? `Этапы: ${timelineSummary(program)}.` : null,
    program.sources.length > 0
      ? `Официальные источники: ${program.sources
          .slice(0, 3)
          .map((s) => s.label_ru ?? s.source_url)
          .join(", ")}.`
      : null,
    `Паспорта: ${passportSummary(program)}`,
    `Emigro: wizard коридора ${topic.countryRu} и hub wizard /ru/wizard для сравнения маршрутов.`,
  ];
  return facts.filter((f): f is string => Boolean(f));
}

export function buildProgramAiDescription(program: ProgramDetail, topic: NewsTopicConfig): string {
  return [
    buildProgramQuickAnswer(program, topic),
    "Emigro сопоставляет паспорт, доход, семью и сроки с программами ВНЖ без обещания гарантированного статуса.",
  ].join(" ");
}

export function buildProgramMetadata(
  program: ProgramDetail,
  topic: NewsTopicConfig
): Metadata {
  const path = programPagePath(topic, program.slug);
  const seoTitle = fitTitle(`${program.title_ru} — ВНЖ ${topic.countryRu} 2026`);
  const description = fitDescription(
    `${program.summary_ru} Требования, сроки, пороги 2026 и официальные источники для паспортов RU/BY/UA/KZ. Wizard Emigro.`
  );
  const keywords = [
    `ВНЖ ${topic.countryRu}`,
    program.title_ru,
    programTypeLabel(program.program_type),
    "русскоязычные",
    "паспорт RU",
    "релокация 2026",
    ...(topic.seoTags ?? []).slice(0, 3),
  ];

  const base = pageMetadata({
    title: seoTitle,
    description,
    path,
    ogImage: countryOgImage(topic.urlSegment),
    ogImageAlt: `${topic.countryRu}: ${program.title_ru}`,
  });
  return {
    ...base,
    keywords,
    alternates: hreflangAlternates(path),
  };
}

function findDigestItem(digest: DigestItem[], ...categories: string[]): DigestItem | undefined {
  return digest.find((item) => categories.includes(item.category.toLowerCase()));
}

export function buildDigestQuickAnswer(topic: NewsTopicConfig, corridor: Corridor): string {
  const citizenship = findDigestItem(corridor.digest, "citizenship", "timeline");
  const programs = corridor.programs.map((p) => p.title_ru).slice(0, 3).join(", ");
  return [
    `Справочник Emigro по коридору ${topic.countryRu}: проверенные факты о ВНЖ, гражданстве, языке и административных шагах для русскоязычных (RU/BY/UA/KZ).`,
    citizenship ? citizenship.body_ru.split("\n")[0] : topic.focusHintRu,
    programs ? `Программы коридора: ${programs}.` : null,
    "Актуальные изменения законов — в еженедельных новостях Emigro; подбор маршрута — через wizard.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildDigestFaq(topic: NewsTopicConfig, corridor: Corridor): FaqItem[] {
  const citizenship = findDigestItem(corridor.digest, "citizenship", "timeline");
  const language = findDigestItem(corridor.digest, "exam", "language", "citizenship");
  const practical = findDigestItem(corridor.digest, "practical");
  const tax = findDigestItem(corridor.digest, "tax", "taxes");
  const programList =
    corridor.programs.length > 0
      ? corridor.programs.map((p) => p.title_ru).join(", ")
      : `программы коридора ${topic.countryRu} в разработке`;

  return [
    {
      question: `Сколько лет до гражданства ${topic.countryRu} в 2026?`,
      answer:
        citizenship?.body_ru ??
        `Срок натурализации зависит от типа ВНЖ и интеграции; смотрите разделы справочника и официальные источники ${topic.countryRu}.`,
    },
    {
      question: `Какой язык нужен для ВНЖ и гражданства в ${topic.countryRu}?`,
      answer:
        language?.body_ru ??
        `Требования к языку различаются по этапу (ВНЖ vs гражданство); проверьте экзамены и уровни в справочнике и на сайтах миграционных служб.`,
    },
    {
      question: `Какие налоги учитывать при релокации в ${topic.countryRu}?`,
      answer:
        tax?.body_ru ??
        `Налоговый режим зависит от статуса резидента, источника дохода и договоров об избежании двойного налогообложения — это не юридическая консультация, сверяйте с консультантом.`,
    },
    {
      question: `Какие программы ВНЖ есть в коридоре ${topic.countryRu}?`,
      answer: `${programList}. Детальные требования, пороги и источники — на страницах программ и в wizard коридора.`,
    },
    {
      question: `Как отслеживать изменения миграционного законодательства ${topic.countryRu}?`,
      answer:
        practical?.body_ru ??
        `Подпишитесь на еженедельный дайджест Emigro по ${topic.countryRu} и сверяйте решения с официальными публикациями (BOE, MFA, миграционные порталы).`,
    },
    {
      question: `Чем справочник отличается от новостей Emigro?`,
      answer:
        "Справочник — статический intelligence-слой с проверенными фактами и сроками; новости — еженедельные изменения законов и практики консульств с источниками.",
    },
  ];
}

export function buildDigestLlmFacts(topic: NewsTopicConfig, corridor: Corridor): string[] {
  return [
    `Справочник коридора Emigro: ${topic.countryRu} (2026).`,
    topic.focusHintRu,
    `Аудитория: ${corridor.audience_description_ru}`,
    corridor.programs.length > 0
      ? `Программы: ${corridor.programs.map((p) => p.title_ru).join("; ")}.`
      : null,
    ...corridor.digest.slice(0, 5).map((item) => `${item.title_ru}: ${item.body_ru.replace(/\s+/g, " ").slice(0, 200)}`),
    "Emigro: hub wizard /ru/wizard и коридорный wizard для подбора маршрута ВНЖ.",
  ].filter((f): f is string => Boolean(f));
}

export function buildDigestAiDescription(topic: NewsTopicConfig, corridor: Corridor): string {
  return [
    buildDigestQuickAnswer(topic, corridor),
    "Emigro объединяет справочник, программы ВНЖ, wizard и еженедельные новости для русскоязычных релокантов.",
  ].join(" ");
}

export function buildDigestMetadata(topic: NewsTopicConfig): Metadata {
  const path = digestPagePath(topic);
  const seoTitle = fitTitle(`Справочник ВНЖ ${topic.countryRu} — факты 2026`);
  const description = fitDescription(
    `Проверенные факты по ВНЖ, гражданству, языку и срокам в ${topic.countryRu} для паспортов RU/BY/UA/KZ. Программы коридора, wizard подбора маршрута и еженедельные новости Emigro.`
  );
  const keywords = [
    `ВНЖ ${topic.countryRu}`,
    `справочник ${topic.countryRu}`,
    "гражданство",
    "релокация 2026",
    "русскоязычные",
    ...(topic.seoTags ?? []).slice(0, 4),
  ];

  const base = pageMetadata({
    title: seoTitle,
    description,
    path,
    ogImage: countryOgImage(topic.urlSegment),
    ogImageAlt: `Справочник ВНЖ ${topic.countryRu} — Emigro`,
  });
  return {
    ...base,
    keywords,
    alternates: hreflangAlternates(path),
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; item?: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.item ? { item: entry.item } : {}),
    })),
  };
}

export function buildFaqSchema(faq: FaqItem[]): Record<string, unknown> | null {
  if (faq.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildProgramArticleSchema(
  program: ProgramDetail,
  topic: NewsTopicConfig,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: program.title_ru,
    description: program.summary_ru,
    dateModified: programLastModified(program),
    datePublished: "2026-06-01",
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: schemaImage(countryCardImage(topic.urlSegment)),
    keywords: [`ВНЖ ${topic.countryRu}`, program.program_type, "2026"].join(", "),
  };
}

export function buildProgramHowToSchema(
  program: ProgramDetail,
  topic: NewsTopicConfig,
  url: string
): Record<string, unknown> | null {
  if (program.timeline.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Как оформить ${program.title_ru}`,
    description: program.summary_ru,
    step: program.timeline.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title_ru,
      text: step.duration_text ?? step.title_ru,
    })),
    url,
    inLanguage: "ru-RU",
    about: { "@type": "Thing", name: topic.countryRu },
  };
}

export function buildDigestItemListSchema(
  topic: NewsTopicConfig,
  corridor: Corridor,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Справочник коридора ${topic.countryRu}`,
    description: buildDigestQuickAnswer(topic, corridor),
    url,
    numberOfItems: corridor.digest.length,
    itemListElement: corridor.digest.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title_ru,
      description: item.body_ru.slice(0, 300),
      url,
    })),
  };
}

export function buildDigestArticleSchema(
  topic: NewsTopicConfig,
  corridor: Corridor,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Справочник коридора ${topic.countryRu}`,
    description: buildDigestQuickAnswer(topic, corridor),
    dateModified: corridorDigestLastModified(corridor),
    datePublished: "2026-06-01",
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: schemaImage(countryCardImage(topic.urlSegment)),
  };
}

export { PASSPORT_LABELS, PASSPORT_STATUS_LABELS, passportLabel };

export function buildCorridorLandingQuickAnswer(topic: NewsTopicConfig, corridor: Corridor): string {
  const programs =
    corridor.programs.length > 0
      ? `Программы коридора: ${corridor.programs.map((p) => p.title_ru).join(", ")}.`
      : null;
  return [
    `${corridor.title_ru} — коридор Emigro для русскоязычных за рубежом и в СНГ с паспортами RU/BY/UA/KZ.`,
    corridor.audience_description_ru,
    topic.focusHintRu,
    programs,
    "Подбор маршрута — wizard коридора или hub wizard /ru/wizard; факты — в справочнике, изменения — в новостях.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildCorridorLandingFaq(topic: NewsTopicConfig, corridor: Corridor): FaqItem[] {
  const programList =
    corridor.programs.length > 0
      ? corridor.programs.map((p) => p.title_ru).join(", ")
      : `программы коридора ${topic.countryRu} в разработке`;

  return [
    {
      question: `Кому подходит коридор ${topic.countryRu} на Emigro?`,
      answer: `${corridor.audience_description_ru} Коридор ориентирован на паспорта RU/BY/UA/KZ и русскоязычную аудиторию — в том числе тех, кто уже живёт за границей.`,
    },
    {
      question: `Я уже живу в ЕС. Подойдёт ли коридор ${topic.countryRu}?`,
      answer: `Wizard и справочник показывают классические маршруты первичной подачи. Если вы уже в Европе, часто актуальны смена основания, переход в ${topic.countryRu}, продление или воссоединение семьи — сверяйте место подачи с официальными источниками или Emigro Assist.`,
    },
    {
      question: `Какие программы ВНЖ есть в ${topic.countryRu}?`,
      answer: `${programList}. Детальные требования, пороги и официальные источники — на страницах программ и в wizard коридора.`,
    },
    {
      question: `Чем коридор ${topic.countryRu} отличается от транзитного хаба?`,
      answer: `EU-коридор Emigro — это маршрут к ВНЖ и гражданству в ${topic.countryRu}: wizard, справочник, программы и новости. Транзитные хабы (Сербия, Армения и др.) — первый шаг на 3–12 месяцев без EU-статуса.`,
    },
    {
      question: `Как подобрать маршрут в ${topic.countryRu}?`,
      answer: `Используйте wizard коридора ${topic.countryRu} или hub wizard /ru/wizard — Emigro сопоставит паспорт, доход, семью и сроки с программами без гарантии одобрения.`,
    },
    {
      question: `Где смотреть изменения законов по ${topic.countryRu}?`,
      answer: `Еженедельные новости Emigro по ${topic.countryRu} с source_links на первоисточники. Справочник коридора — статический intelligence-слой с проверенными фактами.`,
    },
    {
      question: `Это юридическая консультация?`,
      answer:
        "Нет. Emigro — навигатор и справочник. Решения сверяйте с консульством, миграционными службами и лицензированными специалистами.",
    },
  ];
}

export function buildCorridorLandingLlmFacts(topic: NewsTopicConfig, corridor: Corridor): string[] {
  return [
    `Коридор Emigro: ${topic.countryRu} (2026).`,
    corridor.audience_description_ru,
    topic.focusHintRu,
    corridor.programs.length > 0
      ? `Программы: ${corridor.programs.map((p) => p.title_ru).join("; ")}.`
      : "Программы коридора в разработке.",
    "Emigro: hub wizard /ru/wizard и коридорный wizard для подбора маршрута ВНЖ.",
    "Не юридическая консультация — сверяйте с официальными источниками.",
  ];
}

export function buildCorridorLandingAiDescription(topic: NewsTopicConfig, corridor: Corridor): string {
  return [
    buildCorridorLandingQuickAnswer(topic, corridor),
    "Emigro сопоставляет паспорт, доход, семью и сроки с программами ВНЖ без обещания гарантированного статуса.",
  ].join(" ");
}

export function buildCorridorLandingArticleSchema(
  topic: NewsTopicConfig,
  corridor: Corridor,
  url: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: corridor.title_ru,
    description: buildCorridorLandingQuickAnswer(topic, corridor),
    dateModified: corridorDigestLastModified(corridor),
    datePublished: "2026-06-01",
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: schemaImage(`/images/corridor-${topic.urlSegment}.webp`),
    inLanguage: "ru-RU",
  };
}

/** Gold bar for satellite guides: life in-country for week 0 → month 4–6. */

export const SATELLITE_LAUNCH_AUDIENCE = "week0_to_month6" as const;

export const SATELLITE_LAUNCH_BAR = {
  minGuides: 15,
  minGuideWords: 1200,
  targetGuideWords: 1500,
  minBodySections: 6,
  minParserChannels: 3,
  minOfficialLinks: 2,
  minGroupBankSlugs: 15,
  minWebpBytes: 20_000,
  discussionIntervalDays: 3,
  recycleAfterDays: 45,
  minSeoTitleChars: 24,
  maxSeoTitleChars: 58,
  minSeoDescriptionChars: 140,
  maxSeoDescriptionChars: 165,
  minExcerptChars: 80,
  minQuickAnswerChars: 180,
  minTopicTags: 3,
  minFaqSplitAeo: 2,
} as const;

export type SatelliteLaunchPhase = "week0_1" | "month1_3" | "month4_6";

export const SATELLITE_LAUNCH_SLOTS = [
  "first_30_days",
  "tax_id",
  "home_setup",
  "rent",
  "residence_appointment",
  "visa_route",
  "bank",
  "health",
  "districts",
  "transport",
  "schools_family",
  "yellow_pages",
  "consulate_docs",
  "work_ss",
  "local_life",
] as const;

export type SatelliteLaunchSlot = (typeof SATELLITE_LAUNCH_SLOTS)[number];

/** Without these 8 at gold depth the satellite is a visa brochure, not a place to live. */
export const SATELLITE_LAUNCH_CORE_SLOTS = [
  "first_30_days",
  "tax_id",
  "home_setup",
  "rent",
  "residence_appointment",
  "bank",
  "health",
  "districts",
] as const satisfies readonly SatelliteLaunchSlot[];

export type SatelliteLaunchCoreSlot = (typeof SATELLITE_LAUNCH_CORE_SLOTS)[number];

/** Read this Portugal file before writing the slot. Missing = write from official sources, do not clone Spain. */
export const SATELLITE_LAUNCH_CLONE_FROM: Partial<Record<SatelliteLaunchSlot, string>> = {
  first_30_days: "lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist.ts",
  tax_id: "lib/community-notes/guides/nif-porto.ts",
  rent: "lib/community-notes/guides/porto-braga-long-term-rent.ts",
  residence_appointment: "lib/community-notes/guides/aima-agora-zapis.ts",
  visa_route: "lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026.ts",
  bank: "lib/community-notes/guides/portugal-bank-account.ts",
  health: "lib/community-notes/guides/meditsina-norte-healthcare.ts",
  districts: "lib/community-notes/guides/porto-districts-life.ts",
  transport: "lib/community-notes/guides/car-portugal-buy-rent-import.ts",
  schools_family: "lib/community-notes/guides/porto-vs-braga-family-schools.ts",
  yellow_pages: "lib/community-notes/guides/yellow-pages-relocant-portugal.ts",
  consulate_docs: "lib/community-notes/guides/embassy-appointment-booking.ts",
  local_life: "lib/community-notes/guides/norte-climate-comfort.ts",
};

export const SATELLITE_GUIDE_HORIZON_RE = /4\s*[–\-]\s*6\s*мес|к 4[–\-]6|4–6 месяц/i;
export const SATELLITE_GUIDE_NOTA_RE = /Nota Emigro|fact-check|Проверка Emigro/i;

export function satelliteGuideQualityGaps(text: string): string[] {
  const gaps: string[] = [];
  if (!SATELLITE_GUIDE_HORIZON_RE.test(text)) gaps.push("нет горизонта «к 4–6 месяцу»");
  if (!SATELLITE_GUIDE_NOTA_RE.test(text)) gaps.push("нет Nota Emigro / fact-check");
  return gaps;
}

export type SatelliteSeoAeoGuide = {
  seo_title: string;
  seo_description: string;
  excerpt?: string;
  quick_answer: string;
  faq: Array<{ q: string; a: string }>;
  topic_tags?: string[];
  official_links?: Array<{ title: string; url: string }>;
};

const SATELLITE_SEO_GEO_RE: Record<string, RegExp> = {
  spain: /испан|spain|valencia|валенс|madrid|barcelona/i,
  portugal: /португал|portugal|porto|порту|norte|брага|braga|lisboa|лиссабон/i,
};

/** Same-batch SEO + AEO. Empty = pass. Do not ship a guide and «допилить мета» later. */
export function satelliteGuideSeoAeoGaps(
  guide: SatelliteSeoAeoGuide,
  opts: { country: string; city: string; slot?: SatelliteLaunchSlot }
): string[] {
  const gaps: string[] = [];
  const year = String(new Date().getFullYear());
  const title = guide.seo_title.trim();
  const desc = guide.seo_description.trim();
  const qa = guide.quick_answer.replace(/\s+/g, " ").trim();
  const { minSeoTitleChars, maxSeoTitleChars, minSeoDescriptionChars, maxSeoDescriptionChars } =
    SATELLITE_LAUNCH_BAR;

  if (!title.includes(year)) gaps.push(`seo_title без ${year}`);
  if (title.length < minSeoTitleChars || title.length > maxSeoTitleChars) {
    gaps.push(`seo_title length ${title.length} (${minSeoTitleChars}–${maxSeoTitleChars})`);
  }
  if (desc.length < minSeoDescriptionChars || desc.length > maxSeoDescriptionChars) {
    gaps.push(`seo_description length ${desc.length} (${minSeoDescriptionChars}–${maxSeoDescriptionChars})`);
  }

  const geoRe = SATELLITE_SEO_GEO_RE[opts.country] ?? new RegExp(opts.city, "i");
  if (!geoRe.test(`${title} ${desc}`)) {
    gaps.push("SEO без гео города/страны в seo_title + seo_description");
  }

  const excerpt = (guide.excerpt ?? "").replace(/\s+/g, " ").trim();
  if (excerpt.length < SATELLITE_LAUNCH_BAR.minExcerptChars) {
    gaps.push(`excerpt ${excerpt.length} chars < ${SATELLITE_LAUNCH_BAR.minExcerptChars}`);
  } else if (excerpt === desc) {
    gaps.push("excerpt = seo_description (нужен отдельный сниппет, не клон meta)");
  }

  if (qa.length < SATELLITE_LAUNCH_BAR.minQuickAnswerChars) {
    gaps.push(
      `quick_answer ${qa.length} chars < ${SATELLITE_LAUNCH_BAR.minQuickAnswerChars} (AEO snippet для ChatGPT)`
    );
  }

  const tags = guide.topic_tags ?? [];
  if (tags.length < SATELLITE_LAUNCH_BAR.minTopicTags) {
    gaps.push(`topic_tags ${tags.length} < ${SATELLITE_LAUNCH_BAR.minTopicTags}`);
  }

  const httpsLinks = (guide.official_links ?? []).filter((l) => /^https:\/\//i.test(l.url));
  if (httpsLinks.length < SATELLITE_LAUNCH_BAR.minOfficialLinks) {
    gaps.push(`https official_links ${httpsLinks.length} < ${SATELLITE_LAUNCH_BAR.minOfficialLinks}`);
  }

  const faq = guide.faq ?? [];
  if (faq.length < 4) gaps.push(`faq ${faq.length} < 4`);
  const splitFaq = faq.filter((f) => /по правилам/i.test(f.a) && /на практике/i.test(f.a));
  if (splitFaq.length < SATELLITE_LAUNCH_BAR.minFaqSplitAeo) {
    gaps.push(
      `FAQ AEO: ${splitFaq.length} ответов с «По правилам» + «На практике» (нужно ≥${SATELLITE_LAUNCH_BAR.minFaqSplitAeo})`
    );
  }

  if (opts.slot) {
    const meta = SATELLITE_LAUNCH_SLOT_META[opts.slot];
    const hay = `${title} ${desc} ${qa} ${faq.map((f) => `${f.q} ${f.a}`).join(" ")}`.toLowerCase();
    const hits = meta.seoAnyOf.filter((token) => hay.includes(token.toLowerCase()));
    if (hits.length < 1) {
      gaps.push(`SEO/AEO нет токена слота (${meta.seoAnyOf.join(" / ")})`);
    }
  }

  return gaps;
}

export type SatelliteLaunchSlotMeta = {
  phase: SatelliteLaunchPhase;
  lifeSide: string;
  label: string;
  mustAnswer: readonly string[];
  portugalGold: string;
  /** SERP query cheap+Sol must beat in seo_title (substitute {city}). Same batch — not later. */
  primaryQuery: string;
  /** Question an LLM user would ask; quick_answer + FAQ must answer it in the same ship. */
  aeoQuestion: string;
  /** At least one token must appear in title + description + quick_answer + FAQ. */
  seoAnyOf: readonly string[];
};

/** Locked life-coverage map. Missing key → satellite is not gold. */
export const SATELLITE_LAUNCH_SLOT_META: Record<SatelliteLaunchSlot, SatelliteLaunchSlotMeta> = {
  first_30_days: {
    phase: "week0_1",
    lifeSide: "Оркестратор приезда",
    label: "Первые 30 дней — чеклист 0–6 недель",
    mustAnswer: [
      "Что сделать в первые 72 часа и что подождёт до 4-й недели?",
      "В каком порядке: связь → ID → крыша → банк → здоровье → миграция?",
      "Что ломается к 4–6 месяцу, если месяц 1 закрыли «на потом»?",
    ],
    portugalGold: "pervyj-mesyac-portugaliya-checklist",
    primaryQuery: "первые 30 дней {city} 2026",
    aeoQuestion: "Что сделать в первые 30 дней после переезда в {city}?",
    seoAnyOf: ["30 дн", "30 дней", "первых 30", "checklist"],
  },
  tax_id: {
    phase: "week0_1",
    lifeSide: "Документы",
    label: "Налоговый / ID номер в городе-фокусе",
    mustAnswer: [
      "Где и с какими документами получить номер в городе-фокусе?",
      "Нужен ли адрес / представитель / NIE-аналог заранее?",
      "Что без этого номера нельзя сделать в первую неделю?",
    ],
    portugalGold: "nif-porto-kak-poluchit-2026",
    primaryQuery: "NIE NIF {city} 2026",
    aeoQuestion: "Как получить NIE или NIF в {city} и нужен ли адрес заранее?",
    seoAnyOf: ["NIE", "NIF"],
  },
  home_setup: {
    phase: "week0_1",
    lifeSide: "Связь и ЖКХ",
    label: "SIM, интернет, электричество / газ в первые недели",
    mustAnswer: [
      "Как получить номер в день прилёта (eSIM / салон) без полного пакета?",
      "Как подключить домашний интернет и на чьё имя договор?",
      "Электричество / газ / вода: кто открывает, какие депозиты, что будет к 2–3 месяцу?",
    ],
    portugalGold: "vybor-internet-provaydera-portugaliya-2026",
    primaryQuery: "SIM интернет свет {city} 2026",
    aeoQuestion: "Как подключить SIM, интернет и свет в {city} в первую неделю?",
    seoAnyOf: ["SIM", "интернет", "eSIM", "fibra"],
  },
  rent: {
    phase: "week0_1",
    lifeSide: "Жильё",
    label: "Долгая аренда в городе-фокусе",
    mustAnswer: [
      "Как выглядит договор, залог, fiador / гарантия, сроки?",
      "Красные флаги Idealista-класса в городе-фокусе?",
      "Что делать с временным жильём, если к 4–6 месяцу всё ещё short-term?",
    ],
    portugalGold: "arenda-dolgosrok-porto-braga-2026",
    primaryQuery: "аренда {city} Idealista 2026",
    aeoQuestion: "Как снять жильё надолго в {city} без обмана на Idealista?",
    seoAnyOf: ["аренд", "Idealista", "alquiler", "caução", "fianza"],
  },
  residence_appointment: {
    phase: "month1_3",
    lifeSide: "Статус",
    label: "Запись в миграцию (cita / Termin / AIMA)",
    mustAnswer: [
      "Какой портал и какой тип записи для типичного RU-кейса?",
      "Что несут на приём в городе-фокусе, сколько ждут на практике?",
      "Что будет, если слот не взять в первые 1–3 месяца?",
    ],
    portugalGold: "aima-agora-zapis-2026",
    primaryQuery: "cita extranjería AIMA {city} 2026",
    aeoQuestion: "Как записаться на cita / AIMA / Termin в {city}?",
    seoAnyOf: ["cita", "AIMA", "Agora", "TIE", "Termin"],
  },
  visa_route: {
    phase: "month1_3",
    lifeSide: "Статус",
    label: "Главный RU-маршрут (DNV / Blue Card / work) + мифы",
    mustAnswer: [
      "Какой канал подачи: консульство / UGE / миграция — не путать?",
      "Что не считается проживанием (туризм, учёба, если это миф)?",
      "Где полный pillar на www, что сателлит закрывает на практике?",
    ],
    portugalGold: "prodlenie-vnzh-portugaliya-aima-2026",
    primaryQuery: "digital nomad {city} 2026 консульство",
    aeoQuestion: "Куда подавать DNV / D8 / рабочую визу — консульство или UGE?",
    seoAnyOf: ["DNV", "D8", "D7", "UGE", "ВНЖ"],
  },
  bank: {
    phase: "month1_3",
    lifeSide: "Деньги",
    label: "IBAN нерезидента vs Revolut",
    mustAnswer: [
      "Какие банки в городе-фокусе открывают нерезиденту / с каким статусом?",
      "KYC для RU/BY: что приносят, где отказывают?",
      "Чем местный IBAN отличается от Revolut к 4–6 месяцу (зарплата, аренда, налоги)?",
    ],
    portugalGold: "kak-otkryt-bankovskiy-schet-portugalia-2026",
    primaryQuery: "банк IBAN нерезидент {city} 2026",
    aeoQuestion: "Можно ли открыть счёт нерезиденту в {city} и чем IBAN отличается от Revolut?",
    seoAnyOf: ["IBAN"],
  },
  health: {
    phase: "month1_3",
    lifeSide: "Здоровье",
    label: "Медицина / страховка в городе-фокусе",
    mustAnswer: [
      "Как попасть в госсистему (номер, прикрепление, терапевт)?",
      "Что всегда частное (стоматология, очередь) и какая страховка на 1–6 месяц?",
      "Экстренные: куда ехать в городе-фокусе?",
    ],
    portugalGold: "meditsina-norte-sns-chastnaya-stomatologiya-2026",
    primaryQuery: "медицина {city} SIP SNS 2026",
    aeoQuestion: "Как попасть в государственную медицину в {city} — SIP, SNS, utente?",
    seoAnyOf: ["SIP", "SNS", "utente"],
  },
  districts: {
    phase: "month1_3",
    lifeSide: "Где жить",
    label: "Районы города-фокуса (аренда, школы, быт)",
    mustAnswer: [
      "Какие 5–8 районов реально снимают релоканты и чем они отличаются?",
      "Кому куда: соло / пара / школа / тишина / бюджет?",
      "Что бесит к 4–6 месяцу (шум, commute, плесень), чего не видно на просмотре?",
    ],
    portugalGold: "porto-rajony-arenda-shkoly-parki-sport-2026",
    primaryQuery: "районы {city} аренда школы 2026",
    aeoQuestion: "В каком районе {city} снимать жильё под аренду и школы?",
    seoAnyOf: ["район", "distrito", "barrio"],
  },
  transport: {
    phase: "month1_3",
    lifeSide: "Передвижение",
    label: "Городской транспорт + первое авто / права",
    mustAnswer: [
      "Как жить 1–2 месяца без машины (карта, зоны, аэропорт)?",
      "Аренда / покупка / импорт авто: что реально в первые полгода?",
      "Права, штрафы, платные дороги — что ловит новичка?",
    ],
    portugalGold: "mashina-portugaliya-kupit-arenda-import-2026",
    primaryQuery: "транспорт метро {city} 2026",
    aeoQuestion: "Как жить в {city} без машины первые месяцы?",
    seoAnyOf: ["метро", "metro", "транспорт", "авто"],
  },
  schools_family: {
    phase: "month1_3",
    lifeSide: "Семья",
    label: "Школы и семья (даже если гайд «если есть дети»)",
    mustAnswer: [
      "Государственная vs международная школа в городе-фокусе: сроки и документы?",
      "Детский сад / кружки / vacunación — что закрыть в месяц 1–3?",
      "Если детей нет: один честный абзац + ссылка, не выкидывать слот?",
    ],
    portugalGold: "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
    primaryQuery: "школы семья {city} 2026",
    aeoQuestion: "Как устроить ребёнка в школу в {city}?",
    seoAnyOf: ["школ", "семья", "детск"],
  },
  yellow_pages: {
    phase: "month1_3",
    lifeSide: "Сервисы",
    label: "Кто-есть-кто: мастер, юрист, gestoría, клиника",
    mustAnswer: [
      "Кого вызывают в первые полгода (не «лучший адвокат для гражданства»)?",
      "Как отличить нормальный сервис от чат-рекламы?",
      "Что чинить через жёлтые страницы, а что через Assist / официальный портал?",
    ],
    portugalGold: "zheltye-stranitsy-relokanta-portugaliya-2026",
    primaryQuery: "gestoría мастер юрист {city}",
    aeoQuestion: "Кого вызывать в {city} в первые полгода — мастер, юрист, gestoría?",
    seoAnyOf: ["gestor", "жёлт", "сервис", "мастер"],
  },
  consulate_docs: {
    phase: "month4_6",
    lifeSide: "Документы РФ/BY",
    label: "Консульство, паспорт, апостиль",
    mustAnswer: [
      "Как записаться в консульство из города-фокуса и какие сроки?",
      "Замена заграна / доверенности / апостиль: что успеть к 4–6 месяцу?",
      "Что нельзя откладывать до конца года?",
    ],
    portugalGold: "zapis-v-konsulstvo-portugaliya-2026",
    primaryQuery: "консульство паспорт {city} 2026",
    aeoQuestion: "Как записаться в консульство из {city} на паспорт?",
    seoAnyOf: ["консульств", "паспорт", "апостил"],
  },
  work_ss: {
    phase: "month4_6",
    lifeSide: "Работа и взносы",
    label: "NISS / соцстрах, первый договор, налоговый час",
    mustAnswer: [
      "Как получить номер соцстраха / аналог и зачем он к месяцу 4–6?",
      "Первый трудовой / IE / удалёнка: что спрашивают банки и арендодатель?",
      "Когда стартует «налоговый резидент» — не путать с штампом в паспорте?",
    ],
    portugalGold: "social-security-contributions-portugal-risk-2026",
    primaryQuery: "Seguridad Social NISS {city} 2026",
    aeoQuestion: "Как получить номер соцстраха в {city} и когда начинается налоговый час?",
    seoAnyOf: ["NISS", "Seguridad Social", "соцстрах", "autónomo", "взнос"],
  },
  local_life: {
    phase: "month4_6",
    lifeSide: "Ритм жизни",
    label: "Климат, быт, выходные — жизнь к 4–6 месяцу",
    mustAnswer: [
      "Климат жилья: отопление, плесень, кондиционер — что всплывает к первой зиме/лету?",
      "Недельный ритм: магазины, спорт, парки, что закрыто в воскресенье?",
      "Куда ехать на выходные в регионе, не подменяя гайд фестивалями и вином?",
    ],
    portugalGold: "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
    primaryQuery: "климат быт {city} 4-6 месяцев",
    aeoQuestion: "Что всплывает в быту {city} к 4–6 месяцу — климат, плесень, ритм?",
    seoAnyOf: ["климат", "плесен", "быт"],
  },
};

export const SATELLITE_LAUNCH_SLOT_LABELS: Record<SatelliteLaunchSlot, string> = {
  first_30_days: SATELLITE_LAUNCH_SLOT_META.first_30_days.label,
  tax_id: SATELLITE_LAUNCH_SLOT_META.tax_id.label,
  home_setup: SATELLITE_LAUNCH_SLOT_META.home_setup.label,
  rent: SATELLITE_LAUNCH_SLOT_META.rent.label,
  residence_appointment: SATELLITE_LAUNCH_SLOT_META.residence_appointment.label,
  visa_route: SATELLITE_LAUNCH_SLOT_META.visa_route.label,
  bank: SATELLITE_LAUNCH_SLOT_META.bank.label,
  health: SATELLITE_LAUNCH_SLOT_META.health.label,
  districts: SATELLITE_LAUNCH_SLOT_META.districts.label,
  transport: SATELLITE_LAUNCH_SLOT_META.transport.label,
  schools_family: SATELLITE_LAUNCH_SLOT_META.schools_family.label,
  yellow_pages: SATELLITE_LAUNCH_SLOT_META.yellow_pages.label,
  consulate_docs: SATELLITE_LAUNCH_SLOT_META.consulate_docs.label,
  work_ss: SATELLITE_LAUNCH_SLOT_META.work_ss.label,
  local_life: SATELLITE_LAUNCH_SLOT_META.local_life.label,
};

/** Honest mismatches: do not clone these PT slugs as the *topic*, only as length/structure when a file exists. */
export const SATELLITE_LAUNCH_PT_SLOT_CAVEATS: Partial<Record<SatelliteLaunchSlot, string>> = {
  visa_route:
    "У Portugal на сателлите — продление AIMA; D8/D7 живёт на www. Новая страна пишет главный канал въезда, не renewal-клон.",
  home_setup:
    "Эталонный slug — провайдеры интернета. Новый гайд обязан закрыть SIM + свет/газ в том же тексте.",
  work_ss:
    "Эталонный slug — риски взносов, не how-to NISS. Новый гайд — как получить SS/аналог + налоговый час к 4–6 мес.",
  transport:
    "Эталон — авто. Новый гайд начинает с 1–2 месяцев без машины, авто — вторая половина.",
};

/** Portugal has these; a new satellite must not ship them as v1 instead of the 15. */
export const SATELLITE_LAUNCH_DEFER = [
  "покупка квартиры / земли / стройка",
  "фестивали, клубы, вино как отдельные гайды",
  "гражданство 2–5 лет и exam-only (UniPrep, не сателлит)",
  "thin household: возврат товара, разовая новость транспорта, один FAQ",
] as const;

export function satelliteLaunchRequiredFiles(country: string, city: string): string[] {
  return [
    `lib/satellite/${country}.ts`,
    `app/satellite/${country}/page.tsx`,
    `app/satellite/${country}/layout.tsx`,
    `app/satellite/${country}/notes/[slug]/page.tsx`,
    `app/satellite/${country}/tag/[tag]/page.tsx`,
    `app/satellite/${country}/llms/route.ts`,
    `lib/community-notes/guides/${country}-editorial-index.ts`,
    `scripts/${country}-upsert-editorial.ts`,
    `scripts/${country}-community-daily.ts`,
    `scripts/${country}-generate-note-images.ts`,
    `scripts/${country}-post-group-note.ts`,
    `lib/community-notes/${city}-group-bank.json`,
    `lib/community-notes/${city}-group-prompts.ts`,
    `deploy/systemd/emigro-${country}-community.service`,
    `deploy/systemd/emigro-${country}-community.timer`,
  ];
}

export function satelliteLaunchGrepNeedles(
  country: string,
  city: string
): Array<{ file: string; needle: string; label: string }> {
  const cityUpper = city.replace(/-/g, "_").toUpperCase();
  return [
    { file: "lib/satellite/city-chats.ts", needle: `countryKey: "${country}"`, label: "city-chats registry row" },
    { file: "parser/groups.yaml", needle: `country_key: ${country}`, label: "parser channels" },
    { file: "middleware.ts", needle: `/satellite/${country}`, label: "middleware satellite rewrite" },
    { file: "lib/site-url.ts", needle: `${country}.emigro.online`, label: "site-url satellite origin" },
    { file: ".env.example", needle: `EMIGRO_${cityUpper}_CHAT_ID`, label: "env example chat id" },
    { file: "lib/corridor/hub.ts", needle: "hasPractice", label: "corridor hasPractice (manual confirm)" },
    { file: "lib/community-notes/seed.ts", needle: `"${country}"`, label: "SatelliteCountryKey union" },
    {
      file: "lib/satellite/funnel-urls.ts",
      needle: country === "portugal" ? "PORTUGAL_SATELLITE" : `"${country}"`,
      label: "funnel-urls country config",
    },
    { file: "package.json", needle: `"${country}:daily"`, label: "npm daily script" },
    ...(country === "portugal"
      ? []
      : [{ file: "package.json", needle: `"${country}:upsert-editorial"`, label: "npm upsert-editorial script" }]),
    { file: "lib/threads/inventory.ts", needle: country, label: "Threads inventory country" },
    { file: "lib/satellite/city-chat-copy.ts", needle: "Для своих", label: "city chat product pitch" },
    { file: "components/satellite/CityChatPitch.tsx", needle: "CITY_CHAT_PILLARS", label: "CityChatPitch on surfaces" },
    {
      file: `app/satellite/${country}/notes/[slug]/page.tsx`,
      needle: 'data-llm="facts"',
      label: "note AEO data-llm facts",
    },
    {
      file: `app/satellite/${country}/notes/[slug]/page.tsx`,
      needle: 'data-llm="commercial"',
      label: "note AEO data-llm commercial",
    },
    { file: "lib/community-notes/seo-page.ts", needle: "withAiMetadata", label: "note head ai:description" },
  ];
}

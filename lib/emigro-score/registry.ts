import { axis } from "./score";
import type { EmigroCountryScore } from "./types";

const AS_OF = "2026-08-09";

function score(
  countryId: string,
  summary: string,
  values: [number, number, number, number, number],
  whys: [string, string, string, string, string],
  extra?: Partial<Pick<EmigroCountryScore, "validUntil" | "sourceGuide">>
): EmigroCountryScore {
  const ids = ["entry", "status", "banks", "tax", "next"] as const;
  return {
    countryId,
    asOf: AS_OF,
    summary,
    ...extra,
    axes: ids.map((id, i) => axis(id, values[i], whys[i])),
  };
}

/** Editorial Emigro Score registry — RU passport baseline. */
export const EMIGRO_SCORE_REGISTRY: Record<string, EmigroCountryScore> = {
  portugal: score(
    "portugal",
    "Сильный EU-путь при очередях AIMA и KYC банков case-by-case.",
    [60, 70, 60, 60, 90],
    [
      "Шенген/национальная виза; без «лёгкого» безвиза для РФ.",
      "D7/D8 и семья работают, но AIMA и сроки — узкое место.",
      "Счёт возможен, усиленный KYC для РФ.",
      "Спецрежимы менялись (NHR→IFICI); нужен advisor.",
      "Прямой EU-коридор Emigro: гражданство на горизонте.",
    ],
    { sourceGuide: "/ru/guides" }
  ),
  spain: score(
    "spain",
    "DNV и классические ВНЖ сильны; банки и налоги для РФ жёстче.",
    [50, 70, 60, 50, 80],
    [
      "Нацвиза / консульская подача; безвиз Шенген ограничен.",
      "DNV, некоммерческий и работа — реальные маршруты.",
      "Открытие счёта возможно, комплаенс для РФ высокий.",
      "Beckham и IRPF сложны; не путать с «автоматом».",
      "Полный EU-коридор, сильная практика на Emigro.",
    ]
  ),
  france: score(
    "france",
    "Passeport Talent и работа — сильный коридор, вход визовый.",
    [50, 70, 50, 50, 80],
    [
      "Виза обязательна; запись в консульстве — трение.",
      "Talent / salarié — массовые пути при оффере.",
      "Банки для РФ часто отказывают или тянут KYC.",
      "ПНФ прогрессивный; спецрежимы узкие.",
      "EU + натурализация с языком B2 с 2026.",
    ]
  ),
  italy: score(
    "italy",
    "Digital nomad и elective — рабочие, но бюрократия тяжёлая.",
    [50, 60, 50, 60, 80],
    [
      "Нацвиза D; консульская дисперсия по доходам.",
      "DN ~€24.8k+; elective и работа — отдельные треки.",
      "Счета case-by-case; РФ — усиленный due diligence.",
      "Impatriati = база, не «скидка ставки»; нужен commercialista.",
      "EU-коридор с сильной практикой первых 30 дней.",
    ]
  ),
  germany: score(
    "germany",
    "Blue Card и Fachkraft — топ для найма; фриланс сложнее.",
    [50, 80, 50, 50, 90],
    [
      "Нацвиза / работа; безвиз только краткосрочный Шенген.",
      "Blue Card и qualified employment — сильный mass-market.",
      "Банки (N26 и др.) для РФ часто блокируют онboarding.",
      "Прогрессивный налог + соцвзносы; Scheinselbständigkeit риск.",
      "Сильнейший EU-путь при оффере; гражданство ускорилось.",
    ]
  ),
  netherlands: score(
    "netherlands",
    "Highly skilled и DAFT узкие; вход и жильё дорогие.",
    [50, 60, 40, 50, 80],
    [
      "MVV / виза; безвиз не заменяет ВНЖ.",
      "HSM при спонсоре; DAFT и поиск работы — нишевые.",
      "Банковский onboarding для РФ очень жёсткий.",
      "30%/27% ruling не для всех; пороги Belastingdienst.",
      "EU при успешном статусе; жильё — отдельный риск.",
    ]
  ),
  sweden: score(
    "sweden",
    "Работа по офферу сильна; без оффера коридор слабый.",
    [50, 60, 40, 50, 80],
    [
      "Визовый вход; миграция через Migrationsverket.",
      "Work permit при работодателе — основной путь.",
      "Банки для non-EU/РФ часто требуют personnummer сначала.",
      "Высокие налоги; предсказуемо, но дорого.",
      "EU при статусе; язык и климат — барьер интеграции.",
    ]
  ),
  norway: score(
    "norway",
    "Не EU, но сильный work-track; вход только по основанию.",
    [50, 60, 40, 50, 70],
    [
      "Виза/разрешение; безвиз короткий.",
      "Skilled worker — основной mass path.",
      "BankID/счёт завязаны на D-номер — медленно для РФ.",
      "Высокие ставки; прозрачная система.",
      "EEA-близко, но не классический EU-коридор Emigro.",
    ]
  ),
  finland: score(
    "finland",
    "Work и startup возможны; для РФ визовый и KYC-жёсткий вход.",
    [40, 60, 40, 50, 80],
    [
      "Консульский/визовый вход; геополитика усиливает отказ.",
      "Work / specialist — при оффере.",
      "Банки осторожны с РФ.",
      "Прогрессивный налог; предсказуемо.",
      "EU при статусе; сильный соцпакет.",
    ]
  ),
  denmark: score(
    "denmark",
    "Pay Limit / Positive List — при оффере; без него слабо.",
    [50, 60, 40, 50, 80],
    [
      "Виза обязательна для долгосрочного трека.",
      "Зарплатные схемы работают при соответствии порогу.",
      "Банки для РФ — высокий friction.",
      "Высокие налоги, ясная администрация.",
      "EU при ВНЖ; жильё в Копенгагене дорогое.",
    ]
  ),
  serbia: score(
    "serbia",
    "Эталон транзитного хаба: вход, банки, консульства EU.",
    [70, 80, 70, 70, 80],
    [
      "Безвиз 30 дней для РФ; понятная практика.",
      "ВНЖ через работу/компанию отработан на Emigro.",
      "Счета открывают чаще, чем в EU, при документах.",
      "Налоги предсказуемее многих хабов; СИДН смотреть отдельно.",
      "Консульства в Белграде — сильный трамплин в EU.",
    ],
    { sourceGuide: "/ru/guides/vnj-serbiya-dlya-rossiyan-2026" }
  ),
  armenia: score(
    "armenia",
    "Лёгкий вход и ИП IT 1%; EU из Еревана слабый.",
    [70, 70, 80, 80, 60],
    [
      "Безвиз 180 дней/год суммарно; выезд не обнуляет.",
      "ЕАЭС без work permit (RU); UA — чаще ИП→ВНЖ.",
      "Мир/SWIFT: ВТБ Армения и локальные банки доступнее EU.",
      "ИП IT 1% оборота + фикс. взносы — сильный режим.",
      "PT D7/D8 из Еревана обычно нет — Тбилиси/Стамбул.",
    ],
    { sourceGuide: "/ru/guides/armeniya-dlya-rossiyan-2026" }
  ),
  georgia: score(
    "georgia",
    "365 дней безвиза, но work permit и нет СИДН с РФ.",
    [70, 50, 60, 40, 50],
    [
      "Безвиз до 365 дней; страховка ≥30k лари с 2026.",
      "Work permit с 1.03; remote-only — серая зона.",
      "TBC/BOG открывают при регистрации; KYC усилился.",
      "СИДН с РФ нет; 183 дня → резидент GE.",
      "Консульства есть; D7 с одного безвиза чаще нет.",
    ],
    { sourceGuide: "/ru/guides/gruziya-dlya-rossiyan-2026" }
  ),
  kazakhstan: score(
    "kazakhstan",
    "Близкий хаб; пилот РВП 2026 удлинил и удорожил статус.",
    [70, 60, 50, 70, 50],
    [
      "Загран 90/180; внутренний РФ — 30 дней авиа.",
      "Пилот: KAZTEST, 5.7M ₸, спецслужбы — не «ИП за неделю».",
      "Kaspi для быта; SWIFT из РФ часто в стоп-листе.",
      "Упрощёнка ~3% при лимитах; СИДН с РФ есть.",
      "PT D7/D8 из KZ обычно недоступны.",
    ],
    { sourceGuide: "/ru/guides/kazahstan-dlya-rossiyan-2026" }
  ),
  montenegro: score(
    "montenegro",
    "Евро-хаб с визой РФ/BY с 01.11 и sunset nomad.",
    [50, 50, 60, 60, 60],
    [
      "РФ/BY: безвиз до 31.10.2026, далее виза (VFS).",
      "Nomad до окт. 2026; DOO с €5k/год соцвзносов.",
      "CKB/Erste после residence; RU — EDD.",
      "CIT 9%; PIT до 15%; 183 дня — резидентство.",
      "Не EU; PT в Подгорице нет — Белград/Тирана.",
    ],
    {
      sourceGuide: "/ru/guides/chernogoriya-vnj-dlya-rossiyan-2026",
      validUntil: "2026-11-01",
    }
  ),
  uae: score(
    "uae",
    "Ясные визы и 0% PIT; банки для РФ тяжелы, не EU.",
    [70, 70, 50, 80, 60],
    [
      "Tourist/visit и residency-визы по понятным трекам.",
      "Freelance/company residency — рабочие при бюджете.",
      "Счёт часто после Emirates ID; РФ — жёсткий KYC.",
      "0% personal tax при корректном статусе — сильная сторона.",
      "Settle-хаб; Шенген/EU — отдельный маршрут.",
    ],
    { sourceGuide: "/ru/guides/oae-dlya-rossiyan-2026" }
  ),
  thailand: score(
    "thailand",
    "Settle через LTR/Elite/DTV; банки и EU-база слабые.",
    [70, 60, 40, 50, 40],
    [
      "Безвиз РФ 30 дней (двусторонний); не 60-дневная схема 93 стран.",
      "LTR/Elite/DTV — реальные long-stay; border run рискован.",
      "Счёт обычно после long-term visa.",
      "Tax residency 180+; foreign income — отдельная логика.",
      "Страна для жизни, не трамплин в Шенген.",
    ],
    { sourceGuide: "/ru/guides/tailand-dlya-rossiyan-2026" }
  ),
  turkey: score(
    "turkey",
    "Быстрый ikamet и логистика; EU отдельно.",
    [80, 60, 50, 60, 50],
    [
      "Короткий безвиз / e-visa — лёгкий первый въезд.",
      "Ikamet и работа — отработанные, но не EU-ВНЖ.",
      "Банки открывают чаще EU, санкционный комплаенс есть.",
      "Налоги и company setup понятны при advisor.",
      "Settle/транзит; EU-подача — отдельный трек.",
    ],
    { sourceGuide: "/ru/guides/turciya-dlya-rossiyan-2026" }
  ),
  indonesia: score(
    "indonesia",
    "Бали как lifestyle-хаб; визы и банки — трение.",
    [70, 50, 40, 50, 40],
    [
      "Visa on arrival / e-VOA и long-stay варианты — сверять.",
      "KITAS/remote треки есть, но не «лёгкий ВНЖ».",
      "Локальный банк без KITAS сложен.",
      "Tax residency при долгом stay; foreign income — кейс.",
      "Не база для EU-консульств.",
    ],
    { sourceGuide: "/ru/guides/bali-indoneziya-dlya-rossiyan-2026" }
  ),
  "south-africa": score(
    "south-africa",
    "Critical Skills / PR возможны; далеко от EU.",
    [60, 60, 50, 60, 40],
    [
      "Виза по основанию; не безвизный хаб как GE/AM.",
      "Critical Skills и работа — реальный settle-трек.",
      "Банки после статуса; onboarding не мгновенный.",
      "Налоговая система зрелая; DTT смотреть отдельно.",
      "Страна для жизни; Шенген — отдельный проект.",
    ],
    { sourceGuide: "/ru/guides/yuar-dlya-rossiyan-ukraintsev-belorusov-kazahstantsev-2026" }
  ),
};

export function getEmigroScore(countryId: string): EmigroCountryScore | null {
  return EMIGRO_SCORE_REGISTRY[countryId] ?? null;
}

export function listEmigroScoreCountryIds(): string[] {
  return Object.keys(EMIGRO_SCORE_REGISTRY);
}

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
  austria: score(
    "austria",
    "Red-White-Red и работа сильны при оффере; вход визовый, банки жёсткие.",
    [50, 60, 40, 50, 80],
    [
      "Нацвиза / D; безвиз Шенген только краткосрочный.",
      "RWR Card и employment — основной mass path при квалификации.",
      "Банки для РФ — высокий friction и долгое KYC.",
      "Прогрессивный налог; предсказуемо при advisor.",
      "Полноценный EU-коридор при успешном статусе.",
    ]
  ),
  greece: score(
    "greece",
    "DN, FIP и Golden Visa — рабочие треки; налоги и art.5C не путать.",
    [50, 60, 50, 50, 70],
    [
      "Нацвиза / консульская подача для долгосрочных программ.",
      "Digital Nomad, FIP и GV tiers — реальные, но разные аудитории.",
      "Счёт возможен; KYC для РФ case-by-case.",
      "Спецрежим 50% ≠ «7% для всех»; foreign payroll ≠ art.5C.",
      "EU при статусе; сильная практика на Emigro.",
    ],
    { sourceGuide: "/ru/guides/vnj-gretsiya-2026-digital-nomad-fip-golden-visa" }
  ),
  cyprus: score(
    "cyprus",
    "DN квота 500 / макс 3y; Non-Dom силён, Category F в бэклоге.",
    [50, 50, 40, 70, 60],
    [
      "Виза/разрешение; не «лёгкий» безвизный хаб.",
      "DN ограничен квотой и сроком; FIP/Pink Slip — отдельные риски.",
      "Банки после KYC; РФ — усиленный due diligence.",
      "Non-Dom / SDC — сильная налоговая история при корректном статусе.",
      "Вне Шенгена; EU-путь слабее PT/ES, но EU-член.",
    ],
    { sourceGuide: "/ru/guides/vnj-kipr-2026-digital-nomad-fip-non-dom" }
  ),
  hungary: score(
    "hungary",
    "White Card и Guest Investor — узкие, но рабочие; банки осторожны.",
    [50, 60, 40, 60, 70],
    [
      "Виза / подача по программе; безвиз не заменяет ВНЖ.",
      "White Card remote и инвестиционные треки — не для всех бюджетов.",
      "Банковский onboarding для РФ часто тяжёлый.",
      "Спецрежимы (в т.ч. KATA-контекст) менялись — нужен advisor.",
      "EU при статусе; коридор на Emigro развивается.",
    ],
    { sourceGuide: "/ru/guides/vnj-vengriya-2026-white-card-guest-investor" }
  ),
  malta: score(
    "malta",
    "NRP для многих RU/BY недоступен; nomad/MPRP — дорогие ниши.",
    [50, 40, 40, 60, 60],
    [
      "Виза / residence application; не mass безвиз.",
      "Nomad и MPRP узкие; NRP часто закрыт для RU/BY.",
      "Банки строгие; без residence сложно.",
      "Non-Dom / tax — отдельно от ВНЖ; не путать.",
      "EU-член; путь дорогой и селективный.",
    ],
    { sourceGuide: "/ru/guides/vnj-malta-2026-nomad-mprp-non-dom" }
  ),
  bulgaria: score(
    "bulgaria",
    "Type D, DN и EOOD 10% — доступный EU-вход при оффере/бизнесе.",
    [50, 60, 50, 70, 70],
    [
      "Виза D / подача; евро с 2026 упрощает быт.",
      "DN 1+1 и EOOD — рабочие; DN ≠ прямой путь в PR.",
      "Банки открывают чаще «старой» EU-15, но KYC есть.",
      "CIT 10% и предсказуемая админка — плюс для компании.",
      "EU; гражданство долгое, часто с отказом от другого паспорта.",
    ],
    { sourceGuide: "/ru/guides/vnj-bolgariya-2026-type-d-digital-nomad-eood" }
  ),
  croatia: score(
    "croatia",
    "DN с высоким порогом и max 18 мес; 0% на foreign work income.",
    [50, 50, 50, 80, 60],
    [
      "Виза/разрешение после въезда по правилам MUP.",
      "Digital Nomad ≤18 мес + cooling-off; нет PR на DN.",
      "Счета при статусе; комплаенс средний для региона.",
      "0% PIT на foreign work income при nomad — сильный плюс.",
      "EU/Шенген-контекст; DN не трамплин в гражданство.",
    ],
    { sourceGuide: "/ru/guides/vnj-horvatiya-2026-digital-nomad" }
  ),
  slovenia: score(
    "slovenia",
    "DN на 12 мес без продления; s.p./normiranec — отдельный трек.",
    [50, 50, 40, 60, 70],
    [
      "Виза / temporary residence; вход не безвизный хаб.",
      "DN max 12 мес без extend; s.p. — другой маршрут.",
      "Банки для РФ осторожны.",
      "Normiranec и соцвзносы — считать отдельно от «~4%».",
      "EU; семья на DN относительно благоприятна.",
    ],
    { sourceGuide: "/ru/guides/vnj-sloveniya-2026-digital-nomad-sp" }
  ),
  estonia: score(
    "estonia",
    "Для РФ MFA почти блокирует C/D; e-Residency ≠ ВНЖ.",
    [30, 30, 30, 50, 40],
    [
      "Для граждан РФ визы C/D почти недоступны (MFA).",
      "DNV формально есть, но вход для RU на практике закрыт.",
      "Банки/финтех для РФ после 2022 крайне жёсткие.",
      "Корпоративный налог на распределение предсказуем при компании.",
      "EU силён на бумаге; для RU baseline Score низкий честно.",
    ],
    { sourceGuide: "/ru/guides/vnj-estoniya-2026-digital-nomad-e-residency" }
  ),
  poland: score(
    "poland",
    "Работа и карта побыту доступны при оффере; вход визовый.",
    [50, 70, 50, 60, 80],
    [
      "Нацвиза / работа; безвиз Шенген только краткосрочный.",
      "Umowa o pracę / карта побыту — массовый путь при работодателе.",
      "Банки открывают чаще DE/NL, KYC для РФ всё равно есть.",
      "PIT/ZUS предсказуемы; спецрежимы для бизнеса узкие.",
      "Сильный EU-коридор; язык и бюрократия — барьер.",
    ]
  ),
  czechia: score(
    "czechia",
    "Employee Card при оффере; без работы коридор слабее.",
    [50, 60, 50, 50, 70],
    [
      "Виза / long-term; не безвизный хаб.",
      "Employee / Trade License — рабочие при основании.",
      "Банки case-by-case для РФ.",
      "Налоги стандартные EU; без яркого remote-режима.",
      "EU; Прага дорогая, регионы проще по бюджету.",
    ]
  ),
  switzerland: score(
    "switzerland",
    "Очень жёсткий вход и квоты; высокий быт, не EU.",
    [40, 40, 30, 50, 50],
    [
      "Виза/разрешение; квоты B/L для third-country жёсткие.",
      "Работа только с сильным оффером; mass remote почти нет.",
      "Банки для РФ после 2022 часто закрыты.",
      "Кантональные налоги сложны; lump-sum — для узкой аудитории.",
      "Не EU; Шенген есть, но статус дорогой и селективный.",
    ]
  ),
  uk: score(
    "uk",
    "Skilled Worker и др. визы — при оффере; не EU, банки строгие.",
    [40, 50, 40, 50, 40],
    [
      "Виза обязательна; post-Brexit нет «лёгкого» EU-входа.",
      "Skilled Worker / Global Talent — при спонсоре или критерии.",
      "Банки для РФ — высокий отказ/KYC.",
      "Tax residency и NI предсказуемы при advisor.",
      "Не EU; settle возможен, но не трамплин в Шенген-ВНЖ.",
    ]
  ),
};

export function getEmigroScore(countryId: string): EmigroCountryScore | null {
  return EMIGRO_SCORE_REGISTRY[countryId] ?? null;
}

export function listEmigroScoreCountryIds(): string[] {
  return Object.keys(EMIGRO_SCORE_REGISTRY);
}

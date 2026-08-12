import { guidePath } from "@/lib/guides/load";
import { barakhloPromoUrl } from "@/lib/community-notes/sponsor-promo";
import { ORIGIN_HUB_PATH } from "@/lib/seo/corridor-llm-layer";
import { portugalSatelliteUrl, spainSatelliteUrl } from "@/lib/site-url";

export type ClusterLink = {
  href: string;
  label: string;
  description?: string;
  external?: boolean;
};

export type SeoCluster = {
  id: string;
  title: string;
  links: ClusterLink[];
};

/** Narrow internal-linking clusters — PT / ES / FR / GR / PL / EE / CY / CZ / SE / BY / RU corridors. */
export const SEO_CLUSTERS: Record<string, SeoCluster> = {
  russia: {
    id: "russia",
    title: "Граждане России — EU коридоры",
    links: [
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub для россиян",
        description: "PT, ES, DE, FR, IT, NL — пороги, консульства, wizard",
      },
      {
        href: guidePath("kuda-pereehat-iz-rossii-2026-evropa-vnj"),
        label: "Куда переехать из России 2026",
        description: "Pillar-обзор 7 EU-коридоров",
      },
      {
        href: guidePath("otkaz-v-natsionalnoy-vize-konsulstvo-2026"),
        label: "Отказ в национальной визе",
        description: "Консульство, апелляция, повторная подача",
      },
      {
        href: guidePath("oae-dlya-rossiyan-2026"),
        label: "ОАЭ для россиян 2026",
        description: "ВНЖ, Golden Visa, налоги",
      },
      {
        href: guidePath("konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya"),
        label: "Консульская подача RU/BY/KZ",
        description: "Москва, Стамбул, юрисдикция",
      },
      {
        href: guidePath("podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026"),
        label: "Доход из России для ВНЖ",
        description: "Выписки, санкции, типовые ошибки",
      },
      { href: "/ru/wizard", label: "Hub wizard", description: "Подбор маршрута по паспорту и доходу" },
    ],
  },
  portugal: {
    id: "portugal",
    title: "Коридор Португалия",
    links: [
      { href: "/ru/portugal", label: "Коридор Португалия", description: "Программы D8/D7, wizard, новости" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"),
        label: "D8 и D7 Португалия 2026",
        description: "Pillar-гид: €3 680 / €920, AIMA, гражданство",
      },
      {
        href: guidePath("pervye-30-dnej-v-portugalii-2026"),
        label: "Первые 30 дней: NIF, банк, AIMA",
        description: "Чек-лист после прилёта",
      },
      {
        href: portugalSatelliteUrl(),
        label: "Практика — portugal.emigro.online",
        description: "NIF, AIMA, аренда из Telegram-сигналов",
        external: true,
      },
      {
        href: barakhloPromoUrl("cluster_pt", "portugal"),
        label: "Barakhlo · Porto",
        description: "Объявления из русскоязычных чатов",
        external: true,
      },
    ],
  },
  spain: {
    id: "spain",
    title: "Коридор Испания",
    links: [
      { href: "/ru/spain", label: "Коридор Испания", description: "Digital nomad, wizard, новости" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-ispaniya-2026"),
        label: "Digital nomad Испания 2026",
        description: "Pillar-гид: €2 849/мес, teletrabajo, Beckham",
      },
      {
        href: guidePath("pervye-30-dnej-v-ispanii-2026"),
        label: "Первые 30 дней: NIE, TIE",
        description: "Чек-лист после прилёта",
      },
      {
        href: spainSatelliteUrl(),
        label: "Практика — spain.emigro.online",
        description: "NIE, extranjería, аренда Valencia",
        external: true,
      },
      {
        href: barakhloPromoUrl("cluster_es", "spain"),
        label: "Barakhlo · Valencia",
        description: "Объявления из русскоязычных чатов",
        external: true,
      },
    ],
  },
  france: {
    id: "france",
    title: "Коридор Франция",
    links: [
      { href: "/ru/france", label: "Коридор Франция", description: "Passeport Talent, visiteur, wizard" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-frantsiya-2026-passeport-talent"),
        label: "ВНЖ Франция 2026",
        description: "Passeport Talent, VLS-TS, пороги",
      },
      {
        href: guidePath("pervye-30-dnej-v-frantsii-2026"),
        label: "Первые 30 дней во Франции",
        description: "Чек-лист после прилёта",
      },
      { href: "/ru/france/wizard", label: "Wizard Франция", description: "Talent / visiteur / семья" },
    ],
  },
  greece: {
    id: "greece",
    title: "Коридор Греция",
    links: [
      { href: "/ru/greece", label: "Коридор Греция", description: "Digital Nomad, FIP, Golden Visa" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-gretsiya-2026-digital-nomad-fip-golden-visa"),
        label: "ВНЖ Греция 2026",
        description: "DN €3 500, FIP, Golden Visa €250k–€800k",
      },
      {
        href: guidePath("pervye-30-dnej-v-gretsii-2026"),
        label: "Первые 30 дней: AFM, AMKA",
        description: "Чек-лист после прилёта",
      },
      {
        href: "/ru/greece/programs/greece-digital-nomad",
        label: "Digital Nomad Visa",
        description: "Type D до въезда (Law 5275/2026)",
      },
      {
        href: "/ru/greece/programs/greece-fip",
        label: "Financially Independent Person",
        description: "Пассивный доход / FIP",
      },
      {
        href: "/ru/greece/programs/greece-golden-visa",
        label: "Golden Visa",
        description: "Инвестиции в недвижимость",
      },
      {
        href: "/ru/greece/programs/greece-family-reunification",
        label: "Family reunification",
        description: "Воссоединение семьи",
      },
      { href: "/ru/greece/wizard", label: "Wizard Греция", description: "Подбор DN / FIP / GV" },
    ],
  },
  poland: {
    id: "poland",
    title: "Коридор Польша",
    links: [
      { href: "/ru/poland", label: "Коридор Польша", description: "Work permit, Blue Card, B2B IT" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-polsha-2026"),
        label: "ВНЖ Польша 2026",
        description: "Type A, Blue Card, B2B — пороги и сроки",
      },
      {
        href: guidePath("pervye-30-dnej-v-polsche-2026"),
        label: "Первые 30 дней: PESEL, meldunek",
        description: "Чек-лист после прилёта",
      },
      {
        href: guidePath("grazhdanstvo-germaniya-polsha-2026"),
        label: "Гражданство DE и PL 2026",
        description: "StAG, Karta Polaka, двойной паспорт",
      },
      {
        href: barakhloPromoUrl("cluster_pl", "poland"),
        label: "Barakhlo · Warszawa",
        description: "Объявления из русскоязычных чатов",
        external: true,
      },
      { href: "/ru/poland/wizard", label: "Wizard Польша", description: "Подбор work permit / Blue Card" },
    ],
  },
  estonia: {
    id: "estonia",
    title: "Коридор Эстония",
    links: [
      { href: "/ru/estonia", label: "Коридор Эстония", description: "Digital Nomad, e-Residency / OÜ" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-estoniya-2026-digital-nomad-e-residency"),
        label: "Эстония 2026: DNV и e-Residency",
        description: "€4 500/мес; e-Residency ≠ ВНЖ",
      },
      {
        href: "/ru/estonia/programs/estonia-digital-nomad",
        label: "Digital Nomad Visa",
        description: "D до 365 дн., €4 500/мес",
      },
      {
        href: "/ru/estonia/programs/estonia-e-residency-ou",
        label: "e-Residency / OÜ",
        description: "Бизнес-ID без права жить в EE",
      },
      { href: "/ru/estonia/wizard", label: "Wizard Эстония", description: "DNV vs e-Residency" },
    ],
  },
  cyprus: {
    id: "cyprus",
    title: "Коридор Кипр",
    links: [
      { href: "/ru/cyprus", label: "Коридор Кипр", description: "Digital Nomad, Category F, Non-Dom" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-kipr-2026-digital-nomad-fip-non-dom"),
        label: "ВНЖ Кипр 2026",
        description: "DN €3 500, Category F, Non-Dom",
      },
      {
        href: "/ru/cyprus/programs/cyprus-digital-nomad",
        label: "Digital Nomad Visa",
        description: "Net ≥ €3 500/мес, квота",
      },
      {
        href: "/ru/cyprus/programs/cyprus-category-f",
        label: "Category F",
        description: "Пассивный доход от €9 568/год",
      },
      { href: "/ru/cyprus/wizard", label: "Wizard Кипр", description: "DN / Category F / Non-Dom" },
    ],
  },
  czechia: {
    id: "czechia",
    title: "Коридор Чехия",
    links: [
      { href: "/ru/czechia", label: "Коридор Чехия", description: "Employee card, Blue Card, živnost" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-chehiya-2026"),
        label: "ВНЖ Чехия 2026",
        description: "Employee card, Blue Card, živnost IT",
      },
      {
        href: guidePath("pervye-30-dnej-v-chehii-2026"),
        label: "Первые 30 дней в Чехии",
        description: "Чек-лист после прилёта",
      },
      {
        href: "/ru/czechia/programs/czechia-zivnost-freelancer",
        label: "Živnostenský list",
        description: "Фриланс / самозанятость",
      },
      {
        href: "/ru/czechia/programs/czechia-student-visa",
        label: "Студенческий pobyt",
        description: "Studium, средства, жильё",
      },
      { href: "/ru/czechia/wizard", label: "Wizard Чехия", description: "Employee card / živnost" },
    ],
  },
  sweden: {
    id: "sweden",
    title: "Коридор Швеция",
    links: [
      { href: "/ru/sweden", label: "Коридор Швеция", description: "Work permit, Blue Card, семья" },
      {
        href: ORIGIN_HUB_PATH,
        label: "Origin hub — россияне в EU",
        description: "Все коридоры из РФ одной страницей",
      },
      {
        href: guidePath("vnj-shvetsiya-2026-work-permit-grazhdanstvo"),
        label: "ВНЖ Швеция 2026",
        description: "Work permit, Blue Card, гражданство",
      },
      {
        href: "/ru/sweden/programs/sweden-work-permit",
        label: "Work permit",
        description: "Работа по офферу в SE",
      },
      {
        href: "/ru/sweden/programs/sweden-eu-blue-card",
        label: "EU Blue Card",
        description: "Квалифицированная работа",
      },
      { href: "/ru/sweden/wizard", label: "Wizard Швеция", description: "Work permit / Blue Card" },
    ],
  },
  belarus: {
    id: "belarus",
    title: "Белорусы в Европе",
    links: [
      {
        href: guidePath("belorusy-v-evropu-vnj-2026"),
        label: "Белорусы в Европе 2026",
        description: "ВНЖ без temporary protection",
      },
      { href: "/ru/poland", label: "Коридор Польша", description: "Work permit, Blue Card, B2B IT" },
      { href: "/ru/czechia", label: "Коридор Чехия", description: "Employee card, Živnostenský list" },
      {
        href: guidePath("podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026"),
        label: "Доход из РФ для ВНЖ",
        description: "Выписки, санкции, типовые ошибки",
      },
      { href: "/ru/wizard?interest=poland,czechia", label: "Wizard для BY-паспорта", description: "Подбор маршрута ВНЖ" },
    ],
  },
};

/** Comparison guides — cross-links between each other and corridor pillars. */
export const COMPARISON_CROSS_LINKS: Record<string, ClusterLink[]> = {
  "portugaliya-vs-ispaniya-vnj-2026": [
    { href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), label: "D8/D7 Португалия 2026" },
    { href: guidePath("vnj-ispaniya-2026"), label: "Digital nomad Испания 2026" },
    { href: guidePath("digital-nomad-vizy-evropy-sravnenie-2026"), label: "Digital Nomad визы Европы" },
    { href: guidePath("d7-vs-digital-nomad-visa-sravnenie"), label: "D7 vs D8 Португалия" },
  ],
  "digital-nomad-vizy-evropy-sravnenie-2026": [
    { href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), label: "D8 Португалия 2026" },
    { href: guidePath("vnj-ispaniya-2026"), label: "Digital nomad Испания 2026" },
    { href: guidePath("vnj-italiya-2026-digital-nomad"), label: "Digital Nomad Италия 2026" },
    { href: guidePath("portugaliya-vs-ispaniya-vnj-2026"), label: "Португалия vs Испания ВНЖ" },
    { href: guidePath("d7-vs-digital-nomad-visa-sravnenie"), label: "D7 vs D8 Португалия" },
  ],
  "d7-vs-digital-nomad-visa-sravnenie": [
    { href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), label: "D8 и D7 Португалия 2026" },
    { href: guidePath("portugaliya-vs-ispaniya-vnj-2026"), label: "Португалия vs Испания" },
    { href: guidePath("digital-nomad-vizy-evropy-sravnenie-2026"), label: "Digital Nomad визы Европы" },
    { href: "/ru/portugal/programs/portugal-d8-digital-nomad", label: "Программа D8" },
  ],
};

/** Map guide slug → cluster id for sidebar cluster navigation. */
export const GUIDE_CLUSTER_MAP: Record<string, string> = {
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": "russia",
  "vnj-germaniya-2026": "russia",
  "rabota-v-evrope-dlya-rossiyan-2026": "russia",
  "otkaz-v-natsionalnoy-vize-konsulstvo-2026": "russia",
  "oae-dlya-rossiyan-2026": "russia",
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "portugal",
  "pervye-30-dnej-v-portugalii-2026": "portugal",
  "d7-vs-digital-nomad-visa-sravnenie": "portugal",
  "vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026": "portugal",
  "vnj-ispaniya-2026": "spain",
  "pervye-30-dnej-v-ispanii-2026": "spain",
  "vnj-frantsiya-2026-passeport-talent": "france",
  "pervye-30-dnej-v-frantsii-2026": "france",
  "vnj-gretsiya-2026-digital-nomad-fip-golden-visa": "greece",
  "pervye-30-dnej-v-gretsii-2026": "greece",
  "vnj-polsha-2026": "poland",
  "pervye-30-dnej-v-polsche-2026": "poland",
  "grazhdanstvo-germaniya-polsha-2026": "poland",
  "vnj-estoniya-2026-digital-nomad-e-residency": "estonia",
  "vnj-kipr-2026-digital-nomad-fip-non-dom": "cyprus",
  "vnj-chehiya-2026": "czechia",
  "pervye-30-dnej-v-chehii-2026": "czechia",
  "vnj-shvetsiya-2026-work-permit-grazhdanstvo": "sweden",
  "belorusy-v-evropu-vnj-2026": "belarus",
  "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026": "belarus",
  "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya": "belarus",
  "dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost": "belarus",
};

export function getClusterForGuide(slug: string): SeoCluster | undefined {
  const clusterId = GUIDE_CLUSTER_MAP[slug];
  return clusterId ? SEO_CLUSTERS[clusterId] : undefined;
}

export function getComparisonCrossLinks(slug: string): ClusterLink[] {
  return COMPARISON_CROSS_LINKS[slug] ?? [];
}

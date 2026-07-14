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

/** Narrow internal-linking clusters — PT / ES / BY / RU corridors. */
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
    { href: guidePath("digital-nomad-portugaliya-ispaniya-italiya-2026"), label: "DN: PT vs ES vs IT" },
    { href: guidePath("d7-vs-digital-nomad-visa-sravnenie"), label: "D7 vs D8 Португалия" },
  ],
  "digital-nomad-portugaliya-ispaniya-italiya-2026": [
    { href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), label: "D8 Португалия 2026" },
    { href: guidePath("vnj-ispaniya-2026"), label: "Digital nomad Испания 2026" },
    { href: guidePath("portugaliya-vs-ispaniya-vnj-2026"), label: "Португалия vs Испания ВНЖ" },
    { href: guidePath("d7-vs-digital-nomad-visa-sravnenie"), label: "D7 vs D8 Португалия" },
  ],
  "d7-vs-digital-nomad-visa-sravnenie": [
    { href: guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), label: "D8 и D7 Португалия 2026" },
    { href: guidePath("portugaliya-vs-ispaniya-vnj-2026"), label: "Португалия vs Испания" },
    { href: guidePath("digital-nomad-portugaliya-ispaniya-italiya-2026"), label: "DN: PT vs ES vs IT" },
    { href: "/ru/portugal/programs/portugal-d8-digital-nomad", label: "Программа D8" },
  ],
};

/** Map guide slug → cluster id for sidebar cluster navigation. */
export const GUIDE_CLUSTER_MAP: Record<string, string> = {
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": "russia",
  "germaniya-blue-card-chancenkarte-2026-sng": "russia",
  "vnj-germaniya-2026": "russia",
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "portugal",
  "pervye-30-dnej-v-portugalii-2026": "portugal",
  "d7-vs-digital-nomad-visa-sravnenie": "portugal",
  "vnj-ispaniya-2026": "spain",
  "pervye-30-dnej-v-ispanii-2026": "spain",
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

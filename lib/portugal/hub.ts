import { barakhloPromoUrl, BARAKHLO_LISBON_URL } from "@/lib/community-notes/sponsor-promo";
import { getEmigroScore, toEmigroScoreView, type EmigroScoreView } from "@/lib/emigro-score";
import { newsIndexPath } from "@/lib/news/topics";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const PORTUGAL_CORRIDOR_SLUG = "ru-speaking-to-portugal";
export const PORTUGAL_URL_SEGMENT = "portugal";

export type PortugalHubTab = "hub" | "route" | "news" | "digest" | "practice" | "market";
export type PortugalHubLayerId = "route" | "news" | "practice" | "market";

export type PortugalHubTileStats = {
  routeCount: number;
  digestCount: number;
  newsCount: number;
  practiceNotes: number;
  lastNewsLabel: string | null;
};

export type HubTileRating = {
  label: string;
  value: number;
  tone?: "good" | "warn" | "critical" | "neutral";
};

export type HubTileIcon = "compass" | "newspaper" | "sticky" | "shopping";

export type HubTileConfig = {
  id: PortugalHubLayerId;
  href: string;
  external?: boolean;
  image: string;
  imagePosition?: string;
  gradient: string;
  glow: string;
  title: string;
  subtitle: string;
  topLeft: (stats: PortugalHubTileStats) => string;
  topLeftHint?: string;
  topRightIcon: HubTileIcon;
  topRightLabel: string;
  bottomLeft: (stats: PortugalHubTileStats) => string;
  bottomRight: (stats: PortugalHubTileStats) => string;
  ratings: HubTileRating[];
};

/** Serializable tile props for client components (stats resolved on server). */
export type ResolvedHubTile = Omit<HubTileConfig, "topLeft" | "bottomLeft" | "bottomRight"> & {
  topLeft: string;
  bottomLeft: string;
  bottomRight: string;
  emigroScore?: EmigroScoreView;
};

export function resolvePortugalHubTiles(stats: PortugalHubTileStats): ResolvedHubTile[] {
  const emigro = getEmigroScore("portugal");
  const emigroScore = emigro ? toEmigroScoreView(emigro) : undefined;

  return PORTUGAL_HUB_TILES.map(({ topLeft, bottomLeft, bottomRight, ...tile }) => {
    const base = {
      ...tile,
      topLeft: topLeft(stats),
      bottomLeft: bottomLeft(stats),
      bottomRight: bottomRight(stats),
    };
    if (tile.id !== "route" || !emigroScore) return base;
    return {
      ...base,
      topLeft: String(emigroScore.overall100),
      topLeftHint: "Emigro Score",
      ratings: emigroScore.axes.map((a) => ({
        label: a.label,
        value: a.value,
        tone: a.tone,
      })),
      emigroScore,
    };
  });
}

export type PortugalHubNavItem = {
  id: PortugalHubTab;
  label: string;
  href: string;
  external?: boolean;
};

/** Canonical URLs — single source for nav, tiles, intel links, next steps. */
export const portugalHubPaths = {
  landing: "/ru/portugal",
  wizard: "/ru/portugal/wizard",
  digest: "/ru/portugal/digest",
  news: newsIndexPath(PORTUGAL_URL_SEGMENT),
  barakhlo: (utmContent: string) => barakhloPromoUrl(utmContent),
} as const;

/** Canonical Portugal satellite entry (respects PORTUGAL_SATELLITE_USE_SUBDOMAIN). */
export function portugalSatelliteHubUrl(): string {
  return portugalSatelliteUrl("/");
}

export function isPortugalHubTopic(topic: { key?: string; urlSegment?: string }): boolean {
  return topic.urlSegment === PORTUGAL_URL_SEGMENT || topic.key === PORTUGAL_URL_SEGMENT;
}

export function portugalHubNavItems(): PortugalHubNavItem[] {
  return [
    { id: "hub", label: "Обзор", href: portugalHubPaths.landing },
    { id: "route", label: "Маршрут", href: portugalHubPaths.wizard },
    { id: "news", label: "Новости", href: portugalHubPaths.news },
    { id: "digest", label: "Справочник", href: portugalHubPaths.digest },
    { id: "practice", label: "Практика", href: portugalSatelliteHubUrl(), external: true },
    { id: "market", label: "Барахолка", href: portugalHubPaths.barakhlo("hub_nav"), external: true },
  ];
}

export const PORTUGAL_HUB_JOURNEY = [
  {
    step: "Решаю переезжать",
    detail: "Wizard + новости — понять маршрут и что изменилось в законах.",
  },
  {
    step: "Подаю документы",
    detail: "Справочник + program pages — требования, сроки, официальные ссылки.",
  },
  {
    step: "Живу в Португалии",
    detail: "Сателлит + Barakhlo — быт, услуги, объявления от сообщества.",
  },
] as const;

export const PORTUGAL_HUB_TILES: HubTileConfig[] = [
  {
    id: "route",
    href: portugalHubPaths.wizard,
    image: "/images/corridor-portugal.webp",
    imagePosition: "50% 35%",
    gradient: "from-emerald-950/90 via-teal-950/75 to-slate-950/85",
    glow: "from-emerald-400/30 to-transparent",
    title: "Маршрут",
    subtitle: "Portugal",
    topLeft: (s) => String(s.routeCount),
    topLeftHint: "маршрута",
    topRightIcon: "compass",
    topRightLabel: "Wizard",
    bottomLeft: () => "RU · BY · UA · KZ",
    bottomRight: () => "Бесплатно",
    ratings: [],
  },
  {
    id: "news",
    href: portugalHubPaths.news,
    image: "/images/emigro-news-digest-portugal.webp",
    imagePosition: "55% 40%",
    gradient: "from-indigo-950/88 via-blue-950/72 to-slate-950/85",
    glow: "from-sky-400/25 to-transparent",
    title: "Новости",
    subtitle: "Portugal",
    topLeft: (s) => String(s.newsCount || "—"),
    topLeftHint: "выпусков",
    topRightIcon: "newspaper",
    topRightLabel: "Weekly",
    bottomLeft: (s) => (s.lastNewsLabel ? `Обновлено ${s.lastNewsLabel}` : "AIMA · законы"),
    bottomRight: (s) => `${s.digestCount} фактов`,
    ratings: [],
  },
  {
    id: "practice",
    href: portugalSatelliteHubUrl(),
    external: true,
    image: "/images/og/guide-pervye-30-dnej-v-portugalii-2026.jpg",
    imagePosition: "50% 45%",
    gradient: "from-teal-950/88 via-cyan-950/70 to-slate-950/88",
    glow: "from-teal-300/25 to-transparent",
    title: "Практика",
    subtitle: "Lisbon",
    topLeft: (s) => String(s.practiceNotes),
    topLeftHint: "заметок",
    topRightIcon: "sticky",
    topRightLabel: "Live",
    bottomLeft: () => "#aima · #nif · #аренда",
    bottomRight: () => "Community",
    ratings: [],
  },
  {
    id: "market",
    href: portugalHubPaths.barakhlo("hub_tile"),
    external: true,
    image: "/images/corridor-portugal.webp",
    imagePosition: "20% 60%",
    gradient: "from-orange-950/90 via-amber-950/75 to-slate-950/88",
    glow: "from-orange-300/30 to-transparent",
    title: "Barakhlo",
    subtitle: "Lisbon",
    topLeft: () => "0%",
    topLeftHint: "комиссия",
    topRightIcon: "shopping",
    topRightLabel: "Market",
    bottomLeft: () => "мебель · услуги · авто",
    bottomRight: () => "Telegram",
    ratings: [],
  },
];

/** Wizard results — ordered cross-links into hub layers. */
export type PortugalHubNextStep = {
  id: string;
  title: string;
  description: string;
  linkClass: string;
  external: boolean;
  resolveHref: (ctx: { guideHref: string; placement: string }) => string;
};

export const PORTUGAL_HUB_NEXT_STEPS: PortugalHubNextStep[] = [
  {
    id: "news",
    resolveHref: () => portugalHubPaths.news,
    external: false,
    title: "Что изменилось по законам и AIMA →",
    description: "Еженедельный дайджест новостей по Португалии.",
    linkClass: "text-corridor-700",
  },
  {
    id: "digest",
    resolveHref: ({ guideHref }) => guideHref,
    external: false,
    title: "Справочник коридора →",
    description: "Требования, сроки, CIPLE — с официальными источниками.",
    linkClass: "text-corridor-700",
  },
  {
    id: "practice",
    resolveHref: () => portugalSatelliteHubUrl(),
    external: true,
    title: "Практика: NIF, аренда, AIMA",
    description: "Короткие заметки из Telegram-сигналов сообщества.",
    linkClass: "text-teal-800",
  },
  {
    id: "market",
    resolveHref: ({ placement }) => portugalHubPaths.barakhlo(placement),
    external: true,
    title: "Барахолка Лиссабона",
    description: "Мебель, услуги, авто — когда будете на месте.",
    linkClass: "text-orange-800",
  },
];

export { BARAKHLO_LISBON_URL, PORTUGAL_SATELLITE };

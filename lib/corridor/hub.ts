import { barakhloMarketCityLabel } from "@/lib/barakhlo/markets";
import { barakhloPromoUrl } from "@/lib/community-notes/sponsor-promo";
import { countryCardImage } from "@/lib/brand/country-accents";
import { isCorridorFull, topicHasWizard } from "@/lib/corridor/publish";
import { newsIndexPath } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import {
  isPortugalHubTopic,
  portugalSatelliteHubUrl,
  PORTUGAL_URL_SEGMENT,
} from "@/lib/portugal/hub";
import { publicSiteUrl } from "@/lib/site-url";

export type CorridorHubTab = "hub" | "route" | "news" | "digest" | "practice" | "market";
export type CorridorHubLayerId = "route" | "news" | "practice" | "market";

export type CorridorHubTileStats = {
  routeCount: number;
  digestCount: number;
  newsCount: number;
  practiceNotes: number;
  lastNewsLabel: string | null;
};

export type HubTileRating = {
  label: string;
  value: number;
  tone?: "good" | "warn" | "neutral";
};

export type HubTileIcon = "compass" | "newspaper" | "sticky" | "shopping";

export type CorridorHubFeatures = {
  isPortugal: boolean;
  hasWizard: boolean;
  hasNews: boolean;
  hasPractice: boolean;
  hasMarket: boolean;
};

export type ResolvedHubTile = {
  id: CorridorHubLayerId;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
  image: string;
  imagePosition?: string;
  gradient: string;
  glow: string;
  title: string;
  subtitle: string;
  topLeft: string;
  topLeftHint?: string;
  topRightIcon: HubTileIcon;
  topRightLabel: string;
  bottomLeft: string;
  bottomRight: string;
  ratings: HubTileRating[];
  hubLabel: string;
};

export type CorridorHubNavItem = {
  id: CorridorHubTab;
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
};

export function getCorridorHubFeatures(topic: NewsTopicConfig): CorridorHubFeatures {
  const isPortugal = isPortugalHubTopic(topic);
  return {
    isPortugal,
    hasWizard: topicHasWizard(topic),
    hasNews: true,
    hasPractice: isPortugal,
    hasMarket: true,
  };
}

export function corridorHubPaths(topic: NewsTopicConfig) {
  const landing = topic.sitePaths?.landing ?? `/ru/${topic.urlSegment}`;
  return {
    landing,
    wizard: topic.sitePaths?.wizard ?? `${landing}/wizard`,
    digest: topic.sitePaths?.guide ?? `${landing}/digest`,
    news: newsIndexPath(topic.urlSegment),
    barakhlo: (utmContent: string) => barakhloPromoUrl(utmContent, topic.urlSegment),
  };
}

export function corridorHubLabel(topic: NewsTopicConfig): string {
  return `${topic.flag} ${topic.countryRu} Hub`;
}

export function corridorMainSiteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${publicSiteUrl()}${normalized}`;
}

export type CorridorHubNavContext = "corridor" | "satellite";

export function corridorHubNavItems(
  topic: NewsTopicConfig,
  features = getCorridorHubFeatures(topic),
  context: CorridorHubNavContext = "corridor"
): CorridorHubNavItem[] {
  const paths = corridorHubPaths(topic);

  const corridorLink = (path: string): Pick<CorridorHubNavItem, "href" | "external"> => {
    if (context === "satellite") {
      return { href: corridorMainSiteUrl(path), external: true };
    }
    return { href: path };
  };

  return [
    { id: "hub", label: "Обзор", ...corridorLink(paths.landing) },
    features.hasWizard
      ? { id: "route", label: "Маршрут", ...corridorLink(paths.wizard) }
      : { id: "route", label: "Маршрут", href: paths.landing, comingSoon: true },
    { id: "news", label: "Новости", ...corridorLink(paths.news) },
    isCorridorFull(topic.status) && topic.sitePaths?.guide
      ? { id: "digest", label: "Справочник", ...corridorLink(paths.digest) }
      : { id: "digest", label: "Справочник", href: paths.landing, comingSoon: true },
    features.hasPractice
      ? context === "satellite"
        ? { id: "practice", label: "Практика", href: "/" }
        : { id: "practice", label: "Практика", href: portugalSatelliteHubUrl(), external: true }
      : { id: "practice", label: "Практика", href: paths.landing, comingSoon: true },
    features.hasMarket
      ? { id: "market", label: "Барахолка", href: paths.barakhlo("hub_nav"), external: true }
      : { id: "market", label: "Барахолка", href: paths.landing, comingSoon: true },
  ];
}

export function corridorHubJourney(topic: NewsTopicConfig, features = getCorridorHubFeatures(topic)) {
  const country = topic.countryRu;
  const liveStep = features.hasPractice
    ? `Сателлит + Barakhlo — быт, услуги, объявления от сообщества.`
    : `Barakhlo уже работает в вашем городе; практика-слой Emigro для ${country} — скоро.`;

  return [
    {
      step: "Решаю переезжать",
      detail: "Wizard + новости — понять маршрут и что изменилось в законах.",
    },
    {
      step: "Подаю документы",
      detail: "Справочник + program pages — требования, сроки, официальные ссылки.",
    },
    {
      step: `Живу в ${country}`,
      detail: liveStep,
    },
  ] as const;
}

const COMING_SOON_RATINGS: HubTileRating[] = [
  { label: "Покрытие", value: 35, tone: "neutral" },
  { label: "Источники", value: 40, tone: "neutral" },
  { label: "Wizard", value: 30, tone: "neutral" },
  { label: "Сложность", value: 50, tone: "warn" },
  { label: "Assist", value: 45, tone: "neutral" },
];

function newsTileImage(topic: NewsTopicConfig): string {
  if (topic.urlSegment === PORTUGAL_URL_SEGMENT) {
    return "/images/emigro-news-digest-portugal.webp";
  }
  return countryCardImage(topic.urlSegment);
}

function practiceTileImage(topic: NewsTopicConfig): string {
  if (topic.urlSegment === PORTUGAL_URL_SEGMENT) {
    return "/images/og/guide-pervye-30-dnej-v-portugalii-2026.jpg";
  }
  return countryCardImage(topic.urlSegment);
}

export function resolveCorridorHubTiles(
  topic: NewsTopicConfig,
  stats: CorridorHubTileStats,
  features = getCorridorHubFeatures(topic)
): ResolvedHubTile[] {
  const paths = corridorHubPaths(topic);
  const hubLabel = corridorHubLabel(topic);
  const cardImage = countryCardImage(topic.urlSegment);
  const subtitle = topic.countryEn;

  const routeTile: ResolvedHubTile = features.hasWizard
    ? {
        id: "route",
        href: paths.wizard,
        image: cardImage,
        imagePosition: "50% 35%",
        gradient: "from-emerald-950/90 via-teal-950/75 to-slate-950/85",
        glow: "from-emerald-400/30 to-transparent",
        title: "Маршрут",
        subtitle,
        topLeft: String(stats.routeCount),
        topLeftHint: "маршрута",
        topRightIcon: "compass",
        topRightLabel: "Wizard",
        bottomLeft: "RU · BY · UA · KZ",
        bottomRight: "Бесплатно",
        ratings: [
          { label: "Покрытие", value: 88, tone: "good" },
          { label: "Источники", value: 95, tone: "good" },
          { label: "Wizard", value: 90, tone: "good" },
          { label: "Сложность", value: 62, tone: "warn" },
          { label: "Assist", value: 78, tone: "good" },
        ],
        hubLabel,
      }
    : {
        id: "route",
        href: paths.landing,
        comingSoon: true,
        image: cardImage,
        imagePosition: "50% 35%",
        gradient: "from-slate-950/90 via-slate-900/75 to-slate-950/85",
        glow: "from-slate-400/20 to-transparent",
        title: "Маршрут",
        subtitle,
        topLeft: "Скоро",
        topLeftHint: "wizard",
        topRightIcon: "compass",
        topRightLabel: "Wizard",
        bottomLeft: "RU · BY · UA · KZ",
        bottomRight: "Coming soon",
        ratings: COMING_SOON_RATINGS,
        hubLabel,
      };

  const newsTile: ResolvedHubTile = features.hasNews
    ? {
        id: "news",
        href: paths.news,
        image: newsTileImage(topic),
        imagePosition: "55% 40%",
        gradient: "from-indigo-950/88 via-blue-950/72 to-slate-950/85",
        glow: "from-sky-400/25 to-transparent",
        title: "Новости",
        subtitle,
        topLeft: stats.newsCount ? String(stats.newsCount) : "—",
        topLeftHint: "выпусков",
        topRightIcon: "newspaper",
        topRightLabel: "Weekly",
        bottomLeft: stats.lastNewsLabel ? `Обновлено ${stats.lastNewsLabel}` : topic.focusHintRu,
        bottomRight: stats.digestCount ? `${stats.digestCount} фактов` : "дайджест",
        ratings: [
          { label: "Свежесть", value: 92, tone: "good" },
          { label: "Источники", value: 94, tone: "good" },
          { label: "Законы", value: 88, tone: "good" },
          { label: "Справочник", value: stats.digestCount ? 85 : 45, tone: stats.digestCount ? "good" : "neutral" },
          { label: "RU-слой", value: 96, tone: "good" },
        ],
        hubLabel,
      }
    : {
        id: "news",
        href: paths.landing,
        comingSoon: true,
        image: newsTileImage(topic),
        gradient: "from-slate-950/88 via-slate-900/72 to-slate-950/85",
        glow: "from-slate-400/20 to-transparent",
        title: "Новости",
        subtitle,
        topLeft: "Скоро",
        topLeftHint: "weekly",
        topRightIcon: "newspaper",
        topRightLabel: "Weekly",
        bottomLeft: topic.focusHintRu,
        bottomRight: "Coming soon",
        ratings: COMING_SOON_RATINGS,
        hubLabel,
      };

  const practiceTile: ResolvedHubTile = features.hasPractice
    ? {
        id: "practice",
        href: portugalSatelliteHubUrl(),
        external: true,
        image: practiceTileImage(topic),
        imagePosition: "50% 45%",
        gradient: "from-teal-950/88 via-cyan-950/70 to-slate-950/88",
        glow: "from-teal-300/25 to-transparent",
        title: "Практика",
        subtitle: "Lisbon",
        topLeft: String(stats.practiceNotes),
        topLeftHint: "заметок",
        topRightIcon: "sticky",
        topRightLabel: "Live",
        bottomLeft: "#aima · #nif · #аренда",
        bottomRight: "Community",
        ratings: [
          { label: "Практика", value: 90, tone: "good" },
          { label: "Локально", value: 93, tone: "good" },
          { label: "Свежесть", value: 86, tone: "good" },
          { label: "Telegram", value: 91, tone: "good" },
          { label: "Глубина", value: 74, tone: "neutral" },
        ],
        hubLabel,
      }
    : {
        id: "practice",
        href: paths.landing,
        comingSoon: true,
        image: practiceTileImage(topic),
        imagePosition: "50% 45%",
        gradient: "from-slate-950/88 via-slate-900/70 to-slate-950/88",
        glow: "from-slate-400/20 to-transparent",
        title: "Практика",
        subtitle: topic.countryRu,
        topLeft: "Скоро",
        topLeftHint: "community",
        topRightIcon: "sticky",
        topRightLabel: "Live",
        bottomLeft: "NIF · аренда · быт",
        bottomRight: "Coming soon",
        ratings: COMING_SOON_RATINGS,
        hubLabel,
      };

  const marketTile: ResolvedHubTile = {
    id: "market",
    href: paths.barakhlo("hub_tile"),
    external: true,
    image: cardImage,
    imagePosition: "20% 60%",
    gradient: "from-orange-950/90 via-amber-950/75 to-slate-950/88",
    glow: "from-orange-300/30 to-transparent",
    title: "Barakhlo",
    subtitle: barakhloMarketCityLabel(topic.urlSegment),
    topLeft: "0%",
    topLeftHint: "комиссия",
    topRightIcon: "shopping",
    topRightLabel: "Market",
    bottomLeft: "мебель · услуги · авто",
    bottomRight: "Telegram",
    ratings: [
      { label: "Локально", value: 95, tone: "good" },
      { label: "Услуги", value: 88, tone: "good" },
      { label: "Цены", value: 82, tone: "good" },
      { label: "Скорость", value: 90, tone: "good" },
      { label: "RU-чаты", value: 94, tone: "good" },
    ],
    hubLabel,
  };

  return [routeTile, newsTile, practiceTile, marketTile];
}

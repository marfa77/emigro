import { barakhloMarketCityLabel } from "@/lib/barakhlo/markets";
import { barakhloPromoUrl } from "@/lib/community-notes/sponsor-promo";
import { countGuidesForTopic, guidesTopicFilterHref } from "@/lib/guides/corridor-guides";
import { countryCardImage } from "@/lib/brand/country-accents";
import { isCorridorFull, topicHasWizard } from "@/lib/corridor/publish";
import { newsIndexPath } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import {
  isPortugalHubTopic,
  portugalSatelliteHubUrl,
  PORTUGAL_URL_SEGMENT,
} from "@/lib/portugal/hub";
import {
  isSpainHubTopic,
  spainSatelliteHubUrl,
  SPAIN_URL_SEGMENT,
} from "@/lib/spain/hub";
import { publicSiteUrl } from "@/lib/site-url";
import { corridorHubLabel } from "@/lib/corridor/hub-label";
import { getEmigroScore, toEmigroScoreView, type EmigroScoreView } from "@/lib/emigro-score";

export type CorridorHubTab = "hub" | "route" | "news" | "digest" | "practice" | "market";
export type CorridorHubLayerId = "route" | "news" | "guides" | "practice" | "market";

export type CorridorHubTileStats = {
  routeCount: number;
  digestCount: number;
  guideCount: number;
  newsCount: number;
  practiceNotes: number;
  lastNewsLabel: string | null;
};

export type HubTileRating = {
  label: string;
  value: number;
  tone?: "good" | "warn" | "critical" | "neutral";
};

export type HubTileIcon = "compass" | "newspaper" | "book" | "sticky" | "shopping";

export type CorridorHubFeatures = {
  isPortugal: boolean;
  isSpain: boolean;
  hasWizard: boolean;
  hasNews: boolean;
  hasPractice: boolean;
  hasMarket: boolean;
};

function satellitePracticeHubUrl(topic: NewsTopicConfig): string {
  if (isSpainHubTopic(topic)) return spainSatelliteHubUrl();
  return portugalSatelliteHubUrl();
}

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
  /** Country fitness — when set, front shows hero Emigro Score instead of product vanity bars. */
  emigroScore?: EmigroScoreView;
  /** Destination / country card (homepage) vs hub layer tile */
  faceMode?: "layer" | "country";
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
  const isSpain = isSpainHubTopic(topic);
  return {
    isPortugal,
    isSpain,
    hasWizard: topicHasWizard(topic),
    hasNews: true,
    hasPractice: isPortugal || isSpain,
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

export { corridorHubLabel } from "@/lib/corridor/hub-label";

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
        : { id: "practice", label: "Практика", href: satellitePracticeHubUrl(topic), external: true }
      : { id: "practice", label: "Практика", href: paths.landing, comingSoon: true },
    features.hasMarket
      ? { id: "market", label: "Барахолка", href: paths.barakhlo("hub_nav"), external: true }
      : { id: "market", label: "Барахолка", href: paths.landing, comingSoon: true },
  ];
}

export function corridorHubJourney(topic: NewsTopicConfig, features = getCorridorHubFeatures(topic)) {
  const country = topic.countryRu;
  const countryIn = countryLocativeRu(country);
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
      detail: "Гайды + справочник + program pages — требования, сроки, официальные ссылки.",
    },
    {
      step: `Живу в ${countryIn}`,
      detail: liveStep,
    },
  ] as const;
}

function countryLocativeRu(countryRu: string): string {
  const map: Record<string, string> = {
    Португалия: "Португалии",
    Испания: "Испании",
    Германия: "Германии",
    Италия: "Италии",
    Франция: "Франции",
    Нидерланды: "Нидерландах",
    Польша: "Польше",
    Чехия: "Чехии",
    Австрия: "Австрии",
    Греция: "Греции",
    Хорватия: "Хорватии",
    Венгрия: "Венгрии",
    Румыния: "Румынии",
    Болгария: "Болгарии",
    Словакия: "Словакии",
    Словения: "Словении",
    Эстония: "Эстонии",
    Латвия: "Латвии",
    Литва: "Литве",
    Финляндия: "Финляндии",
    Швеция: "Швеции",
    Норвегия: "Норвегии",
    Дания: "Дании",
    Ирландия: "Ирландии",
    Бельгия: "Бельгии",
    Швейцария: "Швейцарии",
    Кипр: "Кипре",
    Мальта: "Мальте",
    Люксембург: "Люксембурге",
  };
  return map[countryRu] ?? countryRu;
}

const COMING_SOON_RATINGS: HubTileRating[] = [];

function scoreForTopic(topic: NewsTopicConfig): EmigroScoreView | undefined {
  const raw = getEmigroScore(topic.urlSegment);
  return raw ? toEmigroScoreView(raw) : undefined;
}

function emigroRatings(view: EmigroScoreView): HubTileRating[] {
  return view.axes.map((a) => ({
    label: a.label,
    value: a.value,
    tone: a.tone,
  }));
}

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
  if (topic.urlSegment === SPAIN_URL_SEGMENT) {
    return "/images/corridor-spain.webp";
  }
  return countryCardImage(topic.urlSegment);
}

function guidesTileImage(topic: NewsTopicConfig): string {
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
  const emigroScore = scoreForTopic(topic);

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
        topLeft: emigroScore ? String(emigroScore.overall100) : String(stats.routeCount),
        topLeftHint: emigroScore ? "Emigro Score" : "маршрута",
        topRightIcon: "compass",
        topRightLabel: "Wizard",
        bottomLeft: "RU · BY · UA · KZ",
        bottomRight: "Бесплатно",
        ratings: emigroScore ? emigroRatings(emigroScore) : COMING_SOON_RATINGS,
        hubLabel,
        emigroScore,
        faceMode: "layer",
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
        topLeft: emigroScore ? String(emigroScore.overall100) : "Скоро",
        topLeftHint: emigroScore ? "Emigro Score" : "wizard",
        topRightIcon: "compass",
        topRightLabel: "Wizard",
        bottomLeft: "RU · BY · UA · KZ",
        bottomRight: "Coming soon",
        ratings: emigroScore ? emigroRatings(emigroScore) : COMING_SOON_RATINGS,
        hubLabel,
        emigroScore,
        faceMode: "layer",
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
        bottomRight: stats.lastNewsLabel ? stats.lastNewsLabel : "еженедельно",
        ratings: [],
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
        ratings: [],
        hubLabel,
      };

  const guidesTile: ResolvedHubTile =
    stats.guideCount > 0 || isCorridorFull(topic.status)
      ? {
          id: "guides",
          href: guidesTopicFilterHref(topic.key),
          image: guidesTileImage(topic),
          imagePosition: "50% 40%",
          gradient: "from-violet-950/88 via-purple-950/72 to-slate-950/85",
          glow: "from-violet-400/25 to-transparent",
          title: "Гайды",
          subtitle: topic.countryRu,
          topLeft: stats.guideCount ? String(stats.guideCount) : "—",
          topLeftHint: "гайдов",
          topRightIcon: "book",
          topRightLabel: "Pillar",
          bottomLeft:
            stats.digestCount > 0
              ? `справочник · ${stats.digestCount} фактов`
              : "D8 · D7 · документы · бюджет",
          bottomRight: "Читать",
          ratings: [],
          hubLabel,
        }
      : {
          id: "guides",
          href: guidesTopicFilterHref(topic.key),
          comingSoon: true,
          image: guidesTileImage(topic),
          imagePosition: "50% 40%",
          gradient: "from-slate-950/88 via-slate-900/72 to-slate-950/85",
          glow: "from-slate-400/20 to-transparent",
          title: "Гайды",
          subtitle: topic.countryRu,
          topLeft: "Скоро",
          topLeftHint: "pillar",
          topRightIcon: "book",
          topRightLabel: "Pillar",
          bottomLeft: "разборы маршрутов",
          bottomRight: "Coming soon",
          ratings: [],
          hubLabel,
        };

  const practiceTile: ResolvedHubTile = features.hasPractice
    ? {
        id: "practice",
        href: satellitePracticeHubUrl(topic),
        external: true,
        image: practiceTileImage(topic),
        imagePosition: "50% 45%",
        gradient: features.isSpain
          ? "from-amber-950/88 via-orange-950/70 to-slate-950/88"
          : "from-teal-950/88 via-cyan-950/70 to-slate-950/88",
        glow: features.isSpain ? "from-amber-300/25 to-transparent" : "from-teal-300/25 to-transparent",
        title: "Практика",
        subtitle: features.isSpain ? "Valencia" : "Lisbon",
        topLeft: String(stats.practiceNotes),
        topLeftHint: "заметок",
        topRightIcon: "sticky",
        topRightLabel: "Live",
        bottomLeft: features.isSpain ? "#nie · #tie · #аренда" : "#aima · #nif · #аренда",
        bottomRight: "Community",
        ratings: [],
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
        ratings: [],
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
    ratings: [],
    hubLabel,
  };

  return [routeTile, newsTile, guidesTile, practiceTile, marketTile];
}

/** One flip tile per country on the homepage — Open links to corridor overview. */
export function resolveCorridorCountryTile(
  topic: NewsTopicConfig,
  stats: CorridorHubTileStats,
  features = getCorridorHubFeatures(topic)
): ResolvedHubTile {
  const paths = corridorHubPaths(topic);
  const hubLabel = corridorHubLabel(topic);
  const cardImage = countryCardImage(topic.urlSegment);
  const [routeTile] = resolveCorridorHubTiles(topic, stats, features);

  const layerCount = [
    features.hasWizard,
    features.hasNews,
    stats.guideCount > 0 || isCorridorFull(topic.status),
    features.hasPractice,
    features.hasMarket,
  ].filter(Boolean).length;

  const emigroScore = scoreForTopic(topic);

  return {
    ...routeTile,
    href: paths.landing,
    comingSoon: undefined,
    title: topic.countryRu,
    subtitle: topic.countryEn,
    topLeft: emigroScore
      ? String(emigroScore.overall100)
      : features.hasWizard
        ? String(stats.routeCount)
        : stats.newsCount
          ? String(stats.newsCount)
          : "—",
    topLeftHint: emigroScore ? "Emigro Score" : features.hasWizard ? "маршрута" : "новостей",
    topRightLabel: features.hasWizard ? "Hub" : "Коридор",
    bottomLeft: emigroScore?.summary ?? topic.focusHintRu,
    bottomRight: `${layerCount} слоя`,
    image: cardImage,
    imagePosition: "50% 35%",
    hubLabel,
    emigroScore,
    faceMode: "country",
    ratings: emigroScore ? emigroRatings(emigroScore) : routeTile.ratings,
  };
}

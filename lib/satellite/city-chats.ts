import { publicSiteUrl, portugalSatelliteUrl, spainSatelliteUrl, italySatelliteUrl } from "@/lib/site-url";

export type SatelliteCityChat = {
  countryKey: string;
  city: string;
  cityRu: string;
  chatTitleRu: string;
  /** Bot /start payload, e.g. porto_chat — site never uses t.me/+. */
  startPayload: string;
  envChatId: string;
  fallbackChatId?: string;
  keywords: readonly string[];
  kicker: string;
  blurb: string;
  featuredNoteSlug?: string;
  featuredNoteLabel?: string;
};

/**
 * Owned private city chats. One per country satellite.
 * Add a row here when launching a satellite — wizard + bot funnel pick it by countryKey.
 */
export const SATELLITE_CITY_CHATS: readonly SatelliteCityChat[] = [
  {
    countryKey: "portugal",
    city: "porto",
    cityRu: "Порту",
    chatTitleRu: "Порту и вокруг",
    startPayload: "porto_chat",
    envChatId: "EMIGRO_PORTO_CHAT_ID",
    fallbackChatId: "-5534913841",
    keywords: ["порту", "porto", "порто"],
    kicker: "Для своих",
    blurb:
      "Для своих в Порту: публикуем важное, общаемся, эксперты отвечают на вопросы. Бот сразу пришлёт ссылку в личку. Документы и AIMA — в Route Check, не стеной в чате.",
    featuredNoteSlug: "nif-porto-kak-poluchit-2026",
    featuredNoteLabel: "NIF в Porto",
  },
  {
    countryKey: "spain",
    city: "valencia",
    cityRu: "Валенсия",
    chatTitleRu: "Валенсия и вокруг",
    startPayload: "valencia_chat",
    envChatId: "EMIGRO_VALENCIA_CHAT_ID",
    fallbackChatId: "-1003941603184",
    keywords: ["валенсия", "valencia"],
    kicker: "Для своих",
    blurb:
      "Для своих в Валенсии: публикуем важное, общаемся, эксперты отвечают на вопросы. Бот пришлёт ссылку в личку. NIE/TIE и cita — в гайдах и Route Check, не стеной в чате.",
    featuredNoteSlug: "nie-empadronamiento-poryadok-2026",
    featuredNoteLabel: "NIE и empadronamiento",
  },
  {
    countryKey: "italy",
    city: "milan",
    cityRu: "Милан",
    chatTitleRu: "Милан и вокруг",
    startPayload: "milan_chat",
    envChatId: "EMIGRO_MILAN_CHAT_ID",
    fallbackChatId: "-1004380721749",
    keywords: ["милан", "milan", "milano", "комо", "como"],
    kicker: "Для своих",
    blurb:
      "Для своих в Милане и вокруг (север, включая Комо): публикуем важное, общаемся, эксперты отвечают на вопросы. Бот пришлёт ссылку в личку. Codice fiscale и permesso — в гайдах и Route Check, не стеной в чате.",
    featuredNoteSlug: "codice-fiscale-milano-2026",
    featuredNoteLabel: "Codice fiscale в Milano",
  },
];

export function cityChatTelegramId(chat: SatelliteCityChat): string | undefined {
  const fromEnv = process.env[chat.envChatId]?.trim();
  return fromEnv || chat.fallbackChatId?.trim() || undefined;
}

export function isCityChatLive(chat: SatelliteCityChat): boolean {
  return Boolean(cityChatTelegramId(chat));
}

export function cityChatForCountry(countryKey: string | undefined | null): SatelliteCityChat | undefined {
  const key = countryKey?.trim().toLowerCase();
  if (!key) return undefined;
  return SATELLITE_CITY_CHATS.find((c) => c.countryKey === key);
}

export function liveCityChatForCountry(countryKey: string | undefined | null): SatelliteCityChat | undefined {
  const chat = cityChatForCountry(countryKey);
  return chat && isCityChatLive(chat) ? chat : undefined;
}

/** Bare /start and /chat without a city — primary live community. */
export function defaultCityChat(): SatelliteCityChat {
  return liveCityChatForCountry("portugal") ?? SATELLITE_CITY_CHATS[0];
}

export function parseCityChatStartPayload(payload: string): SatelliteCityChat | undefined {
  const clean = payload.trim().toLowerCase();
  if (!clean) return undefined;
  for (const chat of SATELLITE_CITY_CHATS) {
    if (clean === chat.city || clean === chat.startPayload) return chat;
    if (clean.startsWith(`${chat.startPayload}_`)) return chat;
  }
  return undefined;
}

export function countryKeyFromCorridorSlug(slug: string | undefined | null): string | undefined {
  const raw = slug?.trim().toLowerCase() ?? "";
  if (!raw) return undefined;
  const m = raw.match(/to-([a-z]+)$/) || raw.match(/^([a-z]+)$/);
  return m?.[1];
}

export function countryKeyFromWizardReport(report: {
  payload?: { pick?: { countrySegment?: string } | null } | null;
  corridorSlug?: string | null;
}): string | undefined {
  const pick = report.payload?.pick?.countrySegment?.trim().toLowerCase();
  if (pick) return pick;
  return countryKeyFromCorridorSlug(report.corridorSlug);
}

export function cityChatForWizardReport(report: {
  payload?: { pick?: { countrySegment?: string } | null } | null;
  corridorSlug?: string | null;
}): SatelliteCityChat | undefined {
  return liveCityChatForCountry(countryKeyFromWizardReport(report));
}

export function matchCityChatKeyword(text: string): SatelliteCityChat | undefined {
  const t = (text || "").trim().toLowerCase();
  if (!t) return undefined;
  for (const chat of SATELLITE_CITY_CHATS) {
    for (const word of chat.keywords) {
      if (t === word || t.includes(`чат ${word}`) || t.includes(`группу ${word}`)) return chat;
    }
  }
  return undefined;
}

export function satelliteUrlForCountry(countryKey: string, path = "/"): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "/";
  if (countryKey === "spain") return spainSatelliteUrl(normalized);
  if (countryKey === "italy") return italySatelliteUrl(normalized);
  if (countryKey === "portugal") return portugalSatelliteUrl(normalized);
  return `${publicSiteUrl()}/satellite/${countryKey}${normalized === "/" ? "" : normalized}`;
}

export function satelliteUrlFromWizard(
  chat: SatelliteCityChat,
  path: string,
  placement: "wizard_hub_results" | "wizard_corridor_results",
  content: string
): string {
  const url = new URL(satelliteUrlForCountry(chat.countryKey, path || "/"));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "wizard");
  url.searchParams.set("utm_campaign", `${chat.countryKey}_practice`);
  url.searchParams.set("utm_placement", placement);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

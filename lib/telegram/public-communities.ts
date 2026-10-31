import type { GuideFrontmatter } from "@/lib/guides/load";
import { getGuideCountryTopicKeys } from "@/lib/guides/guide-display";

export type PublicTelegramCommunityCountry = "portugal" | "spain" | "italy";

export type PublicTelegramCommunityLink = {
  url: string;
  title: string;
  description: string;
  kind: "channel" | "chat";
};

const PORTUGAL_LINKS: readonly PublicTelegramCommunityLink[] = [
  {
    url: "https://t.me/emigro_portugal",
    title: "Новости севера Португалии",
    description: "Канал @emigro_portugal: события, практика и заметки по Norte и Португалии.",
    kind: "channel",
  },
];

const SPAIN_LINKS: readonly PublicTelegramCommunityLink[] = [
  {
    url: "https://t.me/valencia_echat",
    title: "Чат релокантов Валенсия",
    description: "Открытый чат @valencia_echat: быт, NIE/TIE и опыт по Valenciana.",
    kind: "chat",
  },
];

const ITALY_LINKS: readonly PublicTelegramCommunityLink[] = [
  {
    url: "https://t.me/emigro_Italy",
    title: "Новости севера Италии",
    description: "Канал @emigro_Italy: новости и материалы по северу Италии.",
    kind: "channel",
  },
  {
    url: "https://t.me/milan_echat",
    title: "Чат · Милан",
    description: "Чат релокантов в Милане и Lombardia — permesso, быт, встречи.",
    kind: "chat",
  },
  {
    url: "https://t.me/comomercatino",
    title: "Барахолка · Комо",
    description: "Como. Mercatino delle pulci @comomercatino — buy & sell у озера Комо.",
    kind: "chat",
  },
];

export const PUBLIC_TELEGRAM_COMMUNITY_COUNTRIES: readonly PublicTelegramCommunityCountry[] = [
  "portugal",
  "spain",
  "italy",
];

export function isPublicTelegramCommunityCountry(
  key: string | undefined | null,
): key is PublicTelegramCommunityCountry {
  const normalized = key?.trim().toLowerCase();
  return normalized === "portugal" || normalized === "spain" || normalized === "italy";
}

export function publicTelegramLinksForCountry(
  countryKey: PublicTelegramCommunityCountry,
): readonly PublicTelegramCommunityLink[] {
  if (countryKey === "portugal") return PORTUGAL_LINKS;
  if (countryKey === "spain") return SPAIN_LINKS;
  return ITALY_LINKS;
}

/** All distinct public community links (five entries) for the directory page. */
export function allPublicTelegramCommunityLinks(): PublicTelegramCommunityLink[] {
  return [...PORTUGAL_LINKS, ...SPAIN_LINKS, ...ITALY_LINKS];
}

const STORY_COUNTRY_TO_KEY: Record<string, PublicTelegramCommunityCountry> = {
  португалия: "portugal",
  portugal: "portugal",
  испания: "spain",
  spain: "spain",
  италия: "italy",
  italy: "italy",
};

export function publicTelegramCountryFromStoryCountry(country: string | undefined): PublicTelegramCommunityCountry | undefined {
  const key = country?.trim().toLowerCase();
  if (!key) return undefined;
  return STORY_COUNTRY_TO_KEY[key];
}

export function resolvePublicTelegramCountryFromGuide(
  guide: Pick<GuideFrontmatter, "slug" | "tags" | "topic_keys" | "primary_intent">,
): PublicTelegramCommunityCountry | undefined {
  const countries = getGuideCountryTopicKeys(guide.topic_keys);
  const supported = countries.filter(isPublicTelegramCommunityCountry);
  if (supported.length === 1) return supported[0];

  const slug = guide.slug.toLowerCase();
  if (slug.includes("portugal") || slug.startsWith("pt-")) return "portugal";
  if (slug.includes("spain") || slug.includes("ispania") || slug.startsWith("es-")) return "spain";
  if (slug.includes("italy") || slug.includes("italia") || slug.startsWith("it-")) return "italy";

  const hay = [...(guide.tags ?? []), ...(guide.topic_keys ?? [])].join(" ").toLowerCase();
  if (/португал|portugal|aima|d7|d8|ciple/.test(hay) && !/испан|spain|ital/.test(hay)) return "portugal";
  if (/испан|spain|valencia|nie|extranjer/.test(hay) && !/ital/.test(hay)) return "spain";
  if (/итал|italy|milano|como|permesso/.test(hay)) return "italy";

  return undefined;
}

export function publicTelegramCountryLabel(countryKey: PublicTelegramCommunityCountry): string {
  const labels: Record<PublicTelegramCommunityCountry, string> = {
    portugal: "Португалия",
    spain: "Испания",
    italy: "Италия",
  };
  return labels[countryKey];
}

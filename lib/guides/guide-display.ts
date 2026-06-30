import type { GuideFrontmatter } from "@/lib/guides/load";
import { getGuideAudiences } from "@/lib/guides/categories";
import { corridorSlugToTopicKey, filterCorridorSlugsForGuideTopics } from "@/lib/guides/corridor-live-data";
import { findFirstProviderTopicKey } from "@/lib/providers/registry";

export const GENERIC_GUIDE_TOPIC_KEYS = new Set([
  "relocation",
  "transit",
  "visa",
  "work",
  "vnj",
  "europe",
  "ees",
  "schengen",
  "border-control",
  "entry-exit",
  "consulate",
  "banks",
  "business",
  "ip",
  "ip-paushal",
  "documents",
  "apostille",
  "funds",
  "income",
  "citizenship",
  "legalization",
  "study",
  "checklist",
  "arrival",
  "investment",
  "digital-nomad",
  "digital nomad",
]);

export const EU_COUNTRY_TOPIC_KEYS = new Set([
  "portugal",
  "spain",
  "france",
  "italy",
  "germany",
  "netherlands",
  "scandinavia",
  "poland",
  "czechia",
  "austria",
]);

export function specificGuideTopicKeys(topicKeys?: string[]): Set<string> {
  return new Set((topicKeys ?? []).filter((key) => !GENERIC_GUIDE_TOPIC_KEYS.has(key)));
}

export function getGuideCountryTopicKeys(topicKeys?: string[]): string[] {
  return (topicKeys ?? []).filter((key) => EU_COUNTRY_TOPIC_KEYS.has(key));
}

export function firstCountryTopicKeyForWizardInterest(topicKeys?: string[]): string | undefined {
  const countries = getGuideCountryTopicKeys(topicKeys);
  if (countries.length > 0) return countries[0];
  for (const key of topicKeys ?? []) {
    if (!GENERIC_GUIDE_TOPIC_KEYS.has(key)) return key;
  }
  return undefined;
}

export function isMultiCountryGuide(guide: Pick<GuideFrontmatter, "topic_keys" | "primary_intent">): boolean {
  if (guide.primary_intent === "comparison") return true;
  return getGuideCountryTopicKeys(guide.topic_keys).length > 1;
}

export function shouldShowGuideProviders(
  guide: Pick<GuideFrontmatter, "topic_keys" | "corridor_slugs" | "primary_intent">,
): boolean {
  if (isMultiCountryGuide(guide)) return false;
  const countries = getGuideCountryTopicKeys(guide.topic_keys);
  if (countries.length !== 1) return false;
  const corridors = filterCorridorSlugsForGuideTopics(guide.corridor_slugs, guide.topic_keys);
  return corridors.length === 1;
}

export function getGuideProviderTopicKey(
  guide: Pick<GuideFrontmatter, "topic_keys" | "corridor_slugs" | "primary_intent">,
): string | undefined {
  if (!shouldShowGuideProviders(guide)) return undefined;
  const country = getGuideCountryTopicKeys(guide.topic_keys)[0];
  return country && findFirstProviderTopicKey([country]) ? country : undefined;
}

export type GuidePassportIso2 = "RU" | "UA" | "BY" | "KZ";

export function getGuidePassportIso2(
  guide: Pick<GuideFrontmatter, "slug" | "tags" | "topic_keys">,
): GuidePassportIso2 {
  const topicKeys = (guide.topic_keys ?? []).map((k) => k.toLowerCase());
  if (topicKeys.includes("ukraine")) return "UA";
  if (topicKeys.includes("kazakhstan")) return "KZ";

  const slug = guide.slug.toLowerCase();
  const tags = (guide.tags ?? []).map((t) => t.toLowerCase());
  if (slug.includes("belorus") || tags.some((t) => t.includes("беларус"))) return "BY";

  const audiences = getGuideAudiences(guide as GuideFrontmatter);
  if (audiences.includes("ua")) return "UA";
  if (audiences.includes("by_kz") && !audiences.includes("ru")) return "BY";

  return "RU";
}

export function passportColumnLabel(iso2: GuidePassportIso2): string {
  const labels: Record<GuidePassportIso2, string> = {
    RU: "RU-паспорт",
    UA: "UA-паспорт",
    BY: "BY-паспорт",
    KZ: "KZ-паспорт",
  };
  return labels[iso2];
}

export function usesNeutralGuideCover(
  guide: Pick<GuideFrontmatter, "topic_keys" | "primary_intent">,
): boolean {
  return isMultiCountryGuide(guide);
}

/** Corridor wizard card copy — avoid Portugal-only D7/D8 on other corridors. */
export function corridorWizardBlurb(urlSegment: string): string {
  const blurbs: Record<string, string> = {
    portugal: "D8, D7, воссоединение — wizard сопоставит профиль с требованиями.",
    spain: "Digital nomad, non-lucrative, семья — wizard сопоставит профиль с требованиями.",
    france: "Passeport Talent, visiteur, семья — wizard сопоставит профиль с требованиями.",
    italy: "Digital nomad, elective residency, семья — wizard сопоставит профиль с требованиями.",
    germany: "Blue Card, Chancenkarte, семья — wizard сопоставит профиль с требованиями.",
    netherlands: "Highly Skilled Migrant, startup, семья — wizard сопоставит профиль с требованиями.",
    scandinavia: "Work permit, семья — wizard сопоставит профиль с требованиями.",
    poland: "Blue Card, work permit, семья — wizard сопоставит профиль с требованиями.",
    czechia: "Employee card, Blue Card, семья — wizard сопоставит профиль с требованиями.",
    austria: "RWR card, Blue Card, семья — wizard сопоставит профиль с требованиями.",
  };
  return blurbs[urlSegment] ?? "Wizard сопоставит ваш профиль с программами ВНЖ коридора.";
}

export function orderedGuideCorridorSlugs(
  corridorSlugs?: string[],
  topicKeys?: string[],
): string[] {
  const filtered = filterCorridorSlugsForGuideTopics(corridorSlugs, topicKeys);
  if (!topicKeys?.length || filtered.length <= 1) return filtered;
  return [...filtered].sort((a, b) => {
    const ai = topicKeys.indexOf(corridorSlugToTopicKey(a));
    const bi = topicKeys.indexOf(corridorSlugToTopicKey(b));
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

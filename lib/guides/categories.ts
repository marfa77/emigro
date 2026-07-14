import type { LucideIcon } from "lucide-react";
import { Compass, FileText, GitCompare, MapPin, Plane, Users, Wallet } from "lucide-react";
import type { GuideFrontmatter } from "@/lib/guides/types";

export type GuideCategoryId =
  | "countries"
  | "transit"
  | "finance"
  | "documents"
  | "family"
  | "comparison"
  | "general";

export type GuideAudienceId = "ru" | "ua" | "by_kz";

export type GuideCategory = {
  id: GuideCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type GuideAudience = {
  id: GuideAudienceId;
  label: string;
  flag: string;
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "countries",
    label: "Страны и ВНЖ",
    description: "Маршруты ВНЖ и программы по конкретным странам ЕС.",
    icon: MapPin,
  },
  {
    id: "transit",
    label: "Транзитные хабы",
    description: "Сербия, Грузия, Армения и другие хабы до переезда в Европу.",
    icon: Plane,
  },
  {
    id: "finance",
    label: "Финансы и налоги",
    description: "Доход, банки, ИП, бюджет и налоги при релокации.",
    icon: Wallet,
  },
  {
    id: "documents",
    label: "Документы",
    description: "Апостиль, консульства, отказы и легализация статуса.",
    icon: FileText,
  },
  {
    id: "family",
    label: "Семья и учёба",
    description: "Дети, воссоединение семьи и учебные визы.",
    icon: Users,
  },
  {
    id: "comparison",
    label: "Сравнения",
    description: "Сравнительные разборы маршрутов и программ.",
    icon: GitCompare,
  },
  {
    id: "general",
    label: "Общие маршруты",
    description: "Обзорные гайды и стартовые маршруты без узкой темы.",
    icon: Compass,
  },
];

const TRANSIT_TOPIC_KEYS = [
  "serbia",
  "georgia",
  "armenia",
  "uae",
  "thailand",
  "montenegro",
  "kazakhstan",
  "indonesia",
] as const;

const TRANSIT_SLUG_FRAGMENTS = [
  "serbiya",
  "gruziya",
  "armeniya",
  "oae",
  "tailand",
  "turciya",
  "chernogoriya",
  "kazahstan",
  "bali-indoneziya",
  "indoneziya",
] as const;

const FINANCE_NEEDLES = ["nalogi", "bank", "ip", "dohod", "byudzhet", "bank-i-iban"] as const;

const DOCUMENT_NEEDLES = ["dokumenty", "apostil", "konsul", "otkaz", "legaliz"] as const;

const FAMILY_NEEDLES = ["deti", "semya", "vossoedinenie", "uchebn"] as const;

const CATEGORY_ORDER = GUIDE_CATEGORIES.map((category) => category.id);

export function isGuideCategoryId(value: string): value is GuideCategoryId {
  return CATEGORY_ORDER.includes(value as GuideCategoryId);
}

export const GUIDE_AUDIENCES: GuideAudience[] = [
  { id: "ru", label: "Граждане РФ", flag: "🇷🇺" },
  { id: "ua", label: "Граждане Украины", flag: "🇺🇦" },
  { id: "by_kz", label: "Беларусь и КЗ", flag: "🇧🇾🇰🇿" },
];

export function isGuideAudienceId(value: string): value is GuideAudienceId {
  return GUIDE_AUDIENCES.some((a) => a.id === value);
}

export function getGuideAudiences(guide: GuideFrontmatter): GuideAudienceId[] {
  const audiences = new Set<GuideAudienceId>();
  const slug = guide.slug.toLowerCase();
  const tags = (guide.tags ?? []).map((t) => t.toLowerCase());
  const topicKeys = (guide.topic_keys ?? []).map((k) => k.toLowerCase());

  if (
    tags.some((t) => t === "рф" || t === "россия") ||
    slug.includes("rossiyan") ||
    slug.includes("dlya-rossiyan")
  ) {
    audiences.add("ru");
  }

  if (
    tags.some((t) => t === "украина" || t === "ukraine" || t === "ua") ||
    topicKeys.includes("ukraine") ||
    slug.includes("ukrain")
  ) {
    audiences.add("ua");
  }

  if (tags.some((t) => t === "беларусь" || t === "казахстан" || t === "by" || t === "kz")) {
    audiences.add("by_kz");
  }

  return Array.from(audiences);
}

export function getGuideAudienceById(id: GuideAudienceId): GuideAudience {
  return GUIDE_AUDIENCES.find((a) => a.id === id)!;
}

export function getGuideCategoryById(id: GuideCategoryId): GuideCategory {
  return GUIDE_CATEGORIES.find((category) => category.id === id)!;
}

function matchesNeedles(value: string, needles: readonly string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function guideHaystack(guide: GuideFrontmatter): {
  slug: string;
  title: string;
  tags: string[];
  topicKeys: string[];
} {
  return {
    slug: guide.slug.toLowerCase(),
    title: guide.title.toLowerCase(),
    tags: (guide.tags ?? []).map((tag) => tag.toLowerCase()),
    topicKeys: (guide.topic_keys ?? []).map((key) => key.toLowerCase()),
  };
}

export function getGuideCategories(guide: GuideFrontmatter): GuideCategoryId[] {
  const categories = new Set<GuideCategoryId>();
  const { slug, title, tags, topicKeys } = guideHaystack(guide);

  if ((guide.corridor_slugs?.length ?? 0) > 0 || slug.includes("vnj") || slug.includes("grazhdanstvo") || title.includes("внж") || title.includes("гражданств")) {
    categories.add("countries");
  }

  if (
    topicKeys.some((key) => TRANSIT_TOPIC_KEYS.includes(key as (typeof TRANSIT_TOPIC_KEYS)[number])) ||
    tags.some((tag) => TRANSIT_TOPIC_KEYS.some((key) => tag.includes(key))) ||
    TRANSIT_SLUG_FRAGMENTS.some((fragment) => slug.includes(fragment))
  ) {
    categories.add("transit");
  }

  if (matchesNeedles(slug, FINANCE_NEEDLES) || tags.some((tag) => matchesNeedles(tag, FINANCE_NEEDLES))) {
    categories.add("finance");
  }

  if (matchesNeedles(slug, DOCUMENT_NEEDLES) || tags.some((tag) => matchesNeedles(tag, DOCUMENT_NEEDLES))) {
    categories.add("documents");
  }

  if (matchesNeedles(slug, FAMILY_NEEDLES) || tags.some((tag) => matchesNeedles(tag, FAMILY_NEEDLES))) {
    categories.add("family");
  }

  if (
    guide.primary_intent === "comparison" ||
    slug.includes("vs") ||
    slug.includes("sravnenie") ||
    slug.includes("investitsionnyy") ||
    topicKeys.includes("investment")
  ) {
    categories.add("comparison");
  }

  if (categories.size === 0) {
    categories.add("general");
  }

  return CATEGORY_ORDER.filter((id) => categories.has(id));
}

export function groupGuidesByCategory(guides: GuideFrontmatter[]): Map<GuideCategoryId, GuideFrontmatter[]> {
  const grouped = new Map<GuideCategoryId, GuideFrontmatter[]>(
    CATEGORY_ORDER.map((id) => [id, []]),
  );

  for (const guide of guides) {
    for (const categoryId of getGuideCategories(guide)) {
      grouped.get(categoryId)!.push(guide);
    }
  }

  return grouped;
}

function guideSortDate(guide: GuideFrontmatter): number {
  const value = guide.date_modified ?? guide.date_published;
  return value ? new Date(value).getTime() : 0;
}

const FEATURED_GUIDE_SLUG_PRIORITY = [
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  "pervye-30-dnej-v-portugalii-2026",
  "kuda-pereehat-iz-rossii-2026-evropa-vnj",
  "belorusy-v-evropu-vnj-2026",
  "vnj-ispaniya-2026",
] as const;

export function pickFeaturedGuide(guides: GuideFrontmatter[]): GuideFrontmatter | null {
  if (guides.length === 0) return null;

  for (const slug of FEATURED_GUIDE_SLUG_PRIORITY) {
    const match = guides.find((guide) => guide.slug === slug);
    if (match) return match;
  }

  const generalGuides = guides.filter((guide) => getGuideCategories(guide).includes("general"));
  const pool = generalGuides.length > 0 ? generalGuides : guides;

  return [...pool].sort((a, b) => guideSortDate(b) - guideSortDate(a))[0];
}

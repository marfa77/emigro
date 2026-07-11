export type ContentKind = "news" | "lifehack" | "tip" | "guide" | "qa";

export const CONTENT_KIND_LABELS: Record<ContentKind, string> = {
  news: "Новости",
  lifehack: "Лайфхак",
  tip: "Совет",
  guide: "Гайд",
  qa: "Вопрос–ответ",
};

export const CONTENT_KIND_EMOJI: Record<ContentKind, string> = {
  news: "📰",
  lifehack: "⚡",
  tip: "💡",
  guide: "📋",
  qa: "❓",
};

/** Curated navigation tags (shown first on hub). */
export const FEATURED_HASHTAGS = [
  "nif",
  "aima",
  "arenda",
  "bank",
  "sns",
  "лайфхак",
  "совет",
  "новости",
  "транспорт",
  "auto",
  "imt",
  "sim",
  "школа",
  "porto",
  "lisboa",
] as const;

export const SPAIN_FEATURED_HASHTAGS = [
  "nie",
  "tie",
  "extranjeria",
  "arenda",
  "bank",
  "valencia",
  "madrid",
  "barcelona",
  "лайфхак",
  "совет",
  "новости",
  "транспорт",
  "auto",
  "sim",
] as const;

export function featuredHashtagsForCountry(countryKey: "portugal" | "spain" = "portugal"): readonly string[] {
  return countryKey === "spain" ? SPAIN_FEATURED_HASHTAGS : FEATURED_HASHTAGS;
}

export const HASHTAG_LABELS: Record<string, string> = {
  nif: "NIF",
  aima: "AIMA",
  arenda: "Аренда",
  bank: "Банк",
  банк: "Банк",
  sns: "SNS",
  ciple: "CIPLE",
  lifehack: "Лайфхак",
  лайфхак: "Лайфхак",
  tip: "Совет",
  совет: "Совет",
  news: "Новости",
  новости: "Новости",
  guide: "Гайд",
  гайд: "Гайд",
  qa: "Q&A",
  transport: "Транспорт",
  транспорт: "Транспорт",
  auto: "Авто",
  imt: "IMT",
  водительские: "Права",
  sim: "SIM",
  school: "Школа",
  школа: "Школа",
  food: "Еда",
  еда: "Еда",
  pets: "Питомцы",
  portugal: "Португалия",
  porto: "Порту",
  norte: "Norte",
  braga: "Брага",
  lisboa: "Лиссабон",
  lisbon: "Лиссабон",
  nie: "NIE",
  tie: "TIE",
  extranjeria: "Extranjería",
  valencia: "Валенсия",
  madrid: "Мадрид",
  barcelona: "Барселона",
};

export function normalizeHashtag(raw: string): string {
  return raw.replace(/^#/, "").trim().toLowerCase().replace(/\s+/g, "-");
}

export function hashtagLabel(tag: string): string {
  const key = normalizeHashtag(tag);
  return HASHTAG_LABELS[key] ?? key.replace(/-/g, " ");
}

export function hashtagHref(tag: string): string {
  return `/tag/${encodeURIComponent(normalizeHashtag(tag))}`;
}

const KIND_TAG: Record<ContentKind, string> = {
  news: "новости",
  lifehack: "лайфхак",
  tip: "совет",
  guide: "гайд",
  qa: "вопрос",
};

/** English content_kind aliases — never store alongside Russian kind tag. */
const KIND_ALIASES = new Set(["news", "lifehack", "tip", "guide", "qa", "новости", "лайфхак", "совет", "гайд", "вопрос"]);

/** Geo tags belong in page header, not in every card pill list. */
const GEO_TAGS = new Set([
  "portugal",
  "porto",
  "norte",
  "braga",
  "lisboa",
  "lisbon",
  "spain",
  "valencia",
  "madrid",
  "barcelona",
]);

/** Merge topic hints + content kind + inline #tags into deduped list. */
export function buildNoteHashtags(input: {
  topicTags?: string[];
  contentKind?: ContentKind;
  extra?: string[];
}): string[] {
  const set = new Set<string>();

  for (const t of input.topicTags ?? []) {
    const key = normalizeHashtag(t);
    if (key && !GEO_TAGS.has(key) && !KIND_ALIASES.has(key)) set.add(key);
  }

  for (const t of input.extra ?? []) {
    const key = normalizeHashtag(t);
    if (key && !GEO_TAGS.has(key) && !KIND_ALIASES.has(key)) set.add(key);
  }

  if (input.contentKind) set.add(KIND_TAG[input.contentKind]);

  set.delete("");
  return Array.from(set).slice(0, 8);
}

export function collectHashtagCounts(notes: Array<{ hashtags: string[] }>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.hashtags ?? []) {
      const key = normalizeHashtag(tag);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

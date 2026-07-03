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
  "банк",
  "sns",
  "лайфхак",
  "совет",
  "новости",
  "транспорт",
  "sim",
  "школа",
  "lisboa",
] as const;

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
  sim: "SIM",
  school: "Школа",
  школа: "Школа",
  food: "Еда",
  еда: "Еда",
  pets: "Питомцы",
  portugal: "Португалия",
  lisboa: "Лиссабон",
  lisbon: "Лиссабон",
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

/** Merge topic hints + content kind + inline #tags into deduped list. */
export function buildNoteHashtags(input: {
  topicTags?: string[];
  contentKind?: ContentKind;
  extra?: string[];
}): string[] {
  const set = new Set<string>();
  for (const t of input.topicTags ?? []) set.add(normalizeHashtag(t));
  for (const t of input.extra ?? []) set.add(normalizeHashtag(t));
  if (input.contentKind) {
    set.add(input.contentKind);
    if (input.contentKind === "lifehack") set.add("лайфхак");
    if (input.contentKind === "tip") set.add("совет");
    if (input.contentKind === "news") set.add("новости");
    if (input.contentKind === "guide") set.add("гайд");
  }
  set.delete("");
  return Array.from(set).slice(0, 12);
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

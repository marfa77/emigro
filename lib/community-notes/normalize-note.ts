import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { noteSeedFallback } from "@/lib/community-notes/seed";
import type {
  CommunityNote,
  CommunityNoteFaq,
  CommunityNoteLink,
  ContentKind,
  NoteBodySection,
} from "@/lib/community-notes/types";

const CONTENT_KINDS = new Set<ContentKind>(["news", "lifehack", "tip", "guide", "qa"]);

function asString(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text === "null" || text === "undefined" ? fallback : text;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function asContentKind(value: unknown): ContentKind {
  return CONTENT_KINDS.has(value as ContentKind) ? (value as ContentKind) : "guide";
}

function asSectionKind(value: unknown): NoteBodySection["section_kind"] {
  if (value === "official" || value === "practice" || value === "gap" || value === "glossary") {
    return value;
  }
  return undefined;
}

function asBodySections(value: unknown): NoteBodySection[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((section): section is Record<string, unknown> => section != null && typeof section === "object")
    .map((section) => ({
      heading: asString(section.heading, "Раздел"),
      paragraphs: section.paragraphs ? asStringArray(section.paragraphs) : undefined,
      bullets: section.bullets ? asStringArray(section.bullets) : undefined,
      section_kind: asSectionKind(section.section_kind),
    }))
    .filter((section) => section.heading.length > 0);
}

function asFaq(value: unknown): CommunityNoteFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
    .map((item) => ({
      q: asString(item.q),
      a: asString(item.a),
    }))
    .filter((item) => item.q.length > 0 && item.a.length > 0);
}

function asOfficialLinks(value: unknown): CommunityNoteLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
    .map((item) => ({
      title: asString(item.title),
      url: asString(item.url),
    }))
    .filter((item) => item.title.length > 0 && item.url.length > 0);
}

function resolveCountryKey(value: unknown, fallback: string): string {
  const key = asString(value, fallback);
  return key === "spain" || key === "portugal" ? key : fallback;
}

/** Coerce Supabase / seed rows into a safe CommunityNote shape. */
export function normalizeCommunityNote(row: Record<string, unknown>, countryKey = "portugal"): CommunityNote {
  const resolvedCountry = resolveCountryKey(row.country_key, countryKey);
  const contentKind = asContentKind(row.content_kind);
  const topicTags = asStringArray(row.topic_tags);

  return {
    id: asString(row.id, `seed-${asString(row.slug, "note")}`),
    slug: asString(row.slug),
    country_key: resolvedCountry,
    city: asString(row.city, resolvedCountry === "spain" ? "valencia" : "porto"),
    category: asString(row.category, resolvedCountry === "spain" ? "Испания" : "Португалия"),
    content_kind: contentKind,
    title: asString(row.title, asString(row.slug, "Заметка")),
    excerpt: asString(row.excerpt),
    seo_title: asString(row.seo_title),
    seo_description: asString(row.seo_description),
    quick_answer: asString(row.quick_answer),
    body_paragraphs: asStringArray(row.body_paragraphs),
    body_sections: asBodySections(row.body_sections),
    key_takeaways: asStringArray(row.key_takeaways),
    faq: asFaq(row.faq),
    official_links: asOfficialLinks(row.official_links),
    source_channel: row.source_channel == null ? null : asString(row.source_channel),
    source_label: row.source_label == null ? null : asString(row.source_label),
    topic_tags: topicTags.length > 0 ? topicTags : [resolvedCountry],
    hashtags:
      asStringArray(row.hashtags).length > 0
        ? asStringArray(row.hashtags)
        : buildNoteHashtags({ topicTags, contentKind }),
    status:
      row.status === "draft" || row.status === "published" || row.status === "archived"
        ? row.status
        : "published",
    published_at: row.published_at == null ? null : asString(row.published_at),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}

function pickText(current: string, seed: string): string {
  return current.trim().length > 0 ? current : seed;
}

function pickArray<T>(current: T[], seed: T[]): T[] {
  return current.length > 0 ? current : seed;
}

/** Fill thin DB rows from editorial seed for known satellite slugs. */
export function overlayEditorialSeed(note: CommunityNote, countryKey = note.country_key): CommunityNote {
  const seed = noteSeedFallback(countryKey).find((item) => item.slug === note.slug);
  if (!seed) return note;

  return {
    ...note,
    country_key: resolveCountryKey(note.country_key, seed.country_key),
    city: pickText(note.city, seed.city),
    category: pickText(note.category, seed.category),
    content_kind: note.content_kind || seed.content_kind,
    title: pickText(note.title, seed.title),
    excerpt: pickText(note.excerpt, seed.excerpt),
    seo_title: pickText(note.seo_title, seed.seo_title),
    seo_description: pickText(note.seo_description, seed.seo_description),
    quick_answer: pickText(note.quick_answer, seed.quick_answer),
    body_paragraphs: pickArray(note.body_paragraphs, seed.body_paragraphs),
    body_sections: pickArray(note.body_sections, seed.body_sections),
    key_takeaways: pickArray(note.key_takeaways, seed.key_takeaways),
    faq: pickArray(note.faq, seed.faq),
    official_links: pickArray(note.official_links, seed.official_links),
    topic_tags: pickArray(note.topic_tags, seed.topic_tags),
    hashtags: pickArray(note.hashtags, seed.hashtags),
    source_channel: note.source_channel ?? seed.source_channel,
    source_label: note.source_label ?? seed.source_label,
    published_at: note.published_at ?? seed.published_at,
  };
}

export function finalizeCommunityNote(row: Record<string, unknown>, countryKey = "portugal"): CommunityNote {
  return overlayEditorialSeed(normalizeCommunityNote(row, countryKey), countryKey);
}

/** Union DB notes with editorial seed so all baseline slugs stay published. */
export function mergePublishedNotesWithSeed(notes: CommunityNote[], countryKey: string): CommunityNote[] {
  const seed = noteSeedFallback(countryKey);
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const merged: CommunityNote[] = [];

  for (const seedNote of seed) {
    const dbNote = bySlug.get(seedNote.slug);
    merged.push(dbNote ? overlayEditorialSeed(dbNote, countryKey) : seedNote);
    bySlug.delete(seedNote.slug);
  }

  for (const note of Array.from(bySlug.values())) {
    merged.push(overlayEditorialSeed(note, countryKey));
  }

  return merged.sort((a, b) => {
    const aTime = a.published_at ? Date.parse(a.published_at) : 0;
    const bTime = b.published_at ? Date.parse(b.published_at) : 0;
    return bTime - aTime;
  });
}

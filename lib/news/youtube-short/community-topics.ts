import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { getPublishedCommunityNotes, getPublishedCommunityNoteBySlug } from "@/lib/community-notes/queries";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";
import type { TipShortFormat, TipShortTopic } from "./topics";

/** Always use live subdomain in Shorts metadata (cron runs without NODE_ENV=production). */
function portugalNoteUrl(slug: string): string {
  return communityNotePublicUrl(slug);
}

/** Kinds suitable for evergreen Shorts (skip news — time-sensitive). */
const SHORT_CONTENT_KINDS = new Set<ContentKind>(["lifehack", "tip", "guide", "qa"]);

function contentKindToFormat(kind: ContentKind): TipShortFormat {
  switch (kind) {
    case "guide":
      return "howto";
    case "qa":
      return "fact";
    case "tip":
      return "list";
    case "lifehack":
      return "fact";
    default:
      return "howto";
  }
}

function buildNoteContext(note: CommunityNote): string {
  const parts: string[] = [`Заголовок: ${note.title}`, `Quick answer: ${note.quick_answer}`];

  if (note.key_takeaways.length) {
    parts.push("Коротко:", ...note.key_takeaways.map((item) => `- ${item}`));
  }

  for (const section of note.body_sections) {
    parts.push(`\n## ${section.heading}`);
    for (const paragraph of section.paragraphs ?? []) parts.push(paragraph);
    for (const bullet of section.bullets ?? []) parts.push(`- ${bullet}`);
  }

  if (!note.body_sections.length && note.body_paragraphs.length) {
    parts.push("", ...note.body_paragraphs);
  }

  return parts.join("\n").slice(0, 3500);
}

function extractFacts(note: CommunityNote): string[] {
  const fromTakeaways = note.key_takeaways.map((t) => t.trim()).filter(Boolean);
  if (fromTakeaways.length >= 3) return fromTakeaways.slice(0, 6);

  const bullets = note.body_sections
    .flatMap((section) => section.bullets ?? [])
    .map((item) => item.trim())
    .filter(Boolean);
  if (bullets.length >= 3) return bullets.slice(0, 6);

  const paragraphs = [
    note.quick_answer,
    ...note.body_paragraphs,
    ...note.body_sections.flatMap((section) => section.paragraphs ?? []),
  ]
    .map((item) => item.trim())
    .filter(Boolean);
  if (paragraphs.length >= 2) return paragraphs.slice(0, 5);

  return [note.excerpt || note.title];
}

function hookSeedFromNote(note: CommunityNote): string {
  const excerpt = note.excerpt.trim().replace(/\s+/g, " ");
  if (excerpt.length >= 20) return excerpt.length > 140 ? `${excerpt.slice(0, 137).trim()}…` : excerpt;
  const qa = note.quick_answer.trim().replace(/\s+/g, " ");
  if (qa.length >= 20) return qa.length > 140 ? `${qa.slice(0, 137).trim()}…` : qa;
  return note.title;
}

function tagsFromNote(note: CommunityNote): string[] {
  const tags = Array.from(new Set([...(note.hashtags ?? []), ...(note.topic_tags ?? [])]))
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter((t) => t && t !== "portugal" && t !== "lisboa")
    .slice(0, 8);
  return tags.length ? tags : ["Португалия", "лайфхак"];
}

export function communityNoteToTipTopic(note: CommunityNote): TipShortTopic | null {
  if (!SHORT_CONTENT_KINDS.has(note.content_kind)) return null;

  return {
    id: note.slug,
    title: note.title,
    hookSeed: hookSeedFromNote(note),
    format: contentKindToFormat(note.content_kind),
    country: "Португалия",
    topic_key: "portugal",
    note_url: portugalNoteUrl(note.slug),
    note_context: buildNoteContext(note),
    content_kind: note.content_kind,
    facts: extractFacts(note),
    tags: tagsFromNote(note),
  };
}

function sortNotesOldestFirst(notes: CommunityNote[]): CommunityNote[] {
  return [...notes].sort((a, b) => {
    const left = a.published_at ?? a.created_at;
    const right = b.published_at ?? b.created_at;
    return left.localeCompare(right);
  });
}

export async function loadCommunityTipTopics(countryKey = "portugal"): Promise<TipShortTopic[]> {
  const notes = sortNotesOldestFirst(await getPublishedCommunityNotes(countryKey));
  const topics: TipShortTopic[] = [];

  for (const note of notes) {
    if (note.id.startsWith("seed-")) continue;
    const topic = communityNoteToTipTopic(note);
    if (topic) topics.push(topic);
  }

  return topics;
}

export async function getCommunityTipTopic(slug: string, countryKey = "portugal"): Promise<TipShortTopic | null> {
  const note = await getPublishedCommunityNoteBySlug(slug, countryKey);
  if (!note || note.id.startsWith("seed-")) return null;
  return communityNoteToTipTopic(note);
}

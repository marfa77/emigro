import { CONTENT_KIND_LABELS } from "@/lib/community-notes/hashtags";
import type { CommunityNote } from "@/lib/community-notes/types";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { portugalSatellitePublicUrl } from "@/lib/site-url";

/** City-life inventory first — the Porto group is not a visa forum. */
const LIFE_HINT =
  /arenda|аренд|sns|врач|стомат|медицин|транспорт|portagen|auto|авто|школ|фестив|вино|гастро|район|district|matosinhos|gaia|braga|климат|туризм|pet|питом|sim|esim|желт|барахол|банк|conta|nif-porto|перв(ый|ые)-?мес/i;

/** Basic group id is `-NNNN`; supergroup would be `-100NNNN`. Env wins after upgrade. */
const PORTO_GROUP_CHAT_ID_FALLBACK = "-5534913841";

export function portoGroupChatId(): string | undefined {
  const raw = process.env.EMIGRO_PORTO_CHAT_ID?.trim();
  return raw || PORTO_GROUP_CHAT_ID_FALLBACK;
}

export function satelliteNotePublicUrl(slug: string): string {
  const url = new URL(portugalSatellitePublicUrl(`/notes/${slug}`));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "porto_group");
  url.searchParams.set("utm_content", slug);
  return url.toString();
}

function haystack(note: CommunityNote): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function isCityLifeNote(note: CommunityNote): boolean {
  return LIFE_HINT.test(haystack(note));
}

function stripMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/участники\s+@[\w]+(?:\s+и\s+@[\w]+)*/gi, "В местных чатах")
    .replace(/@(?:por_tugal|chatlisboa|chatporto|lepta|braga_pt_rus|autolife_pt)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function takeawayLines(note: CommunityNote): string[] {
  const fromKeys = (note.key_takeaways ?? [])
    .map((t) => stripMd(t.replace(/^(Официально|На практике|Расхождение|В чате|Сегодня):\s*/i, "")))
    .filter((t) => t.length > 12 && t.length < 280)
    .slice(0, 3);
  if (fromKeys.length >= 2) return fromKeys;
  const hook = stripMd(note.quick_answer || note.excerpt || "");
  if (hook.length > 20) return [hook.length > 320 ? `${hook.slice(0, 317).trim()}…` : hook];
  return [];
}

export function formatPortoGroupHtml(note: CommunityNote, noteUrl: string): string {
  const kind = CONTENT_KIND_LABELS[note.content_kind] ?? "Заметка";
  const title = escapeTelegramHtml(note.title.replace(/\s+/g, " ").trim().slice(0, 160));
  const bullets = takeawayLines(note).map((line) => `• ${escapeTelegramHtml(line)}`);
  const href = noteUrl.replace(/"/g, "&quot;");
  const body = bullets.length > 0 ? bullets.join("\n") : escapeTelegramHtml(stripMd(note.excerpt || "").slice(0, 280));

  return [
    `<b>${title}</b>`,
    `<i>${escapeTelegramHtml(kind)} · portugal.emigro.online</i>`,
    "",
    body,
    "",
    href,
  ].join("\n");
}

export type PortoGroupBank = {
  created_at?: string;
  skipped?: Record<string, string>;
  queue: string[];
};

export const PORTO_GROUP_BANK_PATH = "lib/community-notes/porto-group-bank.json";

export function pickNextBankSlug(queue: string[], postedSlugs: Set<string>): string | null {
  for (const slug of queue) {
    if (slug && !postedSlugs.has(slug)) return slug;
  }
  return null;
}

export function pickNextPortoGroupNote(
  notes: CommunityNote[],
  postedSlugs: Set<string>,
  bank: PortoGroupBank
): CommunityNote | null {
  const bySlug = new Map(
    notes.filter((n) => n.status === "published" && n.slug).map((n) => [n.slug, n])
  );
  for (const slug of bank.queue) {
    if (!slug || postedSlugs.has(slug)) continue;
    const note = bySlug.get(slug);
    if (note) return note;
  }
  return null;
}

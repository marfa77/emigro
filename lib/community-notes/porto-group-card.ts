import type { CommunityNote } from "@/lib/community-notes/types";
import {
  discussionPromptForNote,
  PORTO_GROUP_RECYCLE_AFTER_MS,
  PORTO_GROUP_REPLY_HINT,
} from "@/lib/community-notes/porto-group-prompts";
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

/** Discussion starter for the city chat — one hook + one question, not a guide dump. */
export function formatPortoGroupHtml(note: CommunityNote, noteUrl: string): string {
  const title = escapeTelegramHtml(note.title.replace(/\s+/g, " ").trim().slice(0, 160));
  const { hook, question } = discussionPromptForNote(note);
  const href = noteUrl.replace(/"/g, "&quot;");

  return [
    `<b>${title}</b>`,
    "",
    escapeTelegramHtml(hook),
    "",
    `<b>${escapeTelegramHtml(question)}</b>`,
    "",
    escapeTelegramHtml(PORTO_GROUP_REPLY_HINT),
    "",
    href,
  ].join("\n");
}

export type PortoGroupBank = {
  created_at?: string;
  policy?: string;
  skipped?: Record<string, string>;
  queue: string[];
};

export type PortoGroupPostRecord = { slug: string; at: string };

export const PORTO_GROUP_BANK_PATH = "lib/community-notes/porto-group-bank.json";

export function pickNextBankSlug(queue: string[], postedSlugs: Set<string>): string | null {
  for (const slug of queue) {
    if (slug && !postedSlugs.has(slug)) return slug;
  }
  return null;
}

function publishedBySlug(notes: CommunityNote[]): Map<string, CommunityNote> {
  return new Map(notes.filter((n) => n.status === "published" && n.slug).map((n) => [n.slug, n]));
}

export function pickNextPortoGroupNote(
  notes: CommunityNote[],
  postedSlugs: Set<string>,
  bank: PortoGroupBank,
  opts?: { now?: number; postedAt?: Map<string, number>; recycleAfterMs?: number }
): CommunityNote | null {
  const bySlug = publishedBySlug(notes);
  for (const slug of bank.queue) {
    if (!slug || postedSlugs.has(slug)) continue;
    const note = bySlug.get(slug);
    if (note) return note;
  }

  const now = opts?.now ?? Date.now();
  const recycleAfter = opts?.recycleAfterMs ?? PORTO_GROUP_RECYCLE_AFTER_MS;
  const postedAt = opts?.postedAt;
  let oldest: { note: CommunityNote; at: number } | null = null;
  for (const slug of bank.queue) {
    if (!slug) continue;
    const note = bySlug.get(slug);
    if (!note) continue;
    const at = postedAt?.get(slug);
    if (at == null) continue;
    if (now - at < recycleAfter) continue;
    if (!oldest || at < oldest.at) oldest = { note, at };
  }
  return oldest?.note ?? null;
}

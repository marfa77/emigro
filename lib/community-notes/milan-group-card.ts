import type { CommunityNote } from "@/lib/community-notes/types";
import {
  discussionPromptForMilanNote,
  MILAN_GROUP_RECYCLE_AFTER_MS,
  MILAN_GROUP_REPLY_HINT,
} from "@/lib/community-notes/milan-group-prompts";
import { cityChatForCountry, cityChatTelegramId } from "@/lib/satellite/city-chats";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { italySatellitePublicUrl } from "@/lib/site-url";

const LIFE_HINT =
  /arenda|аренд|ssn|врач|стомат|медицин|транспорт|metro|atm|trenord|auto|авто|школ|район|district|isola|navigli|климат|sim|esim|luce|желт|банк|iban|codice|перв(ый|ые)-?мес/i;

export function milanGroupChatId(): string | undefined {
  const chat = cityChatForCountry("italy");
  return chat ? cityChatTelegramId(chat) : undefined;
}

export function milanNotePublicUrl(slug: string): string {
  const url = new URL(italySatellitePublicUrl(`/notes/${slug}`));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "milan_group");
  url.searchParams.set("utm_content", slug);
  return url.toString();
}

function haystack(note: CommunityNote): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function isMilanCityLifeNote(note: CommunityNote): boolean {
  return LIFE_HINT.test(haystack(note));
}

export function formatMilanGroupHtml(note: CommunityNote, noteUrl: string): string {
  const title = escapeTelegramHtml(note.title.replace(/\s+/g, " ").trim().slice(0, 160));
  const { hook, question } = discussionPromptForMilanNote(note);
  const href = noteUrl.replace(/"/g, "&quot;");

  return [
    `<b>${title}</b>`,
    "",
    escapeTelegramHtml(hook),
    "",
    `<b>${escapeTelegramHtml(question)}</b>`,
    "",
    escapeTelegramHtml(MILAN_GROUP_REPLY_HINT),
    "",
    href,
  ].join("\n");
}

export type MilanGroupBank = {
  created_at?: string;
  policy?: string;
  skipped?: Record<string, string>;
  queue: string[];
};

export type MilanGroupPostRecord = { slug: string; at: string };

export const MILAN_GROUP_BANK_PATH = "lib/community-notes/milan-group-bank.json";

export function pickNextBankSlug(queue: string[], postedSlugs: Set<string>): string | null {
  for (const slug of queue) {
    if (slug && !postedSlugs.has(slug)) return slug;
  }
  return null;
}

function publishedBySlug(notes: CommunityNote[]): Map<string, CommunityNote> {
  return new Map(notes.filter((n) => n.status === "published" && n.slug).map((n) => [n.slug, n]));
}

export function pickNextMilanGroupNote(
  notes: CommunityNote[],
  postedSlugs: Set<string>,
  bank: MilanGroupBank,
  opts?: { now?: number; postedAt?: Map<string, number>; recycleAfterMs?: number }
): CommunityNote | null {
  const bySlug = publishedBySlug(notes);
  for (const slug of bank.queue) {
    if (!slug || postedSlugs.has(slug)) continue;
    const note = bySlug.get(slug);
    if (note) return note;
  }

  const now = opts?.now ?? Date.now();
  const recycleAfter = opts?.recycleAfterMs ?? MILAN_GROUP_RECYCLE_AFTER_MS;
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

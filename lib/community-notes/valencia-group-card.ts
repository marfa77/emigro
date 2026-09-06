import type { CommunityNote } from "@/lib/community-notes/types";
import {
  discussionPromptForValenciaNote,
  VALENCIA_GROUP_RECYCLE_AFTER_MS,
  VALENCIA_GROUP_REPLY_HINT,
} from "@/lib/community-notes/valencia-group-prompts";
import { cityChatForCountry, cityChatTelegramId } from "@/lib/satellite/city-chats";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { spainSatellitePublicUrl } from "@/lib/site-url";

/** City-life inventory first — the Valencia group is not a visa forum. */
const LIFE_HINT =
  /arenda|аренд|sip|врач|стомат|медицин|транспорт|metro|emt|auto|авто|школ|район|district|ruzafa|cabanyal|климат|sim|esim|luz|желт|gestor|банк|iban|nie|перв(ый|ые)-?мес/i;

export function valenciaGroupChatId(): string | undefined {
  const chat = cityChatForCountry("spain");
  return chat ? cityChatTelegramId(chat) : undefined;
}

export function valenciaNotePublicUrl(slug: string): string {
  const url = new URL(spainSatellitePublicUrl(`/notes/${slug}`));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "valencia_group");
  url.searchParams.set("utm_content", slug);
  return url.toString();
}

function haystack(note: CommunityNote): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function isValenciaCityLifeNote(note: CommunityNote): boolean {
  return LIFE_HINT.test(haystack(note));
}

export function formatValenciaGroupHtml(note: CommunityNote, noteUrl: string): string {
  const title = escapeTelegramHtml(note.title.replace(/\s+/g, " ").trim().slice(0, 160));
  const { hook, question } = discussionPromptForValenciaNote(note);
  const href = noteUrl.replace(/"/g, "&quot;");

  return [
    `<b>${title}</b>`,
    "",
    escapeTelegramHtml(hook),
    "",
    `<b>${escapeTelegramHtml(question)}</b>`,
    "",
    escapeTelegramHtml(VALENCIA_GROUP_REPLY_HINT),
    "",
    href,
  ].join("\n");
}

export type ValenciaGroupBank = {
  created_at?: string;
  policy?: string;
  skipped?: Record<string, string>;
  queue: string[];
};

export type ValenciaGroupPostRecord = { slug: string; at: string };

export const VALENCIA_GROUP_BANK_PATH = "lib/community-notes/valencia-group-bank.json";

export function pickNextBankSlug(queue: string[], postedSlugs: Set<string>): string | null {
  for (const slug of queue) {
    if (slug && !postedSlugs.has(slug)) return slug;
  }
  return null;
}

function publishedBySlug(notes: CommunityNote[]): Map<string, CommunityNote> {
  return new Map(notes.filter((n) => n.status === "published" && n.slug).map((n) => [n.slug, n]));
}

export function pickNextValenciaGroupNote(
  notes: CommunityNote[],
  postedSlugs: Set<string>,
  bank: ValenciaGroupBank,
  opts?: { now?: number; postedAt?: Map<string, number>; recycleAfterMs?: number }
): CommunityNote | null {
  const bySlug = publishedBySlug(notes);
  for (const slug of bank.queue) {
    if (!slug || postedSlugs.has(slug)) continue;
    const note = bySlug.get(slug);
    if (note) return note;
  }

  const now = opts?.now ?? Date.now();
  const recycleAfter = opts?.recycleAfterMs ?? VALENCIA_GROUP_RECYCLE_AFTER_MS;
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

import type { CommunityNote } from "@/lib/community-notes/types";
import {
  discussionPromptForPhuketNote,
  PHUKET_GROUP_RECYCLE_AFTER_MS,
  PHUKET_GROUP_REPLY_HINT,
} from "@/lib/community-notes/phuket-group-prompts";
import { cityChatForCountry, cityChatTelegramId } from "@/lib/satellite/city-chats";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { thailandSatellitePublicUrl } from "@/lib/site-url";

/** City life first; visa and investment topics remain a minority of the chat queue. */
const LIFE_HINT =
  /arenda|rent|meditsin|health|transport|baik|school|shkol|rajony|district|klimat|sim|internet|servisy|bank|tax-id|30-dnej/i;

export function phuketGroupChatId(): string | undefined {
  const chat = cityChatForCountry("thailand");
  return chat ? cityChatTelegramId(chat) : undefined;
}

export function phuketNotePublicUrl(slug: string): string {
  const url = new URL(thailandSatellitePublicUrl(`/notes/${slug}`));
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "phuket_group");
  url.searchParams.set("utm_content", slug);
  return url.toString();
}

function haystack(note: CommunityNote): string {
  return [note.slug, note.title, note.category, ...(note.topic_tags ?? []), ...(note.hashtags ?? [])].join(" ");
}

export function isPhuketCityLifeNote(note: CommunityNote): boolean {
  return LIFE_HINT.test(haystack(note));
}

export function formatPhuketGroupHtml(note: CommunityNote, noteUrl: string): string {
  const title = escapeTelegramHtml(note.title.replace(/\s+/g, " ").trim().slice(0, 160));
  const { hook, question } = discussionPromptForPhuketNote(note);
  const href = noteUrl.replace(/"/g, "&quot;");

  return [
    `<b>${title}</b>`,
    "",
    escapeTelegramHtml(hook),
    "",
    `<b>${escapeTelegramHtml(question)}</b>`,
    "",
    escapeTelegramHtml(PHUKET_GROUP_REPLY_HINT),
    "",
    href,
  ].join("\n");
}

export type PhuketGroupBank = {
  created_at?: string;
  policy?: string;
  skipped?: Record<string, string>;
  queue: string[];
};

export type PhuketGroupPostRecord = { slug: string; at: string };

export const PHUKET_GROUP_BANK_PATH = "lib/community-notes/phuket-group-bank.json";

function publishedBySlug(notes: CommunityNote[]): Map<string, CommunityNote> {
  return new Map(notes.filter((note) => note.status === "published" && note.slug).map((note) => [note.slug, note]));
}

export function pickNextPhuketGroupNote(
  notes: CommunityNote[],
  postedSlugs: Set<string>,
  bank: PhuketGroupBank,
  opts?: { now?: number; postedAt?: Map<string, number>; recycleAfterMs?: number }
): CommunityNote | null {
  const bySlug = publishedBySlug(notes);
  for (const slug of bank.queue) {
    if (!slug || postedSlugs.has(slug)) continue;
    const note = bySlug.get(slug);
    if (note) return note;
  }

  const now = opts?.now ?? Date.now();
  const recycleAfter = opts?.recycleAfterMs ?? PHUKET_GROUP_RECYCLE_AFTER_MS;
  const postedAt = opts?.postedAt;
  let oldest: { note: CommunityNote; at: number } | null = null;
  for (const slug of bank.queue) {
    if (!slug) continue;
    const note = bySlug.get(slug);
    if (!note) continue;
    const at = postedAt?.get(slug);
    if (at == null || now - at < recycleAfter) continue;
    if (!oldest || at < oldest.at) oldest = { note, at };
  }
  return oldest?.note ?? null;
}

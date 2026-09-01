import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import {
  formatPortoGroupHtml,
  pickNextPortoGroupNote,
  PORTO_GROUP_BANK_PATH,
  portoGroupChatId,
  satelliteNotePublicUrl,
  type PortoGroupBank,
} from "@/lib/community-notes/porto-group-card";
import type { CommunityNote } from "@/lib/community-notes/types";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

const STATE_FILE = resolve(process.cwd(), "parser/out/porto-group-posted.json");
const BANK_FILE = resolve(process.cwd(), PORTO_GROUP_BANK_PATH);

type PostedState = {
  chat_id: string;
  slugs: string[];
};

function loadPosted(chatId: string): Set<string> {
  try {
    const raw = JSON.parse(readFileSync(STATE_FILE, "utf-8")) as PostedState;
    if (raw.chat_id !== chatId) return new Set();
    return new Set(raw.slugs ?? []);
  } catch {
    return new Set();
  }
}

function savePosted(chatId: string, slugs: Set<string>): void {
  mkdirSync(dirname(STATE_FILE), { recursive: true });
  const state: PostedState = { chat_id: chatId, slugs: Array.from(slugs).sort() };
  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function loadBank(): PortoGroupBank | { error: string } {
  try {
    const raw = JSON.parse(readFileSync(BANK_FILE, "utf-8")) as PortoGroupBank;
    if (!Array.isArray(raw.queue) || raw.queue.length === 0) {
      return { error: "porto group bank empty" };
    }
    return raw;
  } catch {
    return { error: "porto group bank missing" };
  }
}

export type PortoGroupPostResult = {
  skipped?: string;
  slug?: string;
  title?: string;
  html?: string;
  messageId?: number;
  dryRun?: boolean;
};

async function sendOrPreview(
  chatId: string,
  note: CommunityNote,
  posted: Set<string>,
  dryRun?: boolean
): Promise<PortoGroupPostResult> {
  const noteUrl = satelliteNotePublicUrl(note.slug);
  const html = formatPortoGroupHtml(note, noteUrl);

  if (dryRun) {
    return { slug: note.slug, title: note.title, html, dryRun: true };
  }

  const sent = await sendStatsBotMessage(chatId, html, {
    parseMode: "HTML",
    disableWebPagePreview: false,
  });
  if (!sent.success) {
    throw new Error(sent.error || "telegram send failed");
  }

  posted.add(note.slug);
  savePosted(chatId, posted);

  return { slug: note.slug, title: note.title, html, messageId: sent.messageId };
}

export async function postNextPortoGroupNote(options?: {
  dryRun?: boolean;
  slug?: string;
  countryKey?: string;
}): Promise<PortoGroupPostResult> {
  const chatId = portoGroupChatId();
  if (!chatId) return { skipped: "EMIGRO_PORTO_CHAT_ID missing" };
  if (!process.env.EMIGRO_CHAT_BOT_TOKEN?.trim()) {
    return { skipped: "EMIGRO_CHAT_BOT_TOKEN missing — Porto posts use @emigro_chat_bot only" };
  }

  const countryKey = options?.countryKey ?? "portugal";
  const dryRun = options?.dryRun;
  const slug = options?.slug;
  const notes = await getPublishedCommunityNotesUncached(countryKey);
  const posted = loadPosted(chatId);

  if (slug) {
    const note = notes.find((n) => n.slug === slug) ?? null;
    if (!note) return { skipped: `slug not found: ${slug}` };
    if (posted.has(note.slug)) return { skipped: "already posted" };
    return sendOrPreview(chatId, note, posted, dryRun);
  }

  const bank = loadBank();
  if ("error" in bank) return { skipped: bank.error };

  const note = pickNextPortoGroupNote(notes, posted, bank);
  if (!note) return { skipped: "porto group bank exhausted" };
  return sendOrPreview(chatId, note, posted, dryRun);
}

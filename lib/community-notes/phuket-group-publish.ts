import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import {
  formatPhuketGroupHtml,
  pickNextPhuketGroupNote,
  PHUKET_GROUP_BANK_PATH,
  phuketGroupChatId,
  phuketNotePublicUrl,
  type PhuketGroupBank,
  type PhuketGroupPostRecord,
} from "@/lib/community-notes/phuket-group-card";
import { phuketGroupGuideDue } from "@/lib/community-notes/phuket-group-prompts";
import type { CommunityNote } from "@/lib/community-notes/types";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

export const PHUKET_GROUP_POSTED_PATH = resolve(process.cwd(), "parser/out/phuket-group-posted.json");
const BANK_FILE = resolve(process.cwd(), PHUKET_GROUP_BANK_PATH);

export type PhuketGroupPostedState = {
  chat_id: string;
  last_posted_at?: string;
  slugs: string[];
  posts?: PhuketGroupPostRecord[];
};

export function loadPhuketGroupPostedState(
  chatId: string,
  path = PHUKET_GROUP_POSTED_PATH
): PhuketGroupPostedState {
  try {
    const raw = JSON.parse(readFileSync(path, "utf-8")) as PhuketGroupPostedState;
    if (raw.chat_id !== chatId) return { chat_id: chatId, slugs: [], posts: [] };
    return {
      chat_id: chatId,
      last_posted_at: raw.last_posted_at,
      slugs: raw.slugs ?? [],
      posts: Array.isArray(raw.posts) ? raw.posts : [],
    };
  } catch {
    return { chat_id: chatId, slugs: [], posts: [] };
  }
}

function savePosted(state: PhuketGroupPostedState, path = PHUKET_GROUP_POSTED_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function loadBank(): PhuketGroupBank | { error: string } {
  try {
    const raw = JSON.parse(readFileSync(BANK_FILE, "utf-8")) as PhuketGroupBank;
    if (!Array.isArray(raw.queue) || raw.queue.length === 0) return { error: "phuket group bank empty" };
    return raw;
  } catch {
    return { error: "phuket group bank missing" };
  }
}

function postedAtMap(state: PhuketGroupPostedState): Map<string, number> {
  const map = new Map<string, number>();
  const fallback = state.last_posted_at ? Date.parse(state.last_posted_at) : NaN;
  for (const slug of state.slugs) {
    if (Number.isFinite(fallback)) map.set(slug, fallback);
  }
  for (const row of state.posts ?? []) {
    const at = Date.parse(row.at);
    if (row.slug && Number.isFinite(at)) map.set(row.slug, at);
  }
  return map;
}

export type PhuketGroupPostResult = {
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
  state: PhuketGroupPostedState,
  dryRun?: boolean
): Promise<PhuketGroupPostResult> {
  const html = formatPhuketGroupHtml(note, phuketNotePublicUrl(note.slug));
  if (dryRun) return { slug: note.slug, title: note.title, html, dryRun: true };

  const sent = await sendStatsBotMessage(chatId, html, {
    parseMode: "HTML",
    disableWebPagePreview: false,
  });
  if (!sent.success) throw new Error(sent.error || "telegram send failed");

  const at = new Date().toISOString();
  const slugs = state.slugs.includes(note.slug) ? state.slugs : [...state.slugs, note.slug];
  const posts = [...(state.posts ?? []).filter((post) => post.slug !== note.slug), { slug: note.slug, at }];
  savePosted({ chat_id: chatId, last_posted_at: at, slugs, posts });
  return { slug: note.slug, title: note.title, html, messageId: sent.messageId };
}

export async function postNextPhuketGroupNote(options?: {
  dryRun?: boolean;
  slug?: string;
  force?: boolean;
}): Promise<PhuketGroupPostResult> {
  const chatId = phuketGroupChatId();
  if (!chatId) return { skipped: "EMIGRO_PHUKET_CHAT_ID missing" };
  if (!process.env.EMIGRO_CHAT_BOT_TOKEN?.trim()) {
    return { skipped: "EMIGRO_CHAT_BOT_TOKEN missing — Phuket posts use @emigro_chat_bot only" };
  }

  const notes = await getPublishedCommunityNotesUncached("thailand");
  const state = loadPhuketGroupPostedState(chatId);
  if (!options?.force && !phuketGroupGuideDue(state.last_posted_at)) {
    return { skipped: "interval (max 1 discussion / 3 days)" };
  }

  if (options?.slug) {
    const note = notes.find((row) => row.slug === options.slug) ?? null;
    if (!note) return { skipped: `slug not found: ${options.slug}` };
    return sendOrPreview(chatId, note, state, options.dryRun);
  }

  const bank = loadBank();
  if ("error" in bank) return { skipped: bank.error };
  const note = pickNextPhuketGroupNote(notes, new Set(state.slugs), bank, { postedAt: postedAtMap(state) });
  if (!note) return { skipped: "phuket group bank exhausted (recycle in 45 days)" };
  return sendOrPreview(chatId, note, state, options?.dryRun);
}

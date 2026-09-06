import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import {
  formatValenciaGroupHtml,
  pickNextValenciaGroupNote,
  VALENCIA_GROUP_BANK_PATH,
  valenciaGroupChatId,
  valenciaNotePublicUrl,
  type ValenciaGroupBank,
  type ValenciaGroupPostRecord,
} from "@/lib/community-notes/valencia-group-card";
import { valenciaGroupGuideDue } from "@/lib/community-notes/valencia-group-prompts";
import type { CommunityNote } from "@/lib/community-notes/types";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

export const VALENCIA_GROUP_POSTED_PATH = resolve(process.cwd(), "parser/out/valencia-group-posted.json");
const BANK_FILE = resolve(process.cwd(), VALENCIA_GROUP_BANK_PATH);

export type ValenciaGroupPostedState = {
  chat_id: string;
  last_posted_at?: string;
  slugs: string[];
  posts?: ValenciaGroupPostRecord[];
};

export function loadValenciaGroupPostedState(
  chatId: string,
  path = VALENCIA_GROUP_POSTED_PATH
): ValenciaGroupPostedState {
  try {
    const raw = JSON.parse(readFileSync(path, "utf-8")) as ValenciaGroupPostedState;
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

function savePosted(state: ValenciaGroupPostedState, path = VALENCIA_GROUP_POSTED_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function loadBank(): ValenciaGroupBank | { error: string } {
  try {
    const raw = JSON.parse(readFileSync(BANK_FILE, "utf-8")) as ValenciaGroupBank;
    if (!Array.isArray(raw.queue) || raw.queue.length === 0) {
      return { error: "valencia group bank empty" };
    }
    return raw;
  } catch {
    return { error: "valencia group bank missing" };
  }
}

function postedAtMap(state: ValenciaGroupPostedState): Map<string, number> {
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

export type ValenciaGroupPostResult = {
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
  state: ValenciaGroupPostedState,
  dryRun?: boolean
): Promise<ValenciaGroupPostResult> {
  const noteUrl = valenciaNotePublicUrl(note.slug);
  const html = formatValenciaGroupHtml(note, noteUrl);

  if (dryRun) {
    return { slug: note.slug, title: note.title, html, dryRun: true };
  }

  const sent = await sendStatsBotMessage(chatId, html, {
    parseMode: "HTML",
    disableWebPagePreview: true,
  });
  if (!sent.success) {
    throw new Error(sent.error || "telegram send failed");
  }

  const at = new Date().toISOString();
  const slugs = state.slugs.includes(note.slug) ? state.slugs : [...state.slugs, note.slug];
  const posts = [...(state.posts ?? []).filter((p) => p.slug !== note.slug), { slug: note.slug, at }];
  savePosted({ chat_id: chatId, last_posted_at: at, slugs, posts });

  return { slug: note.slug, title: note.title, html, messageId: sent.messageId };
}

export async function postNextValenciaGroupNote(options?: {
  dryRun?: boolean;
  slug?: string;
  countryKey?: string;
  force?: boolean;
}): Promise<ValenciaGroupPostResult> {
  const chatId = valenciaGroupChatId();
  if (!chatId) return { skipped: "EMIGRO_VALENCIA_CHAT_ID missing" };
  if (!process.env.EMIGRO_CHAT_BOT_TOKEN?.trim()) {
    return { skipped: "EMIGRO_CHAT_BOT_TOKEN missing — Valencia posts use @emigro_chat_bot only" };
  }

  const countryKey = options?.countryKey ?? "spain";
  const dryRun = options?.dryRun;
  const slug = options?.slug;
  const notes = await getPublishedCommunityNotesUncached(countryKey);
  const state = loadValenciaGroupPostedState(chatId);

  if (!options?.force && !valenciaGroupGuideDue(state.last_posted_at)) {
    return { skipped: "interval (max 1 discussion / 3 days)" };
  }

  if (slug) {
    const note = notes.find((n) => n.slug === slug) ?? null;
    if (!note) return { skipped: `slug not found: ${slug}` };
    return sendOrPreview(chatId, note, state, dryRun);
  }

  const bank = loadBank();
  if ("error" in bank) return { skipped: bank.error };

  const posted = new Set(state.slugs);
  const note = pickNextValenciaGroupNote(notes, posted, bank, { postedAt: postedAtMap(state) });
  if (!note) return { skipped: "valencia group bank exhausted (recycle in 45 days)" };
  return sendOrPreview(chatId, note, state, dryRun);
}

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
  type PortoGroupPostRecord,
} from "@/lib/community-notes/porto-group-card";
import { portoGroupGuideDue } from "@/lib/community-notes/porto-group-prompts";
import type { CommunityNote } from "@/lib/community-notes/types";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

export const PORTO_GROUP_POSTED_PATH = resolve(process.cwd(), "parser/out/porto-group-posted.json");
const BANK_FILE = resolve(process.cwd(), PORTO_GROUP_BANK_PATH);

export type PortoGroupPostedState = {
  chat_id: string;
  last_posted_at?: string;
  slugs: string[];
  posts?: PortoGroupPostRecord[];
};

export function loadPortoGroupPostedState(chatId: string, path = PORTO_GROUP_POSTED_PATH): PortoGroupPostedState {
  try {
    const raw = JSON.parse(readFileSync(path, "utf-8")) as PortoGroupPostedState;
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

function savePosted(state: PortoGroupPostedState, path = PORTO_GROUP_POSTED_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
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

function postedAtMap(state: PortoGroupPostedState): Map<string, number> {
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
  state: PortoGroupPostedState,
  dryRun?: boolean
): Promise<PortoGroupPostResult> {
  const noteUrl = satelliteNotePublicUrl(note.slug);
  const html = formatPortoGroupHtml(note, noteUrl);

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

export async function postNextPortoGroupNote(options?: {
  dryRun?: boolean;
  slug?: string;
  countryKey?: string;
  force?: boolean;
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
  const state = loadPortoGroupPostedState(chatId);

  if (!options?.force && !portoGroupGuideDue(state.last_posted_at)) {
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
  const note = pickNextPortoGroupNote(notes, posted, bank, { postedAt: postedAtMap(state) });
  if (!note) return { skipped: "porto group bank exhausted (recycle in 45 days)" };
  return sendOrPreview(chatId, note, state, dryRun);
}

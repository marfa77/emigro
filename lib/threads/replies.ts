/**
 * Threads comment auto-replies for @emigro2eu.
 * Poll → skip → LLM draft → owner Telegram DM → publish only after ✅.
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import {
  fetchThreadsMe,
  listConversation,
  listMyThreads,
  listPendingReplies,
  publishThreadsReply,
  type ThreadsMediaItem,
} from "@/lib/threads/client";
import {
  assertThreadsBrandUsername,
  expectedThreadsBrandUsername,
  loadThreadsEnv,
  normalizeThreadsUsername,
  THREADS_BRAND_USERNAME,
} from "@/lib/threads/config";
import { threadsAssistUrl, threadsWizardUrl } from "@/lib/threads/banks";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";
import {
  answerNewsBotCallback,
  editNewsBotMessageHtml,
  sendOwnerTelegramHtmlWithButtons,
  type TelegramInlineButton,
} from "@/lib/telegram";
import { isAdminTelegramChat } from "@/lib/telegram/admin-bot";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

export const THREADS_REPLIES_STATE_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-threads-replies.json"
);

/** Telegram callback_data prefixes (64-byte max). */
export const THREADS_REPLY_CB_OK = "tr:ok:";
export const THREADS_REPLY_CB_NO = "tr:no:";

export const MAX_REPLY_CHARS = 220;
export const MAX_AGE_HOURS = 24;
export const ROOT_POST_LIMIT = 12;
export const FIRST_LEVEL_ONLY = true;

const HIDDEN_HARD = new Set(["COVERED", "BLOCKED", "RESTRICTED"]);
/** Emoji / punctuation only (no unicode flag — Next typecheck targets ES5). */
const REACT_ONLY = /^[^A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/;
const CYRILLIC_RE = /[А-Яа-яЁёІіЇїЄєҐґ]/;
const LEAK_RE =
  /json requested|here is the json|here is the requested|```|\{["']?(?:reply|skip)["']?\s*:|return json|as requested:|\bthe json\b/i;
const INVITE_HASH_RE = /t\.me\/\+|telegram\.me\/\+/i;
const THRESHOLD_LEAK_RE = /\b(iprem|smi)\b|гарантированн/i;
const SKIP_BAIT_RE =
  /\b(chatgpt|gpt-?\d|openai|claude|gemini|llama)\b|(ты|вы|you(?:'re| are)?)\s+(бот|аи|ai|робот)|ignore (all |your )?previous|system prompt|kill yourself|\bkys\b|убей себя/i;
const SPAM_RE =
  /crypto|binance|forex|onlyfans|nude|porn|xxx|казино|ставки|заработок\s+без|подпишись|follow\s+me|dm\s+me\s+for/i;

const BANNED_REPLY = [
  "как ии",
  "языковая модель",
  "я бот",
  "искусственн",
  "отличный вопрос",
  "рад помочь",
  "если у вас есть",
  "конечно!",
  "с удовольствием",
  "нейросет",
  "полностью согласен",
  "абсолютно согласен",
  "не могу не согласиться",
  "вы правы",
  "справедливо замечено",
  "интересная мысль",
  "спасибо за комментарий",
  "спасибо, что написали",
  "так и есть!",
  "я юрист",
  "юридическ",
  "great question",
  "happy to help",
  "as an ai",
  "language model",
];

export type ThreadsReplyStatus =
  | "awaiting_owner"
  | "replied"
  | "rejected"
  | "skipped";

export type ThreadsReplyStateItem = {
  first_seen: string;
  status: ThreadsReplyStatus;
  reason?: string;
  reply?: string;
  comment?: string;
  username?: string;
  post_id?: string;
  post_excerpt?: string;
  permalink?: string;
  asked_at?: string;
  replied_at?: string;
  reply_id?: string;
};

export type ThreadsRepliesState = { items: Record<string, ThreadsReplyStateItem> };

export type ThreadsReplyDraft = {
  commentId: string;
  postId: string;
  username: string;
  comment: string;
  postExcerpt: string;
  permalink: string;
  reply: string;
};

export type ThreadsRepliesRunResult = {
  ok: boolean;
  dryRun: boolean;
  username?: string;
  expected: string;
  brandOk: boolean;
  posts: number;
  comments: number;
  inbox: number;
  asked: number;
  skipped: number;
  drafts: Array<{ to: string; reply: string; commentId: string }>;
  skipReasons?: Record<string, number>;
  skip?: string;
  error?: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function maxPerRun(): number {
  const n = Number(process.env.THREADS_REPLY_MAX_PER_RUN || 5);
  return Number.isFinite(n) && n > 0 ? Math.min(20, Math.floor(n)) : 5;
}

export function parentId(item: ThreadsMediaItem): string {
  const replied = item.replied_to;
  if (replied && typeof replied === "object") return String(replied.id || "");
  return String(replied || "");
}

export function isFirstLevelComment(item: ThreadsMediaItem, rootId: string): boolean {
  const pid = parentId(item);
  if (!pid) return true;
  return pid === String(rootId);
}

export function skipReason(
  item: ThreadsMediaItem,
  opts: { our: string; alreadyReplied: Set<string> }
): string | null {
  const cid = String(item.id || "");
  if (!cid) return "no_id";
  if (item.is_reply_owned_by_me) return "ours";
  const username = normalizeThreadsUsername(item.username);
  if (username && username === opts.our) return "ours";
  const hide = String(item.hide_status || "NOT_HUSHED").toUpperCase();
  if (HIDDEN_HARD.has(hide)) return "hidden";
  const text = String(item.text || "").trim();
  if (!text) return "empty";
  if (REACT_ONLY.test(text) || text.length < 2) return "react";
  if (opts.alreadyReplied.has(cid)) return "already_replied";
  if (SKIP_BAIT_RE.test(text) || SPAM_RE.test(text)) return "spam";
  return null;
}

export function tooOldOnDiscovery(item: ThreadsMediaItem, now = new Date()): boolean {
  const raw = String(item.timestamp || "").trim();
  if (!raw) return false;
  const stamp = new Date(raw.replace("Z", "+00:00"));
  if (Number.isNaN(stamp.getTime())) return false;
  return now.getTime() - stamp.getTime() > MAX_AGE_HOURS * 3600 * 1000;
}

function clip(text: string, limit: number): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit - 1)}…`;
}

function allowedHttpUrls(text: string): boolean {
  const urls = text.match(/https?:\/\/\S+/gi) || [];
  if (urls.length === 0) return true;
  return urls.every(
    (u) =>
      /emigro\.online\/ru\/(?:[\w-]+\/)?(?:wizard|assist)/i.test(u) ||
      /(?:t|telegram)\.me\/emigro_chat_bot/i.test(u)
  );
}

export function lintReply(text: string): string | null {
  const clean = (text || "").replace(/\s+/g, " ").trim().replace(/^["']|["']$/g, "");
  if (!clean) return null;
  let clipped = clean;
  if (clipped.length > MAX_REPLY_CHARS) {
    clipped = `${clipped.slice(0, MAX_REPLY_CHARS - 1).trim()}…`;
  }
  const lowered = clipped.toLowerCase();
  if (BANNED_REPLY.some((frag) => lowered.includes(frag))) return null;
  if (LEAK_RE.test(clipped) || THRESHOLD_LEAK_RE.test(lowered)) return null;
  if (INVITE_HASH_RE.test(clipped)) return null;
  if (!CYRILLIC_RE.test(clipped)) return null;
  if (!allowedHttpUrls(clipped)) return null;
  return clipped;
}

export function emptyRepliesState(): ThreadsRepliesState {
  return { items: {} };
}

export function loadThreadsRepliesState(
  path = THREADS_REPLIES_STATE_PATH
): ThreadsRepliesState {
  if (!existsSync(path)) return emptyRepliesState();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ThreadsRepliesState>;
    const items =
      raw.items && typeof raw.items === "object" && !Array.isArray(raw.items)
        ? raw.items
        : {};
    return { items };
  } catch {
    return emptyRepliesState();
  }
}

export function saveThreadsRepliesState(
  state: ThreadsRepliesState,
  path = THREADS_REPLIES_STATE_PATH
): void {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
    chmodSync(path, 0o600);
  } catch (e) {
    console.warn(
      "[threads-replies] state save failed:",
      e instanceof Error ? e.message : e
    );
  }
}

export function pruneThreadsRepliesState(
  state: ThreadsRepliesState,
  days = 14
): void {
  const cutoff = Date.now() - days * 24 * 3600 * 1000;
  for (const [key, row] of Object.entries(state.items)) {
    const seen = Date.parse(String(row.first_seen || ""));
    if (Number.isFinite(seen) && seen < cutoff) delete state.items[key];
  }
}

function alreadyAsked(row: ThreadsReplyStateItem | undefined): boolean {
  if (!row) return false;
  return (
    row.status === "awaiting_owner" ||
    row.status === "replied" ||
    row.status === "rejected" ||
    row.status === "skipped"
  );
}

function mergeById(rows: ThreadsMediaItem[]): ThreadsMediaItem[] {
  const map = new Map<string, ThreadsMediaItem>();
  for (const row of rows) {
    const id = String(row.id || "");
    if (!id) continue;
    map.set(id, { ...map.get(id), ...row, id });
  }
  return Array.from(map.values());
}

export async function collectReplyInbox(opts?: {
  our?: string;
  state?: ThreadsRepliesState;
}): Promise<{
  posts: number;
  comments: number;
  skipReasons: Record<string, number>;
  inbox: Array<{ post: ThreadsMediaItem; item: ThreadsMediaItem }>;
}> {
  const our = opts?.our || expectedThreadsBrandUsername();
  const state = opts?.state;
  const posts = await listMyThreads(ROOT_POST_LIMIT);
  let comments = 0;
  const skipReasons: Record<string, number> = {};
  const bump = (reason: string) => {
    skipReasons[reason] = (skipReasons[reason] || 0) + 1;
  };
  const inbox: Array<{ post: ThreadsMediaItem; item: ThreadsMediaItem }> = [];

  for (const post of posts) {
    if (post.is_reply) continue;
    const rootId = String(post.id || "");
    if (!rootId) continue;

    let thread: ThreadsMediaItem[] = [];
    try {
      const conversation = post.has_replies === false ? [] : await listConversation(rootId);
      const pending = await listPendingReplies(rootId);
      thread = mergeById([...conversation, ...pending]);
    } catch (e) {
      console.warn(
        "[threads-replies] conversation failed",
        rootId,
        e instanceof Error ? e.message : e
      );
      continue;
    }

    comments += thread.filter((item) => String(item.id || "") && String(item.id) !== rootId).length;

    const ours = new Set(
      thread
        .filter((item) => item.is_reply_owned_by_me && parentId(item))
        .map((item) => parentId(item))
    );

    for (const item of thread) {
      const cid = String(item.id || "");
      if (!cid || cid === rootId) continue;
      if (FIRST_LEVEL_ONLY && !isFirstLevelComment(item, rootId)) {
        bump("nested");
        continue;
      }
      const reason = skipReason(item, { our, alreadyReplied: ours });
      if (reason) {
        bump(reason);
        continue;
      }
      if (state && alreadyAsked(state.items[cid])) {
        bump(state.items[cid]?.status || "asked");
        continue;
      }
      inbox.push({ post, item });
    }
  }

  return { posts: posts.filter((p) => !p.is_reply).length, comments, skipReasons, inbox };
}

function parseModelJson(raw: string): { reply?: string; skip?: boolean } {
  let text = (raw || "").trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  try {
    const data = JSON.parse(text) as { reply?: string; skip?: boolean };
    if (data && typeof data === "object") return data;
  } catch {
    /* try slice */
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    return JSON.parse(match[0]) as { reply?: string; skip?: boolean };
  } catch {
    return {};
  }
}

function safeCta(build: () => string, fallback: string): string {
  try {
    return build();
  } catch {
    return fallback;
  }
}

function replyVoiceSystem(): string {
  const wizard = safeCta(() => threadsWizardUrl("thr_reply"), "https://www.emigro.online/ru/wizard");
  const assist = safeCta(() => threadsAssistUrl("thr_reply"), "https://www.emigro.online/ru/assist");
  const porto = portoChatDeepLink("thr");
  return `Ты сосед в Threads от аккаунта @${THREADS_BRAND_USERNAME} (Emigro — навигатор релокации, не юрфирма).

Голос:
- 1–2 предложения, максимум ${MAX_REPLY_CHARS} символов, по-русски
- зацеп за их фразу, без общего согласия и без мемуаров от первого лица
- не юрист, не «гарантированный ВНЖ», не выдумывай IPREM/SMI/€ пороги
- без markdown, списков, хештегов, пачек эмодзи

Куда слать (только эти ссылки, никогда t.me/+):
- какую страну / какой коридор / виза / документы → бесплатный визард подбора коридора: ${wizard}
- уже запутанный кейс (отказ, смена статуса, сопровождение) → Assist Route Check €129: ${assist}
- быт Порту (аренда, NIF, районы, чат) → бот чата: ${porto}

Запрещено:
- шаблоны «отличный вопрос», «рад помочь», «полностью согласен», «спасибо за комментарий»
- признаваться что ты бот/модель
- продавать абзацем, обещать ВНЖ
- английские служебные фразы, JSON, преамбулы

Оскорбления, спам, провокации «ты бот», оффтоп — skip.

Верни JSON: {"reply": "текст"} или {"skip": true}`;
}

async function callReplyLlm(prompt: string): Promise<string> {
  const key = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "").trim();
  if (!key) throw new Error("GOOGLE_API_KEY is required to draft Threads replies");
  const model = (process.env.THREADS_REPLY_MODEL || process.env.EMIGRO_NEWS_FAST_MODEL || "gemini-2.5-flash")
    .replace(/^google\//, "")
    .trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: replyVoiceSystem() }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 160,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            reply: { type: "STRING" },
            skip: { type: "BOOLEAN" },
          },
        },
      },
    }),
  });
  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };
  if (!res.ok) throw new Error(json.error?.message || `Gemini HTTP ${res.status}`);
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

export async function draftThreadsReply(params: {
  postText: string;
  comment: string;
  username: string;
}): Promise<string | null> {
  const prompt = [
    `Пост:\n${clip(params.postText, 500)}`,
    "",
    `Коммент @${params.username.replace(/^@/, "")}:\n${clip(params.comment, 400)}`,
  ].join("\n");
  const data = parseModelJson(await callReplyLlm(prompt));
  if (data.skip === true) return null;
  return lintReply(String(data.reply || ""));
}

export function formatThreadsReplyApprovalHtml(draft: ThreadsReplyDraft): string {
  return [
    `<b>Threads ответ</b> · @${escapeTelegramHtml(THREADS_BRAND_USERNAME)}`,
    "",
    `кому: @${escapeTelegramHtml(draft.username.replace(/^@/, "") || "user")}`,
    `пост: ${escapeTelegramHtml(clip(draft.postExcerpt, 280))}`,
    `коммент: ${escapeTelegramHtml(clip(draft.comment, 320))}`,
    "",
    "наш ответ:",
    escapeTelegramHtml(draft.reply),
    "",
    "—",
    draft.permalink ? escapeTelegramHtml(draft.permalink) : "",
    `<code>tr:${escapeTelegramHtml(draft.commentId)}</code>`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function parseThreadsReplyDraftFromMessage(text: string): {
  commentId?: string;
  reply?: string;
} {
  const raw = (text || "").trim();
  if (!raw) return {};
  const idMatch = raw.match(/\btr:([0-9]{10,})\b/);
  const commentId = idMatch?.[1];
  const replyMatch = raw.match(/наш ответ:\s*\n([\s\S]*?)\n—/i);
  const reply = lintReply((replyMatch?.[1] || "").trim());
  return { commentId, reply: reply || undefined };
}

function replyKeyboard(commentId: string): TelegramInlineButton[][] {
  const ok = `${THREADS_REPLY_CB_OK}${commentId}`;
  const no = `${THREADS_REPLY_CB_NO}${commentId}`;
  if (Buffer.byteLength(ok, "utf8") > 64 || Buffer.byteLength(no, "utf8") > 64) {
    return [
      [
        { text: "✅ Ответить", callback_data: THREADS_REPLY_CB_OK },
        { text: "❌ Пропуск", callback_data: THREADS_REPLY_CB_NO },
      ],
    ];
  }
  return [
    [
      { text: "✅ Ответить", callback_data: ok },
      { text: "❌ Пропуск", callback_data: no },
    ],
  ];
}

function parseReplyCb(data: string): { action: "ok" | "no" | null; commentId?: string } {
  if (data === THREADS_REPLY_CB_OK.slice(0, -1) || data === THREADS_REPLY_CB_OK) {
    return { action: "ok" };
  }
  if (data === THREADS_REPLY_CB_NO.slice(0, -1) || data === THREADS_REPLY_CB_NO) {
    return { action: "no" };
  }
  if (data.startsWith(THREADS_REPLY_CB_OK)) {
    return { action: "ok", commentId: data.slice(THREADS_REPLY_CB_OK.length) };
  }
  if (data.startsWith(THREADS_REPLY_CB_NO)) {
    return { action: "no", commentId: data.slice(THREADS_REPLY_CB_NO.length) };
  }
  return { action: null };
}

async function askOwner(draft: ThreadsReplyDraft): Promise<{ ok: boolean; error?: string }> {
  const dm = await sendOwnerTelegramHtmlWithButtons(
    formatThreadsReplyApprovalHtml(draft),
    replyKeyboard(draft.commentId)
  );
  if (!dm.success) return { ok: false, error: dm.error || "dm-failed" };
  return { ok: true };
}

export async function publishApprovedThreadsReply(params: {
  commentId: string;
  reply: string;
}): Promise<{ ok: boolean; id?: string; error?: string; skipped?: boolean }> {
  const reply = lintReply(params.reply);
  if (!reply) return { ok: false, error: "draft-rejected-by-lint" };

  const env = loadThreadsEnv();
  if (!env.autoPublish) {
    return { ok: false, skipped: true, error: "THREADS_AUTO_PUBLISH≠1" };
  }

  try {
    const published = await publishThreadsReply({
      text: reply,
      replyToId: params.commentId,
      forcePublish: true,
    });
    if (published.dryRun || !published.id) {
      return { ok: false, skipped: true, error: "dry-run-gate" };
    }
    const state = loadThreadsRepliesState();
    const row = state.items[params.commentId] || { first_seen: nowIso(), status: "replied" as const };
    row.status = "replied";
    row.reply = reply;
    row.reply_id = published.id;
    row.replied_at = nowIso();
    state.items[params.commentId] = row;
    saveThreadsRepliesState(state);
    return { ok: true, id: published.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function rejectThreadsReply(commentId: string): Promise<void> {
  if (!commentId) return;
  const state = loadThreadsRepliesState();
  const row = state.items[commentId] || { first_seen: nowIso(), status: "rejected" as const };
  row.status = "rejected";
  row.reason = "owner";
  state.items[commentId] = row;
  saveThreadsRepliesState(state);
}

export async function handleThreadsReplyCallback(params: {
  data: string;
  chatId: string | number;
  userId?: string | number;
  callbackQueryId: string;
  messageId?: number;
  messageText?: string;
}): Promise<boolean> {
  const parsed = parseReplyCb(params.data);
  if (!parsed.action) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) {
    await answerNewsBotCallback(params.callbackQueryId, "Нет доступа");
    return true;
  }

  const fromMessage = parseThreadsReplyDraftFromMessage(params.messageText || "");
  const commentId = parsed.commentId || fromMessage.commentId || "";
  const reply = fromMessage.reply || loadThreadsRepliesState().items[commentId]?.reply || "";

  if (parsed.action === "no") {
    await rejectThreadsReply(commentId);
    await answerNewsBotCallback(params.callbackQueryId, "Пропущено");
    if (params.messageId != null) {
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        `❌ Threads ответ пропуск\n<code>${escapeTelegramHtml(commentId || "?")}</code>`
      );
    }
    return true;
  }

  if (!commentId || !reply) {
    await answerNewsBotCallback(params.callbackQueryId, "Нет черновика");
    if (params.messageId != null) {
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        "⚠️ Нет comment id или текста ответа — перезапусти <code>threads:replies --ask-owner</code>"
      );
    }
    return true;
  }

  const result = await publishApprovedThreadsReply({ commentId, reply });
  await answerNewsBotCallback(
    params.callbackQueryId,
    result.ok ? "Опубликовано" : result.error || "Ошибка"
  );
  if (params.messageId != null) {
    await editNewsBotMessageHtml(
      params.chatId,
      params.messageId,
      result.ok
        ? `✅ Threads ответ · @${THREADS_BRAND_USERNAME}\n<code>${escapeTelegramHtml(commentId)}</code>`
        : `⚠️ Не удалось: ${escapeTelegramHtml(result.error || "error")}`
    );
  }
  return true;
}

export async function runThreadsReplies(opts: {
  dryRun?: boolean;
  askOwner?: boolean;
}): Promise<ThreadsRepliesRunResult> {
  const dryRun = opts.dryRun !== false && !opts.askOwner;
  const expected = expectedThreadsBrandUsername();
  const env = loadThreadsEnv();

  if (!env.accessToken) {
    return {
      ok: true,
      dryRun,
      expected,
      brandOk: false,
      posts: 0,
      comments: 0,
      inbox: 0,
      asked: 0,
      skipped: 0,
      drafts: [],
      skip: "missing_token",
    };
  }

  const me = await fetchThreadsMe();
  const username = normalizeThreadsUsername(me.username);
  try {
    assertThreadsBrandUsername(me.username);
  } catch (e) {
    return {
      ok: false,
      dryRun,
      username,
      expected,
      brandOk: false,
      posts: 0,
      comments: 0,
      inbox: 0,
      asked: 0,
      skipped: 0,
      drafts: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }

  const state = loadThreadsRepliesState();
  pruneThreadsRepliesState(state);
  const collected = await collectReplyInbox({ our: username, state });
  const drafts: ThreadsRepliesRunResult["drafts"] = [];
  let asked = 0;
  let skipped = 0;
  const limit = maxPerRun();

  for (const { post, item } of collected.inbox) {
    const cid = String(item.id || "");
    if (!cid) continue;

    if (tooOldOnDiscovery(item)) {
      state.items[cid] = {
        first_seen: nowIso(),
        status: "skipped",
        reason: "stale",
      };
      skipped += 1;
      continue;
    }

    if (asked >= limit) break;

    const usernameTo = String(item.username || "user").replace(/^@/, "");
    const comment = String(item.text || "");
    const postExcerpt = String(post.text || "");

    let reply: string | null = null;
    try {
      reply = await draftThreadsReply({
        postText: postExcerpt,
        comment,
        username: usernameTo,
      });
    } catch (e) {
      console.warn(
        "[threads-replies] draft failed",
        cid,
        e instanceof Error ? e.message : e
      );
      continue;
    }

    if (!reply) {
      state.items[cid] = {
        first_seen: nowIso(),
        status: "skipped",
        reason: "model_skip",
        comment: clip(comment, 200),
        username: usernameTo,
        post_id: String(post.id || ""),
      };
      skipped += 1;
      continue;
    }

    const draft: ThreadsReplyDraft = {
      commentId: cid,
      postId: String(post.id || ""),
      username: usernameTo,
      comment,
      postExcerpt,
      permalink: String(item.permalink || post.permalink || ""),
      reply,
    };
    drafts.push({ to: usernameTo, reply, commentId: cid });

    if (dryRun) {
      asked += 1;
      continue;
    }

    const dm = await askOwner(draft);
    if (!dm.ok) {
      console.warn("[threads-replies] DM failed", cid, dm.error);
      continue;
    }

    state.items[cid] = {
      first_seen: nowIso(),
      status: "awaiting_owner",
      reply,
      comment: clip(comment, 280),
      username: usernameTo,
      post_id: draft.postId,
      post_excerpt: clip(postExcerpt, 280),
      permalink: draft.permalink,
      asked_at: nowIso(),
    };
    asked += 1;
    saveThreadsRepliesState(state);
  }

  if (!dryRun) saveThreadsRepliesState(state);

  return {
    ok: true,
    dryRun,
    username,
    expected,
    brandOk: true,
    posts: collected.posts,
    comments: collected.comments,
    inbox: collected.inbox.length,
    asked,
    skipped,
    drafts,
    skipReasons: collected.skipReasons,
  };
}

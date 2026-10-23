import { createAdminClient } from "@/lib/admin/supabase";
import { isAdminTelegramChat, sendStatsBotMessage, statsBotToken } from "@/lib/telegram/admin-bot";
import { downloadTelegramFile } from "@/lib/telegram/bot/download-file";
import { runAgentWithFallback, type Content, type Part, type Source } from "@/lib/telegram/bot/agent/gemini";
import { agentSystemPrompt } from "@/lib/telegram/bot/agent/prompt";
import { AGENT_FUNCTIONS, callAgentTool } from "@/lib/telegram/bot/agent/tools";
import { parseMenuLabel } from "@/lib/telegram/bot/markup";
import { getLiveSession } from "@/lib/telegram/bot/session";
import type { TelegramMessage, TelegramUpdate } from "@/lib/telegram/bot/types";

const HISTORY_LIMIT = 20;
const HISTORY_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const HELP = `🧠 <b>Маркетолог Emigro</b> — SEO, AEO, SMM и воронка. Пишите текстом, голосом или присылайте скриншоты (выдача, аналитика, пост конкурента).

Примеры:
• «Разбери выдачу по „ВНЖ Португалии для россиян 2026“ и усиль наш title»
• «Что просело в Search Console за 28 дней и что чинить первым»
• «5 цепочек для Threads про NIF в Порту с CTA на сателлит»
• «План контента для Валенсии на неделю»

/new — новый разговор, /ai вопрос — спросить, когда открыто меню бота.`;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lisbonNow(): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

async function tg(method: string, body: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const token = statsBotToken();
  if (!token) return null;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  return res ? ((await res.json().catch(() => null)) as Record<string, unknown> | null) : null;
}

const typing = (chatId: number | string) => tg("sendChatAction", { chat_id: chatId, action: "typing" });

async function loadHistory(userId: number): Promise<Content[]> {
  try {
    const { data } = await createAdminClient()
      .from("emigro_bot_agent_messages")
      .select("role, text")
      .eq("telegram_user_id", userId)
      .gte("created_at", new Date(Date.now() - HISTORY_WINDOW_MS).toISOString())
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);
    const rows = (data ?? []).reverse();
    while (rows.length && rows[0].role !== "user") rows.shift();
    return rows.map((r) => ({ role: r.role as Content["role"], parts: [{ text: r.text as string }] }));
  } catch (e) {
    console.warn("[agent] history load failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

async function saveTurn(userId: number, userText: string, answer: string, model: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("emigro_bot_agent_messages")
    .insert([
      { telegram_user_id: userId, role: "user", text: userText },
      { telegram_user_id: userId, role: "model", text: answer, model },
    ]);
  if (error) console.warn("[agent] history save failed:", error.message);
}

async function clearHistory(userId: number): Promise<void> {
  await createAdminClient().from("emigro_bot_agent_messages").delete().eq("telegram_user_id", userId);
}

function withSources(text: string, sources: Source[]): string {
  if (!sources.length) return text;
  const links = sources.slice(0, 6).map((s) => `<a href="${escapeHtml(s.uri)}">${escapeHtml(s.title)}</a>`);
  return `${text}\n\n<i>Источники:</i> ${links.join(" · ")}`;
}

async function reply(chatId: number | string, html: string): Promise<void> {
  const sent = await sendStatsBotMessage(chatId, html, { parseMode: "HTML" });
  if (sent.success) return;
  console.warn("[agent] HTML send failed, falling back to plain:", sent.error);
  const plain = html
    .replace(/<a href="([^"]+)">([^<]*)<\/a>/g, "$2 ($1)")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  await sendStatsBotMessage(chatId, plain, { parseMode: null });
}

/** Turns a Telegram message into model input; null when the message is not for the agent. */
async function toUserParts(message: TelegramMessage, text: string): Promise<{ parts: Part[]; log: string } | null> {
  if (message.voice) {
    const buf = await downloadTelegramFile(message.voice.file_id);
    if (!buf) return { parts: [{ text: "(не удалось скачать голосовое)" }], log: "🎤 голосовое" };
    return {
      parts: [{ text: "Голосовое сообщение Павла:" }, { inline_data: { mime_type: message.voice.mime_type || "audio/ogg", data: buf.toString("base64") } }],
      log: "🎤 голосовое",
    };
  }
  const photo = message.photo?.[message.photo.length - 1];
  const image = photo?.file_id ?? (message.document?.mime_type?.startsWith("image/") ? message.document.file_id : undefined);
  if (image) {
    const buf = await downloadTelegramFile(image);
    const q = text || "Разбери скриншот как маркетолог: что видно, выводы, что делать.";
    if (!buf) return { parts: [{ text: q }], log: `🖼 ${q}` };
    const mime = photo ? "image/jpeg" : message.document!.mime_type!;
    return { parts: [{ inline_data: { mime_type: mime, data: buf.toString("base64") } }, { text: q }], log: `🖼 ${q}` };
  }
  return text ? { parts: [{ text }], log: text } : null;
}

async function answer(userId: number, chatId: number | string, ownerName: string, parts: Part[], log: string): Promise<void> {
  await typing(chatId);
  const typingTimer = setInterval(() => void typing(chatId), 4500);
  try {
    const history = await loadHistory(userId);
    const result = await runAgentWithFallback({
      system: agentSystemPrompt({ now: lisbonNow(), ownerName }),
      history,
      userParts: parts,
      functions: AGENT_FUNCTIONS,
      onCall: callAgentTool,
    });
    const text = withSources(result.text, result.sources);
    clearInterval(typingTimer);
    await reply(chatId, text);
    await saveTurn(userId, log, text, result.model).catch(() => undefined);
  } catch (e) {
    console.error("[agent] failed:", e);
    await reply(chatId, `⚠️ Агент не смог ответить: ${escapeHtml(e instanceof Error ? e.message : String(e)).slice(0, 300)}`);
  } finally {
    clearInterval(typingTimer);
  }
}

/** Owner-only marketing agent. Returns true when the update was consumed. */
export async function tryHandleOwnerAgent(update: TelegramUpdate): Promise<boolean> {
  const message = update.message;
  if (!message || (message.chat?.type || "private") !== "private" || message.chat?.id == null) return false;
  const chatId = message.chat.id;
  const userId = Number(message.from?.id);
  if (!Number.isFinite(userId) || !isAdminTelegramChat(chatId, userId)) return false;
  if (!process.env.GEMINI_API_KEY?.trim() && !process.env.GOOGLE_API_KEY?.trim()) return false;

  let text = (message.text || message.caption || "").trim();
  if (/^\/(?:new|reset)(?:@\w+)?$/i.test(text)) {
    await clearHistory(userId).catch(() => undefined);
    await reply(chatId, "🧹 Новый разговор. Контекст очищен.");
    return true;
  }
  if (/^\/(?:ai|agent)(?:@\w+)?$/i.test(text)) {
    await reply(chatId, HELP);
    return true;
  }
  const forced = text.match(/^\/(?:ai|agent)(?:@\w+)?\s+([\s\S]+)$/i);
  if (forced) {
    text = forced[1].trim();
  } else {
    if (text.startsWith("/")) return false;
    if (text && parseMenuLabel(text)) return false;
    if (await getLiveSession(userId)) return false;
  }

  const input = await toUserParts(message, text);
  if (!input) return false;
  await answer(userId, chatId, message.from?.first_name || "Павел", input.parts, input.log);
  return true;
}

/** CIPLE / owner bot — leads + news channel. */
import { normalizeTelegramPublicUrl, telegramPublicUrl } from "@/lib/telegram/public-url";

function ownerBotToken(): string | undefined {
  return (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim();
}

function channelBotToken(): string | undefined {
  return ownerBotToken();
}

function dmBotToken(): string | undefined {
  return ownerBotToken();
}

function ownerChatId(): string | undefined {
  return process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim();
}

type TelegramApiResult = {
  ok?: boolean;
  description?: string;
  result?: { message_id?: number };
};

async function sendTelegramPlain(
  token: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  if (!token) return { success: false, error: "bot token missing" };
  if (!chatId) return { success: false, error: "chat id missing" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      disable_web_page_preview: false,
    }),
  });

  const json = (await res.json()) as TelegramApiResult;
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true, messageId: json.result?.message_id };
}

export async function sendTelegramHtmlToChat(
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const token = dmBotToken();
  if (!token) return { success: false, error: "TELEGRAM_BOT_TOKEN missing" };
  if (!chatId) return { success: false, error: "chat id missing" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });

  const json = (await res.json()) as TelegramApiResult;
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

export async function sendTelegramPlainToChat(
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const token = dmBotToken();
  if (!token) return { success: false, error: "TELEGRAM_BOT_TOKEN missing" };
  return sendTelegramPlain(token, chatId, text);
}

function newsChannelId(): string {
  return (process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news").trim();
}

/** Public Telegram link for the news channel (never localhost). */
export function newsTelegramChannelUrl(): string {
  const channel = newsChannelId();
  if (/^https?:\/\//i.test(channel)) return normalizeTelegramPublicUrl(channel);
  if (channel.startsWith("@")) return telegramPublicUrl(channel);
  if (/^t\.me\//i.test(channel) || /^telegram\.me\//i.test(channel)) {
    return normalizeTelegramPublicUrl(channel);
  }
  return telegramPublicUrl("Emigro_news");
}

function splitThreadsForTelegram(text: string, max = 4000): string[] {
  const parts = text.split(/\n\n(?=\d+\/\d+\n)/);
  const chunks: string[] = [];
  let current = "";

  for (const part of parts) {
    const next = current ? `${current}\n\n${part}` : part;
    if (next.length > max) {
      if (current) chunks.push(current.trim());
      current = part.length > max ? part.slice(0, max) : part;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, max)];
}

/** Publish editorial HTML digest to @Emigro_news (like CIPLE — one rich post). */
export async function publishNewsDigestHtmlToChannel(html: string): Promise<void> {
  await publishNewsHtmlToChannel(html);
}

/** Publish HTML to @Emigro_news; returns Telegram message_id(s). */
export async function publishNewsHtmlToChannel(html: string): Promise<number[]> {
  const token = channelBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");

  const channel = newsChannelId();
  const result = await sendTelegramHtmlWithToken(token, channel, html);
  if (!result.success) {
    throw new Error(result.error || `Failed to publish to ${channel}`);
  }
  return result.messageId != null ? [result.messageId] : [];
}

async function sendTelegramHtmlWithToken(
  token: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const json = (await res.json()) as TelegramApiResult;
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true, messageId: json.result?.message_id };
}

/** Delete previously published channel messages (bot must be channel admin). */
export async function deleteTelegramChannelMessages(messageIds: number[]): Promise<{
  deleted: number[];
  failed: Array<{ messageId: number; error: string }>;
}> {
  const token = channelBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");
  const channel = newsChannelId();

  const deleted: number[] = [];
  const failed: Array<{ messageId: number; error: string }> = [];

  for (const messageId of messageIds) {
    const res = await fetch(`https://api.telegram.org/bot${token}/deleteMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: channel, message_id: messageId }),
    });
    const json = (await res.json()) as TelegramApiResult;
    if (res.ok && json.ok !== false) {
      deleted.push(messageId);
    } else {
      failed.push({ messageId, error: json.description || res.statusText });
    }
  }

  return { deleted, failed };
}

/** Publish a readable digest that is also ready to copy into a Threads thread. */
export async function publishNewsDigestToChannel(
  threadsText: string,
  _options?: { flag?: string; countryRu?: string }
): Promise<number[]> {
  const token = channelBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");
  const channel = newsChannelId();
  const messages = splitThreadsForTelegram(threadsText);
  const messageIds: number[] = [];

  for (const msg of messages) {
    const result = await sendTelegramPlain(token, channel, msg);
    if (!result.success) throw new Error(result.error || `Failed to publish to ${channel}`);
    if (result.messageId != null) messageIds.push(result.messageId);
  }

  return messageIds;
}

/** Owner DM via CIPLE bot (EMIGRO_NEWS_BOT_TOKEN) — lead shortlist requests, Threads copy. */
export async function sendOwnerTelegramDm(text: string): Promise<{ success: boolean; error?: string }> {
  const token = ownerBotToken();
  const chatId = ownerChatId();
  if (!token) return { success: false, error: "EMIGRO_NEWS_BOT_TOKEN missing" };
  if (!chatId) return { success: false, error: "TELEGRAM_PRIVATE_CHAT_ID missing" };
  return sendTelegramPlain(token, chatId, text);
}

export type TelegramInlineButton = { text: string; callback_data: string };

/** Owner DM (HTML) with inline keyboard — news bot. */
export async function sendOwnerTelegramHtmlWithButtons(
  html: string,
  keyboard: TelegramInlineButton[][]
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  const token = ownerBotToken();
  const chatId = ownerChatId();
  if (!token) return { success: false, error: "EMIGRO_NEWS_BOT_TOKEN missing" };
  if (!chatId) return { success: false, error: "TELEGRAM_PRIVATE_CHAT_ID missing" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: false,
      reply_markup: { inline_keyboard: keyboard },
    }),
  });
  const json = (await res.json()) as TelegramApiResult;
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true, messageId: json.result?.message_id };
}

export async function answerNewsBotCallback(
  callbackQueryId: string,
  text?: string
): Promise<void> {
  const token = ownerBotToken();
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text?.slice(0, 200),
      show_alert: false,
    }),
  });
}

export async function editNewsBotMessageHtml(
  chatId: string | number,
  messageId: number,
  html: string
): Promise<{ success: boolean; error?: string }> {
  const token = ownerBotToken();
  if (!token) return { success: false, error: "bot token missing" };
  const res = await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: html.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const json = (await res.json()) as TelegramApiResult;
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

/** News bot token (same as channel / owner DM). */
export function newsBotToken(): string | undefined {
  return ownerBotToken();
}

/** @deprecated use sendOwnerTelegramDm */
export async function sendNewsDigestThreadsDm(threadsText: string): Promise<void> {
  const result = await sendOwnerTelegramDm(threadsText);
  if (!result.success) {
    throw new Error(result.error || "Telegram DM failed");
  }
}

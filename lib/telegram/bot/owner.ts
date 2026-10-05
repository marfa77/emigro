import { buildTelegramStatsReport } from "@/lib/analytics/format-stats-telegram";
import {
  handleLightningApprovalCallback,
  handleLightningApprovalCommand,
} from "@/lib/news/lightning-approval";
import { handleGuideApprovalCallback } from "@/lib/news/run-guide-telegram-queue";
import { handleThreadsReplyCallback } from "@/lib/threads/replies";
import {
  isAdminTelegramChat,
  sendStatsBotMessage,
  telegramAdminChatIds,
} from "@/lib/telegram/admin-bot";
import {
  buildDemoStatsReport,
  isStatsCommand,
  isStatsDemoCommand,
} from "@/lib/telegram/commands";
import type { TelegramMessage, TelegramUpdate } from "@/lib/telegram/bot/types";

const recentStatsReplies = new Map<string, number>();
const STATS_REPLY_COOLDOWN_MS = 120_000;

export function isOwnerCallbackData(data: string): boolean {
  const d = data.trim();
  return (
    d.startsWith("lg:") ||
    d.startsWith("gd:ok:") ||
    d.startsWith("gd:no:") ||
    d.startsWith("tr:ok:") ||
    d.startsWith("tr:no:")
  );
}

export function isOwnerCommandText(text: string): boolean {
  const t = text.trim();
  if (isStatsCommand(t) || isStatsDemoCommand(t)) return true;
  return /^\/(?:молния_|molniya_|lightning_)/i.test(t);
}

function statsReplyDedupKey(message: TelegramMessage): string | null {
  const chatId = message.chat?.id;
  const messageId = message.message_id;
  if (chatId == null || messageId == null) return null;
  return `${chatId}:${messageId}`;
}

function shouldSkipDuplicateStatsReply(message: TelegramMessage): boolean {
  const key = statsReplyDedupKey(message);
  if (!key) return false;
  const now = Date.now();
  for (const k of Array.from(recentStatsReplies.keys())) {
    const ts = recentStatsReplies.get(k)!;
    if (now - ts > STATS_REPLY_COOLDOWN_MS) recentStatsReplies.delete(k);
  }
  if (recentStatsReplies.has(key)) return true;
  recentStatsReplies.set(key, now);
  return false;
}

async function sendStatsReply(chatId: string | number, report: string): Promise<void> {
  const result = await sendStatsBotMessage(chatId, report, { parseMode: "HTML" });
  if (result.success) return;
  console.error("[telegram] stats HTML send failed:", result.error);
  const plain = report.replace(/<\/?[^>]+>/g, "");
  const plainResult = await sendStatsBotMessage(chatId, plain, { parseMode: null });
  if (plainResult.success) return;
  console.error("[telegram] stats plain send failed:", plainResult.error);
  await sendStatsBotMessage(
    chatId,
    `Не удалось отправить отчёт: ${plainResult.error || result.error || "unknown"}`,
    { parseMode: null }
  );
}

async function handleStatsCommand(message: TelegramMessage): Promise<boolean> {
  const text = (message.text || "").trim();
  const demo = isStatsDemoCommand(text);
  if (!demo && !isStatsCommand(text)) return false;
  if ((message.chat?.type || "private") !== "private") return true;

  const chatId = message.chat?.id;
  const userId = message.from?.id;
  if (chatId == null) return true;

  if (telegramAdminChatIds().size === 0) {
    await sendStatsBotMessage(
      chatId,
      "TELEGRAM_ADMIN_CHAT_ID или TELEGRAM_PRIVATE_CHAT_ID не задан на сервере.",
      { parseMode: null }
    );
    return true;
  }
  if (!isAdminTelegramChat(chatId, userId)) return true;
  if (shouldSkipDuplicateStatsReply(message)) return true;

  if (demo) {
    await sendStatsReply(chatId, buildDemoStatsReport());
    return true;
  }
  try {
    const report = await buildTelegramStatsReport();
    await sendStatsReply(chatId, report);
  } catch (e) {
    console.error("[telegram] stats_report failed:", e);
    await sendStatsReply(
      chatId,
      "⚠️ <b>Статистика временно недоступна</b> (ошибка или таймаут БД).\n" +
        "Попробуйте через минуту или <code>/stats demo</code> для примера отчёта."
    );
  }
  return true;
}

export async function tryHandleOwnerUpdate(update: TelegramUpdate): Promise<boolean> {
  const cb = update.callback_query;
  if (cb?.id && cb.data && isOwnerCallbackData(cb.data)) {
    const args = {
      data: cb.data,
      chatId: cb.message?.chat?.id ?? cb.from?.id ?? "",
      userId: cb.from?.id,
      callbackQueryId: cb.id,
      messageId: cb.message?.message_id,
    };
    if (await handleGuideApprovalCallback(args)) return true;
    if (await handleThreadsReplyCallback({ ...args, messageText: cb.message?.text })) return true;
    if (await handleLightningApprovalCallback(args)) return true;
    return true;
  }

  const message = update.message || update.edited_message;
  if (!message?.text || message.chat?.id == null) return false;

  if (await handleStatsCommand(message)) return true;
  return handleLightningApprovalCommand({
    text: message.text,
    chatId: message.chat.id,
    userId: message.from?.id,
  });
}

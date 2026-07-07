import { buildTelegramStatsReport } from "@/lib/analytics/format-stats-telegram";
import { parseWizardTelegramStartPayload } from "@/lib/telegram/deep-link";
import {
  isAdminTelegramChat,
  sendStatsBotMessage,
  telegramAdminChatIds,
} from "@/lib/telegram/admin-bot";
import {
  buildDemoStatsReport,
  isStartCommand,
  isStatsCommand,
  isStatsDemoCommand,
  startWelcomeMessage,
} from "@/lib/telegram/commands";
import { sendWizardReportToTelegramUser } from "@/lib/wizard/send-telegram-report";

const recentStatsReplies = new Map<string, number>();
const STATS_REPLY_COOLDOWN_MS = 120_000;

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

export type TelegramMessage = {
  message_id?: number;
  text?: string;
  chat?: { id?: number | string; type?: string };
  from?: { id?: number | string; username?: string; first_name?: string; last_name?: string };
};

async function sendStatsReply(chatId: string | number, report: string): Promise<void> {
  const result = await sendStatsBotMessage(chatId, report, { parseMode: "HTML" });
  if (!result.success) {
    await sendStatsBotMessage(
      chatId,
      "Не удалось отправить отчёт (проверьте EMIGRO_CHAT_BOT_TOKEN на сервере).",
      { parseMode: null }
    );
  }
}

async function handleStatsCommand(message: TelegramMessage): Promise<boolean> {
  const text = (message.text || "").trim();
  const demo = isStatsDemoCommand(text);
  if (!demo && !isStatsCommand(text)) return false;

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

  if (!isAdminTelegramChat(chatId, userId)) {
    return true;
  }

  if (shouldSkipDuplicateStatsReply(message)) {
    return true;
  }

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

function startPayload(text: string): string | null {
  const match = text.trim().match(/^\/start(?:@\w+)?\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function handleWizardStartCommand(message: TelegramMessage): Promise<boolean> {
  const payload = startPayload(message.text || "");
  if (!payload) return false;

  const parsed = parseWizardTelegramStartPayload(payload);
  if (!parsed) return false;

  const chatId = message.chat?.id;
  const userId = message.from?.id;
  if (chatId == null || userId == null) return true;

  const delivered = await sendWizardReportToTelegramUser({
    sessionId: parsed.sessionId,
    telegramUserId: userId,
    profile: {
      telegramUserId: userId,
      username: message.from?.username,
      firstName: message.from?.first_name,
      lastName: message.from?.last_name,
    },
    source: "bot_start",
  });

  if (!delivered.success) {
    await sendStatsBotMessage(
      chatId,
      [
        "<b>Не удалось отправить отчёт</b>",
        "",
        delivered.error ?? "Проверьте, что wizard завершён на сайте, и попробуйте снова.",
      ].join("\n"),
      { parseMode: "HTML" }
    );
    return true;
  }

  if (delivered.skipped) {
    await sendStatsBotMessage(
      chatId,
      "<b>Отчёт уже был отправлен</b> — проверьте сообщения выше или откройте результат на сайте.",
      { parseMode: "HTML" }
    );
    return true;
  }

  await sendStatsBotMessage(
    chatId,
    "<b>✅ Готово!</b> Полный отчёт по маршрутам — в сообщении выше. Сохраните чат, чтобы вернуться к нему позже.",
    { parseMode: "HTML" }
  );

  return true;
}

async function handleStartCommand(message: TelegramMessage): Promise<boolean> {
  if (!isStartCommand(message.text || "")) return false;
  const chatId = message.chat?.id;
  if (chatId == null) return true;

  await sendStatsBotMessage(chatId, startWelcomeMessage(), { parseMode: "HTML" });
  return true;
}

export async function processTelegramMessage(message: TelegramMessage): Promise<void> {
  if (await handleStatsCommand(message)) return;
  if (await handleWizardStartCommand(message)) return;
  if (await handleStartCommand(message)) return;
}

export type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
};

export async function processTelegramUpdate(update: TelegramUpdate): Promise<void> {
  const message = update.message || update.edited_message;
  if (!message) return;
  await processTelegramMessage(message);
}

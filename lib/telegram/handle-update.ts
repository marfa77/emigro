import { buildTelegramStatsReport } from "@/lib/analytics/format-stats-telegram";
import { corridorResultsPath } from "@/lib/corridor/paths";
import { createServerClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";
import { parseWizardTelegramStartPayload } from "@/lib/telegram/deep-link";
import { sendOwnerTelegramDm } from "@/lib/telegram";
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function startPayload(text: string): string | null {
  const match = text.trim().match(/^\/start(?:@\w+)?\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function resultUrlForSession(mode: "hub" | "corridor", sessionId: string): Promise<string> {
  if (mode === "hub") {
    return `${SITE_URL}/ru/wizard/results?session=${encodeURIComponent(sessionId)}`;
  }

  const supabase = createServerClient();
  const { data: session } = await supabase
    .from("emigro_wizard_sessions")
    .select("corridor_id")
    .eq("id", sessionId)
    .single();

  if (!session?.corridor_id) return `${SITE_URL}/ru`;

  const { data: corridor } = await supabase
    .from("emigro_corridors")
    .select("slug")
    .eq("id", session.corridor_id)
    .single();

  return corridor?.slug
    ? `${SITE_URL}${corridorResultsPath(corridor.slug)}?session=${encodeURIComponent(sessionId)}`
    : `${SITE_URL}/ru`;
}

async function handleWizardStartCommand(message: TelegramMessage): Promise<boolean> {
  const payload = startPayload(message.text || "");
  if (!payload) return false;

  const parsed = parseWizardTelegramStartPayload(payload);
  if (!parsed) return false;

  const chatId = message.chat?.id;
  if (chatId == null) return true;

  const resultUrl = await resultUrlForSession(parsed.mode, parsed.sessionId);
  const userLabel = [
    message.from?.username ? `@${message.from.username}` : null,
    [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" "),
    message.from?.id ? `id ${message.from.id}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  await sendStatsBotMessage(
    chatId,
    [
      "<b>Результат wizard сохранён</b>",
      "",
      "Мы видим вашу сессию и можем продолжить разбор здесь.",
      `Session: <code>${escapeHtml(parsed.sessionId)}</code>`,
      "",
      `<a href="${escapeHtml(resultUrl)}">Открыть результат</a>`,
    ].join("\n"),
    { parseMode: "HTML" }
  );

  const ownerMessage = [
    "📨 Emigro — результат wizard открыт в Telegram",
    "",
    `Тип: ${parsed.mode === "hub" ? "глобальный hub" : "коридор"}`,
    `Session: ${parsed.sessionId}`,
    `Результаты: ${resultUrl}`,
    userLabel ? `Telegram: ${userLabel}` : null,
    chatId ? `Chat: ${chatId}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  const owner = await sendOwnerTelegramDm(ownerMessage);
  if (!owner.success) console.warn("[telegram] owner wizard handoff:", owner.error);

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

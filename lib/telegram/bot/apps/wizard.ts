import { sendWizardReportToTelegramUser } from "@/lib/wizard/send-telegram-report";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession } from "@/lib/telegram/bot/session";
import { upsertBotUser } from "@/lib/telegram/bot/users";
import { liveCityChatForCountry } from "@/lib/satellite/city-chats";
import { startAssist } from "@/lib/telegram/bot/apps/assist";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

export async function startWizard(
  ctx: BotUserCtx,
  input: { mode: "hub" | "corridor"; sessionId: string }
): Promise<void> {
  await clearSession(ctx.userId);
  const delivered = await sendWizardReportToTelegramUser({
    sessionId: input.sessionId,
    telegramUserId: ctx.userId,
    profile: {
      telegramUserId: ctx.userId,
      username: ctx.username,
      firstName: ctx.firstName,
      lastName: ctx.lastName,
    },
    source: "bot_start",
  });

  if (!delivered.success) {
    await sendStatsBotMessage(
      ctx.chatId,
      [
        "<b>Не удалось отправить отчёт</b>",
        "",
        delivered.error ?? "Проверьте, что wizard завершён на сайте, и попробуйте снова.",
      ].join("\n"),
      { parseMode: "HTML" }
    );
    await sendHome(ctx);
    return;
  }

  if (delivered.countryKey) {
    await upsertBotUser(ctx, delivered.countryKey);
  }

  if (delivered.skipped) {
    await sendStatsBotMessage(
      ctx.chatId,
      "<b>Отчёт уже был отправлен</b> — проверьте сообщения выше или откройте результат на сайте.",
      { parseMode: "HTML" }
    );
  } else {
    await sendStatsBotMessage(
      ctx.chatId,
      "<b>✅ Готово!</b> Полный отчёт по маршрутам — в сообщении выше. Сохраните чат, чтобы вернуться к нему позже.",
      { parseMode: "HTML" }
    );
  }

  const chat = liveCityChatForCountry(delivered.countryKey);
  if (chat) {
    const { issueCityChatInvite, cityChatInviteHtml, cityChatInviteReplyMarkup } = await import(
      "@/lib/telegram/porto-chat-invite"
    );
    const invite = await issueCityChatInvite(ctx.userId, chat);
    await sendStatsBotMessage(ctx.chatId, cityChatInviteHtml(invite), {
      parseMode: "HTML",
      replyMarkup: cityChatInviteReplyMarkup(invite),
    });
  }

  await sendHome(ctx, "Разобрать кейс с человеком — кнопка ниже, не повтор wizard в чате.");
  await sendStatsBotMessage(ctx.chatId, "Следующий шаг:", {
    parseMode: "HTML",
    replyMarkup: inlineRows([
      [{ text: "Разобрать с человеком", callback_data: `home:assist:${delivered.countryKey ?? ""}`.slice(0, 64) }],
    ]),
  });
}

export async function continueWizardHomeAssist(
  ctx: BotUserCtx,
  incoming: BotIncoming
): Promise<boolean> {
  if (incoming.kind !== "callback" || !incoming.data.startsWith("home:assist")) return false;
  const country = incoming.data.split(":")[2]?.replace(/[^a-z]/g, "") || undefined;
  await startAssist(ctx, { country, sessionId: undefined });
  return true;
}

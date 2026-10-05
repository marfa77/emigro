import {
  SATELLITE_CITY_CHATS,
  cityChatForCountry,
  liveCityChatForCountry,
  type SatelliteCityChat,
} from "@/lib/satellite/city-chats";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import {
  cityChatInviteHtml,
  cityChatInviteReplyMarkup,
  issueCityChatInvite,
} from "@/lib/telegram/porto-chat-invite";
import { inlineRows, persistentMenuKeyboard } from "@/lib/telegram/bot/markup";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession } from "@/lib/telegram/bot/session";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

export async function sendCityPicker(ctx: BotUserCtx, hint?: string): Promise<void> {
  await sendStatsBotMessage(
    ctx.chatId,
    [
      hint ?? "<b>Чат города</b>",
      "Инвайт только после выбора города — не рассылаем ссылку на любой текст.",
      "Порту · Валенсия · Милан · Пхукет.",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: inlineRows([
        SATELLITE_CITY_CHATS.map((chat) => ({
          text: chat.cityRu,
          callback_data: `city:${chat.countryKey}`,
        })),
      ]),
    }
  );
  await sendStatsBotMessage(ctx.chatId, "Меню всегда внизу.", {
    parseMode: "HTML",
    replyMarkup: persistentMenuKeyboard(),
  });
}

export async function inviteToCity(ctx: BotUserCtx, chat: SatelliteCityChat): Promise<void> {
  const result = await issueCityChatInvite(ctx.userId, chat);
  await sendStatsBotMessage(ctx.chatId, cityChatInviteHtml(result), {
    parseMode: "HTML",
    replyMarkup: cityChatInviteReplyMarkup(result),
  });
  await clearSession(ctx.userId);
  await sendHome(ctx, `Чат: ${chat.chatTitleRu}. Дальше — меню.`);
}

export async function startCity(ctx: BotUserCtx, countryKey?: string): Promise<void> {
  const chat = countryKey ? cityChatForCountry(countryKey) ?? liveCityChatForCountry(countryKey) : undefined;
  if (chat) {
    await inviteToCity(ctx, chat);
    return;
  }
  await sendCityPicker(ctx);
}

export async function continueCity(ctx: BotUserCtx, incoming: BotIncoming): Promise<void> {
  if (incoming.kind === "callback" && incoming.data.startsWith("city:")) {
    const key = incoming.data.slice("city:".length);
    await startCity(ctx, key);
    return;
  }
  if (incoming.kind === "message") {
    const { matchCityChatKeyword } = await import("@/lib/satellite/city-chats");
    const chat = matchCityChatKeyword(incoming.text);
    if (chat) {
      await inviteToCity(ctx, chat);
      return;
    }
  }
  await sendCityPicker(ctx, "Напишите город или нажмите кнопку.");
}

import {
  parseNewsBotCallback,
  parseNewsBotIntent,
} from "@/lib/news/bot-subscribe-commands";
import { handleNewsSubscribeCallback, handleNewsSubscribeText } from "@/lib/telegram/news-subscribe";
import { newsBotHowToHtml, SATELLITE_NEWS_TOPIC_KEYS, newsBotTopicByKey } from "@/lib/news/bot-subscribe-topics";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { newsBotCallbackData } from "@/lib/news/bot-subscribe-commands";
import { persistentMenuKeyboard } from "@/lib/telegram/bot/markup";
import type { BotIncoming, BotUserCtx } from "@/lib/telegram/bot/types";

export async function startNews(ctx: BotUserCtx, topicKey?: string): Promise<void> {
  if (topicKey) {
    await handleNewsSubscribeText({
      text: `новости ${newsBotTopicByKey(topicKey)?.countryRu ?? topicKey}`,
      chat: { id: ctx.chatId, type: "private" },
      from: { id: ctx.userId, username: ctx.username, first_name: ctx.firstName },
    });
    await sendStatsBotMessage(ctx.chatId, "Меню всегда внизу.", {
      parseMode: "HTML",
      replyMarkup: persistentMenuKeyboard(),
    });
    return;
  }
  await sendStatsBotMessage(ctx.chatId, newsBotHowToHtml(), {
    parseMode: "HTML",
    replyMarkup: {
      inline_keyboard: [
        SATELLITE_NEWS_TOPIC_KEYS.map((key) => {
          const topic = newsBotTopicByKey(key)!;
          return { text: `${topic.flag} ${topic.countryRu}`, callback_data: newsBotCallbackData(key) };
        }),
      ],
    },
  });
  await sendStatsBotMessage(ctx.chatId, "Меню всегда внизу.", {
    parseMode: "HTML",
    replyMarkup: persistentMenuKeyboard(),
  });
}

export async function continueNews(ctx: BotUserCtx, incoming: BotIncoming): Promise<boolean> {
  if (incoming.kind === "callback") {
    return handleNewsSubscribeCallback({
      id: incoming.id,
      data: incoming.data,
      from: { id: ctx.userId, username: ctx.username, first_name: ctx.firstName },
      message: { chat: { id: ctx.chatId } },
    });
  }
  if (!parseNewsBotIntent(incoming.text)) return false;
  return handleNewsSubscribeText({
    text: incoming.text,
    chat: { id: ctx.chatId, type: "private" },
    from: { id: ctx.userId, username: ctx.username, first_name: ctx.firstName },
  });
}

export function isNewsCallback(data: string): boolean {
  return Boolean(parseNewsBotCallback(data));
}

export function isNewsText(text: string): boolean {
  return Boolean(parseNewsBotIntent(text));
}

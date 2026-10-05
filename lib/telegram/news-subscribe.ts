import {
  newsBotCallbackData,
  newsBotUnsubCallbackData,
  parseNewsBotCallback,
  parseNewsBotIntent,
  parseNewsStartPayload,
  type NewsBotIntent,
} from "@/lib/news/bot-subscribe-commands";
import { newsBotHowToHtml, SATELLITE_NEWS_TOPIC_KEYS, newsBotTopicByKey } from "@/lib/news/bot-subscribe-topics";
import { deliverPendingNewsToBotSubscribers, sendLatestNewsSample } from "@/lib/news/bot-push";
import { pauseNewsBotSubscriptions, upsertNewsBotSubscription } from "@/lib/news/bot-subscriptions";
import {
  answerStatsBotCallback,
  sendStatsBotMessage,
  type TelegramInlineKeyboard,
} from "@/lib/telegram/admin-bot";

type TelegramMessage = {
  text?: string;
  chat?: { id?: number | string; type?: string };
  from?: { id?: number | string; username?: string; first_name?: string };
};

function countryPickerKeyboard(): TelegramInlineKeyboard {
  return {
    inline_keyboard: [
      SATELLITE_NEWS_TOPIC_KEYS.map((key) => {
        const topic = newsBotTopicByKey(key)!;
        return { text: `${topic.flag} ${topic.countryRu}`, callback_data: newsBotCallbackData(key) };
      }),
    ],
  };
}

function isPrivateChat(message: TelegramMessage): boolean {
  return (message.chat?.type || "private") === "private";
}

async function sendHowTo(chatId: number | string): Promise<void> {
  await sendStatsBotMessage(chatId, newsBotHowToHtml(), {
    parseMode: "HTML",
    replyMarkup: countryPickerKeyboard(),
  });
}

async function applyIntent(
  intent: NewsBotIntent,
  ctx: {
    chatId: number;
    userId: number;
    username?: string;
    firstName?: string;
  }
): Promise<void> {
  if (intent.type === "help" || (intent.type === "subscribe" && !intent.topic)) {
    await sendHowTo(ctx.chatId);
    return;
  }

  if (intent.type === "unsubscribe") {
    const count = await pauseNewsBotSubscriptions(ctx.userId, intent.topic?.key);
    await sendStatsBotMessage(
      ctx.chatId,
      count > 0
        ? intent.topic
          ? `Ок, новости ${intent.topic.countryRu} больше не присылаем. Снова: <code>новости ${intent.topic.countryRu}</code>`
          : "Ок, все новостные подписки выключены. Снова — напишите «новости» и выберите страну."
        : "Активных подписок не было. Напишите «новости», если хотите включить.",
      { parseMode: "HTML" }
    );
    return;
  }

  const topic = intent.topic;
  if (!topic) {
    await sendHowTo(ctx.chatId);
    return;
  }

  const { created } = await upsertNewsBotSubscription({
    telegramUserId: ctx.userId,
    chatId: ctx.chatId,
    topic,
    username: ctx.username,
    firstName: ctx.firstName,
  });

  await sendStatsBotMessage(
    ctx.chatId,
    [
      created
        ? `<b>Подписка включена · ${topic.flag} ${topic.countryRu}</b>`
        : `<b>Уже подписаны · ${topic.flag} ${topic.countryRu}</b>`,
      "Новые выпуски с сайта приходят сюда. Подписка живёт только в этом чате.",
      "",
      "Другая страна: напишите «новости» и выберите кнопку.",
      "Отписка: «отписка» или /stop",
    ].join("\n"),
    {
      parseMode: "HTML",
      replyMarkup: {
        inline_keyboard: [[{ text: "Отписаться", callback_data: newsBotUnsubCallbackData(topic.key) }]],
      },
    }
  );

  await sendLatestNewsSample(ctx.chatId, ctx.userId, topic);
  void deliverPendingNewsToBotSubscribers({ topicKey: topic.key, lookbackHours: 48 });
}

export async function handleNewsSubscribeStart(message: TelegramMessage): Promise<boolean> {
  const match = (message.text || "").trim().match(/^\/start(?:@\w+)?\s+(.+)$/i);
  if (!match) return false;
  const parsed = parseNewsStartPayload(match[1]);
  if (!parsed) return false;
  if (!isPrivateChat(message)) return true;
  const chatId = message.chat?.id;
  const userId = message.from?.id;
  if (chatId == null || userId == null) return true;
  await applyIntent(parsed === "picker" ? { type: "subscribe" } : { type: "subscribe", topic: parsed }, {
    chatId: Number(chatId),
    userId: Number(userId),
    username: message.from?.username,
    firstName: message.from?.first_name,
  });
  return true;
}

export async function handleNewsSubscribeText(message: TelegramMessage): Promise<boolean> {
  const intent = parseNewsBotIntent(message.text || "");
  if (!intent) return false;
  if (!isPrivateChat(message)) return true;
  const chatId = message.chat?.id;
  const userId = message.from?.id;
  if (chatId == null || userId == null) return true;
  await applyIntent(intent, {
    chatId: Number(chatId),
    userId: Number(userId),
    username: message.from?.username,
    firstName: message.from?.first_name,
  });
  return true;
}

export async function handleNewsSubscribeCallback(query: {
  id: string;
  data?: string;
  from?: { id?: number | string; username?: string; first_name?: string };
  message?: { chat?: { id?: number | string } };
}): Promise<boolean> {
  const intent = parseNewsBotCallback(query.data || "");
  if (!intent) return false;
  const chatId = query.message?.chat?.id;
  const userId = query.from?.id;
  if (chatId == null || userId == null) {
    await answerStatsBotCallback(query.id, "Не понял чат");
    return true;
  }
  await answerStatsBotCallback(query.id);
  await applyIntent(intent, {
    chatId: Number(chatId),
    userId: Number(userId),
    username: query.from?.username,
    firstName: query.from?.first_name,
  });
  return true;
}

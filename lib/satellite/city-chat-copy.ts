import type { SatelliteCityChat } from "@/lib/satellite/city-chats";

/** Product pitch for owned city chats — gold satellite feature, not a timid join button. */
export const CITY_CHAT_KICKER = "Для своих";

export const CITY_CHAT_PILLARS = [
  {
    key: "signal",
    title: "Важное",
    text: "Гайды и городская практика — не стена объявлений и не визовый флуд.",
  },
  {
    key: "talk",
    title: "Общение",
    text: "Быт, жильё, встречи в городе-фокусе. Закрытый чат, без публичного @.",
  },
  {
    key: "experts",
    title: "Эксперты",
    text: "Команда Emigro отвечает на вопросы, пока сообщество не заговорит само.",
  },
] as const;

export const CITY_CHAT_JOIN_HINT =
  "Без публичного @. Одна кнопка — бот сразу пришлёт ссылку в личку.";

type ChatCopy = Pick<SatelliteCityChat, "chatTitleRu" | "cityRu" | "countryKey">;

export function cityChatLead(chat: Pick<ChatCopy, "cityRu">): string {
  return `${chat.cityRu} и вокруг — для своих: публикуем важное, общаемся, эксперты отвечают на вопросы.`;
}

export function cityChatHeadline(chat: Pick<ChatCopy, "chatTitleRu">): string {
  return `Чат «${chat.chatTitleRu}»`;
}

export function cityChatCtaLabel(chat: Pick<ChatCopy, "chatTitleRu">): string {
  return `Войти в чат «${chat.chatTitleRu}»`;
}

export function cityChatBlurb(chat: Pick<ChatCopy, "cityRu">): string {
  return `${cityChatLead(chat)} ${CITY_CHAT_JOIN_HINT}`;
}

/** Telegram group description when the human creates the chat at launch. */
export function cityChatTelegramBio(chat: ChatCopy): string {
  return [
    `${chat.cityRu} и вокруг — для своих.`,
    "Публикуем важное, общаемся, эксперты отвечают на вопросы.",
    "Без визового флуда и стены объявлений.",
    `Гайды: https://${chat.countryKey}.emigro.online`,
  ].join("\n");
}

export function cityChatThreadsLine(cityRu: string): string {
  return `${cityRu} и вокруг — для своих: важное, общение, эксперты отвечают. Вход через бота, без публичной ссылки.`;
}

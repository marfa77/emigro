import { cityChatTelegramId, defaultCityChat, type SatelliteCityChat } from "@/lib/satellite/city-chats";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

type TelegramApiResult<T> = {
  ok?: boolean;
  description?: string;
  result?: T;
};

type ChatMemberStatus = {
  status?: string;
  is_member?: boolean;
};

type ChatInviteLink = {
  invite_link?: string;
};

function chatBotToken(): string | undefined {
  return process.env.EMIGRO_CHAT_BOT_TOKEN?.trim();
}

async function chatBotApi<T>(method: string, body: Record<string, unknown>): Promise<TelegramApiResult<T>> {
  const token = chatBotToken();
  if (!token) return { ok: false, description: "EMIGRO_CHAT_BOT_TOKEN missing" };
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as TelegramApiResult<T>;
}

function isAlreadyInChat(member: ChatMemberStatus | undefined): boolean {
  const status = member?.status;
  if (status === "creator" || status === "administrator" || status === "member") return true;
  if (status === "restricted" && member?.is_member) return true;
  return false;
}

export type CityChatInviteResult =
  | { kind: "link"; url: string; alreadyMember: boolean; chat: SatelliteCityChat }
  | { kind: "error"; chat: SatelliteCityChat };

/** @deprecated Use CityChatInviteResult */
export type PortoChatInviteResult = CityChatInviteResult;

async function createCityInviteLink(
  telegramChatId: string,
  telegramUserId: string | number
): Promise<string | null> {
  const expireDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const created = await chatBotApi<ChatInviteLink>("createChatInviteLink", {
    chat_id: telegramChatId,
    name: `web ${String(telegramUserId)}`.slice(0, 32),
    expire_date: expireDate,
    member_limit: 1,
    creates_join_request: false,
  });
  const url = created.result?.invite_link?.trim();
  if (!created.ok || !url) {
    console.error("[city-chat] createChatInviteLink failed:", created.description);
    return null;
  }
  return url;
}

export async function issueCityChatInvite(
  telegramUserId: string | number,
  chat: SatelliteCityChat = defaultCityChat()
): Promise<CityChatInviteResult> {
  const telegramChatId = cityChatTelegramId(chat);
  if (!telegramChatId || !chatBotToken()) return { kind: "error", chat };

  const member = await chatBotApi<ChatMemberStatus>("getChatMember", {
    chat_id: telegramChatId,
    user_id: telegramUserId,
  });
  const alreadyMember = Boolean(member.ok && isAlreadyInChat(member.result));

  const url = await createCityInviteLink(telegramChatId, telegramUserId);
  if (!url) return { kind: "error", chat };
  return { kind: "link", url, alreadyMember, chat };
}

export async function issuePortoChatInvite(telegramUserId: string | number): Promise<CityChatInviteResult> {
  return issueCityChatInvite(telegramUserId, defaultCityChat());
}

export function cityChatInviteReplyMarkup(
  result: CityChatInviteResult
): { inline_keyboard: Array<Array<{ text: string; url: string }>> } | undefined {
  if (result.kind !== "link") return undefined;
  const title = result.chat.chatTitleRu;
  return {
    inline_keyboard: [
      [
        {
          text: result.alreadyMember ? `Открыть чат «${title}»` : `Войти в чат «${title}»`,
          url: result.url,
        },
      ],
    ],
  };
}

export function portoChatInviteReplyMarkup(result: CityChatInviteResult) {
  return cityChatInviteReplyMarkup(result);
}

export function cityChatInviteHtml(result: CityChatInviteResult): string {
  const title = result.chat.chatTitleRu;
  const city = result.chat.cityRu;
  if (result.kind === "error") {
    return [
      `<b>${escapeTelegramHtml(title)} · Emigro</b>`,
      "",
      `Сейчас не получилось выдать ссылку. Напишите сюда «${escapeTelegramHtml(city)}» или /chat через пару минут.`,
    ].join("\n");
  }
  const href = escapeTelegramHtml(result.url);
  if (result.alreadyMember) {
    return [
      `<b>${escapeTelegramHtml(title)} · Emigro</b>`,
      "",
      "Вы уже в чате — откройте его кнопкой, не ищите в списке.",
      "",
      `<a href="${href}">Открыть чат</a>`,
    ].join("\n");
  }
  return [
    `<b>${escapeTelegramHtml(title)} · Emigro</b> — для своих в ${escapeTelegramHtml(city)}.`,
    "<i>Публикуем важное, общаемся, эксперты отвечают на вопросы. Закрытый чат, без публичного @.</i>",
    "",
    "Одноразовая ссылка: 24 часа, один человек. Не пересылайте — после входа сгорит.",
    "",
    `<a href="${href}">Войти в чат</a>`,
    "",
    "Объявления — через закреп, не стеной. Не юридическая консультация.",
  ].join("\n");
}

export function portoChatInviteHtml(result: CityChatInviteResult): string {
  return cityChatInviteHtml(result);
}

import { portoGroupChatId } from "@/lib/community-notes/porto-group-card";
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

export type PortoChatInviteResult =
  | { kind: "link"; url: string; alreadyMember: boolean }
  | { kind: "error" };

async function createPortoInviteLink(chatId: string, telegramUserId: string | number): Promise<string | null> {
  const expireDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const created = await chatBotApi<ChatInviteLink>("createChatInviteLink", {
    chat_id: chatId,
    name: `web ${String(telegramUserId)}`.slice(0, 32),
    expire_date: expireDate,
    member_limit: 1,
    creates_join_request: false,
  });
  const url = created.result?.invite_link?.trim();
  if (!created.ok || !url) {
    console.error("[porto-chat] createChatInviteLink failed:", created.description);
    return null;
  }
  return url;
}

export async function issuePortoChatInvite(telegramUserId: string | number): Promise<PortoChatInviteResult> {
  const chatId = portoGroupChatId();
  if (!chatId || !chatBotToken()) return { kind: "error" };

  const member = await chatBotApi<ChatMemberStatus>("getChatMember", {
    chat_id: chatId,
    user_id: telegramUserId,
  });
  const alreadyMember = Boolean(member.ok && isAlreadyInChat(member.result));

  const url = await createPortoInviteLink(chatId, telegramUserId);
  if (!url) return { kind: "error" };
  return { kind: "link", url, alreadyMember };
}

export function portoChatInviteReplyMarkup(
  result: PortoChatInviteResult
): { inline_keyboard: Array<Array<{ text: string; url: string }>> } | undefined {
  if (result.kind !== "link") return undefined;
  return {
    inline_keyboard: [
      [
        {
          text: result.alreadyMember ? "Открыть чат «Порту и вокруг»" : "Войти в чат «Порту и вокруг»",
          url: result.url,
        },
      ],
    ],
  };
}

export function portoChatInviteHtml(result: PortoChatInviteResult): string {
  if (result.kind === "error") {
    return [
      "<b>Порту и вокруг · Emigro</b>",
      "",
      "Сейчас не получилось выдать ссылку. Напишите сюда «Порту» или /chat через пару минут.",
    ].join("\n");
  }
  const href = escapeTelegramHtml(result.url);
  if (result.alreadyMember) {
    return [
      "<b>Порту и вокруг · Emigro</b>",
      "",
      "Вы уже в чате — откройте его кнопкой, не ищите в списке.",
      "",
      `<a href="${href}">Открыть чат</a>`,
    ].join("\n");
  }
  return [
    "<b>Порту и вокруг · Emigro</b> — живой городской чат.",
    "<i>Закрытый, без публичного @. Быт, жильё, встречи.</i>",
    "",
    "Одноразовая ссылка: 24 часа, один человек. Не пересылайте — после входа сгорит.",
    "",
    `<a href="${href}">Войти в чат</a>`,
    "",
    "Объявления — через закреп / Барахолку, не стеной. Не юридическая консультация.",
  ].join("\n");
}

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
  | { kind: "already_member" }
  | { kind: "link"; url: string }
  | { kind: "error" };

export async function issuePortoChatInvite(telegramUserId: string | number): Promise<PortoChatInviteResult> {
  const chatId = portoGroupChatId();
  if (!chatId || !chatBotToken()) return { kind: "error" };

  const member = await chatBotApi<ChatMemberStatus>("getChatMember", {
    chat_id: chatId,
    user_id: telegramUserId,
  });
  if (member.ok && isAlreadyInChat(member.result)) {
    return { kind: "already_member" };
  }

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
    return { kind: "error" };
  }
  return { kind: "link", url };
}

export function portoChatInviteReplyMarkup(
  result: PortoChatInviteResult
): { inline_keyboard: Array<Array<{ text: string; url: string }>> } | undefined {
  if (result.kind !== "link") return undefined;
  return { inline_keyboard: [[{ text: "Войти в чат Порту", url: result.url }]] };
}

export function portoChatInviteHtml(result: PortoChatInviteResult): string {
  if (result.kind === "already_member") {
    return [
      "<b>Порту и вокруг · Emigro</b>",
      "",
      "Вы уже в этой группе — откройте её в списке чатов Telegram.",
    ].join("\n");
  }
  if (result.kind === "error") {
    return [
      "<b>Порту и вокруг · Emigro</b>",
      "",
      "Сейчас не получилось выдать ссылку. Напишите сюда «Порту» или /chat через пару минут — или откройте кнопку на portugal.emigro.online ещё раз.",
    ].join("\n");
  }
  const href = escapeTelegramHtml(result.url);
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

/** @emigro_chat_bot — wizard session deep links + wizard link on /start; admin /stats webhook. Discussion group: @emigro_chat. */

export function statsBotToken(): string | undefined {
  const token =
    process.env.EMIGRO_CHAT_BOT_TOKEN?.trim() ||
    process.env.EMIGRO_NEWS_BOT_TOKEN?.trim() ||
    process.env.EMIGRO_BOT_TOKEN?.trim() ||
    process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token || undefined;
}

/** Split long Telegram text on newlines without cutting mid-line (keeps HTML tags intact). */
export function splitTelegramTextChunks(text: string, maxLen = 3500): string[] {
  const trimmed = text.trimEnd();
  if (trimmed.length <= maxLen) return [trimmed];

  const chunks: string[] = [];
  let rest = trimmed;
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf("\n", maxLen);
    if (cut < Math.floor(maxLen * 0.5)) cut = maxLen;
    chunks.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).replace(/^\n+/, "");
  }
  if (rest.trim()) chunks.push(rest.trimEnd());
  return chunks;
}

export function telegramAdminChatIds(): Set<string> {
  const raw =
    process.env.TELEGRAM_ADMIN_CHAT_ID ||
    process.env.TELEGRAM_PRIVATE_CHAT_ID ||
    "";
  const ids = new Set<string>();
  for (const part of raw.split(",")) {
    const clean = part.trim();
    if (clean) ids.add(clean);
  }
  return ids;
}

export function isAdminTelegramChat(
  chatId: string | number | null | undefined,
  userId?: string | number | null
): boolean {
  const admins = telegramAdminChatIds();
  if (admins.size === 0) return false;
  if (chatId != null && admins.has(String(chatId))) return true;
  if (userId != null && admins.has(String(userId))) return true;
  return false;
}

type TelegramApiResult = {
  ok?: boolean;
  description?: string;
  result?: { message_id?: number };
};

export async function sendStatsBotMessage(
  chatId: string | number,
  text: string,
  options?: { parseMode?: "HTML" | null; disableWebPagePreview?: boolean }
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  const token = statsBotToken();
  if (!token) return { success: false, error: "EMIGRO_CHAT_BOT_TOKEN missing" };

  const chunks = splitTelegramTextChunks(text, 3500);
  let messageId: number | undefined;
  for (let i = 0; i < chunks.length; i++) {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text: chunks[i],
      disable_web_page_preview: options?.disableWebPagePreview ?? true,
    };
    if (options?.parseMode === "HTML") {
      body.parse_mode = "HTML";
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as TelegramApiResult;
    if (!res.ok || json.ok === false) {
      return {
        success: false,
        error: `${json.description || res.statusText} (chunk ${i + 1}/${chunks.length})`,
      };
    }
    const id = json.result?.message_id;
    if (typeof id === "number") messageId = id;
  }
  return { success: true, messageId };
}

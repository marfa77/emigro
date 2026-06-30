/** @emigro_chat_bot — wizard session deep links + admin /stats webhook. Discussion group: @emigro_chat. */

export function statsBotToken(): string | undefined {
  const token =
    process.env.EMIGRO_CHAT_BOT_TOKEN?.trim() ||
    process.env.EMIGRO_BOT_TOKEN?.trim();
  return token || undefined;
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

type TelegramApiResult = { ok?: boolean; description?: string };

export async function sendStatsBotMessage(
  chatId: string | number,
  text: string,
  options?: { parseMode?: "HTML" | null }
): Promise<{ success: boolean; error?: string }> {
  const token = statsBotToken();
  if (!token) return { success: false, error: "EMIGRO_CHAT_BOT_TOKEN missing" };

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: text.slice(0, 4096),
    disable_web_page_preview: true,
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
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

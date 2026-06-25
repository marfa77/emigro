/** CIPLE / owner bot — leads + news channel. */
function ownerBotToken(): string | undefined {
  return (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim();
}

function channelBotToken(): string | undefined {
  return ownerBotToken();
}

function dmBotToken(): string | undefined {
  return (process.env.TELEGRAM_BOT_TOKEN || process.env.EMIGRO_NEWS_BOT_TOKEN)?.trim();
}

function ownerChatId(): string | undefined {
  return process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim();
}

async function sendTelegramPlain(
  token: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) return { success: false, error: "bot token missing" };
  if (!chatId) return { success: false, error: "chat id missing" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      disable_web_page_preview: false,
    }),
  });

  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

export async function sendTelegramHtmlToChat(
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const token = dmBotToken();
  if (!token) return { success: false, error: "TELEGRAM_BOT_TOKEN missing" };
  if (!chatId) return { success: false, error: "chat id missing" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });

  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

export async function sendTelegramPlainToChat(
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const token = dmBotToken();
  if (!token) return { success: false, error: "TELEGRAM_BOT_TOKEN missing" };
  return sendTelegramPlain(token, chatId, text);
}

function newsChannelId(): string {
  return (process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news").trim();
}

function splitThreadsForTelegram(text: string, max = 4000): string[] {
  const parts = text.split(/\n\n(?=\d+\/\d+\n)/);
  const chunks: string[] = [];
  let current = "";

  for (const part of parts) {
    const next = current ? `${current}\n\n${part}` : part;
    if (next.length > max) {
      if (current) chunks.push(current.trim());
      current = part.length > max ? part.slice(0, max) : part;
    } else {
      current = next;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, max)];
}

/** Publish editorial HTML digest to @Emigro_news (like CIPLE — one rich post). */
export async function publishNewsDigestHtmlToChannel(html: string): Promise<void> {
  const token = channelBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");

  const channel = newsChannelId();
  const result = await sendTelegramHtmlWithToken(token, channel, html);
  if (!result.success) {
    throw new Error(result.error || `Failed to publish to ${channel}`);
  }
}

async function sendTelegramHtmlWithToken(
  token: string,
  chatId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || json.ok === false) {
    return { success: false, error: json.description || res.statusText };
  }
  return { success: true };
}

/** Publish a readable digest that is also ready to copy into a Threads thread. */
export async function publishNewsDigestToChannel(
  threadsText: string,
  _options?: { flag?: string; countryRu?: string }
): Promise<void> {
  const token = channelBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");
  const channel = newsChannelId();
  const messages = splitThreadsForTelegram(threadsText);
  for (const msg of messages) {
    const result = await sendTelegramPlain(token, channel, msg);
    if (!result.success) throw new Error(result.error || `Failed to publish to ${channel}`);
  }
}

/** Owner DM via CIPLE bot (EMIGRO_NEWS_BOT_TOKEN) — lead shortlist requests, Threads copy. */
export async function sendOwnerTelegramDm(text: string): Promise<{ success: boolean; error?: string }> {
  const token = ownerBotToken();
  const chatId = ownerChatId();
  if (!token) return { success: false, error: "EMIGRO_NEWS_BOT_TOKEN missing" };
  if (!chatId) return { success: false, error: "TELEGRAM_PRIVATE_CHAT_ID missing" };
  return sendTelegramPlain(token, chatId, text);
}

/** @deprecated use sendOwnerTelegramDm */
export async function sendNewsDigestThreadsDm(threadsText: string): Promise<void> {
  const result = await sendOwnerTelegramDm(threadsText);
  if (!result.success) {
    throw new Error(result.error || "Telegram DM failed");
  }
}

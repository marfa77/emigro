import { statsBotToken } from "@/lib/telegram/admin-bot";

export const MAX_TELEGRAM_DOWNLOAD_BYTES = 15 * 1024 * 1024;

async function telegramBotApi(
  method: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown> | null> {
  const token = statsBotToken();
  if (!token) return null;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  return res ? ((await res.json().catch(() => null)) as Record<string, unknown> | null) : null;
}

/** Download a Telegram file by `file_id` (getFile + fetch). Returns null if missing, too large, or failed. */
export async function downloadTelegramFile(fileId: string): Promise<Buffer | null> {
  const token = statsBotToken();
  const info = await telegramBotApi("getFile", { file_id: fileId });
  const filePath = (info?.result as { file_path?: string; file_size?: number } | undefined)?.file_path;
  if (!token || !filePath) return null;
  const res = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.length > MAX_TELEGRAM_DOWNLOAD_BYTES ? null : buf;
}

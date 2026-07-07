import { statsBotToken } from "@/lib/telegram/admin-bot";
import { createHash, createHmac, timingSafeEqual } from "crypto";

export type TelegramLoginPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

function buildDataCheckString(payload: Record<string, unknown>): string {
  const pairs: string[] = [];
  for (const key of Object.keys(payload).sort()) {
    if (key === "hash") continue;
    const value = payload[key];
    if (value === null || value === undefined) continue;
    pairs.push(`${key}=${value}`);
  }
  return pairs.join("\n");
}

/** Validate Telegram Login Widget payload (https://core.telegram.org/widgets/login). */
export function validateTelegramLogin(
  payload: Record<string, unknown>,
  maxAgeSeconds = 86_400
): boolean {
  const token = statsBotToken();
  if (!token) return false;

  const receivedHash = payload.hash;
  if (typeof receivedHash !== "string" || !receivedHash) return false;

  const authDate = Number(payload.auth_date);
  if (!Number.isFinite(authDate) || authDate <= 0) return false;
  if (Math.floor(Date.now() / 1000) - authDate > maxAgeSeconds) return false;

  const dataCheckString = buildDataCheckString(payload);
  const secretKey = createHash("sha256").update(token).digest();
  const calculated = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(calculated, "utf8"), Buffer.from(receivedHash, "utf8"));
  } catch {
    return false;
  }
}

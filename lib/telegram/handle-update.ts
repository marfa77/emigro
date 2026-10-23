import { tryHandleOwnerAgent } from "@/lib/telegram/bot/agent";
import { tryHandleOwnerUpdate } from "@/lib/telegram/bot/owner";
import { routeTelegramUpdate } from "@/lib/telegram/bot/router";
import { getLiveSession } from "@/lib/telegram/bot/session";
import type { TelegramMessage, TelegramUpdate } from "@/lib/telegram/bot/types";

export type { TelegramMessage, TelegramUpdate };

function telegramUserIdFromUpdate(update: TelegramUpdate): number | null {
  const raw =
    update.callback_query?.from?.id ??
    update.message?.from?.id ??
    update.edited_message?.from?.id;
  const userId = Number(raw);
  return Number.isFinite(userId) ? userId : null;
}

export async function processTelegramMessage(message: TelegramMessage): Promise<void> {
  await processTelegramUpdate({ message });
}

export async function processTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (await tryHandleOwnerUpdate(update)) return;

  const userId = telegramUserIdFromUpdate(update);
  if (userId != null) {
    const session = await getLiveSession(userId);
    if (session?.app === "tax") {
      await routeTelegramUpdate(update);
      return;
    }
  }

  if (await tryHandleOwnerAgent(update)) return;
  await routeTelegramUpdate(update);
}

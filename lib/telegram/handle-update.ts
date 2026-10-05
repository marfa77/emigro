import { tryHandleOwnerUpdate } from "@/lib/telegram/bot/owner";
import { routeTelegramUpdate } from "@/lib/telegram/bot/router";
import type { TelegramMessage, TelegramUpdate } from "@/lib/telegram/bot/types";

export type { TelegramMessage, TelegramUpdate };

export async function processTelegramMessage(message: TelegramMessage): Promise<void> {
  await processTelegramUpdate({ message });
}

export async function processTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (await tryHandleOwnerUpdate(update)) return;
  await routeTelegramUpdate(update);
}

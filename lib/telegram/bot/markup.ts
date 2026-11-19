import type { TelegramInlineKeyboard, TelegramReplyKeyboard } from "@/lib/telegram/admin-bot";

export const MENU_REQUEST = "Подобрать специалиста";
export const MENU_STATUS = "Мой запрос";
export const MENU_CITY = "Чат города";
export const MENU_HOME = "Меню";
/** Labels from the pre-2026-11-19 keyboard that people may still have on screen. */
export const MENU_NEWS = "Новости";
export const MENU_ASSIST = "Помощь";
export const MENU_PROPERTY = "Недвижка";
export const MENU_TAX = "Налоги";

export const MENU_LABELS = [
  MENU_HOME,
  MENU_REQUEST,
  MENU_STATUS,
  MENU_CITY,
  MENU_NEWS,
  MENU_ASSIST,
  MENU_PROPERTY,
  MENU_TAX,
] as const;

export function persistentMenuKeyboard(): TelegramReplyKeyboard {
  return {
    keyboard: [[{ text: MENU_REQUEST }], [{ text: MENU_STATUS }, { text: MENU_CITY }]],
    resize_keyboard: true,
    is_persistent: true,
  };
}

export function inlineRows(rows: Array<Array<{ text: string; callback_data: string }>>): TelegramInlineKeyboard {
  return { inline_keyboard: rows };
}

export function parseMenuLabel(text: string): (typeof MENU_LABELS)[number] | null {
  const clean = text.trim();
  return MENU_LABELS.find((label) => label === clean) ?? null;
}

import { publicSiteUrl } from "@/lib/site-url";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { persistentMenuKeyboard } from "@/lib/telegram/bot/markup";
import type { BotUserCtx } from "@/lib/telegram/bot/types";

export function homeHtml(hint?: string): string {
  const origin = publicSiteUrl();
  const wizardUrl = `${origin}${HUB_WIZARD_PATH}`;
  return [
    hint ? `${hint}\n` : "",
    "<b>Emigro</b> — бесплатно подберём юриста или агентство под ваш переезд.",
    "",
    "<b>Подобрать специалиста</b> — несколько коротких вопросов, и мы передадим ваш случай специалисту по маршруту. Для вас бесплатно: комиссию Emigro платит специалист.",
    "<b>Мой запрос</b> — статус вашей заявки.",
    "<b>Чат города</b> — сообщества в Порту, Валенсии, Милане и на Пхукете.",
    "",
    `Подобрать маршрут ВНЖ самостоятельно: <a href="${wizardUrl}">${wizardUrl}</a>`,
    "Не юридическая консультация и не «гарантированный ВНЖ».",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendHome(ctx: BotUserCtx, hint?: string): Promise<void> {
  await sendStatsBotMessage(ctx.chatId, homeHtml(hint), {
    parseMode: "HTML",
    replyMarkup: persistentMenuKeyboard(),
  });
}

export function isGlobalCommand(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t) return false;
  if (/^\/start(?:@\w+)?$/i.test(text.trim())) return true;
  if (/^\/menu(?:@\w+)?$/i.test(text.trim())) return true;
  if (t === "меню" || t === "отмена" || t === "cancel" || t === "/cancel") return true;
  return false;
}

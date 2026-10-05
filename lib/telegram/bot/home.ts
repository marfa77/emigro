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
    "<b>Emigro</b> — личный вход: новости страны, городской чат, заявка на помощь и недвижимость.",
    "Подписка и заявки закрываются здесь, не на сайте. Не юридическая консультация и не «гарантированный ВНЖ».",
    "",
    "<b>Новости</b> — карточка в этот чат, как только выпуск выходит на сайте.",
    "<b>Помощь</b> — подбор партнёра, Route Check €129 или сопровождение.",
    "<b>Недвижка</b> — аренда → городской чат; покупка / инвест → ОАЭ, Пхукет или другой маршрут.",
    "<b>Чат города</b> — Порту, Валенсия, Милан, Пхукет.",
    "",
    `Маршруты ВНЖ на сайте: <a href="${wizardUrl}">${wizardUrl}</a>`,
    "Команды: Меню · отмена · /start",
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

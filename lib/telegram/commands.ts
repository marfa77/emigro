import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { NEWS_TELEGRAM_URL } from "@/lib/community";
import { publicSiteUrl } from "@/lib/site-url";

const STATS_RE = /^\/(?:stats|status)(?:@\w+)?$/i;
const STATS_DEMO_RE = /^\/(?:stats|status)(?:@\w+)?\s+demo$/i;
const START_RE = /^\/start(?:@\w+)?(?:\s|$)/i;

export function isStatsCommand(text: string): boolean {
  return STATS_RE.test((text || "").trim());
}

export function isStatsDemoCommand(text: string): boolean {
  return STATS_DEMO_RE.test((text || "").trim());
}

export function isStartCommand(text: string): boolean {
  return START_RE.test((text || "").trim());
}

export function userWizardLinkMessage(): string {
  const origin = publicSiteUrl();
  const wizardUrl = `${origin}${HUB_WIZARD_PATH}`;
  return [
    "<b>Emigro</b> — навигатор по ВНЖ и релокации для русскоязычных.",
    "",
    "Помогаем разобраться, куда и как переехать: сравниваем маршруты, требования и сроки — без обещаний «гарантированного ВНЖ».",
    "",
    "<b>Что есть на сайте:</b>",
    "• <b>Wizard</b> — подбор страны и программы по вашим ответам",
    "• <b>Коридоры</b> — Португалия, Испания, Франция и другие направления",
    "• <b>Гайды</b> — требования, документы, сроки, практика",
    "• <b>Новости</b> — еженедельные дайджесты с источниками",
    "",
    "<b>Начать с wizard:</b>",
    `<a href="${wizardUrl}">${wizardUrl}</a>`,
    "",
    `<a href="${origin}">emigro.online</a> · <a href="${NEWS_TELEGRAM_URL}">@Emigro_news</a>`,
  ].join("\n");
}

export function buildDemoStatsReport(): string {
  return [
    "<b>📊 Emigro — статистика</b>",
    "<i>⚠️ ДЕМО — пример отчёта, не реальные данные</i>",
    "Часовой пояс: <code>Europe/Lisbon</code> · сегодня 27.06",
    "",
    "<b>Нарастающий итог</b>",
    "Уникальные посетители: <b>128</b> <i>(browser-id, без ботов)</i>",
    "Просмотры страниц: <b>412</b>",
    "Лиды: <b>3</b>",
    "",
    "<b>Сегодня</b> <i>(+5 к вчера)</i>",
    "Посетители: <b>18</b>",
    "Визард started: <b>4</b> <i>(+1 к вчера)</i>",
    "",
    "<b>RU vs ES (LATAM)</b>",
    "<i>ES = /es/* или locale=es / hub-es-latam</i>",
    "<b>🇷🇺 RU</b>",
    "  PV сегодня: <b>14</b> <i>(всего 380)</i>",
    "  Wizard started: <b>3</b> <i>(всего 90)</i>",
    "<b>🇪🇸 ES / LATAM</b>",
    "  PV сегодня: <b>4</b> <i>(всего 32)</i>",
    "  Wizard started: <b>1</b> <i>(всего 4)</i>",
    "",
    "<i>Реальные данные: /stats · этот пример: /stats demo</i>",
  ].join("\n");
}

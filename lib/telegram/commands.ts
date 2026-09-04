import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { publicSiteUrl } from "@/lib/site-url";
import {
  portoChatInviteHtml,
  type PortoChatInviteResult,
} from "@/lib/telegram/porto-chat-invite";

const STATS_RE = /^\/(?:stats|status)(?:@\w+)?$/i;
const STATS_DEMO_RE = /^\/(?:stats|status)(?:@\w+)?\s+demo$/i;
const START_RE = /^\/start(?:@\w+)?(?:\s|$)/i;
const CHAT_RE = /^\/chat(?:@\w+)?$/i;

export function isStatsCommand(text: string): boolean {
  return STATS_RE.test((text || "").trim());
}

export function isStatsDemoCommand(text: string): boolean {
  return STATS_DEMO_RE.test((text || "").trim());
}

export function isStartCommand(text: string): boolean {
  return START_RE.test((text || "").trim());
}

export function isChatCommand(text: string): boolean {
  return CHAT_RE.test((text || "").trim());
}

/** Private DM: join the Porto group (exact phrases + /chat). */
export function isPortoChatRequest(text: string): boolean {
  const t = (text || "").trim().toLowerCase();
  if (!t) return false;
  if (isChatCommand(t)) return true;
  if (t === "порту" || t === "porto" || t === "чат" || t === "группа" || t === "группу") return true;
  if (t === "войти" || t === "вход" || t === "инвайт" || t === "invite") return true;
  if (t.includes("чат порту") || t.includes("чат порто") || t.includes("группу порту")) return true;
  return false;
}

export function userStartMessage(invite: PortoChatInviteResult): string {
  const origin = publicSiteUrl();
  const wizardUrl = `${origin}${HUB_WIZARD_PATH}`;
  return [
    portoChatInviteHtml(invite),
    "",
    "—",
    "",
    "<b>Маршруты ВНЖ</b> — wizard на сайте, без обещаний «гарантированного ВНЖ».",
    `<a href="${wizardUrl}">${wizardUrl}</a>`,
    "",
    `<a href="${origin}">emigro.online</a>`,
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
    "<b>Threads</b> (клики с наших ссылок)",
    "Подписчики @emigro2eu: <b>12</b> <i>(Graph)</i>",
    "7д: визард <b>2</b> · Assist <b>1</b> · гайды <b>0</b>",
    "  26.06: <b>0</b> ·",
    "  27.06: <b>3</b> ▪▪▪",
    "",
    "<i>Реальные данные: /stats · этот пример: /stats demo</i>",
  ].join("\n");
}

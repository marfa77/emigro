import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { publicSiteUrl } from "@/lib/site-url";
import type { SatelliteCityChat } from "@/lib/satellite/city-chats";
import { defaultCityChat, matchCityChatKeyword } from "@/lib/satellite/city-chats";
import {
  cityChatInviteHtml,
  type CityChatInviteResult,
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

/** Private DM: join a satellite city group (exact phrases + /chat). */
export function isCityChatRequest(text: string): boolean {
  const t = (text || "").trim().toLowerCase();
  if (!t) return false;
  if (isChatCommand(t)) return true;
  if (t === "чат" || t === "группа" || t === "группу") return true;
  if (t === "войти" || t === "вход" || t === "инвайт" || t === "invite") return true;
  return Boolean(matchCityChatKeyword(t));
}

/** @deprecated Use isCityChatRequest */
export function isPortoChatRequest(text: string): boolean {
  return isCityChatRequest(text);
}

export function cityChatForKeyword(text: string): SatelliteCityChat {
  return matchCityChatKeyword(text) ?? defaultCityChat();
}

export function userStartMessage(invite: CityChatInviteResult): string {
  const origin = publicSiteUrl();
  const wizardUrl = `${origin}${HUB_WIZARD_PATH}`;
  return [
    cityChatInviteHtml(invite),
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
    "<b>📊 Emigro</b> · <code>Europe/Lisbon</code> · 27.06",
    "Всего: <b>128</b> vis · 412 PV · wizard 40→22 · TG-отчёты 5 · Assist заявки <b>2</b> · лиды <b>3</b>",
    "Сегодня: <b>18</b> vis <i>(+5 к вчера)</i> · ✨12/↩6 · 41 PV · wiz 4→2 · results 3→TG 1 · Assist 2→1 · лиды <b>1</b>",
    "🇷🇺 RU: PV <b>14</b> <i>(+2 к вчера)</i> · wiz 3→1 · results 2",
    "🇪🇸 ES: PV <b>4</b> <i>(= к вчера)</i> · wiz 1→0",
    "🇫🇷 FR: PV <b>0</b> <i>(= к вчера)</i>",
    "",
    "<b>📦 Портфель · 7 дней</b>",
    "Сайт (core): <b>92</b> посетителей · 310 PV · wizard 18 <i>(+12% к прошлым 7д)</i>",
    "",
    "<b>💼 Инвест-миграция</b>",
    "Заявки 7д: <b>8</b> · всего <b>8</b> · в работе 8 · won 0 · lost 0",
    "Куда: 🇹🇭TH×4 · 🇬🇷GR×1 · 🇪🇸ES×1 · 🇵🇹PT×1 · 🇦🇪AE×1",
    "просмотры /invest <b>12</b> · hub 11 · страны 1 · results 0",
    "<i>Заявки пришли без квалификатора (форма/API)</i>",
    "Бюджет в анкетах: ~€3 050k <i>(сумма полей юзеров, не деньги Emigro)</i>",
    "",
    "<b>🛰 Сателлиты</b> <i>чат · гайды · темы из чужих TG</i>",
    "🇵🇹 Португалия: чат <b>47</b> · гайды <b>65</b> <i>(+1)</i> · темы <b>9</b>/7д",
    "🇪🇸 Испания: чат <b>19</b> · гайды <b>18</b> <i>(+2)</i> · темы <b>117</b>/7д",
    "🇮🇹 Италия: чат <b>3</b> · гайды <b>18</b> <i>(+3)</i> · темы <b>48</b>/7д",
    "🇹🇭 Таиланд: чат <b>2</b> · гайды <b>15</b> · тем нет",
    "",
    "<b>🚪 Приток сегодня</b>",
    "Каналы: <code>search</code> 9 · <code>direct</code> 6 · <code>llm</code> 2",
    "Discovery: 🔍 <code>/ru/portugal</code> 3 · 🤖 <code>/es/peru</code> 1",
    "Страны: 🇷🇺 RU 11 · 🇪🇸 ES 3 · 🇩🇪 DE 2",
    "",
    "<b>🧵 Threads</b>",
    "<b>@emigro_assist</b>: 7д <b>6</b> <i>(=)</i> · 30д 25",
    "  → wizard 14",
    "  <code>/ru</code>×3 · <code>/ru/wizard</code>×2",
    "<b>@emigro_invest</b>: 7д <b>1</b> <i>(новое)</i> · 30д 1",
    "  → без конверсий",
    "  <code>/ru/invest</code>×1",
    "",
    "<b>🔎 GSC · 28д</b>: клики <b>140</b> · показы <b>4200</b> · CTR 3.3% · поз. 18.2",
    "",
    "<b>Динамика 7 дней</b> (посетители / просмотры)",
    "  21.06: <b>9</b> / 28 ▪▪▪▪▪▪▪▪▪",
    "  27.06: <b>18</b> / 41 ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪",
    "",
    "<i>/stats · /stats demo</i>",
  ].join("\n");
}

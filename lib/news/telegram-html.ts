import { CHANNEL_STYLE_BANNED_RU, TELEGRAM_DIGEST_MAX_CHARS } from "./editorial";
import { isGoogleNewsUrl } from "./article-resolve";
import { isCriticalInvestorRiskText } from "./scoring";

export type SelectedStory = {
  title: string;
  link: string;
  source: string;
  why: string;
  snippet: string;
};

function stripTelegramHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countBoldOpens(html: string): number {
  return (html.match(/<b\b/gi) ?? []).length;
}

function countTelegramAnchors(html: string): number {
  return (html.match(/<a\s+href\s*=/gi) ?? []).length;
}

export function sanitizeTelegramHtml(text: string): string {
  let out = text.trim();
  out = out.replace(/<\/strong>/gi, "</b>").replace(/<strong\b[^>]*>/gi, "<b>");
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<(?!\/?(b|i|a)\b)[^>]*>/gi, "");
  out = out.replace(/href\s*=\s*"(javascript:[^"]*)"/gi, 'href="#"');
  out = out.replace(/\n{3,}/g, "\n\n");
  out = out.replace(/[ \t]+\n/g, "\n");
  return out;
}

export function ensureTelegramHtmlBlockSpacing(html: string): string {
  return html
    .replace(/<\/b>\s*(?=<b>)/gi, "</b>\n\n")
    .replace(/<\/b>\s*(?=<i>)/gi, "</b>\n")
    .replace(/<\/i>\s*(?=<b>)/gi, "</i>\n\n")
    .replace(/\n{3,}/g, "\n\n");
}

export function stripLeadingWeekBannerLine(html: string): string {
  return html.replace(/^[^\n]*дайджест за неделю[^\n]*\n+/i, "").trim();
}

export function weekHeaderLine(flag: string, weekFrom: Date, weekEnd: Date): string {
  const fmt = (d: Date) =>
    `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
  return `${flag} 🗓 <b>Дайджест за неделю:</b> ${fmt(weekFrom)} - ${fmt(weekEnd)}`;
}

export function digestHtmlFormatViolation(html: string, selected: SelectedStory[]): string | null {
  const n = selected.length;
  const minAnchors = Math.min(n, Math.max(3, Math.min(6, n)));
  const anchors = countTelegramAnchors(html);
  if (anchors < minAnchors) return `need >=${minAnchors} source links (got ${anchors})`;
  if (!/<a\s+href\s*=\s*"https?:\/\//i.test(html)) return "source links must be full https URLs";
  if (countBoldOpens(html) < 4) return "need multiple <b> section titles";
  if (!/<b>\s*критические риски инвестора\s*<\/b>/i.test(html)) {
    return 'missing "<b>Критические риски инвестора</b>"';
  }
  if (!/<b>\s*разбор\s*<\/b>/i.test(html) && !/<b>\s*факт:\s*<\/b>/i.test(html)) {
    return "missing story breakdown with <b>Факт:</b>";
  }
  const banned = new RegExp(CHANNEL_STYLE_BANNED_RU, "i").exec(stripTelegramHtmlToText(html));
  if (banned) return `avoid LLM style marker: "${banned[0]}"`;
  const googleAnchors = (html.match(/<a\s+href\s*=\s*"([^"]+)"/gi) ?? []).filter((a) => {
    const m = a.match(/href\s*=\s*"([^"]+)"/i);
    return m && isGoogleNewsUrl(m[1]);
  });
  if (googleAnchors.length > 1) return `too many Google News links in sources (${googleAnchors.length})`;
  return null;
}

export function buildDeterministicDigestFallback(
  headerLine: string,
  selected: SelectedStory[],
  countryRu: string
): string {
  const items = selected.slice(0, 5);
  const hook = items[0]?.title ? `Главная линия недели: ${items[0].title.slice(0, 160)}.` : `Сигналы недели по ${countryRu}.`;
  const review = items
    .map((s) => `<b>Факт:</b> ${s.title}\n<i>Мы:</i> ${s.why || "Проверьте первоисточник и сроки для вашего кейса."}`)
    .join("\n\n");
  const risks = items.some((s) => isCriticalInvestorRiskText(`${s.title} ${s.snippet}`))
    ? "• Есть сигналы по срокам гражданства — пересчитайте таймлайн с юристом."
    : "• За эту неделю подтверждённых изменений 5→10 лет в источниках нет.";
  const sources = items
    .map((s) => `<a href="${s.link.replace(/"/g, "&quot;")}">${s.source}</a>`)
    .join("\n");

  const body = `<b>Главное</b>
${hook}

<b>Разбор</b>
${review}

<b>Критические риски инвестора</b>
${risks}

<b>Фокус по стране</b>
• Сверьте маршрут ВНЖ с актуальными требованиями консульства.

<b>Что сделать сейчас</b>
• Зафиксируйте дату подачи и список документов.
• Попросите письменную позицию юриста по вашему кейсу.

<b>Источники</b>
${sources}`;

  return sanitizeTelegramHtml(`${headerLine}\n\n${body}`);
}

export function enforceSinglePostLimit(html: string): string {
  if (html.length <= TELEGRAM_DIGEST_MAX_CHARS) return html;
  let s = html.slice(0, TELEGRAM_DIGEST_MAX_CHARS - 40).trimEnd();
  s = s.replace(/<[^>]*$/g, "");
  return sanitizeTelegramHtml(`${s}\n\n<i>…</i>`);
}

export function addArticleLinkToDigest(html: string, articleUrl: string): string {
  if (html.includes("Полная версия на Emigro") || html.includes(articleUrl)) return html;
  const marker = "<b>Источники</b>";
  const insert = `<b>На сайте</b>\n<a href="${articleUrl}">Полная версия на Emigro</a>\n\n`;
  const idx = html.indexOf(marker);
  if (idx === -1) return `${html}\n\n${insert.trim()}`;
  return `${html.slice(0, idx)}${insert}${html.slice(idx)}`;
}

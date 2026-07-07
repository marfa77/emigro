import {
  buildStatsReport,
  countryFlag,
  deltaLine,
  type StatsReport,
} from "@/lib/analytics/stats";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function deltaHtml(today: number, yesterday: number): string {
  return ` <i>${escapeHtml(deltaLine(today, yesterday))}</i>`;
}

function fmtTop(title: string, rows: Array<[string, number]>): string[] {
  if (rows.length === 0) return [`<b>${title}</b>: —`];
  const lines = [`<b>${title}</b>:`];
  for (const [label, cnt] of rows) {
    const short = label.length <= 48 ? label : `${label.slice(0, 45)}…`;
    lines.push(`  • <code>${escapeHtml(short)}</code> — ${cnt}`);
  }
  return lines;
}

function fmtSessionRow(s: StatsReport["recentSessions"][number]): string {
  const prefix = s.isReturning ? "↩ " : "✨ ";
  const meta = [s.country, s.llm, s.referrer].filter(Boolean).join(" · ") || "direct";
  const path = s.pagePath ?? "—";
  const shortPath = path.length > 40 ? `${path.slice(0, 37)}…` : path;
  return `  ${prefix}<code>${escapeHtml(s.sessionId)}</code> · ${escapeHtml(meta)} · ${escapeHtml(shortPath)}`;
}

function conversionPct(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

export function formatStatsReportTelegram(report: StatsReport): string {
  const { total, today, yesterday, wizardTelegram: tg } = report;

  const lines: string[] = [
    "<b>📊 Emigro — статистика</b>",
    `Часовой пояс: <code>${escapeHtml(report.timezone)}</code> · сегодня ${escapeHtml(report.todayLabel)}`,
    "",
    "<b>Нарастающий итог</b>",
    `Уникальные посетители: <b>${total.visitors}</b> <i>(browser-id, без ботов)</i>`,
    `Просмотры страниц: <b>${total.pageViews}</b>`,
    `Сессии (session_start): <b>${total.newSessions}</b>`,
    `Сессии с визардом: <b>${total.wizardStarted}</b>`,
    `Завершения визарда: <b>${total.wizardCompleted}</b>`,
    `Отчётов в Telegram: <b>${tg.deliveriesSentTotal}</b> <i>(юзеров ${tg.usersTotal})</i>`,
    `Лиды: <b>${total.leads}</b>`,
    `Событий в БД: <b>${total.eventsTotal}</b>`,
    `Боты (исключены): <b>${report.botsTotal}</b> сессий`,
    "",
    `<b>Сегодня</b>${deltaHtml(today.visitors, yesterday.visitors)}`,
    `Посетители: <b>${today.visitors}</b>`,
    `  ↩ вернулись: <b>${report.todayReturningVisitors}</b>${deltaHtml(report.todayReturningVisitors, report.yesterdayReturningVisitors)}`,
    `  ✨ новые: <b>${report.todayNewVisitors}</b>${deltaHtml(report.todayNewVisitors, report.yesterdayNewVisitors)}`,
    `Просмотры страниц: <b>${today.pageViews}</b>${deltaHtml(today.pageViews, yesterday.pageViews)}`,
    `Новые сессии: <b>${today.newSessions}</b>${deltaHtml(today.newSessions, yesterday.newSessions)}`,
    `Визард started: <b>${today.wizardStarted}</b>${deltaHtml(today.wizardStarted, yesterday.wizardStarted)}`,
    `Просмотры результатов: <b>${tg.resultsViewsToday}</b>${deltaHtml(tg.resultsViewsToday, tg.resultsViewsYesterday)}`,
    `Отчётов в Telegram: <b>${tg.deliveriesToday}</b>${deltaHtml(tg.deliveriesToday, tg.deliveriesYesterday)} <i>(новых юзеров ${tg.usersNewToday})</i>`,
    `Конверсия results → TG: <b>${escapeHtml(conversionPct(tg.deliveriesToday, tg.resultsViewsToday))}</b>`,
    `Лиды: <b>${today.leads}</b>${deltaHtml(today.leads, yesterday.leads)}`,
    `LLM-трафик: <b>${report.llmToday}</b>${deltaHtml(report.llmToday, report.llmYesterday)} <i>(всего ${report.llmTotal})</i>`,
    `Боты (исключены): <b>${report.botsToday}</b>${deltaHtml(report.botsToday, report.botsYesterday)} <i>(всего ${report.botsTotal})</i>`,
    "",
    "<b>Динамика 7 дней</b> (посетители / просмотры)",
  ];

  for (const row of report.trend) {
    const bar = row.visitors > 0 ? "▪".repeat(Math.min(row.visitors, 12)) : "·";
    lines.push(`  ${escapeHtml(row.dayLabel)}: <b>${row.visitors}</b> / ${row.pageViews} ${bar}`);
  }

  lines.push("");
  lines.push(...fmtTop("Топ страниц сегодня", report.topPagesToday));
  lines.push("");
  lines.push(...fmtTop("Топ страниц всего", report.topPagesAll));

  if (report.topReferrersToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Referrer сегодня", report.topReferrersToday));
  }
  if (report.topUtmToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("UTM source сегодня", report.topUtmToday));
  }
  if (report.topCountriesToday.length > 0) {
    lines.push("");
    lines.push(
      ...fmtTop(
        "Страны сегодня",
        report.topCountriesToday.map(([code, cnt]) => [`${countryFlag(code)} ${code}`, cnt])
      )
    );
  }
  if (report.topLangToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Языки сегодня", report.topLangToday));
  }
  if (report.topDeviceToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Устройства сегодня", report.topDeviceToday));
  }
  if (report.topBrowserToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Браузеры сегодня", report.topBrowserToday));
  }

  lines.push("");
  lines.push(`<b>Посетители сегодня</b> (последние ${report.recentSessions.length}):`);
  if (report.recentSessions.length === 0) {
    lines.push("  — пока нет");
  } else {
    for (const s of report.recentSessions) {
      lines.push(fmtSessionRow(s));
    }
  }

  lines.push("");
  lines.push("<i>Обновить: /stats или /status</i>");

  return lines.join("\n");
}

export async function buildTelegramStatsReport(): Promise<string> {
  const report = await buildStatsReport();
  return formatStatsReportTelegram(report);
}

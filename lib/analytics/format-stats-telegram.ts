import {
  buildStatsReport,
  countryFlag,
  deltaLine,
  type StatsReport,
} from "@/lib/analytics/stats";
import { formatThreadsReferralsTelegram } from "@/lib/analytics/threads-stats";

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

function channelLabel(s: StatsReport["recentSessions"][number]): string {
  if (s.channel === "llm") return s.llm || "llm";
  if (s.channel === "search") return "search";
  if (s.channel === "direct") return "direct";
  if (s.channel === "social") return "social";
  if (s.channel === "referral") return "referral";
  if (s.channel === "internal") return "internal";
  return s.channel;
}

function fmtSessionRow(s: StatsReport["recentSessions"][number]): string {
  const prefix = s.isReturning ? "↩ " : "✨ ";
  const meta = [s.country, channelLabel(s), s.referrer].filter(Boolean).join(" · ") || "direct";
  const path = s.pagePath ?? "—";
  const shortPath = path.length > 40 ? `${path.slice(0, 37)}…` : path;
  return `  ${prefix}<code>${escapeHtml(s.sessionId)}</code> · ${escapeHtml(meta)} · ${escapeHtml(shortPath)}`;
}

function conversionPct(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

function fmtLocaleBucket(
  label: string,
  today: StatsReport["localeSplit"]["today"]["es"],
  yesterday: StatsReport["localeSplit"]["yesterday"]["es"],
  total: StatsReport["localeSplit"]["total"]["es"]
): string[] {
  return [
    `<b>${label}</b>`,
    `  PV сегодня: <b>${today.pageViews}</b>${deltaHtml(today.pageViews, yesterday.pageViews)} <i>(всего ${total.pageViews})</i>`,
    `  Wizard started: <b>${today.wizardStarted}</b>${deltaHtml(today.wizardStarted, yesterday.wizardStarted)} <i>(всего ${total.wizardStarted})</i>`,
    `  Wizard done: <b>${today.wizardCompleted}</b>${deltaHtml(today.wizardCompleted, yesterday.wizardCompleted)} <i>(всего ${total.wizardCompleted})</i>`,
    `  Results view: <b>${today.resultsViews}</b>${deltaHtml(today.resultsViews, yesterday.resultsViews)} <i>(всего ${total.resultsViews})</i>`,
  ];
}

function fmtLocaleSplit(report: StatsReport): string[] {
  const { today, yesterday, total } = report.localeSplit;
  const lines = [
    "<b>RU / ES / FR</b>",
    "<i>ES=/es/* · FR=/fr/* · RU=/ru/* (+ satellite)</i>",
    ...fmtLocaleBucket("🇷🇺 RU", today.ru, yesterday.ru, total.ru),
    ...fmtLocaleBucket("🇪🇸 ES / LATAM", today.es, yesterday.es, total.es),
    ...fmtLocaleBucket("🇫🇷 FR / Afrique", today.fr, yesterday.fr, total.fr),
  ];
  const otherToday =
    today.other.pageViews +
    today.other.wizardStarted +
    today.other.wizardCompleted +
    today.other.resultsViews;
  if (otherToday > 0 || total.other.pageViews > 0) {
    lines.push(...fmtLocaleBucket("Other", today.other, yesterday.other, total.other));
  }
  return lines;
}

function periodDelta(current: number, previous: number): string {
  if (previous === 0) return current === 0 ? "=" : "новое";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

function fmtPortfolio(report: StatsReport): string[] {
  const { portfolio } = report;
  const core = portfolio.surfaces.find((surface) => surface.key === "core");
  const investment = portfolio.investment;
  const lines: string[] = [
    "<b>📈 Что изменилось за 7 дней</b>",
    core
      ? `Core visitors: <b>${core.current7d.visitors}</b> <i>(${periodDelta(core.current7d.visitors, core.previous7d.visitors)} к прошлым 7д)</i>`
      : "Core visitors: —",
    `Investment PV: <b>${investment.pageViews7d}</b> <i>(${periodDelta(investment.pageViews7d, investment.pageViewsPrevious7d)} к прошлым 7д)</i>`,
    `Investment leads: <b>${investment.leads7d}</b>`,
    "",
    "<b>🛰 Сателлиты · 7 дней</b>",
  ];
  for (const surface of portfolio.surfaces.filter((item) => item.key !== "core")) {
    lines.push(
      `${escapeHtml(surface.label)}: <b>${surface.current7d.visitors}</b> visitors / ${surface.current7d.pageViews} PV · wizard ${surface.current7d.wizardStarted} · chat intent ${surface.current7d.communityClicks} <i>(${periodDelta(surface.current7d.visitors, surface.previous7d.visitors)})</i>`
    );
  }

  lines.push(
    "",
    "<b>💼 Инвестиционная миграция</b>",
    `7д: PV <b>${investment.pageViews7d}</b> → qualifier <b>${investment.qualifierStarted7d}</b> → completed <b>${investment.qualifierCompleted7d}</b> → CRM leads <b>${investment.leads7d}</b>`,
    `PV: hub ${investment.hubViews7d} · страны ${investment.countryViews7d} · results ${investment.resultsViews7d}`,
    `Всего лидов: <b>${investment.leadsTotal}</b> · assigned ${investment.assigned} · won ${investment.won} · lost ${investment.lost}`,
    `Капитал профилей: <b>€${investment.budgetTotalEur.toLocaleString("ru-RU")}</b> <i>(не revenue/AUM)</i>`
  );
  if (investment.topDestinations.length) {
    lines.push(...fmtTop("Направления", investment.topDestinations));
  }

  lines.push("", "<b>💬 Telegram / community</b>");
  for (const country of portfolio.community) {
    lines.push(
      `${escapeHtml(country.label)}: сигналы 7д <b>${country.signals7d}</b> · backlog ${country.backlog} · notes ${country.publishedNotes} (+${country.published7d}) · источники ${country.activeChannels}/${country.totalChannels}`
    );
  }
  for (const chat of portfolio.ownedChats) {
    const change =
      chat.members != null && chat.previous7d != null
        ? ` <i>(${periodDelta(chat.members, chat.previous7d)} за 7д)</i>`
        : "";
    lines.push(`${escapeHtml(chat.label)}: <b>${chat.members ?? "—"}</b>${change}`);
  }
  lines.push("<i>chat intent — клик на вход; members — реальные участники Telegram</i>");

  const gsc = portfolio.searchConsole;
  lines.push("", "<b>🔎 Google Search Console · 28 дней</b>");
  if (gsc.available) {
    lines.push(
      `Клики: <b>${gsc.clicks}</b> <i>(${periodDelta(gsc.clicks, gsc.previousClicks)})</i> · показы: <b>${gsc.impressions}</b> <i>(${periodDelta(gsc.impressions, gsc.previousImpressions)})</i>`,
      `CTR: <b>${(gsc.ctr * 100).toFixed(1)}%</b> · позиция: <b>${gsc.position.toFixed(1)}</b>`
    );
    if (gsc.topQueries.length) {
      lines.push(...fmtTop("GSC запросы · показы", gsc.topQueries.slice(0, 5).map((row) => [row.key, row.impressions])));
    }
  } else {
    lines.push(`— недоступен: <i>${escapeHtml(gsc.error || "credentials missing")}</i>`);
  }

  lines.push("", "<b>🧵 Threads · два канала</b>");
  for (const account of portfolio.threadsAccounts) {
    lines.push(
      `<b>@${account.handle}</b>: followers ${account.followers ?? "—"} · переходы 7д <b>${account.sessions7d}</b> <i>(${periodDelta(account.sessions7d, account.sessionsPrevious7d)})</i> · 30д ${account.sessions30d}`,
      `  downstream: wizard ${account.wizardStarts} · Assist ${account.assistClicks} · qualifier ${account.qualifierStarts} · invest leads ${account.leads}`
    );
    if (account.topLandings.length) {
      lines.push(...fmtTop(`@${account.handle} landing`, account.topLandings.slice(0, 3)));
    }
  }
  return lines;
}

export function formatStatsReportTelegram(report: StatsReport): string {
  const { total, today, yesterday, wizardTelegram: tg, assist } = report;

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
    `Assist: просмотры: <b>${assist.pageViewsTotal}</b> · CTA: <b>${assist.ctaClicksTotal}</b> · заявки: <b>${assist.leadsTotal}</b>`,
    `Переходы в чаты: <b>${assist.communityClicksTotal}</b>`,
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
    "<b>🧭 Emigro Assist</b>",
    `Просмотры /assist: <b>${assist.pageViewsToday}</b>${deltaHtml(assist.pageViewsToday, assist.pageViewsYesterday)} <i>(всего ${assist.pageViewsTotal})</i>`,
    `Sample plan: <b>${assist.samplePlanViewsToday}</b>${deltaHtml(assist.samplePlanViewsToday, assist.samplePlanViewsYesterday)} <i>(всего ${assist.samplePlanViewsTotal})</i>`,
    `Клики CTA → Assist: <b>${assist.ctaClicksToday}</b>${deltaHtml(assist.ctaClicksToday, assist.ctaClicksYesterday)} <i>(всего ${assist.ctaClicksTotal})</i>`,
    `Заявки Assist: <b>${assist.leadsToday}</b>${deltaHtml(assist.leadsToday, assist.leadsYesterday)} <i>(всего ${assist.leadsTotal})</i>`,
    `Конверсия CTA → заявка: <b>${escapeHtml(conversionPct(assist.leadsToday, assist.ctaClicksToday))}</b>`,
    `Переходы в чаты: <b>${assist.communityClicksToday}</b>${deltaHtml(assist.communityClicksToday, assist.communityClicksYesterday)} <i>(всего ${assist.communityClicksTotal})</i>`,
    "",
    ...fmtLocaleSplit(report),
    "",
    ...fmtPortfolio(report),
    "",
    "<b>Динамика 7 дней</b> (посетители / просмотры)",
  ];

  for (const row of report.trend) {
    const bar = row.visitors > 0 ? "▪".repeat(Math.min(row.visitors, 12)) : "·";
    lines.push(`  ${escapeHtml(row.dayLabel)}: <b>${row.visitors}</b> / ${row.pageViews} ${bar}`);
  }

  lines.push("");
  lines.push(...formatThreadsReferralsTelegram(report.threads));

  lines.push("");
  lines.push(...fmtTop("Топ из поиска сегодня", report.topPagesSearchToday));
  lines.push("");
  lines.push(...fmtTop("Топ из LLM сегодня", report.topPagesLlmToday));
  if (report.llmSourcesToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("LLM-источники сегодня", report.llmSourcesToday));
  }
  if (report.channelMixToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Каналы сегодня (сессии)", report.channelMixToday));
  }
  lines.push("");
  lines.push(...fmtTop("Топ поиск+LLM всего", report.topPagesDiscoveryAll));
  lines.push("");
  lines.push(...fmtTop("Топ страниц сегодня (все источники)", report.topPagesToday));
  lines.push("");
  lines.push(...fmtTop("Топ страниц всего (все источники)", report.topPagesAll));
  if (assist.topAssistPagesToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Assist: страницы сегодня", assist.topAssistPagesToday));
  }
  if (assist.topCtaPlacementsToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Assist: CTA placements сегодня", assist.topCtaPlacementsToday));
  }
  if (assist.topCommunityPlacementsToday.length > 0) {
    lines.push("");
    lines.push(...fmtTop("Чаты: страна · placement сегодня", assist.topCommunityPlacementsToday));
  }

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

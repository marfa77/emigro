import {
  buildStatsReport,
  countryFlag,
  deltaLine,
  type StatsReport,
} from "@/lib/analytics/stats";
import { formatRevolutReferralTelegramLine } from "@/lib/partners/revolut-referral";
import { formatWiseReferralTelegramLine } from "@/lib/partners/wise-referral";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function deltaHtml(today: number, yesterday: number): string {
  return ` <i>${escapeHtml(deltaLine(today, yesterday))}</i>`;
}

function periodDelta(current: number, previous: number): string {
  if (previous === 0) return current === 0 ? "=" : "новое";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

function compactTop(rows: Array<[string, number]>, limit = 3): string {
  if (!rows.length) return "—";
  return rows
    .slice(0, limit)
    .map(([label, cnt]) => {
      const short = label.length <= 36 ? label : `${label.slice(0, 33)}…`;
      return `<code>${escapeHtml(short)}</code> ${cnt}`;
    })
    .join(" · ");
}

function fmtLocaleLines(report: StatsReport): string[] {
  const { today, yesterday } = report.localeSplit;
  const row = (
    flag: string,
    label: string,
    t: typeof today.ru,
    y: typeof yesterday.ru
  ): string => {
    const pvDelta = deltaHtml(t.pageViews, y.pageViews);
    const wiz =
      t.wizardStarted > 0 || t.wizardCompleted > 0
        ? ` · wiz ${t.wizardStarted}→${t.wizardCompleted}`
        : "";
    const results = t.resultsViews > 0 ? ` · results ${t.resultsViews}` : "";
    return `${flag} ${label}: PV <b>${t.pageViews}</b>${pvDelta}${wiz}${results}`;
  };
  return [
    row("🇷🇺", "RU", today.ru, yesterday.ru),
    row("🇪🇸", "ES", today.es, yesterday.es),
    row("🇫🇷", "FR", today.fr, yesterday.fr),
  ];
}

/** All-time + today pulse — three lines, no bots/events/LLM noise. */
function fmtPulse(report: StatsReport): string[] {
  const { total, today, yesterday, wizardTelegram: tg, assist } = report;
  return [
    `<b>📊 Emigro</b> · <code>${escapeHtml(report.timezone)}</code> · ${escapeHtml(report.todayLabel)}`,
    `Всего: <b>${total.visitors}</b> vis · ${total.pageViews} PV · wizard ${total.wizardStarted}→${total.wizardCompleted} · TG-отчёты ${tg.deliveriesSentTotal} · Assist заявки <b>${assist.leadsTotal}</b> · лиды <b>${total.leads}</b>`,
    `Сегодня: <b>${today.visitors}</b> vis${deltaHtml(today.visitors, yesterday.visitors)} · ✨${report.todayNewVisitors}/↩${report.todayReturningVisitors} · ${today.pageViews} PV · wiz ${today.wizardStarted}→${today.wizardCompleted} · results ${tg.resultsViewsToday}→TG ${tg.deliveriesToday} · Assist ${assist.ctaClicksToday}→${assist.leadsToday} · лиды <b>${today.leads}</b>`,
  ];
}

const SAT_FLAG: Record<string, string> = {
  portugal: "🇵🇹",
  spain: "🇪🇸",
  italy: "🇮🇹",
  thailand: "🇹🇭",
};

const DEST_FLAG: Record<string, string> = {
  TH: "🇹🇭",
  GR: "🇬🇷",
  ES: "🇪🇸",
  PT: "🇵🇹",
  AE: "🇦🇪",
  CY: "🇨🇾",
  MT: "🇲🇹",
  HU: "🇭🇺",
  IT: "🇮🇹",
  FR: "🇫🇷",
  DE: "🇩🇪",
};

function fmtInvestBlock(invest: StatsReport["portfolio"]["investment"]): string[] {
  const lines: string[] = ["<b>💼 Инвест-миграция</b>"];

  const open = Math.max(0, invest.leadsTotal - invest.won - invest.lost);
  lines.push(
    `Заявки 7д: <b>${invest.leads7d}</b> · всего <b>${invest.leadsTotal}</b> · в работе ${open} · won ${invest.won} · lost ${invest.lost}`
  );

  if (invest.topDestinations.length) {
    const dest = invest.topDestinations
      .slice(0, 6)
      .map(([code, n]) => {
        const flag = DEST_FLAG[code.toUpperCase()] ?? "";
        return `${flag}${escapeHtml(code)}×${n}`;
      })
      .join(" · ");
    lines.push(`Куда: ${dest}`);
  }

  // Traffic only if meaningful — don't fake a funnel when leads bypass qualifier
  if (invest.pageViews7d > 0 || invest.qualifierStarted7d > 0) {
    const trafficBits = [`просмотры /invest <b>${invest.pageViews7d}</b>`];
    if (invest.hubViews7d || invest.countryViews7d || invest.resultsViews7d) {
      trafficBits.push(
        `hub ${invest.hubViews7d} · страны ${invest.countryViews7d} · results ${invest.resultsViews7d}`
      );
    }
    lines.push(trafficBits.join(" · "));
  }

  if (invest.qualifierStarted7d > 0 || invest.qualifierCompleted7d > 0) {
    lines.push(
      `Квалификатор: старт ${invest.qualifierStarted7d} · дошли до результата ${invest.qualifierCompleted7d}`
    );
  } else if (invest.leads7d > 0) {
    lines.push("<i>Заявки пришли без квалификатора (форма/API)</i>");
  }

  if (invest.budgetTotalEur > 0) {
    const eur = `€${Math.round(invest.budgetTotalEur / 1000).toLocaleString("ru-RU")}k`;
    lines.push(`Бюджет в анкетах: ~${eur} <i>(сумма полей юзеров, не деньги Emigro)</i>`);
  }

  return lines;
}

function fmtPortfolio(report: StatsReport): string[] {
  const { portfolio } = report;
  const core = portfolio.surfaces.find((s) => s.key === "core");
  const lines: string[] = [
    "<b>📦 Портфель · 7 дней</b>",
    core
      ? `Сайт (core): <b>${core.current7d.visitors}</b> посетителей · ${core.current7d.pageViews} PV · wizard ${core.current7d.wizardStarted} <i>(${periodDelta(core.current7d.visitors, core.previous7d.visitors)} к прошлым 7д)</i>`
      : "Сайт (core): —",
    "",
    ...fmtInvestBlock(portfolio.investment),
  ];

  const chatsByCountry = new Map(
    portfolio.ownedChats.map((chat) => [chat.countryKey, chat] as const)
  );
  const communityByCountry = new Map(
    portfolio.community.map((row) => [row.countryKey, row] as const)
  );
  const surfaceByCountry = new Map(
    portfolio.surfaces.filter((s) => s.key !== "core").map((s) => [s.key, s] as const)
  );

  const countryKeys = Array.from(
    new Set([
      ...portfolio.community.map((c) => c.countryKey),
      ...portfolio.ownedChats.map((c) => c.countryKey),
      ...portfolio.surfaces.filter((s) => s.key !== "core").map((s) => s.key),
    ])
  ) as Array<"portugal" | "spain" | "italy" | "thailand">;

  if (countryKeys.length) {
    lines.push("", "<b>🛰 Сателлиты</b> <i>чат · гайды · темы из чужих TG</i>");
    for (const key of countryKeys) {
      const community = communityByCountry.get(key);
      const chat = chatsByCountry.get(key);
      const surface = surfaceByCountry.get(key);
      const flag = SAT_FLAG[key] ?? "";
      const label = community?.label ?? chat?.label ?? surface?.label ?? key;

      const bits: string[] = [];

      if (chat?.members != null) {
        const change =
          chat.previous7d != null
            ? ` <i>(${periodDelta(chat.members, chat.previous7d)})</i>`
            : "";
        bits.push(`чат <b>${chat.members}</b>${change}`);
      } else {
        bits.push("чат —");
      }

      if (community) {
        const notesDelta =
          community.published7d > 0 ? ` <i>(+${community.published7d})</i>` : "";
        bits.push(`гайды <b>${community.publishedNotes}</b>${notesDelta}`);
        bits.push(
          community.signals7d > 0
            ? `темы <b>${community.signals7d}</b>/7д`
            : "тем нет"
        );
        if (community.totalChannels > 0 && community.activeChannels === 0) {
          bits.push("<i>парсер молчит</i>");
        }
      } else if (surface) {
        bits.push(`vis <b>${surface.current7d.visitors}</b>`);
      }

      lines.push(`${flag} ${escapeHtml(label)}: ${bits.join(" · ")}`);
    }
  }

  return lines;
}

function fmtAcquisition(report: StatsReport): string[] {
  const lines: string[] = ["<b>🚪 Приток сегодня</b>"];

  if (report.channelMixToday.length) {
    lines.push(`Каналы: ${compactTop(report.channelMixToday, 5)}`);
  } else {
    lines.push("Каналы: —");
  }

  const discovery = [
    ...report.topPagesSearchToday.slice(0, 2).map(([p, n]) => [`🔍 ${p}`, n] as [string, number]),
    ...report.topPagesLlmToday.slice(0, 2).map(([p, n]) => [`🤖 ${p}`, n] as [string, number]),
  ];
  if (discovery.length) {
    lines.push(`Discovery: ${compactTop(discovery, 4)}`);
  }

  if (report.topCountriesToday.length) {
    lines.push(
      `Страны: ${compactTop(
        report.topCountriesToday.map(([code, cnt]) => [`${countryFlag(code)} ${code}`, cnt]),
        5
      )}`
    );
  }

  if (report.llmToday > 0) {
    lines.push(`LLM: <b>${report.llmToday}</b>${deltaHtml(report.llmToday, report.llmYesterday)}`);
  }

  return lines;
}

function cleanLandingPath(raw: string): string {
  const value = raw.trim();
  if (!value) return "/";
  try {
    const url = value.includes("://") ? new URL(value) : new URL(value, "https://emigro.online");
    return url.pathname || "/";
  } catch {
    return value.split("?")[0] || "/";
  }
}

/** Collapse UTM clones: /ru?utm=… and /ru → one bucket. */
function compactLandings(rows: Array<[string, number]>, limit = 3): string {
  const merged = new Map<string, number>();
  for (const [raw, count] of rows) {
    const path = cleanLandingPath(raw);
    merged.set(path, (merged.get(path) ?? 0) + count);
  }
  const sorted = Array.from(merged.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
  if (!sorted.length) return "";
  return sorted
    .map(([path, n]) => {
      const short = path.length <= 28 ? path : `${path.slice(0, 25)}…`;
      return `<code>${escapeHtml(short)}</code>×${n}`;
    })
    .join(" · ");
}

function fmtDownstream(account: StatsReport["portfolio"]["threadsAccounts"][number]): string {
  const bits: string[] = [];
  if (account.wizardStarts > 0) bits.push(`wizard ${account.wizardStarts}`);
  if (account.assistClicks > 0) bits.push(`Assist ${account.assistClicks}`);
  if (account.qualifierStarts > 0) bits.push(`qualifier ${account.qualifierStarts}`);
  if (account.leads > 0) bits.push(`invest leads ${account.leads}`);
  return bits.length ? bits.join(" · ") : "без конверсий";
}

function fmtThreadsBlock(report: StatsReport): string[] {
  const accounts = report.portfolio.threadsAccounts;
  const lines: string[] = ["<b>🧵 Threads</b>"];

  if (!accounts.length) {
    if (report.threads) {
      const handle = (report.threads.handle || "emigro_assist").replace(/^@/, "");
      const c = report.threads.clicks7d;
      lines.push(
        `@${escapeHtml(handle)}: 7д wiz ${c.wizard} · Assist ${c.assist} · гайды ${c.guide}`
      );
    } else {
      lines.push("— нет данных");
    }
    return lines;
  }

  for (const account of accounts) {
    const followers =
      account.followers != null && account.followers > 0
        ? ` · ${account.followers} fol`
        : "";
    lines.push(
      `<b>@${escapeHtml(account.handle)}</b>${followers}: 7д <b>${account.sessions7d}</b> <i>(${periodDelta(account.sessions7d, account.sessionsPrevious7d)})</i> · 30д ${account.sessions30d}`
    );
    lines.push(`  → ${fmtDownstream(account)}`);
    const tops = compactLandings(account.topLandings, 3);
    if (tops) lines.push(`  ${tops}`);
  }

  return lines;
}

function fmtGscLine(report: StatsReport): string[] {
  const gsc = report.portfolio.searchConsole;
  if (!gsc.available) return [];
  return [
    `<b>🔎 GSC · 28д</b>: клики <b>${gsc.clicks}</b> <i>(${periodDelta(gsc.clicks, gsc.previousClicks)})</i> · показы <b>${gsc.impressions}</b> · CTR ${(gsc.ctr * 100).toFixed(1)}% · поз. ${gsc.position.toFixed(1)}`,
  ];
}

function fmtTrend(report: StatsReport): string[] {
  if (!report.trend.length) return [];
  const lines = ["<b>Динамика 7 дней</b> (посетители / просмотры)"];
  for (const row of report.trend) {
    const bar = row.visitors > 0 ? "▪".repeat(Math.min(row.visitors, 12)) : "·";
    lines.push(`  ${escapeHtml(row.dayLabel)}: <b>${row.visitors}</b> / ${row.pageViews} ${bar}`);
  }
  return lines;
}

/**
 * Compact operator pulse for Telegram /stats.
 * Admin dashboard keeps the full data model — this is presentation only.
 */
export function formatStatsReportTelegram(report: StatsReport): string {
  const lines: string[] = [
    ...fmtPulse(report),
    ...fmtLocaleLines(report),
    "",
    ...fmtPortfolio(report),
    "",
    ...fmtAcquisition(report),
    "",
    ...fmtThreadsBlock(report),
  ];

  const revolutLine = formatRevolutReferralTelegramLine(report.revolutReferral);
  if (revolutLine) {
    lines.push("", revolutLine);
  }

  const wiseLine = formatWiseReferralTelegramLine(report.wiseReferral);
  if (wiseLine) {
    lines.push("", wiseLine);
  }

  const gsc = fmtGscLine(report);
  if (gsc.length) {
    lines.push("", ...gsc);
  }

  const trend = fmtTrend(report);
  if (trend.length) {
    lines.push("", ...trend);
  }

  lines.push("", "<i>/stats · /stats demo</i>");
  return lines.join("\n");
}

export async function buildTelegramStatsReport(): Promise<string> {
  const report = await buildStatsReport();
  return formatStatsReportTelegram(report);
}

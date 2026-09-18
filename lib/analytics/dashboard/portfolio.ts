import { createAdminClient } from "@/lib/admin/supabase";
import { loadMetricSnapshotHistory } from "@/lib/analytics/dashboard/snapshots";
import { fetchSearchConsoleStatsSafe } from "@/lib/analytics/dashboard/search-console";
import type {
  CommunityCountryStats,
  DailyMetricPoint,
  DashboardPortfolioStats,
  DashboardSurfaceKey,
  InvestmentStats,
  OwnedChatStats,
  SurfaceStats,
  ThreadsAccountStats,
} from "@/lib/analytics/dashboard/types";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import { THREADS_INVESTMENT_CAMPAIGN } from "@/lib/threads/investment-vertical";

const SURFACES: Array<{ key: DashboardSurfaceKey; label: string }> = [
  { key: "core", label: "Emigro core" },
  { key: "portugal", label: "Португалия · Порту" },
  { key: "spain", label: "Испания · Валенсия" },
  { key: "italy", label: "Италия · Милан" },
  { key: "thailand", label: "Таиланд · Пхукет" },
];

const COMMUNITY_COUNTRIES = [
  {
    countryKey: "portugal" as const,
    label: "Португалия",
    channels: PORTUGAL_SATELLITE.sourceChannels.length,
  },
  {
    countryKey: "spain" as const,
    label: "Испания",
    channels: SPAIN_SATELLITE.sourceChannels.length,
  },
  {
    countryKey: "italy" as const,
    label: "Италия",
    channels: ITALY_SATELLITE.sourceChannels.length,
  },
  {
    countryKey: "thailand" as const,
    label: "Таиланд",
    channels: THAILAND_SATELLITE.sourceChannels.length,
  },
];

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function emptyPoint(dayLabel = ""): DailyMetricPoint {
  return {
    dayLabel,
    visitors: 0,
    pageViews: 0,
    wizardStarted: 0,
    wizardCompleted: 0,
    assistClicks: 0,
    communityClicks: 0,
    investmentLeads: 0,
  };
}

function sumPoints(points: DailyMetricPoint[]): DailyMetricPoint {
  return points.reduce((sum, point) => {
    sum.visitors += point.visitors;
    sum.pageViews += point.pageViews;
    sum.wizardStarted += point.wizardStarted;
    sum.wizardCompleted += point.wizardCompleted;
    sum.assistClicks += point.assistClicks;
    sum.communityClicks += point.communityClicks;
    sum.investmentLeads += point.investmentLeads;
    return sum;
  }, emptyPoint());
}

async function buildSurfaceStats(): Promise<SurfaceStats[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("emigro_dashboard_daily_series", {
    p_days: 30,
    p_tz: process.env.EMIGRO_ANALYTICS_TIMEZONE?.trim() || "Europe/Lisbon",
  });
  const rows = error ? [] : (data ?? []);
  return SURFACES.map(({ key, label }) => {
    const trend = rows
      .filter((row: { surface: string }) => row.surface === key)
      .map(
        (row: {
          day_label: string;
          visitors: number;
          page_views: number;
          wizard_started: number;
          wizard_completed: number;
          assist_clicks: number;
          community_clicks: number;
          investment_leads: number;
        }): DailyMetricPoint => ({
          dayLabel: row.day_label,
          visitors: Number(row.visitors),
          pageViews: Number(row.page_views),
          wizardStarted: Number(row.wizard_started),
          wizardCompleted: Number(row.wizard_completed),
          assistClicks: Number(row.assist_clicks),
          communityClicks: Number(row.community_clicks),
          investmentLeads: Number(row.investment_leads),
        })
      );
    return {
      key,
      label,
      trend,
      current7d: sumPoints(trend.slice(-7)),
      previous7d: sumPoints(trend.slice(-14, -7)),
    };
  });
}

async function exactCount(
  table: string,
  filters: Array<[string, string, string | string[]]> = []
): Promise<number> {
  const supabase = createAdminClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [operator, field, value] of filters) {
    if (operator === "eq") query = query.eq(field, value as string);
    else if (operator === "gte") query = query.gte(field, value as string);
    else if (operator === "in") query = query.in(field, value as string[]);
  }
  const { count, error } = await query;
  if (error) return 0;
  return Number(count ?? 0);
}

async function buildCommunityStats(): Promise<CommunityCountryStats[]> {
  const supabase = createAdminClient();
  const sevenDaysAgo = isoDaysAgo(7);
  const thirtyDaysAgo = isoDaysAgo(30).slice(0, 10);
  const freshCutoff = isoDaysAgo(1.5);

  return Promise.all(
    COMMUNITY_COUNTRIES.map(async ({ countryKey, label, channels }) => {
      const [signals7d, backlog, publishedNotes, published7d, spotlightDays30, fresh] =
        await Promise.all([
          exactCount("community_signals", [
            ["eq", "country_key", countryKey],
            ["gte", "posted_at", sevenDaysAgo],
          ]),
          exactCount("community_signals", [
            ["eq", "country_key", countryKey],
            ["eq", "status", "new"],
          ]),
          exactCount("community_notes", [
            ["eq", "country_key", countryKey],
            ["eq", "status", "published"],
          ]),
          exactCount("community_notes", [
            ["eq", "country_key", countryKey],
            ["eq", "status", "published"],
            ["gte", "published_at", sevenDaysAgo],
          ]),
          exactCount("community_daily_spotlight", [
            ["eq", "country_key", countryKey],
            ["gte", "spotlight_date", thirtyDaysAgo],
          ]),
          supabase
            .from("community_signals")
            .select("channel_username, posted_at")
            .eq("country_key", countryKey)
            .gte("posted_at", freshCutoff)
            .order("posted_at", { ascending: false })
            .limit(2_000),
        ]);
      const freshRows = fresh.data ?? [];
      const activeChannels = new Set(freshRows.map((row) => row.channel_username)).size;
      const latestSignalAt =
        freshRows.reduce<string | null>(
          (latest, row) => (!latest || row.posted_at > latest ? row.posted_at : latest),
          null
        ) ?? null;
      return {
        countryKey,
        label,
        signals7d,
        backlog,
        publishedNotes,
        published7d,
        activeChannels,
        totalChannels: channels,
        spotlightDays30,
        latestSignalAt,
      };
    })
  );
}

async function countSiteEvents(
  eventName: string,
  start: string,
  end?: string,
  pathPrefix?: string
): Promise<number> {
  const supabase = createAdminClient();
  let query = supabase
    .from("site_events")
    .select("*", { count: "exact", head: true })
    .eq("event_name", eventName)
    .gte("created_at", start);
  if (end) query = query.lt("created_at", end);
  if (pathPrefix) query = query.like("page_path", `${pathPrefix}%`);
  const { count, error } = await query;
  return error ? 0 : Number(count ?? 0);
}

function incrementTop(map: Map<string, number>, value: unknown) {
  const key = String(value ?? "").trim();
  if (key) map.set(key, (map.get(key) ?? 0) + 1);
}

function top(map: Map<string, number>, limit = 5): Array<[string, number]> {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

async function buildInvestmentStats(): Promise<InvestmentStats> {
  const supabase = createAdminClient();
  const start7 = isoDaysAgo(7);
  const start14 = isoDaysAgo(14);
  const [pageViews7d, pageViewsPrevious7d, qualifierStarted7d, qualifierCompleted7d, leads7d, leadsTotal, assignmentRows, leads, investPages] =
    await Promise.all([
      countSiteEvents("page_view", start7, undefined, "/ru/invest"),
      countSiteEvents("page_view", start14, start7, "/ru/invest"),
      countSiteEvents("investment_qualifier_started", start7),
      countSiteEvents("investment_qualifier_completed", start7),
      exactCount("emigro_manual_leads", [
        ["eq", "lead_type", "investment"],
        ["gte", "created_at", start7],
      ]),
      exactCount("emigro_manual_leads", [["eq", "lead_type", "investment"]]),
      supabase.from("emigro_lead_assignments").select("status").limit(5_000),
      supabase
        .from("emigro_manual_leads")
        .select("status, destination_iso2, lead_packet")
        .eq("lead_type", "investment")
        .order("created_at", { ascending: false })
        .limit(2_000),
      supabase
        .from("site_events")
        .select("page_path")
        .eq("event_name", "page_view")
        .gte("created_at", start7)
        .like("page_path", "/ru/invest%")
        .limit(10_000),
    ]);
  const rows = leads.data ?? [];
  const destinations = new Map<string, number>();
  const assets = new Map<string, number>();
  const outcomes = new Map<string, number>();
  const readiness = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  for (const row of investPages.data ?? []) {
    incrementTop(pageCounts, String(row.page_path || "").split("?")[0]);
  }
  const hubViews7d = pageCounts.get("/ru/invest") ?? 0;
  const resultsViews7d = pageCounts.get("/ru/invest/results") ?? 0;
  const countryViews7d = Array.from(pageCounts.entries()).reduce(
    (sum, [path, count]) =>
      path !== "/ru/invest" && path !== "/ru/invest/results" ? sum + count : sum,
    0
  );
  let budgetTotalEur = 0;
  for (const row of rows) {
    const packet = (row.lead_packet ?? {}) as Record<string, unknown>;
    incrementTop(destinations, row.destination_iso2);
    incrementTop(assets, packet.asset);
    incrementTop(outcomes, packet.outcome);
    incrementTop(readiness, packet.funding_readiness);
    const budget = Number(packet.budget_eur ?? 0);
    if (Number.isFinite(budget)) budgetTotalEur += budget;
  }
  return {
    pageViews7d,
    pageViewsPrevious7d,
    hubViews7d,
    countryViews7d,
    resultsViews7d,
    qualifierStarted7d,
    qualifierCompleted7d,
    leads7d,
    leadsTotal,
    assigned: (assignmentRows.data ?? []).filter((row) =>
      ["reserved", "introduced", "accepted"].includes(row.status)
    ).length,
    won: (assignmentRows.data ?? []).filter((row) => row.status === "won").length,
    lost: (assignmentRows.data ?? []).filter((row) => row.status === "lost").length,
    budgetTotalEur,
    topDestinations: top(destinations),
    topAssets: top(assets),
    topOutcomes: top(outcomes),
    topReadiness: top(readiness),
    topPages7d: top(pageCounts),
  };
}

function accountForCampaign(campaign: string | null): ThreadsAccountStats["handle"] {
  return (campaign || "").toLowerCase() === THREADS_INVESTMENT_CAMPAIGN
    ? "emigro_invest"
    : "emigro_assist";
}

export function classifyThreadsAccount(campaign: string | null | undefined) {
  return accountForCampaign(campaign ?? null);
}

async function buildThreadsAccountStats(): Promise<{
  accounts: ThreadsAccountStats[];
  ownedChats: OwnedChatStats[];
  snapshotCapturedAt: string | null;
}> {
  const supabase = createAdminClient();
  const start30 = isoDaysAgo(30);
  const { data } = await supabase
    .from("site_events")
    .select("session_id, page_path, utm_campaign, created_at")
    .eq("event_name", "session_start")
    .ilike("utm_source", "threads")
    .gte("created_at", start30)
    .order("created_at", { ascending: true })
    .limit(20_000);
  const starts = data ?? [];
  const histories = await loadMetricSnapshotHistory(30);
  const threadHistory = histories.filter((item) => item.metricKey.startsWith("threads:"));
  const ownedChats = COMMUNITY_COUNTRIES.map(({ countryKey, label }) => {
    const history = histories.filter(
      (item) => item.metricKey === `telegram:city:${countryKey}:members` && item.value != null
    );
    const latest = history.at(-1);
    const comparison = history
      .filter((item) => {
        if (!latest) return false;
        const days =
          (new Date(latest.snapshotDate).getTime() - new Date(item.snapshotDate).getTime()) /
          86_400_000;
        return days >= 7;
      })
      .at(-1);
    return {
      countryKey,
      label: `${label} · city chat`,
      members: latest?.value ?? null,
      previous7d: comparison?.value ?? null,
      trend: history.map((item) => ({
        dayLabel: item.snapshotDate.slice(5).replace("-", "."),
        value: item.value as number,
      })),
    };
  });
  const allSessionIds = Array.from(new Set(starts.map((row) => row.session_id).filter(Boolean)));
  const { data: downstream } = allSessionIds.length
    ? await supabase
        .from("site_events")
        .select("session_id, event_name")
        .in("session_id", allSessionIds)
        .in("event_name", [
          "wizard_started",
          "assist_cta_click",
          "investment_qualifier_started",
          "investment_lead_submitted",
        ])
        .limit(20_000)
    : { data: [] };
  const now = Date.now();
  const start7Ms = now - 7 * 86_400_000;
  const start14Ms = now - 14 * 86_400_000;

  const accounts = (["emigro_assist", "emigro_invest"] as const).map((handle) => {
    const rows = starts.filter((row) => accountForCampaign(row.utm_campaign) === handle);
    const sessions = new Set(rows.map((row) => row.session_id));
    const current7 = rows.filter((row) => new Date(row.created_at).getTime() >= start7Ms);
    const previous7 = rows.filter((row) => {
      const time = new Date(row.created_at).getTime();
      return time >= start14Ms && time < start7Ms;
    });
    const daily = new Map<string, Set<string>>();
    const landings = new Map<string, number>();
    for (const row of rows) {
      const day = row.created_at.slice(5, 10).replace("-", ".");
      const set = daily.get(day) ?? new Set<string>();
      set.add(row.session_id);
      daily.set(day, set);
      incrementTop(landings, row.page_path || "/");
    }
    const accountHistory = threadHistory.filter((item) =>
      item.metricKey.includes(`:${handle}:`)
    );
    const latest = accountHistory.at(-1);
    const accountEvents = (downstream ?? []).filter((event) => sessions.has(event.session_id));
    return {
      handle,
      followers: latest?.value ?? null,
      followerTrend: accountHistory
        .filter((item) => item.value != null)
        .map((item) => ({
          dayLabel: item.snapshotDate.slice(5).replace("-", "."),
          value: item.value as number,
        })),
      sessions7d: new Set(current7.map((row) => row.session_id)).size,
      sessionsPrevious7d: new Set(previous7.map((row) => row.session_id)).size,
      sessions30d: sessions.size,
      trend: Array.from(daily, ([dayLabel, values]) => ({
        dayLabel,
        sessions: values.size,
      })),
      wizardStarts: accountEvents.filter((event) => event.event_name === "wizard_started").length,
      assistClicks: accountEvents.filter((event) => event.event_name === "assist_cta_click").length,
      qualifierStarts: accountEvents.filter(
        (event) => event.event_name === "investment_qualifier_started"
      ).length,
      leads: accountEvents.filter((event) => event.event_name === "investment_lead_submitted").length,
      topLandings: top(landings),
    };
  });
  return {
    accounts,
    ownedChats,
    snapshotCapturedAt: histories.at(-1)?.capturedAt ?? null,
  };
}

export async function buildDashboardPortfolioStats(): Promise<DashboardPortfolioStats> {
  const [surfaces, community, investment, threads, searchConsole] = await Promise.all([
    buildSurfaceStats(),
    buildCommunityStats(),
    buildInvestmentStats(),
    buildThreadsAccountStats(),
    fetchSearchConsoleStatsSafe(),
  ]);
  return {
    surfaces,
    community,
    ownedChats: threads.ownedChats,
    investment,
    threadsAccounts: threads.accounts,
    searchConsole,
    snapshotCapturedAt: threads.snapshotCapturedAt,
  };
}

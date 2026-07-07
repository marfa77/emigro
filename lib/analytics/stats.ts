import { createAdminClient } from "@/lib/admin/supabase";
import { classifyLlmAttribution } from "@/lib/analytics/llm-attribution";

const VISITOR_EVENTS = ["session_start", "page_view"] as const;
const LEAD_EVENTS = ["lead_submitted", "assist_lead_submitted"] as const;

export interface PeriodCounts {
  visitors: number;
  pageViews: number;
  newSessions: number;
  wizardStarted: number;
  wizardCompleted: number;
  leads: number;
  providerClicks: number;
  eventsTotal: number;
}

export interface WizardTelegramStats {
  usersTotal: number;
  deliveriesTotal: number;
  deliveriesSentTotal: number;
  deliveriesToday: number;
  deliveriesYesterday: number;
  usersNewToday: number;
  usersNewYesterday: number;
  resultsViewsTotal: number;
  resultsViewsToday: number;
  resultsViewsYesterday: number;
}

export interface StatsReport {
  timezone: string;
  todayLabel: string;
  total: PeriodCounts;
  today: PeriodCounts;
  yesterday: PeriodCounts;
  todayNewVisitors: number;
  todayReturningVisitors: number;
  yesterdayNewVisitors: number;
  yesterdayReturningVisitors: number;
  botsTotal: number;
  botsToday: number;
  botsYesterday: number;
  llmToday: number;
  llmYesterday: number;
  llmTotal: number;
  trend: Array<{ dayLabel: string; visitors: number; pageViews: number }>;
  topPagesToday: Array<[string, number]>;
  topPagesAll: Array<[string, number]>;
  topReferrersToday: Array<[string, number]>;
  topUtmToday: Array<[string, number]>;
  topCountriesToday: Array<[string, number]>;
  topCountriesAll: Array<[string, number]>;
  topLangToday: Array<[string, number]>;
  topDeviceToday: Array<[string, number]>;
  topBrowserToday: Array<[string, number]>;
  topProvidersToday: Array<[string, number]>;
  topProvidersAll: Array<[string, number]>;
  llmSourcesToday: Array<[string, number]>;
  recentSessions: Array<{
    sessionId: string;
    pagePath: string | null;
    referrer: string | null;
    country: string | null;
    isReturning: boolean;
    llm: string | null;
  }>;
  wizardTelegram: WizardTelegramStats;
}

function analyticsTimezone(): string {
  return process.env.EMIGRO_ANALYTICS_TIMEZONE?.trim() || "Europe/Lisbon";
}

async function dayWindow(
  supabase: ReturnType<typeof createAdminClient>,
  dayOffset: number,
  tz: string
): Promise<{ start: string; end: string; label: string }> {
  const { data, error } = await supabase.rpc("emigro_day_window", {
    p_day_offset: dayOffset,
    p_tz: tz,
  });
  if (error) throw new Error(error.message);
  const row = (Array.isArray(data) ? data[0] : data) as {
    start_utc: string;
    end_utc: string;
    day_label: string;
  };
  return { start: row.start_utc, end: row.end_utc, label: row.day_label };
}

async function rpcCountDistinct(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  eventNames: string[] = [...VISITOR_EVENTS],
  exclude: string[] = []
): Promise<number> {
  const { data, error } = await supabase.rpc("emigro_count_distinct_sessions", {
    p_start: start,
    p_end: end,
    p_event_names: eventNames,
    p_exclude_sessions: exclude,
  });
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}

async function rpcCountEvents(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  eventName: string | null = null,
  exclude: string[] = []
): Promise<number> {
  const { data, error } = await supabase.rpc("emigro_count_events", {
    p_start: start,
    p_end: end,
    p_event_name: eventName,
    p_exclude_sessions: exclude,
  });
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}

async function rpcTop(
  supabase: ReturnType<typeof createAdminClient>,
  field: string,
  start: string | null,
  end: string | null,
  eventName: string | null = "page_view",
  limit = 5,
  exclude: string[] = []
): Promise<Array<[string, number]>> {
  const { data, error } = await supabase.rpc("emigro_top_site_values", {
    p_field: field,
    p_start: start,
    p_end: end,
    p_event_name: eventName,
    p_limit: limit,
    p_exclude_sessions: exclude,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { value: string; cnt: number }) => [row.value, Number(row.cnt)]);
}

async function periodCounts(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  exclude: string[] = []
): Promise<PeriodCounts> {
  const [visitors, pageViews, newSessions, wizardStarted, wizardCompleted, leads, providerClicks, eventsTotal] =
    await Promise.all([
      rpcCountDistinct(supabase, start, end, [...VISITOR_EVENTS], exclude),
      rpcCountEvents(supabase, start, end, "page_view", exclude),
      rpcCountEvents(supabase, start, end, "session_start", exclude),
      rpcCountDistinct(supabase, start, end, ["wizard_started"], exclude),
      rpcCountEvents(supabase, start, end, "wizard_completed", exclude),
      Promise.all(LEAD_EVENTS.map((ev) => rpcCountEvents(supabase, start, end, ev, exclude))).then(
        (counts) => counts.reduce((a, b) => a + b, 0)
      ),
      rpcCountEvents(supabase, start, end, "provider_click", exclude),
      rpcCountEvents(supabase, start, end, null, exclude),
    ]);

  return {
    visitors,
    pageViews,
    newSessions,
    wizardStarted,
    wizardCompleted,
    leads,
    providerClicks,
    eventsTotal,
  };
}

async function visitorMix(
  supabase: ReturnType<typeof createAdminClient>,
  start: string,
  end: string,
  exclude: string[] = []
): Promise<{ active: number; returning: number; newVisitors: number }> {
  const active = await rpcCountDistinct(supabase, start, end, [...VISITOR_EVENTS], exclude);
  if (active === 0) return { active: 0, returning: 0, newVisitors: 0 };

  const { data: todaySessions, error: todayErr } = await supabase
    .from("site_events")
    .select("session_id")
    .gte("created_at", start)
    .lt("created_at", end)
    .in("event_name", [...VISITOR_EVENTS])
    .limit(5000);
  if (todayErr) throw new Error(todayErr.message);

  const ids = Array.from(new Set((todaySessions ?? []).map((r) => r.session_id).filter(Boolean)));
  if (ids.length === 0) return { active, returning: 0, newVisitors: active };

  const { data: prior, error: priorErr } = await supabase
    .from("site_events")
    .select("session_id")
    .lt("created_at", start)
    .in("event_name", [...VISITOR_EVENTS])
    .in("session_id", ids);
  if (priorErr) throw new Error(priorErr.message);

  const returning = new Set((prior ?? []).map((r) => r.session_id)).size;
  return { active, returning, newVisitors: Math.max(active - returning, 0) };
}

async function countLlmVisitors(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null
): Promise<number> {
  let q = supabase
    .from("site_events")
    .select("session_id, referrer, utm_source, utm_medium")
    .in("event_name", [...VISITOR_EVENTS]);
  if (start) q = q.gte("created_at", start);
  if (end) q = q.lt("created_at", end);
  const { data, error } = await q.limit(10000);
  if (error) throw new Error(error.message);

  const llmSessions = new Set<string>();
  for (const row of data ?? []) {
    if (classifyLlmAttribution(row.referrer, row.utm_source, row.utm_medium)) {
      llmSessions.add(row.session_id);
    }
  }
  return llmSessions.size;
}

async function topFromProperties(
  supabase: ReturnType<typeof createAdminClient>,
  prop: string,
  start: string,
  end: string,
  limit = 8,
  eventNames: readonly string[] = VISITOR_EVENTS
): Promise<Array<[string, number]>> {
  const { data, error } = await supabase
    .from("site_events")
    .select("properties")
    .gte("created_at", start)
    .lt("created_at", end)
    .in("event_name", [...eventNames])
    .limit(5000);
  if (error) throw new Error(error.message);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const val = String((row.properties as Record<string, unknown>)?.[prop] ?? "").trim();
    if (!val) continue;
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

async function topProviderClicks(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  limit = 10
): Promise<Array<[string, number]>> {
  let q = supabase.from("site_events").select("properties").eq("event_name", "provider_click");
  if (start) q = q.gte("created_at", start);
  if (end) q = q.lt("created_at", end);
  const { data, error } = await q.limit(10000);
  if (error) throw new Error(error.message);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const providerId = String((row.properties as Record<string, unknown>)?.provider_id ?? "").trim();
    if (!providerId) continue;
    counts.set(providerId, (counts.get(providerId) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

async function recentSessionsToday(
  supabase: ReturnType<typeof createAdminClient>,
  start: string,
  end: string
): Promise<StatsReport["recentSessions"]> {
  const { data, error } = await supabase
    .from("site_events")
    .select("session_id, page_path, referrer, utm_source, utm_medium, properties, created_at")
    .gte("created_at", start)
    .lt("created_at", end)
    .in("event_name", [...VISITOR_EVENTS])
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);

  const seen = new Set<string>();
  const out: StatsReport["recentSessions"] = [];

  for (const row of data ?? []) {
    if (seen.has(row.session_id)) continue;
    seen.add(row.session_id);

    const { data: prior } = await supabase
      .from("site_events")
      .select("id")
      .eq("session_id", row.session_id)
      .lt("created_at", start)
      .in("event_name", [...VISITOR_EVENTS])
      .limit(1);

    const props = (row.properties ?? {}) as Record<string, unknown>;
    out.push({
      sessionId: row.session_id.slice(0, 8) + "…",
      pagePath: row.page_path,
      referrer: row.referrer,
      country: typeof props.country === "string" ? props.country : null,
      isReturning: (prior?.length ?? 0) > 0,
      llm: classifyLlmAttribution(row.referrer, row.utm_source, row.utm_medium),
    });
    if (out.length >= 12) break;
  }
  return out;
}

async function countTableRows(
  supabase: ReturnType<typeof createAdminClient>,
  table: "emigro_wizard_telegram_users" | "emigro_wizard_telegram_deliveries",
  start: string | null,
  end: string | null,
  filters?: { reportSent?: boolean; dateField?: "created_at" | "first_seen_at" }
): Promise<number> {
  const dateField = filters?.dateField ?? "created_at";
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filters?.reportSent != null) q = q.eq("report_sent", filters.reportSent);
  if (start) q = q.gte(dateField, start);
  if (end) q = q.lt(dateField, end);
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return Number(count ?? 0);
}

async function buildWizardTelegramStats(
  supabase: ReturnType<typeof createAdminClient>,
  todayStart: string,
  todayEnd: string,
  yStart: string,
  yEnd: string
): Promise<WizardTelegramStats> {
  const [
    usersTotal,
    deliveriesTotal,
    deliveriesSentTotal,
    deliveriesToday,
    deliveriesYesterday,
    usersNewToday,
    usersNewYesterday,
    resultsViewsTotal,
    resultsViewsToday,
    resultsViewsYesterday,
  ] = await Promise.all([
    countTableRows(supabase, "emigro_wizard_telegram_users", null, null, { dateField: "first_seen_at" }),
    countTableRows(supabase, "emigro_wizard_telegram_deliveries", null, null),
    countTableRows(supabase, "emigro_wizard_telegram_deliveries", null, null, { reportSent: true }),
    countTableRows(supabase, "emigro_wizard_telegram_deliveries", todayStart, todayEnd, { reportSent: true }),
    countTableRows(supabase, "emigro_wizard_telegram_deliveries", yStart, yEnd, { reportSent: true }),
    countTableRows(supabase, "emigro_wizard_telegram_users", todayStart, todayEnd, { dateField: "first_seen_at" }),
    countTableRows(supabase, "emigro_wizard_telegram_users", yStart, yEnd, { dateField: "first_seen_at" }),
    rpcCountEvents(supabase, null, null, "wizard_results_view"),
    rpcCountEvents(supabase, todayStart, todayEnd, "wizard_results_view"),
    rpcCountEvents(supabase, yStart, yEnd, "wizard_results_view"),
  ]);

  return {
    usersTotal,
    deliveriesTotal,
    deliveriesSentTotal,
    deliveriesToday,
    deliveriesYesterday,
    usersNewToday,
    usersNewYesterday,
    resultsViewsTotal,
    resultsViewsToday,
    resultsViewsYesterday,
  };
}

export async function buildStatsReport(): Promise<StatsReport> {
  const supabase = createAdminClient();
  const tz = analyticsTimezone();
  const todayWin = await dayWindow(supabase, 0, tz);
  const yWin = await dayWindow(supabase, 1, tz);

  const [
    total,
    today,
    yesterday,
    todayMix,
    yMix,
    botsTotal,
    botsToday,
    botsYesterday,
    llmToday,
    llmYesterday,
    llmTotal,
    trendRaw,
    topPagesToday,
    topPagesAll,
    topReferrersToday,
    topUtmToday,
    topCountriesToday,
    topCountriesAll,
    topLangToday,
    topDeviceToday,
    topBrowserToday,
    topProvidersToday,
    topProvidersAll,
    recentSessions,
    wizardTelegram,
  ] = await Promise.all([
    periodCounts(supabase, null, null),
    periodCounts(supabase, todayWin.start, todayWin.end),
    periodCounts(supabase, yWin.start, yWin.end),
    visitorMix(supabase, todayWin.start, todayWin.end),
    visitorMix(supabase, yWin.start, yWin.end),
    supabase.rpc("emigro_bot_session_count", { p_start: null, p_end: null }).then((r) => Number(r.data ?? 0)),
    supabase
      .rpc("emigro_bot_session_count", { p_start: todayWin.start, p_end: todayWin.end })
      .then((r) => Number(r.data ?? 0)),
    supabase
      .rpc("emigro_bot_session_count", { p_start: yWin.start, p_end: yWin.end })
      .then((r) => Number(r.data ?? 0)),
    countLlmVisitors(supabase, todayWin.start, todayWin.end),
    countLlmVisitors(supabase, yWin.start, yWin.end),
    countLlmVisitors(supabase, null, null),
    supabase.rpc("emigro_daily_visitor_trend", { p_days: 7, p_tz: tz, p_exclude_sessions: [] }),
    rpcTop(supabase, "page_path", todayWin.start, todayWin.end),
    rpcTop(supabase, "page_path", null, null),
    rpcTop(supabase, "referrer", todayWin.start, todayWin.end, "session_start", 5),
    rpcTop(supabase, "utm_source", todayWin.start, todayWin.end, null, 4),
    topFromProperties(supabase, "country", todayWin.start, todayWin.end),
    topFromProperties(supabase, "country", "1970-01-01T00:00:00.000Z", todayWin.end),
    topFromProperties(supabase, "accept_language", todayWin.start, todayWin.end),
    topFromProperties(supabase, "device_type", todayWin.start, todayWin.end),
    topFromProperties(supabase, "browser", todayWin.start, todayWin.end),
    topProviderClicks(supabase, todayWin.start, todayWin.end),
    topProviderClicks(supabase, null, null),
    recentSessionsToday(supabase, todayWin.start, todayWin.end),
    buildWizardTelegramStats(supabase, todayWin.start, todayWin.end, yWin.start, yWin.end),
  ]);

  const trend = (trendRaw.data ?? []).map(
    (row: { day_label: string; visitors: number; page_views: number }) => ({
      dayLabel: row.day_label,
      visitors: Number(row.visitors),
      pageViews: Number(row.page_views),
    })
  );

  const llmSourcesToday: Array<[string, number]> = [];
  // computed from recent if needed — skip for MVP

  return {
    timezone: tz,
    todayLabel: todayWin.label,
    total,
    today,
    yesterday,
    todayNewVisitors: todayMix.newVisitors,
    todayReturningVisitors: todayMix.returning,
    yesterdayNewVisitors: yMix.newVisitors,
    yesterdayReturningVisitors: yMix.returning,
    botsTotal,
    botsToday,
    botsYesterday,
    llmToday,
    llmYesterday,
    llmTotal,
    trend,
    topPagesToday,
    topPagesAll,
    topReferrersToday,
    topUtmToday,
    topCountriesToday,
    topCountriesAll,
    topLangToday,
    topDeviceToday,
    topBrowserToday,
    topProvidersToday,
    topProvidersAll,
    llmSourcesToday,
    recentSessions,
    wizardTelegram,
  };
}

export function deltaLine(today: number, yesterday: number): string {
  const diff = today - yesterday;
  if (diff > 0) return `(+${diff} к вчера)`;
  if (diff < 0) return `(${diff} к вчера)`;
  return "(= вчера)";
}

export function countryFlag(code: string): string {
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2 || !/^[A-Z]{2}$/.test(cc)) return "";
  const base = 0x1f1e6;
  return String.fromCodePoint(
    ...cc.split("").map((c) => base + c.charCodeAt(0) - "A".charCodeAt(0))
  );
}

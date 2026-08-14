import { createAdminClient } from "@/lib/admin/supabase";
import { classifyLlmAttribution } from "@/lib/analytics/llm-attribution";
import { classifyTrafficChannel, type TrafficChannel } from "@/lib/analytics/traffic-channel";

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

/** RU vs ES (/es LATAM) vs FR (/fr Afrique) funnel slice for /stats. */
export type LocaleBucket = "es" | "fr" | "ru" | "other";

export interface LocaleFunnelCounts {
  pageViews: number;
  /** Distinct sessions with wizard_started */
  wizardStarted: number;
  wizardCompleted: number;
  resultsViews: number;
}

export interface LocaleSplitPeriod {
  es: LocaleFunnelCounts;
  fr: LocaleFunnelCounts;
  ru: LocaleFunnelCounts;
  other: LocaleFunnelCounts;
}

export interface LocaleSplit {
  today: LocaleSplitPeriod;
  yesterday: LocaleSplitPeriod;
  total: LocaleSplitPeriod;
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
  /** Landing pages from search engines (excl. direct / internal). */
  topPagesSearchToday: Array<[string, number]>;
  topPagesSearchAll: Array<[string, number]>;
  /** Landing pages attributed to LLM (ChatGPT, Perplexity, llms.txt, …). */
  topPagesLlmToday: Array<[string, number]>;
  topPagesLlmAll: Array<[string, number]>;
  /** Combined discovery: search + LLM landings (no direct). */
  topPagesDiscoveryToday: Array<[string, number]>;
  topPagesDiscoveryAll: Array<[string, number]>;
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
  channelMixToday: Array<[string, number]>;
  recentSessions: Array<{
    sessionId: string;
    pagePath: string | null;
    referrer: string | null;
    country: string | null;
    isReturning: boolean;
    llm: string | null;
    channel: TrafficChannel;
  }>;
  wizardTelegram: WizardTelegramStats;
  localeSplit: LocaleSplit;
}

function analyticsTimezone(): string {
  return process.env.EMIGRO_ANALYTICS_TIMEZONE?.trim() || "Europe/Lisbon";
}

function emptyLocaleFunnel(): LocaleFunnelCounts {
  return { pageViews: 0, wizardStarted: 0, wizardCompleted: 0, resultsViews: 0 };
}

function emptyLocaleSplitPeriod(): LocaleSplitPeriod {
  return {
    es: emptyLocaleFunnel(),
    fr: emptyLocaleFunnel(),
    ru: emptyLocaleFunnel(),
    other: emptyLocaleFunnel(),
  };
}

/** Classify site_events row as ES / FR / RU product surface. */
export function classifyEventLocale(
  pagePath: string | null | undefined,
  properties: Record<string, unknown> | null | undefined
): LocaleBucket {
  const locale = String(properties?.locale ?? "").toLowerCase();
  if (locale === "es" || locale.startsWith("es-")) return "es";
  if (locale === "fr" || locale.startsWith("fr-")) return "fr";
  if (locale === "ru" || locale.startsWith("ru-")) return "ru";

  const corridor = String(properties?.corridor_slug ?? properties?.analytics_scope ?? "").toLowerCase();
  if (corridor.includes("hub-es") || corridor.startsWith("es-speaking") || corridor === "hub-es-latam") {
    return "es";
  }
  if (corridor.includes("hub-fr") || corridor.startsWith("fr-speaking") || corridor === "hub-fr-afrique") {
    return "fr";
  }

  const path = (pagePath || "").split("?")[0];
  if (path === "/es" || path.startsWith("/es/")) return "es";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  if (path === "/ru" || path.startsWith("/ru/") || path.startsWith("/satellite/")) return "ru";
  return "other";
}

async function localeFunnelCounts(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null
): Promise<LocaleSplitPeriod> {
  const out = emptyLocaleSplitPeriod();
  const startedSessions: Record<LocaleBucket, Set<string>> = {
    es: new Set(),
    fr: new Set(),
    ru: new Set(),
    other: new Set(),
  };

  let q = supabase
    .from("site_events")
    .select("session_id, event_name, page_path, properties")
    .in("event_name", ["page_view", "wizard_started", "wizard_completed", "wizard_results_view"]);
  if (start) q = q.gte("created_at", start);
  if (end) q = q.lt("created_at", end);

  const { data, error } = await q.limit(25000);
  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    const bucket = classifyEventLocale(
      row.page_path,
      (row.properties ?? null) as Record<string, unknown> | null
    );
    const funnel = out[bucket];
    const name = row.event_name;

    if (name === "page_view") {
      funnel.pageViews += 1;
    } else if (name === "wizard_started") {
      const sid = String(row.session_id ?? "").trim();
      if (sid && !startedSessions[bucket].has(sid)) {
        startedSessions[bucket].add(sid);
        funnel.wizardStarted += 1;
      }
    } else if (name === "wizard_completed") {
      funnel.wizardCompleted += 1;
    } else if (name === "wizard_results_view") {
      funnel.resultsViews += 1;
    }
  }

  return out;
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
  // Paginate — a single unordered .limit(10000) undercounts all-time and can make
  // llmToday > llmTotal when recent ChatGPT sessions sit outside the oldest sample.
  const llmSessions = new Set<string>();
  const PAGE = 2000;
  const MAX_PAGES = 60;
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    let q = supabase
      .from("site_events")
      .select("session_id, referrer, utm_source, utm_medium")
      .in("event_name", [...VISITOR_EVENTS])
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (start) q = q.gte("created_at", start);
    if (end) q = q.lt("created_at", end);
    const { data, error } = await q;
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    if (rows.length === 0) break;

    for (const row of rows) {
      if (!row.session_id) continue;
      if (classifyLlmAttribution(row.referrer, row.utm_source, row.utm_medium)) {
        llmSessions.add(row.session_id);
      }
    }

    if (rows.length < PAGE) break;
    offset += PAGE;
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

type VisitorHit = {
  session_id: string;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  properties: Record<string, unknown> | null;
  created_at: string;
  event_name: string;
};

async function fetchVisitorHits(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  limit = 10000
): Promise<VisitorHit[]> {
  let q = supabase
    .from("site_events")
    .select("session_id, page_path, referrer, utm_source, utm_medium, properties, created_at, event_name")
    .in("event_name", [...VISITOR_EVENTS])
    .order("created_at", { ascending: true })
    .limit(limit);
  if (start) q = q.gte("created_at", start);
  if (end) q = q.lt("created_at", end);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as VisitorHit[];
}

/** First hit per session = landing (for channel / discovery tops). */
function sessionLandings(hits: VisitorHit[]): Map<string, VisitorHit> {
  const landings = new Map<string, VisitorHit>();
  for (const hit of hits) {
    if (!hit.session_id || landings.has(hit.session_id)) continue;
    landings.set(hit.session_id, hit);
  }
  return landings;
}

function topFromMap(counts: Map<string, number>, limit: number): Array<[string, number]> {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function bump(counts: Map<string, number>, key: string) {
  if (!key) return;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

async function fetchSessionStarts(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  _limit = 10000
): Promise<VisitorHit[]> {
  // Paginate all session_start rows in the window. A single .limit(10000) — even
  // newest-first — still samples and diverges from llmTotal / today tops.
  const out: VisitorHit[] = [];
  const PAGE = 2000;
  const MAX_PAGES = 60;
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    let q = supabase
      .from("site_events")
      .select("session_id, page_path, referrer, utm_source, utm_medium, properties, created_at, event_name")
      .eq("event_name", "session_start")
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (start) q = q.gte("created_at", start);
    if (end) q = q.lt("created_at", end);
    const { data, error } = await q;
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as VisitorHit[];
    if (rows.length === 0) break;
    out.push(...rows);
    if (rows.length < PAGE) break;
    offset += PAGE;
  }

  return out;
}

async function discoveryLandingTops(
  supabase: ReturnType<typeof createAdminClient>,
  start: string | null,
  end: string | null,
  limit = 8
): Promise<{
  search: Array<[string, number]>;
  llm: Array<[string, number]>;
  discovery: Array<[string, number]>;
  llmSources: Array<[string, number]>;
  channelMix: Array<[string, number]>;
}> {
  // session_start = landing (referrer/utm preserved); one row per session.
  const landings = await fetchSessionStarts(supabase, start, end);

  const search = new Map<string, number>();
  const llm = new Map<string, number>();
  const discovery = new Map<string, number>();
  const llmSources = new Map<string, number>();
  const channelMix = new Map<string, number>();

  for (const hit of landings) {
    const { channel, label } = classifyTrafficChannel(hit.referrer, hit.utm_source, hit.utm_medium);
    bump(channelMix, channel);

    const path = (hit.page_path || "").trim() || "/";
    if (channel === "search") {
      bump(search, path);
      bump(discovery, path);
    } else if (channel === "llm") {
      bump(llm, path);
      bump(discovery, path);
      bump(llmSources, label);
    }
  }

  return {
    search: topFromMap(search, limit),
    llm: topFromMap(llm, limit),
    discovery: topFromMap(discovery, limit),
    llmSources: topFromMap(llmSources, 6),
    channelMix: topFromMap(channelMix, 8),
  };
}

async function recentSessionsToday(
  supabase: ReturnType<typeof createAdminClient>,
  start: string,
  end: string
): Promise<StatsReport["recentSessions"]> {
  const hits = await fetchVisitorHits(supabase, start, end, 2000);
  const landings = sessionLandings(hits);

  // Newest sessions first for the feed
  const ordered = Array.from(landings.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const out: StatsReport["recentSessions"] = [];
  for (const row of ordered) {
    const { data: prior } = await supabase
      .from("site_events")
      .select("id")
      .eq("session_id", row.session_id)
      .lt("created_at", start)
      .in("event_name", [...VISITOR_EVENTS])
      .limit(1);

    const props = (row.properties ?? {}) as Record<string, unknown>;
    const { channel, label } = classifyTrafficChannel(row.referrer, row.utm_source, row.utm_medium);
    const llm = channel === "llm" ? label : classifyLlmAttribution(row.referrer, row.utm_source, row.utm_medium);

    out.push({
      sessionId: row.session_id.slice(0, 8) + "…",
      pagePath: row.page_path,
      referrer: row.referrer,
      country: typeof props.country === "string" ? props.country : null,
      isReturning: (prior?.length ?? 0) > 0,
      llm,
      channel,
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
    discoveryToday,
    discoveryAll,
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
    discoveryLandingTops(supabase, todayWin.start, todayWin.end),
    discoveryLandingTops(supabase, null, null),
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

  const [localeToday, localeYesterday, localeTotal] = await Promise.all([
    localeFunnelCounts(supabase, todayWin.start, todayWin.end),
    localeFunnelCounts(supabase, yWin.start, yWin.end),
    localeFunnelCounts(supabase, null, null),
  ]);

  const trend = (trendRaw.data ?? []).map(
    (row: { day_label: string; visitors: number; page_views: number }) => ({
      dayLabel: row.day_label,
      visitors: Number(row.visitors),
      pageViews: Number(row.page_views),
    })
  );

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
    topPagesSearchToday: discoveryToday.search,
    topPagesSearchAll: discoveryAll.search,
    topPagesLlmToday: discoveryToday.llm,
    topPagesLlmAll: discoveryAll.llm,
    topPagesDiscoveryToday: discoveryToday.discovery,
    topPagesDiscoveryAll: discoveryAll.discovery,
    topReferrersToday,
    topUtmToday,
    topCountriesToday,
    topCountriesAll,
    topLangToday,
    topDeviceToday,
    topBrowserToday,
    topProvidersToday,
    topProvidersAll,
    llmSourcesToday: discoveryToday.llmSources,
    channelMixToday: discoveryToday.channelMix,
    recentSessions,
    wizardTelegram,
    localeSplit: {
      today: localeToday,
      yesterday: localeYesterday,
      total: localeTotal,
    },
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

import { createAdminClient } from "@/lib/admin/supabase";
import { isAnalyticsBotRow } from "@/lib/analytics/threads-stats";
import { classifyTrafficChannel } from "@/lib/analytics/traffic-channel";

type EventRow = {
  session_id: string | null;
  event_name: string;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  user_agent: string | null;
  properties: Record<string, unknown> | null;
  created_at: string;
};

const FUNNEL = [
  "wizard_started",
  "wizard_completed",
  "wizard_results_view",
  "wizard_cta_click",
  "assist_cta_click",
  "community_join_click",
  "provider_click",
  "investment_lead_submitted",
] as const;

type Totals = { sessions: number; page_views: number } & Record<(typeof FUNNEL)[number], number>;

async function loadEvents(sinceIso: string): Promise<EventRow[]> {
  const supabase = createAdminClient();
  const rows: EventRow[] = [];
  for (let from = 0; from < 60_000; from += 1000) {
    const { data, error } = await supabase
      .from("site_events")
      .select("session_id, event_name, page_path, referrer, utm_source, utm_medium, user_agent, properties, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as EventRow[]));
    if (!data || data.length < 1000) break;
  }
  return rows.filter((r) => !isAnalyticsBotRow(r) && !/^\/(?:admin|api)\b/.test(r.page_path ?? ""));
}

function refHost(referrer: string | null): string {
  if (!referrer) return "(direct)";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer.slice(0, 60);
  }
}

function totals(rows: EventRow[]): Totals {
  const t = { sessions: new Set(rows.map((r) => r.session_id).filter(Boolean)).size, page_views: 0 } as Totals;
  for (const k of FUNNEL) t[k] = 0;
  for (const r of rows) {
    if (r.event_name === "page_view") t.page_views++;
    else if ((FUNNEL as readonly string[]).includes(r.event_name)) t[r.event_name as (typeof FUNNEL)[number]]++;
  }
  return t;
}

/** Sessions keyed by first touch (referrer / UTM of the earliest event). */
function sessionsBy(rows: EventRow[], key: (first: EventRow) => string): Map<string, number> {
  const first = new Map<string, EventRow>();
  for (const r of rows) if (r.session_id && !first.has(r.session_id)) first.set(r.session_id, r);
  const out = new Map<string, number>();
  for (const r of Array.from(first.values())) out.set(key(r), (out.get(key(r)) ?? 0) + 1);
  return out;
}

function count(rows: EventRow[], event: string, key: (r: EventRow) => string): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of rows) if (r.event_name === event) out.set(key(r), (out.get(key(r)) ?? 0) + 1);
  return out;
}

function compare(cur: Map<string, number>, prev: Map<string, number>, limit: number) {
  return Array.from(new Set([...Array.from(cur.keys()), ...Array.from(prev.keys())]))
    .map((k) => ({ key: k, current: cur.get(k) ?? 0, previous: prev.get(k) ?? 0 }))
    .sort((a, b) => b.current - a.current || b.previous - a.previous)
    .slice(0, limit);
}

export async function trafficBreakdown(opts: { days?: number; pathContains?: string }) {
  const days = Math.min(45, Math.max(1, Math.round(opts.days ?? 7)));
  const now = Date.now();
  const splitIso = new Date(now - days * 86_400_000).toISOString();
  let rows = await loadEvents(new Date(now - 2 * days * 86_400_000).toISOString());
  if (opts.pathContains) {
    const sessions = new Set(rows.filter((r) => r.page_path?.includes(opts.pathContains!)).map((r) => r.session_id));
    rows = rows.filter((r) => sessions.has(r.session_id));
  }
  const cur = rows.filter((r) => r.created_at >= splitIso);
  const prev = rows.filter((r) => r.created_at < splitIso);
  const channel = (r: EventRow) => classifyTrafficChannel(r.referrer, r.utm_source, r.utm_medium).channel;
  const source = (r: EventRow) => (r.utm_source ? `utm:${r.utm_source}` : refHost(r.referrer));
  const page = (r: EventRow) => (r.page_path ?? "").split("?")[0] || "/";

  const daily = new Map<string, { date: string; sessions: Set<string>; page_views: number; wizard_started: number; assist_cta_click: number }>();
  for (const r of cur) {
    const date = r.created_at.slice(0, 10);
    const d = daily.get(date) ?? { date, sessions: new Set(), page_views: 0, wizard_started: 0, assist_cta_click: 0 };
    if (r.session_id) d.sessions.add(r.session_id);
    if (r.event_name === "page_view") d.page_views++;
    if (r.event_name === "wizard_started") d.wizard_started++;
    if (r.event_name === "assist_cta_click") d.assist_cta_click++;
    daily.set(date, d);
  }

  return {
    note: "Без ботов и /admin. sessions — уникальные session_id; каналы и источники — по первому касанию сессии. previous — такой же период перед текущим.",
    period_days: days,
    current_from: splitIso.slice(0, 10),
    previous_from: new Date(now - 2 * days * 86_400_000).toISOString().slice(0, 10),
    path_filter: opts.pathContains ?? null,
    totals: { current: totals(cur), previous: totals(prev) },
    daily: Array.from(daily.values()).map((d) => ({ ...d, sessions: d.sessions.size })),
    channels: compare(sessionsBy(cur, channel), sessionsBy(prev, channel), 10),
    sources: compare(sessionsBy(cur, source), sessionsBy(prev, source), 15),
    landing_pages: compare(sessionsBy(cur, page), sessionsBy(prev, page), 15),
    top_pages_by_views: compare(count(cur, "page_view", page), count(prev, "page_view", page), 20),
    wizard_started_by_page: compare(count(cur, "wizard_started", page), count(prev, "wizard_started", page), 8),
    assist_clicks_by_page: compare(count(cur, "assist_cta_click", page), count(prev, "assist_cta_click", page), 8),
  };
}

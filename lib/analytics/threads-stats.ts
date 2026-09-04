/**
 * Threads block for /stats — same shape as Barakhlo:
 * tagged-link sessions only (utm_source=threads), not in-app browser on random URLs.
 */
import { isBotUserAgent } from "@/lib/analytics/ua-parse";
import {
  expectedThreadsBrandUsername,
  loadThreadsEnv,
  THREADS_GRAPH_BASE,
} from "@/lib/threads/config";

export type ThreadsLandingKey = "wizard" | "assist" | "guide" | "news" | "other";

export type ThreadsLandingCounts = Record<ThreadsLandingKey, number>;

export type ThreadsDayCount = { dayLabel: string; sessions: number };

export type ThreadsReferralStats = {
  handle: string;
  followers: number | null;
  clicks7d: ThreadsLandingCounts;
  trend: ThreadsDayCount[];
};

export const THREADS_LANDING_ORDER: Array<{
  key: ThreadsLandingKey;
  label: string;
  always: boolean;
}> = [
  { key: "wizard", label: "визард", always: true },
  { key: "assist", label: "Assist", always: true },
  { key: "guide", label: "гайды", always: true },
  { key: "news", label: "новости", always: false },
  { key: "other", label: "прочие", always: false },
];

export function emptyThreadsLandingCounts(): ThreadsLandingCounts {
  return { wizard: 0, assist: 0, guide: 0, news: 0, other: 0 };
}

export function expectedThreadsHandle(): string {
  return expectedThreadsBrandUsername();
}

export function emptyThreadsReferralStats(): ThreadsReferralStats {
  return {
    handle: expectedThreadsHandle(),
    followers: null,
    clicks7d: emptyThreadsLandingCounts(),
    trend: [],
  };
}

export function isThreadsUtmSource(utm: string | null | undefined): boolean {
  return (utm || "").trim().toLowerCase() === "threads";
}

export function classifyThreadsLanding(pagePath: string | null | undefined): ThreadsLandingKey {
  const path = (pagePath || "").split("?")[0].toLowerCase();
  if (path.includes("/wizard")) return "wizard";
  if (path === "/assist" || path.includes("/assist")) return "assist";
  if (path.includes("/guides") || path.includes("/guias")) return "guide";
  if (
    path.includes("/news") ||
    path.includes("/noticias") ||
    path.includes("/go/telegram")
  ) {
    return "news";
  }
  return "other";
}

export function isAnalyticsBotRow(row: {
  properties?: Record<string, unknown> | null;
  user_agent?: string | null;
}): boolean {
  const bot = row.properties?.is_bot;
  if (bot === true || bot === 1 || bot === "true" || bot === "1") return true;
  return isBotUserAgent(row.user_agent);
}

export type ThreadsTouchRow = {
  session_id: string | null;
  page_path: string | null;
  utm_source: string | null;
  created_at: string;
  properties?: Record<string, unknown> | null;
  user_agent?: string | null;
};

export type ThreadsDayWindow = { start: string; end: string; label: string };

export function followersFromInsightsPayload(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) return null;
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as { name?: string; total_value?: { value?: unknown } };
    if (row.name !== "followers_count") continue;
    const raw = row.total_value?.value;
    const n = typeof raw === "number" ? raw : Number.parseInt(String(raw ?? ""), 10);
    return Number.isFinite(n) ? n : 0;
  }
  return null;
}

export async function fetchThreadsFollowersCountSafe(): Promise<number | null> {
  const env = loadThreadsEnv();
  if (!env.accessToken) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const u = new URL(`${THREADS_GRAPH_BASE}/me/threads_insights`);
    u.searchParams.set("metric", "followers_count");
    u.searchParams.set("access_token", env.accessToken);
    const res = await fetch(u.toString(), { signal: ctrl.signal });
    if (!res.ok) return null;
    return followersFromInsightsPayload(await res.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** First-touch landing per Threads session in the window. */
export function aggregateThreadsSessions(
  rows: ThreadsTouchRow[],
  windows: ThreadsDayWindow[]
): { clicks7d: ThreadsLandingCounts; trend: ThreadsDayCount[] } {
  const eligible = rows.filter(
    (row) =>
      Boolean(row.session_id) &&
      isThreadsUtmSource(row.utm_source) &&
      !isAnalyticsBotRow(row)
  );
  const sorted = [...eligible].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const firstLanding = new Map<string, ThreadsLandingKey>();
  for (const row of sorted) {
    const sid = String(row.session_id);
    if (!firstLanding.has(sid)) {
      firstLanding.set(sid, classifyThreadsLanding(row.page_path));
    }
  }

  const clicks7d = emptyThreadsLandingCounts();
  firstLanding.forEach((landing) => {
    clicks7d[landing] += 1;
  });

  const trend: ThreadsDayCount[] = windows.map((win) => {
    const sessions = new Set<string>();
    for (const row of eligible) {
      const sid = String(row.session_id);
      if (row.created_at >= win.start && row.created_at < win.end) {
        sessions.add(sid);
      }
    }
    return { dayLabel: win.label, sessions: sessions.size };
  });

  return { clicks7d, trend };
}

function fmtLandingLine(prefix: string, counts: ThreadsLandingCounts): string | null {
  const bits: string[] = [];
  for (const { key, label, always } of THREADS_LANDING_ORDER) {
    const value = counts[key];
    if (!always && !value) continue;
    bits.push(`${label} <b>${value}</b>`);
  }
  if (!bits.length) return null;
  return `${prefix}${bits.join(" · ")}`;
}

export function formatThreadsReferralsTelegram(stats: ThreadsReferralStats): string[] {
  const lines = ["<b>Threads</b> (клики с наших ссылок)"];
  if (stats.followers != null) {
    lines.push(
      `Подписчики @${stats.handle}: <b>${stats.followers}</b> <i>(Graph)</i>`
    );
  }
  const clickLine = fmtLandingLine("7д: ", stats.clicks7d);
  if (clickLine) lines.push(clickLine);
  if (!stats.trend.some((row) => row.sessions > 0)) {
    lines.push("  — пока нет");
    return lines;
  }
  for (const row of stats.trend) {
    const bar = row.sessions > 0 ? "▪".repeat(Math.min(row.sessions, 12)) : "·";
    lines.push(`  ${row.dayLabel}: <b>${row.sessions}</b> ${bar}`);
  }
  return lines;
}

import { unstable_cache } from "next/cache";
import { google } from "googleapis";
import type {
  DashboardSurfaceKey,
  SearchConsoleRow,
  SearchConsoleStats,
} from "@/lib/analytics/dashboard/types";
import { classifyDashboardSurface } from "@/lib/analytics/dashboard/surface";

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function credentials(): Record<string, unknown> | undefined {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return JSON.parse(raw.replace(/\\n/g, "\n")) as Record<string, unknown>;
  }
}

function authClient() {
  const inline = credentials();
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!inline && !keyFile) throw new Error("GSC credentials are not configured");
  return new google.auth.GoogleAuth({
    ...(inline ? { credentials: inline } : { keyFile }),
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
}

function mapRows(
  rows:
    | Array<{
        keys?: string[] | null;
        clicks?: number | null;
        impressions?: number | null;
        ctr?: number | null;
        position?: number | null;
      }>
    | null
    | undefined
): SearchConsoleRow[] {
  return (rows ?? []).map((row) => ({
    key: row.keys?.[0] ?? "",
    clicks: Number(row.clicks ?? 0),
    impressions: Number(row.impressions ?? 0),
    ctr: Number(row.ctr ?? 0),
    position: Number(row.position ?? 0),
  }));
}

export function classifyGscSurface(url: string): DashboardSurfaceKey {
  try {
    const parsed = new URL(url);
    return classifyDashboardSurface(parsed.hostname, parsed.pathname);
  } catch {
    return classifyDashboardSurface(null, url);
  }
}

async function fetchSearchConsoleUncached(): Promise<SearchConsoleStats> {
  const lag = Math.max(1, Number.parseInt(process.env.GSC_DATA_LAG_DAYS || "3", 10) || 3);
  const days = 28;
  const currentStart = isoDaysAgo(lag + days - 1);
  const currentEnd = isoDaysAgo(lag);
  const previousStart = isoDaysAgo(lag + days * 2 - 1);
  const previousEnd = isoDaysAgo(lag + days);
  const siteUrl = process.env.GSC_SITE_PROPERTY?.trim() || "sc-domain:emigro.online";
  const searchConsole = google.searchconsole({ version: "v1", auth: authClient() });
  const timeout = Math.max(5_000, Number(process.env.GSC_TIMEOUT_MS || 15_000));

  const query = (
    startDate: string,
    endDate: string,
    dimensions: string[] = [],
    rowLimit = 1_000
  ) =>
    searchConsole.searchanalytics.query(
      { siteUrl, requestBody: { startDate, endDate, dimensions, rowLimit } },
      { timeout }
    );

  const [current, previous, daily, pages, queries] = await Promise.all([
    query(currentStart, currentEnd),
    query(previousStart, previousEnd),
    query(currentStart, currentEnd, ["date"], 100),
    query(currentStart, currentEnd, ["page"], 250),
    query(currentStart, currentEnd, ["query"], 250),
  ]);
  const currentTotal = current.data.rows?.[0];
  const previousTotal = previous.data.rows?.[0];
  const pageRows = mapRows(pages.data.rows).sort((a, b) => b.clicks - a.clicks);
  const surfaceMap = new Map<DashboardSurfaceKey, { clicks: number; impressions: number }>();
  for (const row of pageRows) {
    const key = classifyGscSurface(row.key);
    const value = surfaceMap.get(key) ?? { clicks: 0, impressions: 0 };
    value.clicks += row.clicks;
    value.impressions += row.impressions;
    surfaceMap.set(key, value);
  }

  return {
    available: true,
    startDate: currentStart,
    endDate: currentEnd,
    clicks: Number(currentTotal?.clicks ?? 0),
    previousClicks: Number(previousTotal?.clicks ?? 0),
    impressions: Number(currentTotal?.impressions ?? 0),
    previousImpressions: Number(previousTotal?.impressions ?? 0),
    ctr: Number(currentTotal?.ctr ?? 0),
    position: Number(currentTotal?.position ?? 0),
    trend: (daily.data.rows ?? []).map((row) => ({
      dayLabel: row.keys?.[0]?.slice(5) ?? "",
      clicks: Number(row.clicks ?? 0),
      impressions: Number(row.impressions ?? 0),
    })),
    topPages: pageRows.slice(0, 10),
    topQueries: mapRows(queries.data.rows)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10),
    surfaces: Array.from(surfaceMap, ([key, value]) => ({ key, ...value })).sort(
      (a, b) => b.clicks - a.clicks
    ),
  };
}

const fetchSearchConsoleCached = unstable_cache(
  fetchSearchConsoleUncached,
  ["emigro-admin-gsc-v1"],
  { revalidate: 21_600 }
);

export async function fetchSearchConsoleStatsSafe(): Promise<SearchConsoleStats> {
  try {
    return await fetchSearchConsoleCached();
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : String(error),
      clicks: 0,
      previousClicks: 0,
      impressions: 0,
      previousImpressions: 0,
      ctr: 0,
      position: 0,
      trend: [],
      topPages: [],
      topQueries: [],
      surfaces: [],
    };
  }
}

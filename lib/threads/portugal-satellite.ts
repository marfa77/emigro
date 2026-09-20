/**
 * Isolated Portugal satellite Threads pipeline (portugal.emigro.online).
 * Never reuse Assist THREADS_* or Invest THREADS_INVESTMENT_* tokens.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import {
  clipThreadsText,
  formatThreadsChainPreview,
  type ThreadsChainItem,
} from "@/lib/threads/compose";
import { normalizeThreadsUsername } from "@/lib/threads/config";

export const THREADS_PT_SAT_USERNAME = "emigro_portugal";
export const THREADS_PT_SAT_CAMPAIGN = "emigro_pt_satellite";
export const THREADS_PT_SAT_LINK_STRIDE = 7;
export const THREADS_PT_SAT_WEEKDAYS = [0, 2, 4] as const;

export const THREADS_PT_SAT_STATE_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-portugal-satellite-posted.json"
);

export type PortugalSatelliteRow = {
  d: number;
  pillar: string;
  cta: string;
  dest: string;
  p1: string;
  p2: string;
};

export type PortugalSatelliteState = {
  last_day: number;
  last_posted_on: string;
  posts: Record<string, { at: string; ids?: string[] }>;
};

const BANK_PATH = resolve(
  process.cwd(),
  "lib/threads/banks/emigro-portugal-satellite-days.json"
);

export function expectedPortugalSatelliteUsername(): string {
  return normalizeThreadsUsername(
    process.env.THREADS_PT_SAT_USERNAME || THREADS_PT_SAT_USERNAME
  );
}

export function assertPortugalSatelliteAccountIsolated(me?: {
  username?: string | null;
}): void {
  const got = normalizeThreadsUsername(me?.username);
  const want = expectedPortugalSatelliteUsername();
  const assist = normalizeThreadsUsername(
    process.env.THREADS_USERNAME || process.env.THREADS_BRAND_USERNAME || "emigro_assist"
  );
  const invest = normalizeThreadsUsername(
    process.env.THREADS_INVESTMENT_USERNAME || "emigro_invest"
  );
  if (got && (got === assist || got === invest)) {
    throw new Error(`refusing to publish PT satellite as @${got}`);
  }
  if (me && got !== want) {
    throw new Error(`refusing to publish PT satellite as @${got || "unknown"}; expected @${want}`);
  }
}

export function loadPortugalSatelliteDays(): PortugalSatelliteRow[] {
  const payload = JSON.parse(readFileSync(BANK_PATH, "utf8")) as PortugalSatelliteRow[];
  if (!Array.isArray(payload)) throw new Error("portugal satellite bank must be an array");
  return payload.slice().sort((a, b) => a.d - b.d);
}

export function assertPortugalSatelliteBank(rows = loadPortugalSatelliteDays()): void {
  const errors: string[] = [];
  const ds = rows.map((r) => r.d);
  if (ds.length !== 100) errors.push(`expected 100 days, got ${ds.length}`);
  if (ds[0] !== 1 || ds[ds.length - 1] !== 100) errors.push("days must be 1..100");
  for (const row of rows) {
    if (!row.p1?.trim()) errors.push(`d${row.d}: empty p1`);
    if (/https?:\/\//i.test(row.p1) || /https?:\/\//i.test(row.p2 || "")) {
      errors.push(`d${row.d}: url in copy`);
    }
    if ((row.p1 || "").length > 500) errors.push(`d${row.d}: p1 > 500`);
  }
  if (errors.length) throw new Error(errors.slice(0, 12).join("; "));
}

export function satelliteNoteUrl(dest: string, content: string): string {
  const path = dest.startsWith("/") ? dest : `/${dest}`;
  const url = new URL(path, `https://${PORTUGAL_SATELLITE_HOST}/`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", THREADS_PT_SAT_CAMPAIGN);
  url.searchParams.set("utm_content", content.slice(0, 40));
  return url.toString();
}

export function composePortugalSatelliteChain(row: PortugalSatelliteRow): ThreadsChainItem[] {
  const content = `sat${String(row.d).padStart(3, "0")}`;
  const items: ThreadsChainItem[] = [
    { text: clipThreadsText(row.p1), role: "root", topicTag: "Португалия" },
  ];
  if (row.d % THREADS_PT_SAT_LINK_STRIDE === 0) {
    const cta = clipThreadsText(`${row.p2.trim()}\n${satelliteNoteUrl(row.dest || "/", content)}`);
    items.push({ text: cta, role: "cta" });
    return items;
  }
  if (row.p2?.trim()) {
    items.push({ text: clipThreadsText(row.p2), role: "slide" });
  }
  return items;
}

export function loadPortugalSatelliteState(
  path = THREADS_PT_SAT_STATE_PATH
): PortugalSatelliteState {
  if (!existsSync(path)) return { last_day: 0, last_posted_on: "", posts: {} };
  const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<PortugalSatelliteState>;
  return {
    last_day: Number(raw.last_day || 0),
    last_posted_on: String(raw.last_posted_on || ""),
    posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
  };
}

export function savePortugalSatelliteState(
  state: PortugalSatelliteState,
  path = THREADS_PT_SAT_STATE_PATH
): void {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(tmp, path);
}

function lisbonDateIso(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

/** Python weekday: Monday=0 … Sunday=6. */
export function lisbonWeekday(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  const js = new Date(Date.UTC(year, (month || 1) - 1, day || 1, 12)).getUTCDay();
  return (js + 6) % 7;
}

export function portugalSatelliteDueOn(iso: string): boolean {
  return (THREADS_PT_SAT_WEEKDAYS as readonly number[]).includes(lisbonWeekday(iso));
}

export function planPortugalSatellitePost(opts: {
  today?: string;
  state?: PortugalSatelliteState;
}): { row?: PortugalSatelliteRow; skip?: string; today: string } {
  const today = opts.today || lisbonDateIso();
  const state = opts.state || loadPortugalSatelliteState();
  if (!portugalSatelliteDueOn(today)) return { skip: "off_weekday", today };
  if (state.last_posted_on === today) return { skip: "already_posted", today };
  const rows = loadPortugalSatelliteDays();
  const next = rows.find((row) => row.d === state.last_day + 1) || rows[0];
  if (!next) return { skip: "empty_bank", today };
  return { row: next, today };
}

export function previewPortugalSatellite(row: PortugalSatelliteRow): string {
  return formatThreadsChainPreview(composePortugalSatelliteChain(row));
}

/**
 * Isolated Italy satellite Threads pipeline (italy.emigro.online).
 * Never reuse Assist THREADS_*, Invest THREADS_INVESTMENT_*, or Portugal THREADS_PT_SAT_* tokens.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { ITALY_SATELLITE_HOST } from "@/lib/satellite/italy";
import {
  clipThreadsText,
  formatThreadsChainPreview,
  type ThreadsChainItem,
} from "@/lib/threads/compose";
import { normalizeThreadsUsername } from "@/lib/threads/config";

export const THREADS_IT_SAT_USERNAME = "emigro_italy";
export const THREADS_IT_SAT_CAMPAIGN = "emigro_it_satellite";
export const THREADS_IT_SAT_LINK_STRIDE = 7;
export const THREADS_IT_SAT_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;

export const THREADS_IT_SAT_STATE_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-italy-satellite-posted.json"
);

export type ItalySatelliteRow = {
  d: number;
  pillar: string;
  cta: string;
  dest: string;
  p1: string;
  p2: string;
};

export type ItalySatellitePostFormat = "TEXT";

export type ItalySatelliteState = {
  last_day: number;
  last_posted_on: string;
  posts: Record<string, { at: string; ids?: string[]; format?: ItalySatellitePostFormat }>;
};

const BANK_PATH = resolve(
  process.cwd(),
  "lib/threads/banks/emigro-italy-satellite-days.json"
);

export function expectedItalySatelliteUsername(): string {
  return normalizeThreadsUsername(
    process.env.THREADS_IT_SAT_USERNAME || THREADS_IT_SAT_USERNAME
  );
}

export function assertItalySatelliteAccountIsolated(me?: {
  username?: string | null;
}): void {
  const got = normalizeThreadsUsername(me?.username);
  const want = expectedItalySatelliteUsername();
  const assist = normalizeThreadsUsername(
    process.env.THREADS_BRAND_USERNAME ||
      process.env.THREADS_ASSIST_USERNAME ||
      "emigro_assist"
  );
  const invest = normalizeThreadsUsername(
    process.env.THREADS_INVESTMENT_USERNAME || "emigro_invest"
  );
  const portugal = normalizeThreadsUsername(
    process.env.THREADS_PT_SAT_USERNAME || "emigro_portugal"
  );
  if (got && (got === assist || got === invest || got === portugal)) {
    throw new Error(`refusing to publish IT satellite as @${got}`);
  }
  if (me && got !== want) {
    throw new Error(`refusing to publish IT satellite as @${got || "unknown"}; expected @${want}`);
  }
}

export function loadItalySatelliteDays(): ItalySatelliteRow[] {
  const payload = JSON.parse(readFileSync(BANK_PATH, "utf8")) as ItalySatelliteRow[];
  if (!Array.isArray(payload)) throw new Error("italy satellite bank must be an array");
  return payload.slice().sort((a, b) => a.d - b.d);
}

export function assertItalySatelliteBank(rows = loadItalySatelliteDays()): void {
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
  const url = new URL(path, `https://${ITALY_SATELLITE_HOST}/`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", THREADS_IT_SAT_CAMPAIGN);
  url.searchParams.set("utm_content", content.slice(0, 40));
  return url.toString();
}

export function composeItalySatelliteChain(
  row: ItalySatelliteRow,
  opts?: { today?: string }
): ThreadsChainItem[] {
  const today = opts?.today || romeDateIso();
  void today;
  const content = `sat${String(row.d).padStart(3, "0")}`;
  const items: ThreadsChainItem[] = [
    {
      text: clipThreadsText(row.p1),
      role: "root",
      topicTag: "Италия",
    },
  ];
  if (row.d % THREADS_IT_SAT_LINK_STRIDE === 0) {
    const cta = clipThreadsText(`${row.p2.trim()}\n${satelliteNoteUrl(row.dest || "/", content)}`);
    items.push({ text: cta, role: "cta" });
    return items;
  }
  if (row.p2?.trim()) {
    items.push({ text: clipThreadsText(row.p2), role: "slide" });
  }
  return items;
}

export function loadItalySatelliteState(
  path = THREADS_IT_SAT_STATE_PATH
): ItalySatelliteState {
  if (!existsSync(path)) return { last_day: 0, last_posted_on: "", posts: {} };
  const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ItalySatelliteState>;
  return {
    last_day: Number(raw.last_day || 0),
    last_posted_on: String(raw.last_posted_on || ""),
    posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
  };
}

export function saveItalySatelliteState(
  state: ItalySatelliteState,
  path = THREADS_IT_SAT_STATE_PATH
): void {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(tmp, path);
}

function romeDateIso(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/Rome" });
}

/** Python weekday: Monday=0 … Sunday=6. */
export function romeWeekday(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  const js = new Date(Date.UTC(year, (month || 1) - 1, day || 1, 12)).getUTCDay();
  return (js + 6) % 7;
}

export function italySatelliteDueOn(iso: string): boolean {
  return (THREADS_IT_SAT_WEEKDAYS as readonly number[]).includes(romeWeekday(iso));
}

export function planItalySatellitePost(opts: {
  today?: string;
  state?: ItalySatelliteState;
}): { row?: ItalySatelliteRow; skip?: string; today: string } {
  const today = opts.today || romeDateIso();
  const state = opts.state || loadItalySatelliteState();
  if (!italySatelliteDueOn(today)) return { skip: "off_weekday", today };
  if (state.last_posted_on === today) return { skip: "already_posted", today };
  const rows = loadItalySatelliteDays();
  const next = rows.find((row) => row.d === state.last_day + 1) || rows[0];
  if (!next) return { skip: "empty_bank", today };
  return { row: next, today };
}

export function previewItalySatellite(row: ItalySatelliteRow, today?: string): string {
  return formatThreadsChainPreview(composeItalySatelliteChain(row, { today }));
}

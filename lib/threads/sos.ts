/**
 * Weekly SOS post on @emigro_assist — verified emergency / help numbers.
 * Extra root on top of the daily calendar: does not claim the day budget.
 * Bank: lib/threads/banks/emigro-sos.json (every number verified on an official page).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { type ThreadsChainItem, sanitizeThreadsTopicTag } from "@/lib/threads/compose";

export const THREADS_SOS_BANK_PATH = resolve(process.cwd(), "lib/threads/banks/emigro-sos.json");
export const THREADS_SOS_STATE_PATH = resolve(process.cwd(), "parser/out/emigro-threads-sos.json");

/** 0 = Sunday … 6 = Saturday, Europe/Lisbon. */
export const THREADS_SOS_WEEKDAY = 2;
export const THREADS_SOS_MIN_GAP_DAYS = 6;

export type ThreadsSosRow = {
  id: number;
  week: number;
  country: string;
  topic_tag: string;
  situation: string;
  p1: string;
  p2: string;
  source_url: string;
  evidence: string;
  why: string;
  verified_on: string;
};

export type ThreadsSosState = {
  last_id: number;
  last_posted_on: string;
  posts: Record<string, { at: string; ids: string[]; source?: string }>;
};

export function loadThreadsSosBank(path = THREADS_SOS_BANK_PATH): ThreadsSosRow[] {
  const rows = JSON.parse(readFileSync(path, "utf8")) as ThreadsSosRow[];
  return [...rows].sort((a, b) => a.id - b.id);
}

export function assertThreadsSosBank(rows: ThreadsSosRow[] = loadThreadsSosBank()): string[] {
  const errors: string[] = [];
  const ids = new Set<number>();
  for (const row of rows) {
    const tag = `sos ${row.id}`;
    if (ids.has(row.id)) errors.push(`${tag}: duplicate id`);
    ids.add(row.id);
    if (!row.p1?.trim()) errors.push(`${tag}: empty p1`);
    if ((row.p1 || "").length > 450) errors.push(`${tag}: p1 > 450`);
    if (/https?:\/\//.test(row.p1 || "")) errors.push(`${tag}: url in p1`);
    if ((row.p2 || "").length > 300) errors.push(`${tag}: p2 > 300`);
    if (!/https:\/\/\S+/.test(row.p2 || "")) errors.push(`${tag}: p2 missing official source url`);
    if (!row.source_url || !(row.p2 || "").includes(row.source_url)) {
      errors.push(`${tag}: p2 must carry source_url`);
    }
    if (!row.evidence?.trim()) errors.push(`${tag}: missing evidence`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.verified_on || "")) errors.push(`${tag}: missing verified_on`);
    if (!sanitizeThreadsTopicTag(row.topic_tag)) errors.push(`${tag}: bad topic_tag`);
  }
  return errors;
}

function emptyState(): ThreadsSosState {
  return { last_id: 0, last_posted_on: "", posts: {} };
}

export function loadThreadsSosState(path = THREADS_SOS_STATE_PATH): ThreadsSosState {
  if (!existsSync(path)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ThreadsSosState>;
    return {
      last_id: Number(raw.last_id || 0) || 0,
      last_posted_on: String(raw.last_posted_on || ""),
      posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
    };
  } catch {
    return emptyState();
  }
}

export function saveThreadsSosState(state: ThreadsSosState, path = THREADS_SOS_STATE_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
}

export function lisbonTodayIso(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

export function lisbonWeekdayOf(iso: string): number {
  return new Date(`${iso}T12:00:00.000Z`).getUTCDay();
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(`${b}T12:00:00.000Z`).getTime() - new Date(`${a}T12:00:00.000Z`).getTime()) / 86_400_000
  );
}

export function planThreadsSosPost(opts: {
  today?: string;
  state?: ThreadsSosState;
  rows?: ThreadsSosRow[];
}): { today: string; row?: ThreadsSosRow; skip?: string } {
  const today = opts.today || lisbonTodayIso();
  const state = opts.state || loadThreadsSosState();
  const rows = opts.rows || loadThreadsSosBank();
  if (lisbonWeekdayOf(today) !== THREADS_SOS_WEEKDAY) return { today, skip: "not_sos_weekday" };
  if (state.last_posted_on === today) return { today, skip: "already_posted_today" };
  if (state.last_posted_on && daysBetween(state.last_posted_on, today) < THREADS_SOS_MIN_GAP_DAYS) {
    return { today, skip: "gap_not_elapsed" };
  }
  const row = rows.find((r) => r.id > state.last_id);
  if (!row) return { today, skip: "sos_bank_exhausted" };
  return { today, row };
}

export function composeThreadsSosChain(row: ThreadsSosRow): ThreadsChainItem[] {
  const topicTag = sanitizeThreadsTopicTag(row.topic_tag);
  return [
    { text: row.p1.trim(), role: "root", ...(topicTag ? { topicTag } : {}) },
    { text: row.p2.trim(), role: "cta" },
  ];
}

export function previewThreadsSos(row: ThreadsSosRow): string {
  return composeThreadsSosChain(row)
    .map((item, i) => `${i === 0 ? "ROOT" : "REPLY"}${item.topicTag ? ` [${item.topicTag}]` : ""}:\n${item.text}`)
    .join("\n\n");
}

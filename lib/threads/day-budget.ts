/**
 * Shared root-post budget: max 1 Threads root chain per Europe/Lisbon day
 * across guide + satellite + lightning. Comment replies are not root posts.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export const THREADS_DAY_BUDGET_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-threads-day-budget.json"
);

export type ThreadsRootStream = "guide" | "satellite" | "lightning";

export type ThreadsDayBudgetState = {
  /** YYYY-MM-DD in Europe/Lisbon */
  last_on: string;
  stream: ThreadsRootStream | "";
  claimed_at: string;
  confirmed: boolean;
  /** Optional slug / headline for logs */
  note?: string;
};

export function todayLisbon(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

function emptyState(): ThreadsDayBudgetState {
  return {
    last_on: "",
    stream: "",
    claimed_at: "",
    confirmed: false,
  };
}

export function loadThreadsDayBudget(
  path = THREADS_DAY_BUDGET_PATH
): ThreadsDayBudgetState {
  if (!existsSync(path)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ThreadsDayBudgetState>;
    return {
      ...emptyState(),
      ...raw,
      last_on: String(raw.last_on || ""),
      stream: (raw.stream as ThreadsRootStream | "") || "",
      claimed_at: String(raw.claimed_at || ""),
      confirmed: Boolean(raw.confirmed),
      note: raw.note ? String(raw.note) : undefined,
    };
  } catch {
    return emptyState();
  }
}

export function saveThreadsDayBudget(
  state: ThreadsDayBudgetState,
  path = THREADS_DAY_BUDGET_PATH
): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
}

export type ThreadsDayClaimResult =
  | { ok: true; today: string }
  | {
      ok: false;
      today: string;
      skip: "daily_budget_exhausted";
      holder: ThreadsRootStream | "";
    };

/**
 * Reserve today's root slot before publishing.
 * If already claimed for this Lisbon day, refuse (even if prior claim failed mid-flight).
 */
export function tryClaimThreadsRootSlot(params: {
  stream: ThreadsRootStream;
  today?: string;
  note?: string;
  path?: string;
}): ThreadsDayClaimResult {
  const today = params.today || todayLisbon();
  const path = params.path || THREADS_DAY_BUDGET_PATH;
  const state = loadThreadsDayBudget(path);

  if (state.last_on === today) {
    return {
      ok: false,
      today,
      skip: "daily_budget_exhausted",
      holder: state.stream,
    };
  }

  saveThreadsDayBudget(
    {
      last_on: today,
      stream: params.stream,
      claimed_at: new Date().toISOString(),
      confirmed: false,
      note: params.note,
    },
    path
  );
  return { ok: true, today };
}

/** Mark claim as live after Graph publish succeeds. */
export function confirmThreadsRootSlot(params?: {
  today?: string;
  path?: string;
}): void {
  const today = params?.today || todayLisbon();
  const path = params?.path || THREADS_DAY_BUDGET_PATH;
  const state = loadThreadsDayBudget(path);
  if (state.last_on !== today) return;
  state.confirmed = true;
  saveThreadsDayBudget(state, path);
}

/**
 * Free today's slot if publish failed after claim (allows same-day retry).
 * No-op if another stream already owns a confirmed post.
 */
export function releaseThreadsRootSlot(params: {
  stream: ThreadsRootStream;
  today?: string;
  path?: string;
}): void {
  const today = params.today || todayLisbon();
  const path = params.path || THREADS_DAY_BUDGET_PATH;
  const state = loadThreadsDayBudget(path);
  if (state.last_on !== today) return;
  if (state.stream !== params.stream) return;
  if (state.confirmed) return;
  saveThreadsDayBudget(emptyState(), path);
}

/**
 * Stream 2 — Portugal satellites / Porto chat on top of the daily guide.
 * Own state + gap; does not replace the main guide pipeline.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { SATELLITE_GAP_DAYS } from "@/lib/threads/calendar";
import { publishThreadsChain } from "@/lib/threads/client";
import { loadThreadsEnv } from "@/lib/threads/config";
import {
  pickPortugalSatellitePlan,
  type ThreadsInventoryState,
  type ThreadsSlotPlan,
} from "@/lib/threads/inventory";

export const THREADS_SATELLITE_STATE_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-threads-satellites.json"
);

export type ThreadsSatelliteState = ThreadsInventoryState & {
  last_posted_on: string;
  next_on: string;
  next_gap: number;
  posts: Record<string, { kind: "city"; ids: string[]; at: string }>;
};

function todayLisbon(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function emptyState(): ThreadsSatelliteState {
  return {
    last_posted_on: "",
    next_on: "",
    next_gap: SATELLITE_GAP_DAYS,
    news_used: [],
    guides_used: [],
    notes_used: [],
    last_guide_countries: [],
    wizard_cursor: 0,
    assist_cursor: 0,
    chat_cursor: 0,
    city_cursor: 0,
    posts: {},
  };
}

export function loadThreadsSatelliteState(
  path = THREADS_SATELLITE_STATE_PATH
): ThreadsSatelliteState {
  if (!existsSync(path)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ThreadsSatelliteState>;
    return {
      ...emptyState(),
      ...raw,
      news_used: Array.isArray(raw.news_used) ? raw.news_used.map(String) : [],
      guides_used: Array.isArray(raw.guides_used) ? raw.guides_used.map(String) : [],
      notes_used: Array.isArray(raw.notes_used) ? raw.notes_used.map(String) : [],
      last_guide_countries: Array.isArray(raw.last_guide_countries)
        ? raw.last_guide_countries.map(String)
        : [],
      wizard_cursor: Number(raw.wizard_cursor || 0) || 0,
      assist_cursor: Number(raw.assist_cursor || 0) || 0,
      chat_cursor: Number(raw.chat_cursor || 0) || 0,
      city_cursor: Number(raw.city_cursor || 0) || 0,
      next_gap: Number(raw.next_gap || SATELLITE_GAP_DAYS) || SATELLITE_GAP_DAYS,
      posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
    };
  } catch {
    return emptyState();
  }
}

export function saveThreadsSatelliteState(
  state: ThreadsSatelliteState,
  path = THREADS_SATELLITE_STATE_PATH
): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
}

export function satelliteDue(state: ThreadsSatelliteState, today = todayLisbon()): boolean {
  if (!state.next_on) return true;
  return today >= state.next_on;
}

export function scheduleNextSatellite(
  state: ThreadsSatelliteState,
  today: string,
  gap = SATELLITE_GAP_DAYS
): void {
  state.next_gap = gap;
  state.next_on = addDays(today, gap);
}

/**
 * Prefer Portugal notes + Porto chat. Spain only if no PT note left this cycle
 * (pickCityPlan already rotates; we force portugal-first via city_cursor even turns).
 */
export async function planThreadsSatellitePost(opts?: {
  today?: string;
}): Promise<{ skip?: string; today: string; plan?: ThreadsSlotPlan }> {
  const today = opts?.today || todayLisbon();
  const state = loadThreadsSatelliteState();

  if (state.last_posted_on === today) {
    return { today, skip: "already_posted_today" };
  }
  if (!satelliteDue(state, today)) {
    return { today, skip: "not_due", plan: undefined };
  }

  const plan = await pickPortugalSatellitePlan(state);
  if (!plan) return { today, skip: "queue_empty" };
  return { today, plan };
}

export async function runThreadsSatellites(opts?: {
  dryRun?: boolean;
  forcePublish?: boolean;
}): Promise<{ skip?: string; published?: Array<{ kind: "city"; slug: string; ids: string[] }> }> {
  const dryRun = opts?.dryRun !== false && !opts?.forcePublish;
  const planned = await planThreadsSatellitePost();
  if (planned.skip || !planned.plan) {
    console.log("[threads-satellites]", planned.skip || "no plan");
    return { skip: planned.skip };
  }

  const job = planned.plan;
  console.log(`\n=== satellite ${job.slug} (${job.countryRu} → ${job.cta}) ===\n${job.preview}\n`);

  if (dryRun) {
    const env = loadThreadsEnv();
    console.log(
      `[threads-satellites] dry-run autoPublish=${env.autoPublish ? "1" : "0"} — pass --force-publish to go live`
    );
    return {};
  }

  const result = await publishThreadsChain({ items: job.items, forcePublish: true });
  const state = loadThreadsSatelliteState();
  if (!state.notes_used.includes(job.slug) && !job.slug.startsWith("chat-")) {
    state.notes_used.push(job.slug);
  }
  if (job.slug.startsWith("chat-")) {
    state.chat_cursor = job.cursor ?? state.chat_cursor + 1;
  }
  state.city_cursor = job.cursor ?? (state.city_cursor || 0) + 1;
  state.last_posted_on = planned.today;
  scheduleNextSatellite(state, planned.today);
  state.posts[job.slug] = { kind: "city", ids: result.publishedIds, at: planned.today };
  saveThreadsSatelliteState(state);

  return {
    published: [{ kind: "city", slug: job.slug, ids: result.publishedIds }],
  };
}

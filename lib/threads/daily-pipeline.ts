/**
 * Stream 1 — main Threads feed: one SEO guide / Lisbon day.
 * Stream 2 (satellites) and stream 3 (news via Telegram ✅) are separate.
 * Published in the Barakhlo morning window (Asia/Dubai peaks).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { guideCtaForDate, threadsMainSlotForDate, type ThreadsSlot } from "@/lib/threads/calendar";
import { publishThreadsChain } from "@/lib/threads/client";
import { loadThreadsEnv, THREADS_CAMPAIGN } from "@/lib/threads/config";
import {
  countryKeyFromGuide,
  pickAssistBankPlan,
  pickCityPlan,
  pickDaysBankPlan,
  pickLiveGuidePlan,
  pickWizardPlan,
  type ThreadsInventoryState,
  type ThreadsSlotPlan,
} from "@/lib/threads/inventory";
import { listGuides } from "@/lib/guides/load";

export { THREADS_CAMPAIGN };

export const THREADS_STATE_PATH = resolve(process.cwd(), "parser/out/emigro-threads-posted.json");

export type ThreadsDailyKind = ThreadsSlot;

export type ThreadsDailyState = ThreadsInventoryState & {
  last_day: number;
  last_posted_on: string;
  next_guide_on: string;
  next_guide_gap: number;
  posts: Record<string, { kind: ThreadsDailyKind; ids: string[]; at: string }>;
};

export type ThreadsDailyPlan = ThreadsSlotPlan;

function todayLisbon(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

function emptyState(): ThreadsDailyState {
  return {
    last_day: 0,
    last_posted_on: "",
    next_guide_on: "",
    next_guide_gap: 0,
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

export function loadThreadsDailyState(path = THREADS_STATE_PATH): ThreadsDailyState {
  if (!existsSync(path)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as Partial<ThreadsDailyState>;
    return {
      ...emptyState(),
      ...raw,
      last_day: Number(raw.last_day || 0) || 0,
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
      posts: raw.posts && typeof raw.posts === "object" ? raw.posts : {},
    };
  } catch {
    return emptyState();
  }
}

export function saveThreadsDailyState(state: ThreadsDailyState, path = THREADS_STATE_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
}

export function normalizeThreadsKind(kind?: string | null): ThreadsDailyKind | "day" | undefined {
  if (!kind) return undefined;
  if (kind === "day") return "day";
  if (kind === "guide" || kind === "wizard" || kind === "city" || kind === "assist" || kind === "news") {
    return kind;
  }
  return undefined;
}

async function planForSlot(
  slot: ThreadsSlot,
  state: ThreadsDailyState,
  today: string
): Promise<ThreadsDailyPlan | null> {
  // Manual --kind= still works for banks; cron always uses guide.
  if (slot === "wizard") return pickWizardPlan(state);
  if (slot === "assist") return pickAssistBankPlan(state);
  if (slot === "city") return pickCityPlan(state);
  if (slot === "news") {
    // News is stream 3 (Telegram ✅ lightning) — never auto from daily cron.
    return pickLiveGuidePlan(state, false);
  }
  return pickLiveGuidePlan(state, guideCtaForDate(today) === "assist");
}

export async function planThreadsDailyPost(opts?: {
  today?: string;
  forceKind?: ThreadsDailyKind | "day";
}): Promise<{ skip?: string; today: string; plan?: ThreadsDailyPlan; slot?: ThreadsSlot | "day" }> {
  const today = opts?.today || todayLisbon();
  const state = loadThreadsDailyState();
  const forceKind = opts?.forceKind;

  if (state.last_posted_on === today && !forceKind) {
    return { today, skip: "already_posted_today" };
  }

  if (forceKind === "day") {
    const plan = pickDaysBankPlan(state);
    if (!plan) return { today, skip: "queue_empty", slot: "day" };
    return { today, plan, slot: "day" };
  }

  const slot = forceKind || threadsMainSlotForDate(today);
  const plan = await planForSlot(slot, state, today);
  if (!plan) return { today, skip: "queue_empty", slot };
  return { today, plan, slot };
}

function rememberPlan(state: ThreadsDailyState, job: ThreadsDailyPlan, today: string): void {
  if (job.slug.startsWith("day-")) {
    state.last_day = job.cursor ?? (Number(job.slug.slice(4)) || state.last_day);
    if (job.kind === "assist") state.assist_cursor = (state.assist_cursor || 0) + 1;
    if (job.kind === "city") state.chat_cursor = (state.chat_cursor || 0) + 1;
    state.posts[job.slug] = { kind: job.kind, ids: [], at: today };
    return;
  }
  if (job.kind === "guide") {
    const inventory = listGuides().filter((g) => g.slug && !g.slug.startsWith("_"));
    if (state.guides_used.length >= inventory.length) state.guides_used = [];
    if (!state.guides_used.includes(job.slug)) state.guides_used.push(job.slug);
    const guide = inventory.find((g) => g.slug === job.slug);
    const country = guide ? countryKeyFromGuide(guide) : "europe";
    state.last_guide_countries = [...state.last_guide_countries, country].slice(-8);
  } else if (job.kind === "news") {
    if (!state.news_used.includes(job.slug)) state.news_used.push(job.slug);
  } else if (job.kind === "city" && !job.slug.startsWith("chat-")) {
    if (!state.notes_used.includes(job.slug)) state.notes_used.push(job.slug);
    state.city_cursor = job.cursor ?? state.city_cursor + 1;
  } else if (job.kind === "city") {
    state.chat_cursor = job.cursor ?? state.chat_cursor + 1;
    state.city_cursor = (state.city_cursor || 0) + 1;
  } else if (job.kind === "wizard") {
    state.wizard_cursor = job.cursor ?? state.wizard_cursor + 1;
  } else if (job.kind === "assist") {
    state.assist_cursor = job.cursor ?? state.assist_cursor + 1;
  }
  state.posts[job.slug] = { kind: job.kind, ids: [], at: today };
}

export async function runThreadsDaily(opts?: {
  dryRun?: boolean;
  forcePublish?: boolean;
  forceKind?: ThreadsDailyKind | "day";
}): Promise<{ skip?: string; published?: Array<{ kind: ThreadsDailyKind; slug: string; ids: string[] }> }> {
  const dryRun = opts?.dryRun !== false && !opts?.forcePublish;
  const planned = await planThreadsDailyPost({ forceKind: opts?.forceKind });
  if (planned.skip || !planned.plan) {
    console.log("[threads-daily]", planned.skip || "no plan", planned.slot || "");
    return { skip: planned.skip };
  }

  const job = planned.plan;
  const via =
    planned.slot && planned.slot !== job.kind ? ` fallback from ${planned.slot}` : "";
  console.log(`\n=== ${job.kind} ${job.slug} (${job.countryRu} → ${job.cta}${via}) ===\n${job.preview}\n`);

  if (dryRun) {
    const env = loadThreadsEnv();
    console.log(
      `[threads-daily] dry-run autoPublish=${env.autoPublish ? "1" : "0"} — pass --force-publish to go live`
    );
    return {};
  }

  const result = await publishThreadsChain({ items: job.items, forcePublish: true });
  const state = loadThreadsDailyState();
  rememberPlan(state, job, planned.today);
  state.posts[job.slug] = { kind: job.kind, ids: result.publishedIds, at: planned.today };
  state.last_posted_on = planned.today;
  saveThreadsDailyState(state);
  return { published: [{ kind: job.kind, slug: job.slug, ids: result.publishedIds }] };
}

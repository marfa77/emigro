import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import rawBank from "@/lib/threads/banks/emigro-investment-days.json";
import {
  clipThreadsText,
  threadsTextCost,
  type ThreadsChainItem,
} from "@/lib/threads/compose";

export type InvestmentPhase = "seed" | "traffic" | "lead";
export type InvestmentPublicationMode = "auto" | "manual_review";

export type InvestmentCalendarRow = {
  id: string;
  publishOn: string;
  phase: InvestmentPhase;
  publicationMode: InvestmentPublicationMode;
  topicTag: string;
  p1: string;
  p2?: string;
  dest?: string;
  reviewedAt: string;
  sourceUrls: string[];
};

export type InvestmentPostState = {
  posts: Record<string, { ids: string[]; at: string }>;
};

export const THREADS_INVESTMENT_STATE_PATH = resolve(
  process.cwd(),
  "parser/out/emigro-investment-threads-posted.json"
);

const PHASE_RANK: Record<InvestmentPhase, number> = {
  seed: 1,
  traffic: 2,
  lead: 3,
};

function isoWeekKey(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00Z`);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

export function loadInvestmentCalendar(): InvestmentCalendarRow[] {
  return structuredClone(rawBank) as InvestmentCalendarRow[];
}

export function assertInvestmentCalendar(
  rows = loadInvestmentCalendar()
): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  const dates = new Set<string>();
  const linksByWeek = new Map<string, number>();

  rows.forEach((row, index) => {
    if (!row.id || ids.has(row.id)) errors.push(`row ${index}: duplicate or missing id`);
    ids.add(row.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.publishOn) || dates.has(row.publishOn)) {
      errors.push(`${row.id}: duplicate or invalid publishOn`);
    }
    dates.add(row.publishOn);
    if (index > 0 && rows[index - 1]!.publishOn >= row.publishOn) {
      errors.push(`${row.id}: dates must be strictly increasing`);
    }
    if (!row.reviewedAt || row.sourceUrls.length === 0) {
      errors.push(`${row.id}: reviewedAt and sourceUrls required`);
    }
    if (row.sourceUrls.some((url: string) => !/^https:\/\//.test(url))) {
      errors.push(`${row.id}: source URLs must use https`);
    }
    if (threadsTextCost(row.p1) > 420) errors.push(`${row.id}: p1 over 420`);
    if (row.p2 && threadsTextCost(row.p2) > 420) errors.push(`${row.id}: p2 over 420`);
    if (/https?:\/\//i.test(row.p1) || (row.p2 && /https?:\/\//i.test(row.p2))) {
      errors.push(`${row.id}: URL allowed only in generated final CTA`);
    }
    if (/гарантируем|гарантированн|паспорт за квартир|виза за квартир|автоматически получ/i.test(`${row.p1} ${row.p2 || ""}`)) {
      errors.push(`${row.id}: prohibited guarantee language`);
    }
    if (row.phase === "seed" && (row.p2 || row.dest)) {
      errors.push(`${row.id}: seed rows must be root-only and link-free`);
    }
    if (row.dest) {
      const week = isoWeekKey(row.publishOn);
      linksByWeek.set(week, (linksByWeek.get(week) || 0) + 1);
    }
  });

  const seed = rows.filter((row) => row.phase === "seed");
  if (seed.length !== 3) errors.push("seed phase must contain exactly three roots");
  Array.from(linksByWeek.entries()).forEach(([week, count]) => {
    if (count > 2) errors.push(`${week}: more than two linked posts`);
  });

  if (errors.length > 0) {
    throw new Error(`Investment calendar invalid:\n- ${errors.join("\n- ")}`);
  }
}

export function todayDubai(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });
}

export function configuredInvestmentPhase(
  value = process.env.THREADS_INVESTMENT_PHASE
): InvestmentPhase | "off" {
  const normalized = (value || "off").trim().toLowerCase();
  if (normalized === "off" || normalized === "seed" || normalized === "traffic" || normalized === "lead") {
    return normalized;
  }
  throw new Error("THREADS_INVESTMENT_PHASE must be off|seed|traffic|lead");
}

export function loadInvestmentPostState(
  path = THREADS_INVESTMENT_STATE_PATH
): InvestmentPostState {
  if (!existsSync(path)) return { posts: {} };
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<InvestmentPostState>;
    return {
      posts: parsed.posts && typeof parsed.posts === "object" ? parsed.posts : {},
    };
  } catch {
    return { posts: {} };
  }
}

export function saveInvestmentPostState(
  state: InvestmentPostState,
  path = THREADS_INVESTMENT_STATE_PATH
): void {
  mkdirSync(dirname(path), { recursive: true });
  const temp = `${path}.tmp`;
  writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  renameSync(temp, path);
}

export function planInvestmentPost(params?: {
  today?: string;
  phase?: InvestmentPhase | "off";
  state?: InvestmentPostState;
  id?: string;
}): { row?: InvestmentCalendarRow; skip?: string } {
  const rows = loadInvestmentCalendar();
  assertInvestmentCalendar(rows);
  const phase = params?.phase ?? configuredInvestmentPhase();
  if (phase === "off") return { skip: "phase_off" };

  const state = params?.state ?? loadInvestmentPostState();
  const row = params?.id
    ? rows.find((candidate) => candidate.id === params.id)
    : rows.find((candidate) => candidate.publishOn === (params?.today || todayDubai()));

  if (!row) return { skip: params?.id ? "unknown_id" : "not_scheduled_today" };
  if (state.posts[row.id]) return { skip: "already_published" };
  if (PHASE_RANK[row.phase] > PHASE_RANK[phase]) return { skip: `phase_${row.phase}_locked` };
  if (row.publicationMode !== "auto") return { skip: "manual_review_required" };
  return { row };
}

export function investmentDestinationUrl(
  row: InvestmentCalendarRow,
  siteBase = process.env.EMIGRO_PUBLIC_SITE_URL || "https://www.emigro.online"
): string | undefined {
  if (!row.dest) return undefined;
  const url = new URL(row.dest, `${siteBase.replace(/\/$/, "")}/`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", "emigro_threads_investment");
  url.searchParams.set("utm_content", row.id);
  return url.toString();
}

export function composeInvestmentCalendarPost(
  row: InvestmentCalendarRow
): ThreadsChainItem[] {
  const items: ThreadsChainItem[] = [
    {
      text: clipThreadsText(row.p1),
      role: "root",
      topicTag: row.topicTag,
    },
  ];
  if (row.p2) items.push({ text: clipThreadsText(row.p2), role: "slide" });
  const destination = investmentDestinationUrl(row);
  if (destination) {
    items.push({
      text: clipThreadsText(
        row.dest?.includes("#qualifier")
          ? `Сопоставить бюджет, актив, паспорт, семью и цель:\n${destination}`
          : `Разбор маршрута, ограничения и официальный источник:\n${destination}`
      ),
      role: "cta",
    });
  }
  return items;
}

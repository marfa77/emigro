/**
 * Prewritten Threads banks (Barakhlo calendar style).
 * Copy has no URLs — compose appends Assist or Porto-chat bot deep link.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { publicSiteUrl } from "@/lib/site-url";
import { guidePath } from "@/lib/guides/paths";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";
import {
  THREADS_TEXT_MAX_CHARS,
  clipThreadsText,
  formatThreadsChainPreview,
  sanitizeThreadsTopicTag,
  threadsTextCost,
  type ThreadsChainItem,
} from "@/lib/threads/compose";
import { THREADS_CAMPAIGN } from "@/lib/threads/config";

export type ThreadsBankCta = "porto_chat" | "assist" | "wizard";
export type ThreadsBankPillar = "porto_chat" | "assist" | "mix" | "wizard";

export type ThreadsDayRow = {
  d: number;
  pillar: ThreadsBankPillar;
  cta: ThreadsBankCta;
  p1: string;
  p2: string;
};

export type ThreadsGuideRow = {
  id: number;
  guide: string;
  cta: ThreadsBankCta;
  p1: string;
  p2: string;
};

export type ThreadsWizardRow = {
  d: number;
  p1: string;
  p2: string;
};

const DAYS_PATH = resolve(process.cwd(), "lib/threads/banks/emigro-days.json");
const GUIDES_PATH = resolve(process.cwd(), "lib/threads/banks/emigro-guides.json");
const WIZARD_PATH = resolve(process.cwd(), "lib/threads/banks/emigro-wizard.json");

const BANNED_IN_COPY =
  /https?:\/\/|t\.me\/|telegram\.me\/|emigro\.online|гарантированн|андрей/i;

let daysCache: ThreadsDayRow[] | null = null;
let guidesCache: ThreadsGuideRow[] | null = null;
let wizardCache: ThreadsWizardRow[] | null = null;

function parseArray<T>(path: string, key: "d" | "id"): T[] {
  const payload = JSON.parse(readFileSync(path, "utf8")) as T[] | { days?: T[]; guides?: T[] };
  const rows = Array.isArray(payload)
    ? payload
    : key === "d"
      ? (payload.days ?? [])
      : (payload.guides ?? []);
  return rows;
}

export function loadThreadsDays(): ThreadsDayRow[] {
  if (daysCache) return daysCache;
  daysCache = parseArray<ThreadsDayRow>(DAYS_PATH, "d").sort((a, b) => a.d - b.d);
  return daysCache;
}

export function loadThreadsGuides(): ThreadsGuideRow[] {
  if (guidesCache) return guidesCache;
  guidesCache = parseArray<ThreadsGuideRow>(GUIDES_PATH, "id").sort((a, b) => a.id - b.id);
  return guidesCache;
}

export function loadThreadsWizard(): ThreadsWizardRow[] {
  if (wizardCache) return wizardCache;
  wizardCache = parseArray<ThreadsWizardRow>(WIZARD_PATH, "d").sort((a, b) => a.d - b.d);
  return wizardCache;
}

export function threadsDaysForCta(cta: ThreadsBankCta): ThreadsDayRow[] {
  return loadThreadsDays().filter((row) => row.cta === cta);
}

export function nextCycledRow<T>(rows: T[], cursor: number): { row: T; nextCursor: number } | null {
  if (rows.length === 0) return null;
  const idx = ((cursor % rows.length) + rows.length) % rows.length;
  return { row: rows[idx]!, nextCursor: idx + 1 };
}

export function threadsDayRow(day: number): ThreadsDayRow {
  const row = loadThreadsDays().find((item) => item.d === day);
  if (!row) throw new Error(`Threads bank: no calendar day ${day}`);
  return row;
}

export function threadsGuideRow(id: number): ThreadsGuideRow {
  const row = loadThreadsGuides().find((item) => item.id === id);
  if (!row) throw new Error(`Threads bank: no guide id ${id}`);
  return row;
}

export function threadsAssistUrl(content: string): string {
  const url = new URL(`${publicSiteUrl()}/ru/assist`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", THREADS_CAMPAIGN);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function threadsGuidePageUrl(slug: string, content: string): string {
  const url = new URL(`${publicSiteUrl()}${guidePath(slug)}`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", THREADS_CAMPAIGN);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function threadsWizardUrl(content: string, countryTopic?: string): string {
  const country = (countryTopic || "").trim().toLowerCase();
  const path =
    country && country !== "europe" && /^[a-z]{2,20}$/.test(country)
      ? `/ru/${country}/wizard`
      : "/ru/wizard";
  const url = new URL(`${publicSiteUrl()}${path}`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", THREADS_CAMPAIGN);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function threadsCtaUrl(cta: ThreadsBankCta, content: string, countryTopic?: string): string {
  if (cta === "porto_chat") {
    const source = content.replace(/[^a-z0-9_]/gi, "").slice(0, 24).toLowerCase() || "th";
    return portoChatDeepLink(source);
  }
  if (cta === "wizard") return threadsWizardUrl(content, countryTopic);
  return threadsAssistUrl(content);
}

export function composeBankP2(
  p2: string,
  cta: ThreadsBankCta,
  content: string,
  countryTopic?: string
): string {
  const text = `${p2.trim()}\n${threadsCtaUrl(cta, content, countryTopic)}`;
  if (threadsTextCost(text) <= THREADS_TEXT_MAX_CHARS) return text;
  return clipThreadsText(text, THREADS_TEXT_MAX_CHARS);
}

function topicFor(pillar: ThreadsBankPillar | string): string | undefined {
  if (pillar === "porto_chat") return sanitizeThreadsTopicTag("Порту");
  if (pillar === "mix") return sanitizeThreadsTopicTag("Португалия");
  if (pillar === "wizard") return sanitizeThreadsTopicTag("Визард");
  return sanitizeThreadsTopicTag("ВНЖ");
}

export function composeDayChain(row: ThreadsDayRow): ThreadsChainItem[] {
  const content = `d${String(row.d).padStart(3, "0")}`;
  const topicTag = topicFor(row.pillar);
  return [
    { text: row.p1.trim(), role: "root", ...(topicTag ? { topicTag } : {}) },
    { text: composeBankP2(row.p2, row.cta, content), role: "cta" },
  ];
}

export function composeGuideChain(row: ThreadsGuideRow): ThreadsChainItem[] {
  const content = `gde${String(row.id).padStart(3, "0")}`;
  const pillar: ThreadsBankPillar = row.cta === "porto_chat" ? "porto_chat" : "assist";
  const topicTag = topicFor(pillar);
  const withGuide = `${row.p2.trim()}\n${threadsGuidePageUrl(row.guide, content)}\n${threadsCtaUrl(row.cta, content)}`;
  const p2 =
    threadsTextCost(withGuide) <= THREADS_TEXT_MAX_CHARS
      ? withGuide
      : composeBankP2(row.p2, row.cta, content);
  return [
    { text: row.p1.trim(), role: "root", ...(topicTag ? { topicTag } : {}) },
    { text: p2, role: "cta" },
  ];
}

export function previewDay(row: ThreadsDayRow): string {
  return formatThreadsChainPreview(composeDayChain(row));
}

export function previewGuide(row: ThreadsGuideRow): string {
  return formatThreadsChainPreview(composeGuideChain(row));
}

export function composeConversionChain(opts: {
  p1: string;
  p2: string;
  cta: ThreadsBankCta;
  content: string;
  topic?: string;
  countryTopic?: string;
  extraUrl?: string;
}): ThreadsChainItem[] {
  const topicTag = sanitizeThreadsTopicTag(opts.topic);
  const parts = [opts.p2.trim()];
  if (opts.extraUrl) parts.push(opts.extraUrl);
  parts.push(threadsCtaUrl(opts.cta, opts.content, opts.countryTopic));
  const joined = parts.join("\n");
  const p2 =
    threadsTextCost(joined) <= THREADS_TEXT_MAX_CHARS
      ? joined
      : composeBankP2(opts.p2, opts.cta, opts.content, opts.countryTopic);
  return [
    { text: clipThreadsText(opts.p1.trim(), 420), role: "root", ...(topicTag ? { topicTag } : {}) },
    { text: p2, role: "cta" },
  ];
}

export function composeWizardChain(row: ThreadsWizardRow): ThreadsChainItem[] {
  const content = `wiz${String(row.d).padStart(3, "0")}`;
  const topicTag = topicFor("wizard");
  return [
    { text: row.p1.trim(), role: "root", ...(topicTag ? { topicTag } : {}) },
    { text: composeBankP2(row.p2, "wizard", content), role: "cta" },
  ];
}

export function previewWizard(row: ThreadsWizardRow): string {
  return formatThreadsChainPreview(composeWizardChain(row));
}

function assertCopy(label: string, text: string): string[] {
  const errors: string[] = [];
  const t = text.trim();
  if (!t) errors.push(`${label}: empty`);
  if (BANNED_IN_COPY.test(t)) errors.push(`${label}: banned fragment (url / invite / guaranteed VNJ)`);
  if (threadsTextCost(t) > 420) errors.push(`${label}: p1/p2 over 420 before URL (${threadsTextCost(t)})`);
  return errors;
}

export function assertEmigroThreadsBanks(): string[] {
  const errors: string[] = [];
  const days = loadThreadsDays();
  const guides = loadThreadsGuides();
  const wizard = loadThreadsWizard();
  if (days.length !== 42) errors.push(`days: expected 42, got ${days.length}`);
  if (guides.length !== 21) errors.push(`guides: expected 21, got ${guides.length}`);
  if (wizard.length !== 12) errors.push(`wizard: expected 12, got ${wizard.length}`);

  const dayNums = new Set<number>();
  for (const row of days) {
    if (dayNums.has(row.d)) errors.push(`days: duplicate d=${row.d}`);
    dayNums.add(row.d);
    if (row.cta !== "porto_chat" && row.cta !== "assist") {
      errors.push(`day ${row.d}: bad cta`);
    }
    if (row.pillar !== "porto_chat" && row.pillar !== "assist" && row.pillar !== "mix") {
      errors.push(`day ${row.d}: bad pillar`);
    }
    errors.push(...assertCopy(`day ${row.d} p1`, row.p1));
    errors.push(...assertCopy(`day ${row.d} p2`, row.p2));
    const composed = composeBankP2(row.p2, row.cta, `d${String(row.d).padStart(3, "0")}`);
    if (threadsTextCost(composed) > THREADS_TEXT_MAX_CHARS) {
      errors.push(`day ${row.d}: composed p2 over ${THREADS_TEXT_MAX_CHARS}`);
    }
    if (!composed.includes("http")) errors.push(`day ${row.d}: composed p2 missing URL`);
    if (row.cta === "porto_chat" && !/emigro_chat_bot/.test(composed)) {
      errors.push(`day ${row.d}: porto_chat CTA missing bot link`);
    }
    if (row.cta === "assist" && !/\/ru\/assist/.test(composed)) {
      errors.push(`day ${row.d}: assist CTA missing /ru/assist`);
    }
    if (/t\.me\/\+|joinchat/i.test(composed)) {
      errors.push(`day ${row.d}: invite hash leaked`);
    }
  }
  for (let d = 1; d <= 42; d++) {
    if (!dayNums.has(d)) errors.push(`days: missing d=${d}`);
  }

  const ids = new Set<number>();
  const slugs = new Set<string>();
  for (const row of guides) {
    if (ids.has(row.id)) errors.push(`guides: duplicate id=${row.id}`);
    ids.add(row.id);
    if (slugs.has(row.guide)) errors.push(`guides: duplicate slug ${row.guide}`);
    slugs.add(row.guide);
    errors.push(...assertCopy(`guide ${row.id} p1`, row.p1));
    errors.push(...assertCopy(`guide ${row.id} p2`, row.p2));
    const composed = composeGuideChain(row)[1]?.text ?? "";
    if (threadsTextCost(composed) > THREADS_TEXT_MAX_CHARS) {
      errors.push(`guide ${row.id}: composed p2 over ${THREADS_TEXT_MAX_CHARS}`);
    }
    if (row.cta === "porto_chat" && !/emigro_chat_bot/.test(composed)) {
      errors.push(`guide ${row.id}: porto_chat CTA missing bot link`);
    }
    if (row.cta === "assist" && !/\/ru\/assist/.test(composed)) {
      errors.push(`guide ${row.id}: assist CTA missing /ru/assist`);
    }
  }

  const wizDays = new Set<number>();
  for (const row of wizard) {
    if (wizDays.has(row.d)) errors.push(`wizard: duplicate d=${row.d}`);
    wizDays.add(row.d);
    errors.push(...assertCopy(`wizard ${row.d} p1`, row.p1));
    errors.push(...assertCopy(`wizard ${row.d} p2`, row.p2));
    const composed = composeBankP2(row.p2, "wizard", `wiz${String(row.d).padStart(3, "0")}`);
    if (!/\/ru\/wizard/.test(composed)) errors.push(`wizard ${row.d}: missing /ru/wizard`);
    if (threadsTextCost(composed) > THREADS_TEXT_MAX_CHARS) {
      errors.push(`wizard ${row.d}: composed p2 over ${THREADS_TEXT_MAX_CHARS}`);
    }
  }
  return errors;
}

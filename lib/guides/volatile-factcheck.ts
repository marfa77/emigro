import fs from "fs";
import path from "path";
import { listGuides, loadGuide, type GuideFrontmatter } from "@/lib/guides/load";
import { listVolatileGuides } from "@/lib/guides/review-tiers";
import { createServerClient } from "@/lib/supabase/server";

export type VolatileFactcheckSeverity = "critical" | "warning" | "info";

export type VolatileFactcheckIssue = {
  slug: string;
  severity: VolatileFactcheckSeverity;
  issue: string;
  excerpt: string;
  suggestedAction: string;
  /** High-confidence contradictions / backlog patterns — eligible for Telegram notify. */
  notifyPriority?: boolean;
};

export type RunVolatileFactcheckOptions = {
  /** Only these slugs (must be volatile). Default: all volatile guides. */
  slugs?: string[];
  /** Include Supabase community_signals cross-check (default: off — noisy). */
  skipCommunitySignals?: boolean;
  /** Reference date for stale checks (default: now). */
  asOf?: Date;
  /** Days without date_modified refresh before flagging volatile guides. */
  staleDays?: number;
};

type KnownBadPattern = {
  id: string;
  severity: VolatileFactcheckSeverity;
  /** Empty = all volatile guides. */
  slugHints?: RegExp[];
  test: RegExp;
  /** If set, match is OK when this also matches nearby context. */
  unless?: RegExp;
  issue: string;
  suggestedAction: string;
};

/** Patterns derived from docs/FACTCHECK_BACKLOG.md — known historical errors. */
export const FACTCHECK_BACKLOG_PATTERNS: KnownBadPattern[] = [
  {
    id: "greece-dn-7pct-flat",
    severity: "critical",
    slugHints: [/gruziya|nomad|digital-nomad|evropy-sravnenie/i],
    test: /(?:номад|digital\s*nomad|удалённ\w*|dn\b)[\s\S]{0,120}?7\s*%|7\s*%[\s\S]{0,120}?(?:номад|digital\s*nomad|удалённ\w*)/i,
    unless: /пенсион|pension|не\s+для\s+номад|не\s+nomad|50\s*%\s*скид/i,
    issue: "Греция: flat 7% для digital nomads (7% — режим пенсионеров)",
    suggestedAction:
      "Заменить на 50% скидку на прогрессивный налог (7 лет); явно отделить от пенсионного 7%.",
  },
  {
    id: "france-naturalization-b1",
    severity: "critical",
    slugHints: [/frants|france|grazhdanstvo|kuda-pereehat/i],
    test: /(?:гражданств|naturali[sz]|натурализац)[\s\S]{0,160}?\bB1\b|\bB1\b[\s\S]{0,160}?(?:гражданств|naturali[sz]|натурализац|франц)/i,
    unless: /B2|examen\s+civique|CELI\s+B1|Goethe\s+B1|telc\s+B1|Inburgering|Blue\s+Card.*B1|§18c|StAG/i,
    issue: "Франция: для гражданства с 2026 нужен B2, не B1",
    suggestedAction:
      "Обновить до B2 (устный + письменный с 01.01.2026), добавить examen civique и fee €255 с 01.05.2026.",
  },
  {
    id: "ees-april-launch",
    severity: "critical",
    slugHints: [/ees|shengen/i],
    test: /(?:апрел\w*|april)\s*2026[\s\S]{0,80}?(?:старт|запуск|launch|начал\w*)|(?:старт|запуск|launch)[\s\S]{0,80}?(?:апрел\w*|april)\s*2026/i,
    unless: /10\s+апрел|10\s+apr|полн\w*\s+rollout|завершен|completion|12\s+окт|12\s+oct/i,
    issue: "EES: апрель 2026 описан как «старт», а не завершение rollout",
    suggestedAction:
      "Уточнить: фазовый старт 12.10.2025, полный rollout 10.04.2026; ETIAS — конец 2026.",
  },
  {
    id: "tinkoff-no-sanctions",
    severity: "critical",
    slugHints: [/bank|iban|tinkoff|t-bank/i],
    test: /(?:тинькофф|t-?bank)[\s\S]{0,120}?(?:не\s+под\s+прям|без\s+санкц|not\s+under\s+sanction|no\s+direct\s+sanction)|(?:не\s+под\s+прям|без\s+санкц)[\s\S]{0,120}?(?:тинькофф|t-?bank)/i,
    issue: "T-Bank/Tinkoff: ложное «не под санкциями»",
    suggestedAction:
      "Указать EU (Feb 2023), US (Jul 2023), UK (Dec 2023) sanctions; EU ops ceased, redomiciled RU 2024.",
  },
];

const GUIDES_DIR = path.join(process.cwd(), "content/guides/ru");

const SLUG_COUNTRY_KEY: Record<string, string> = {
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": "portugal",
  "portugaliya-vs-ispaniya-vnj-2026": "portugal",
  "grazhdanstvo-portugaliya-ispaniya-2026": "portugal",
  "digital-nomad-portugaliya-ispaniya-italiya-2026": "portugal",
  "vnj-ispaniya-2026": "spain",
  "vnj-frantsiya-2026-passeport-talent": "france",
  "pervye-30-dnej-v-portugalii-2026": "portugal",
  "pervye-30-dnej-v-ispanii-2026": "spain",
};

const COMMUNITY_SIGNAL_KEYWORDS: Record<string, string[]> = {
  portugal: ["aima", "d7", "d8", "ifici", "nif", "finanças", "financas"],
  spain: ["tie", "extranjer", "nomada", "digital nomad"],
  france: ["titre de séjour", "passeport talent", "prefecture"],
};

/** Generic chat questions — not editorial signals. */
const LOW_VALUE_COMMUNITY_PATTERNS: RegExp[] = [
  /portaldasfinancas.*(?:адрес|address)|(?:адрес|address).*portaldasfinancas/i,
  /кто\s+знает.*как/i,
  /как\s+(?:можно\s+)?(?:поменять|изменить|сменить)/i,
  /подскажите.*как/i,
];

const CONTRADICTION_ANCHORS: {
  label: string;
  pattern: RegExp;
  /** D7/D8 € thresholds — Portugal guides only. */
  ptThresholdOnly?: boolean;
}[] = [
  { label: "D7", pattern: /\bd7\b|пассивн/i, ptThresholdOnly: true },
  { label: "D8", pattern: /\bd8\b|digital\s*nomad|номад/i, ptThresholdOnly: true },
  { label: "AIMA", pattern: /\baima\b/i },
  { label: "воссоединение", pattern: /воссоединен|family\s+reun/i },
  { label: "гражданство FR", pattern: /гражданств[\s\S]{0,40}франц|франц[\s\S]{0,40}гражданств/i },
  { label: "EES", pattern: /\bees\b|entry.exit/i },
  { label: "Blue Card", pattern: /blue\s*card|синяя\s*карта/i },
];

type EuroMention = {
  value: number;
  unit: "month" | "year" | "insurance" | "other";
  lineIndex: number;
};

function inferCountryKey(slug: string, guide?: GuideFrontmatter): string | null {
  if (SLUG_COUNTRY_KEY[slug]) return SLUG_COUNTRY_KEY[slug];
  const hay = [
    slug,
    ...(guide?.topic_keys ?? []),
    ...(guide?.corridor_slugs ?? []),
    ...(guide?.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (/portugal|portugaliya|lisboa|aima|d7|d8/.test(hay)) return "portugal";
  if (/spain|ispania|tie|madrid|barcelona/.test(hay)) return "spain";
  if (/france|frants|paris|passeport/.test(hay)) return "france";
  if (/german|germaniya|blue.card|chancenkarte/.test(hay)) return "germany";
  if (/ital|italiya|elective/.test(hay)) return "italy";
  if (/polsh|poland|polska/.test(hay)) return "poland";
  if (/cheh|czech|praha/.test(hay)) return "czechia";
  if (/niderland|netherlands|holland/.test(hay)) return "netherlands";
  if (/avstri|austria|wien/.test(hay)) return "austria";
  if (/skandinav|sweden|norway|denmark/.test(hay)) return "sweden";
  return null;
}

function isPortugalThresholdContext(slug: string, guide?: GuideFrontmatter): boolean {
  if (/portugal|portugaliya|lisboa|aima|pervye-30-dnej-v-portugalii|vnj-portugaliya|d7-vs|portugaliya-vs/i.test(slug)) {
    return true;
  }
  if (guide?.topic_keys?.includes("portugal")) return true;
  if (guide?.corridor_slugs?.some((s) => /portugal/i.test(s))) return true;
  return false;
}

function isComparisonGuide(guide?: GuideFrontmatter): boolean {
  return guide?.primary_intent === "comparison";
}

function readGuideMarkdown(slug: string): { raw: string; body: string; quickAnswer: string } | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const bodyMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  const body = bodyMatch?.[1] ?? raw;
  const qaMatch = raw.match(/^quick_answer:\s*(.+)$/m);
  let quickAnswer = qaMatch?.[1]?.trim() ?? "";
  if (quickAnswer.startsWith('"') && quickAnswer.endsWith('"')) {
    quickAnswer = quickAnswer.slice(1, -1);
  }
  return { raw, body, quickAnswer };
}

/** Body + quick_answer only — excludes seo_title/seo_description YAML noise. */
function guideScanText(body: string, quickAnswer: string): string {
  return [body, quickAnswer].filter(Boolean).join("\n");
}

function excerpt(text: string, max = 180): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

function matchExcerpt(text: string, pattern: RegExp, max = 180): string {
  const match = pattern.exec(text);
  if (!match) return excerpt(text, max);
  const start = Math.max(0, match.index - 40);
  const end = Math.min(text.length, match.index + match[0].length + 80);
  return excerpt(text.slice(start, end), max);
}

function daysSince(isoDate: string, asOf: Date): number | null {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return null;
  return Math.floor((asOf.getTime() - parsed) / (1000 * 60 * 60 * 24));
}

function checkStaleGuide(guide: GuideFrontmatter, asOf: Date, staleDays: number): VolatileFactcheckIssue | null {
  if (!guide.date_modified) {
    return {
      slug: guide.slug,
      severity: "warning",
      issue: "Volatile guide без date_modified",
      excerpt: guide.title,
      suggestedAction: "Добавить date_modified после каждой проверки фактов.",
      notifyPriority: true,
    };
  }

  const age = daysSince(guide.date_modified, asOf);
  if (age == null) return null;
  if (age <= staleDays) return null;

  return {
    slug: guide.slug,
    severity: age > staleDays * 2 ? "critical" : "warning",
    issue: `date_modified устарел: ${guide.date_modified} (${age} дн., порог ${staleDays})`,
    excerpt: guide.title,
    suggestedAction: "Перепроверить пороги/ставки/дедлайны и обновить date_modified.",
    notifyPriority: true,
  };
}

function checkKnownBadPatterns(slug: string, text: string): VolatileFactcheckIssue[] {
  const issues: VolatileFactcheckIssue[] = [];

  for (const pattern of FACTCHECK_BACKLOG_PATTERNS) {
    if (pattern.slugHints?.length && !pattern.slugHints.some((re) => re.test(slug))) {
      continue;
    }
    if (!pattern.test.test(text)) continue;
    if (pattern.unless?.test(text)) continue;

    issues.push({
      slug,
      severity: pattern.severity,
      issue: pattern.issue,
      excerpt: matchExcerpt(text, pattern.test),
      suggestedAction: pattern.suggestedAction,
      notifyPriority: true,
    });
  }

  return issues;
}

function normalizeNumber(value: string): number {
  return Number(value.replace(/\s/g, "").replace(",", "."));
}

const PT_D7_D8_MONTHLY = new Set([920, 3680]);

function isKnownD7D8ThresholdPair(values: number[]): boolean {
  const unique = Array.from(new Set(values)).sort((a, b) => a - b);
  if (unique.length <= 2 && unique.every((v) => PT_D7_D8_MONTHLY.has(v))) return true;
  return false;
}

function splitNonTableLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("|"));
}

function detectEuroUnit(line: string, matchIndex: number): EuroMention["unit"] {
  const window = line.slice(matchIndex, matchIndex + 48).toLowerCase();
  if (/\/\s*мес|в\s*мес|per\s*month|\bpm\b|\/mo\b|месяц/i.test(window)) return "month";
  if (/\/\s*год|в\s*год|per\s*year|годов|annual/i.test(window)) return "year";
  if (/страх|insur|coverage|покрыт/i.test(line)) return "insurance";
  return "other";
}

function extractEuroMentions(line: string, lineIndex: number): EuroMention[] {
  const mentions: EuroMention[] = [];
  for (const match of Array.from(line.matchAll(/€\s*([\d\s.,]+)/g))) {
    const n = normalizeNumber(match[1]);
    if (!Number.isFinite(n) || n < 200) continue;
    mentions.push({
      value: n,
      unit: detectEuroUnit(line, match.index ?? 0),
      lineIndex,
    });
  }
  return mentions;
}

function euroContradictionHighConfidence(mentions: EuroMention[]): boolean {
  if (mentions.length < 2) return false;

  const byUnit = new Map<EuroMention["unit"], EuroMention[]>();
  for (const m of mentions) {
    const list = byUnit.get(m.unit) ?? [];
    list.push(m);
    byUnit.set(m.unit, list);
  }

  for (const group of Array.from(byUnit.values())) {
    if (group.length < 2) continue;
    const values = Array.from(new Set(group.map((m) => m.value))).sort((a, b) => a - b);
    if (values.length < 2) continue;

    const ratio = values[values.length - 1] / values[0];
    if (ratio < 3.0) continue;

    const lineIndices = group.map((m) => m.lineIndex);
    const minLine = Math.min(...lineIndices);
    const maxLine = Math.max(...lineIndices);
    if (maxLine - minLine <= 1 || ratio >= 3.0) return true;
  }

  return false;
}

function isStagedTimelineLine(line: string): boolean {
  const lower = line.toLowerCase();
  const hasEarly = /слот|запис|биометр|консульств|vfs|ожидани/i.test(lower);
  const hasLate = /карт|выдач|после\s+биометр/i.test(lower);
  return hasEarly && hasLate;
}

function isMixedPurposeEuroLine(line: string): boolean {
  return /golden\s*visa|\bari\b|фонд|сбереж|invest|investic|культур/i.test(line.toLowerCase());
}

function checkInternalContradictions(
  slug: string,
  text: string,
  guide?: GuideFrontmatter
): VolatileFactcheckIssue[] {
  const issues: VolatileFactcheckIssue[] = [];
  const lines = splitNonTableLines(text);
  const comparison = isComparisonGuide(guide);
  const ptContext = isPortugalThresholdContext(slug, guide);

  for (const anchor of CONTRADICTION_ANCHORS) {
    if (anchor.ptThresholdOnly && !ptContext) continue;

    const scopedEntries = lines
      .map((line, lineIndex) => ({ line, lineIndex }))
      .filter(({ line }) => anchor.pattern.test(line));
    if (scopedEntries.length < 2) continue;

    const monthIssues: VolatileFactcheckIssue[] = [];
    for (const { line } of scopedEntries) {
      const lineRanges = new Set<string>();
      for (const match of Array.from(line.matchAll(/(\d+)\s*[–-]\s*(\d+)\s*мес/gi))) {
        lineRanges.add(`${match[1]}-${match[2]}`);
      }
      if (lineRanges.size < 2 || isStagedTimelineLine(line)) continue;

      monthIssues.push({
        slug,
        severity: "warning",
        issue: `Противоречие по «${anchor.label}»: разные сроки (${Array.from(lineRanges).join(" vs ")} мес.)`,
        excerpt: excerpt(line),
        suggestedAction: "Сверить quick_answer и body; оставить одно актуальное значение с датой.",
        notifyPriority: true,
      });
    }

    if (monthIssues.length > 0) {
      issues.push(monthIssues[0]);
      continue;
    }

    if (comparison) continue;

    for (const { line, lineIndex } of scopedEntries) {
      if (isMixedPurposeEuroLine(line)) continue;

      const lineMentions = extractEuroMentions(line, lineIndex);
      const valuesByUnit = new Map<EuroMention["unit"], number[]>();
      for (const m of lineMentions) {
        const list = valuesByUnit.get(m.unit) ?? [];
        list.push(m.value);
        valuesByUnit.set(m.unit, list);
      }

      for (const [unit, values] of Array.from(valuesByUnit.entries())) {
        const unique = Array.from(new Set(values)).sort((a, b) => a - b);
        if (unique.length < 2) continue;

        if (anchor.ptThresholdOnly && isKnownD7D8ThresholdPair(unique)) continue;

        const unitMentions = lineMentions.filter((m) => m.unit === unit);
        if (!euroContradictionHighConfidence(unitMentions)) continue;

        const ratio = unique[unique.length - 1] / unique[0];
        const unitLabel = unit === "month" ? "/мес" : unit === "year" ? "/год" : unit === "insurance" ? "страх." : "";
        issues.push({
          slug,
          severity: "warning",
          issue: `Противоречие по «${anchor.label}»: разные суммы (€${unique.join(" vs €")}${unitLabel ? ` ${unitLabel}` : ""})`,
          excerpt: excerpt(line),
          suggestedAction: "Сверить пороги в prose (не таблица сравнения); уточнить актуальную цифру.",
          notifyPriority: ratio >= 3.0,
        });
      }
    }
  }

  return issues;
}

function extractMonthRangesNearAnchor(text: string, anchor: RegExp): string[] {
  const ranges = new Set<string>();
  for (const line of splitNonTableLines(text)) {
    if (!anchor.test(line)) continue;
    for (const match of Array.from(line.matchAll(/(\d+)\s*[–-]\s*(\d+)\s*мес/gi))) {
      ranges.add(`${match[1]}-${match[2]}`);
    }
  }
  return Array.from(ranges);
}

function checkQuickAnswerBodyDrift(slug: string, quickAnswer: string, body: string): VolatileFactcheckIssue[] {
  if (!quickAnswer.trim()) return [];

  const issues: VolatileFactcheckIssue[] = [];

  for (const anchor of CONTRADICTION_ANCHORS) {
    if (!anchor.pattern.test(quickAnswer) || !anchor.pattern.test(body)) continue;

    const qaRanges = extractMonthRangesNearAnchor(quickAnswer, anchor.pattern);
    const bodyRanges = extractMonthRangesNearAnchor(body, anchor.pattern);
    if (qaRanges.length === 0 || bodyRanges.length === 0) continue;

    const qaSet = new Set(qaRanges);
    const bodySet = new Set(bodyRanges);
    const overlap = qaRanges.some((r) => bodySet.has(r));
    if (overlap) continue;

    issues.push({
      slug,
      severity: "warning",
      issue: `quick_answer и body расходятся по «${anchor.label}» (мес.)`,
      excerpt: `QA: ${qaRanges.join(", ")} · body: ${bodyRanges.join(", ")}`,
      suggestedAction: "Унифицировать сроки в quick_answer и основном тексте для одного anchor.",
      notifyPriority: true,
    });
  }

  return issues;
}

function isLowValueCommunitySignal(text: string): boolean {
  return LOW_VALUE_COMMUNITY_PATTERNS.some((re) => re.test(text));
}

async function fetchCommunitySignalsByCountry(
  countryKey: string,
  keywords: string[]
): Promise<{ text: string; posted_at: string; channel_username: string }[]> {
  const sb = createServerClient();
  const since = new Date();
  since.setDate(since.getDate() - 45);
  const orParts = keywords.map((k) => `text.ilike.%${k.replace(/[%_]/g, "")}%`);

  const { data, error } = await sb
    .from("community_signals")
    .select("text, posted_at, channel_username")
    .eq("country_key", countryKey)
    .gte("posted_at", since.toISOString())
    .or(orParts.join(","))
    .order("posted_at", { ascending: false })
    .limit(20);

  if (error || !data?.length) return [];
  return data.map((row) => ({
    text: String(row.text),
    posted_at: String(row.posted_at),
    channel_username: String(row.channel_username),
  }));
}

async function checkCommunitySignalsGlobal(
  guides: GuideFrontmatter[]
): Promise<VolatileFactcheckIssue[]> {
  const hotKeywords = ["изменил", "новый порог", "с ", "with effect", "с 2026", "больше не", "отмен"];
  const seenSignalText = new Set<string>();
  const issues: VolatileFactcheckIssue[] = [];

  const countryKeys = new Set<string>();
  for (const guide of guides) {
    const key = inferCountryKey(guide.slug, guide);
    if (key) countryKeys.add(key);
  }

  for (const countryKey of Array.from(countryKeys)) {
    const keywords = COMMUNITY_SIGNAL_KEYWORDS[countryKey];
    if (!keywords?.length) continue;

    let rows: Awaited<ReturnType<typeof fetchCommunitySignalsByCountry>>;
    try {
      rows = await fetchCommunitySignalsByCountry(countryKey, keywords);
    } catch {
      continue;
    }

    const relevant = rows.filter((row) => {
      const lower = row.text.toLowerCase();
      if (isLowValueCommunitySignal(row.text)) return false;
      return hotKeywords.some((k) => lower.includes(k));
    });

    if (relevant.length === 0) continue;

    const signal = relevant[0];
    const normalizedSignal = signal.text.replace(/\s+/g, " ").trim().toLowerCase();
    if (seenSignalText.has(normalizedSignal)) continue;
    seenSignalText.add(normalizedSignal);

    const countryGuides = guides.filter((g) => inferCountryKey(g.slug, g) === countryKey);
    const anchorGuide = countryGuides[0];
    if (!anchorGuide) continue;

    const md = readGuideMarkdown(anchorGuide.slug);
    const scanText = md ? guideScanText(md.body, md.quickAnswer) : "";
    const guideDates: string[] = scanText.match(/20\d{2}/g) ?? [];
    const signalYear = signal.text.match(/20\d{2}/)?.[0];

    if (signalYear && guideDates.length > 0 && !guideDates.includes(signalYear)) {
      issues.push({
        slug: anchorGuide.slug,
        severity: "info",
        issue: `community_signals (${countryKey}): возможное свежее изменение`,
        excerpt: excerpt(signal.text),
        suggestedAction: `Проверить @${signal.channel_username.replace(/^@/, "")} и official_sources.`,
      });
      continue;
    }

    issues.push({
      slug: anchorGuide.slug,
      severity: "info",
      issue: `community_signals (${countryKey}): ${relevant.length} свежих сигналов по теме`,
      excerpt: excerpt(signal.text),
      suggestedAction: "Сверить с официальными источниками; при расхождении — обновить guide.",
    });
  }

  return issues;
}

function dedupeIssues(issues: VolatileFactcheckIssue[]): VolatileFactcheckIssue[] {
  const seen = new Set<string>();
  const out: VolatileFactcheckIssue[] = [];
  for (const issue of issues) {
    const key = `${issue.slug}::${issue.issue}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(issue);
  }
  return out;
}

const SEVERITY_RANK: Record<VolatileFactcheckSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export function sortVolatileFactcheckIssues(issues: VolatileFactcheckIssue[]): VolatileFactcheckIssue[] {
  return [...issues].sort((a, b) => {
    const sev = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (sev !== 0) return sev;
    return a.slug.localeCompare(b.slug, "ru");
  });
}

export async function runVolatileGuideFactcheck(
  options: RunVolatileFactcheckOptions = {}
): Promise<VolatileFactcheckIssue[]> {
  const asOf = options.asOf ?? new Date();
  const staleDays = options.staleDays ?? 90;
  const allVolatile = listVolatileGuides(listGuides());
  const slugFilter = options.slugs?.length ? new Set(options.slugs) : null;
  const guides = slugFilter ? allVolatile.filter((g) => slugFilter.has(g.slug)) : allVolatile;

  const issues: VolatileFactcheckIssue[] = [];

  for (const guide of guides) {
    const md = readGuideMarkdown(guide.slug);
    if (!md) continue;

    const scanText = guideScanText(md.body, md.quickAnswer);

    const stale = checkStaleGuide(guide, asOf, staleDays);
    if (stale) issues.push(stale);

    issues.push(...checkKnownBadPatterns(guide.slug, scanText));
    issues.push(...checkInternalContradictions(guide.slug, scanText, guide));
    issues.push(...checkQuickAnswerBodyDrift(guide.slug, md.quickAnswer, md.body));
  }

  if (!options.skipCommunitySignals) {
    issues.push(...(await checkCommunitySignalsGlobal(guides)));
  }

  return sortVolatileFactcheckIssues(dedupeIssues(issues));
}

/** Resolve guide title for notifications. */
export function volatileGuideTitle(slug: string): string {
  return loadGuide(slug)?.title ?? slug;
}

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
};

export type RunVolatileFactcheckOptions = {
  /** Only these slugs (must be volatile). Default: all volatile guides. */
  slugs?: string[];
  /** Skip Supabase community_signals cross-check. */
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
    });
  }

  return issues;
}

function normalizeNumber(value: string): number {
  return Number(value.replace(/\s/g, "").replace(",", "."));
}

const CONTRADICTION_ANCHORS: { label: string; pattern: RegExp }[] = [
  { label: "D7", pattern: /\bd7\b|пассивн/i },
  { label: "D8", pattern: /\bd8\b|digital\s*nomad|номад/i },
  { label: "AIMA", pattern: /\baima\b/i },
  { label: "воссоединение", pattern: /воссоединен|family\s+reun/i },
  { label: "гражданство FR", pattern: /гражданств[\s\S]{0,40}франц|франц[\s\S]{0,40}гражданств/i },
  { label: "EES", pattern: /\bees\b|entry.exit/i },
  { label: "Blue Card", pattern: /blue\s*card|синяя\s*карта/i },
];

function splitNonTableLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("|"));
}

function checkInternalContradictions(slug: string, text: string): VolatileFactcheckIssue[] {
  const issues: VolatileFactcheckIssue[] = [];
  const lines = splitNonTableLines(text);

  for (const anchor of CONTRADICTION_ANCHORS) {
    const scopedLines = lines.filter((line) => anchor.pattern.test(line));
    if (scopedLines.length < 2) continue;

    const monthRanges = new Set<string>();
    const euroValues = new Set<number>();

    for (const line of scopedLines) {
      for (const match of Array.from(line.matchAll(/(\d+)\s*[–-]\s*(\d+)\s*мес/gi))) {
        monthRanges.add(`${match[1]}-${match[2]}`);
      }
      for (const match of Array.from(line.matchAll(/€\s*([\d\s.,]+)/g))) {
        const n = normalizeNumber(match[1]);
        if (Number.isFinite(n) && n >= 200) euroValues.add(n);
      }
    }

    if (monthRanges.size >= 2) {
      issues.push({
        slug,
        severity: "warning",
        issue: `Противоречие по «${anchor.label}»: разные сроки (${Array.from(monthRanges).join(" vs ")} мес.)`,
        excerpt: excerpt(scopedLines.slice(0, 2).join(" · ")),
        suggestedAction: "Сверить quick_answer и body; оставить одно актуальное значение с датой.",
      });
      continue;
    }

    if (euroValues.size >= 2) {
      const sorted = Array.from(euroValues).sort((a, b) => a - b);
      const ratio = sorted[sorted.length - 1] / sorted[0];
      if (ratio >= 1.5) {
        issues.push({
          slug,
          severity: "warning",
          issue: `Противоречие по «${anchor.label}»: разные суммы (€${sorted.join(" vs €")})`,
          excerpt: excerpt(scopedLines.slice(0, 2).join(" · ")),
          suggestedAction: "Сверить пороги в prose (не таблица сравнения); уточнить актуальную цифру.",
        });
      }
    }
  }

  return issues;
}

function checkQuickAnswerBodyDrift(slug: string, quickAnswer: string, body: string): VolatileFactcheckIssue[] {
  if (!quickAnswer.trim()) return [];

  const issues: VolatileFactcheckIssue[] = [];
  const qaMonths = quickAnswer.match(/(\d+)\s*[–-]\s*(\d+)\s*мес/gi) ?? [];
  const bodyMonths = body.match(/(\d+)\s*[–-]\s*(\d+)\s*мес/gi) ?? [];

  for (const qa of qaMonths) {
    if (bodyMonths.length === 0) continue;
    const normalizedQa = qa.replace(/\s+/g, " ").toLowerCase();
    const hasMatch = bodyMonths.some((b) => b.replace(/\s+/g, " ").toLowerCase() === normalizedQa);
    if (!hasMatch && bodyMonths.length >= 1) {
      issues.push({
        slug,
        severity: "warning",
        issue: "quick_answer и body расходятся по срокам (мес.)",
        excerpt: `QA: ${qa} · body: ${bodyMonths.slice(0, 2).join(", ")}`,
        suggestedAction: "Унифицировать сроки в quick_answer и основном тексте.",
      });
      break;
    }
  }

  return issues;
}

async function checkCommunitySignals(
  slug: string,
  guide: GuideFrontmatter,
  text: string
): Promise<VolatileFactcheckIssue[]> {
  const countryKey = inferCountryKey(slug, guide);
  if (!countryKey) return [];

  const keywords = COMMUNITY_SIGNAL_KEYWORDS[countryKey];
  if (!keywords?.length) return [];

  try {
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
      .limit(8);

    if (error || !data?.length) return [];

    const hotKeywords = ["изменил", "новый порог", "с ", "with effect", "с 2026", "больше не", "отмен"];
    const relevant = data.filter((row) => {
      const lower = String(row.text).toLowerCase();
      return hotKeywords.some((k) => lower.includes(k));
    });

    if (relevant.length === 0) return [];

    const signal = relevant[0];
    const signalText = String(signal.text);
    const guideDates: string[] = text.match(/20\d{2}/g) ?? [];
    const signalYear = signalText.match(/20\d{2}/)?.[0];
    if (signalYear && guideDates.length > 0 && !guideDates.includes(signalYear)) {
      return [
        {
          slug,
          severity: "info",
          issue: `community_signals (${countryKey}): возможное свежее изменение`,
          excerpt: excerpt(signalText),
          suggestedAction: `Проверить @${String(signal.channel_username).replace(/^@/, "")} и official_sources.`,
        },
      ];
    }

    return [
      {
        slug,
        severity: "info",
        issue: `community_signals (${countryKey}): ${relevant.length} свежих сигналов по теме`,
        excerpt: excerpt(signalText),
        suggestedAction: "Сверить с официальными источниками; при расхождении — обновить guide.",
      },
    ];
  } catch {
    return [];
  }
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

    const text = [md.raw, md.body, md.quickAnswer].join("\n");

    const stale = checkStaleGuide(guide, asOf, staleDays);
    if (stale) issues.push(stale);

    issues.push(...checkKnownBadPatterns(guide.slug, text));
    issues.push(...checkInternalContradictions(guide.slug, text));
    issues.push(...checkQuickAnswerBodyDrift(guide.slug, md.quickAnswer, md.body));

    if (!options.skipCommunitySignals) {
      issues.push(...(await checkCommunitySignals(guide.slug, guide, text)));
    }
  }

  return sortVolatileFactcheckIssues(dedupeIssues(issues));
}

/** Resolve guide title for notifications. */
export function volatileGuideTitle(slug: string): string {
  return loadGuide(slug)?.title ?? slug;
}

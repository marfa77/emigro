/**
 * Spain guide fact-check: query community_signals for TG practice vs pillar guides.
 *
 *   npm run spain:guide-factcheck
 *   npm run spain:guide-factcheck -- --guide=vnj-ispaniya
 *   npm run spain:guide-factcheck -- --topic=tie --limit=20
 *   npm run spain:guide-factcheck -- --seed-only
 *   npm run spain:guide-factcheck -- --json
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  matchSignalTopic,
  resolveGuideFactcheckConfig,
  SEED_FACTCHECK_SIGNALS,
  SPAIN_GUIDE_FACTCHECK,
  suggestSectionForTopic,
  type GuideFactcheckConfig,
  type GuideFactcheckTopic,
} from "@/lib/guides/spain-telegram-citations";
import { filterRelocantSignals } from "@/lib/satellite/spain";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunitySignal } from "@/lib/community-notes/types";

type FactcheckRow = {
  guide: string;
  guideTitle: string;
  topic: string;
  suggestedSection: string;
  channel: string;
  postedAt: string;
  excerpt: string;
  source: "supabase" | "seed";
};

function parseArgs() {
  const args = process.argv.slice(2);
  let guide: string | undefined;
  let topic: string | undefined;
  let limit = 50;
  let seedOnly = false;
  let json = false;

  for (const arg of args) {
    if (arg.startsWith("--guide=")) guide = arg.slice(8);
    else if (arg.startsWith("--topic=")) topic = arg.slice(8);
    else if (arg.startsWith("--limit=")) limit = Number(arg.slice(8)) || 50;
    else if (arg === "--seed-only") seedOnly = true;
    else if (arg === "--json") json = true;
  }

  return { guide, topic, limit, seedOnly, json };
}

function excerpt(text: string, max = 220): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

function collectKeywords(configs: GuideFactcheckConfig[]): string[] {
  const keys = new Set<string>();
  for (const g of configs) {
    for (const t of g.topics) {
      for (const k of t.keywords) keys.add(k.toLowerCase());
    }
  }
  return Array.from(keys);
}

function mapDbRow(
  signal: CommunitySignal,
  configs: GuideFactcheckConfig[]
): FactcheckRow | null {
  for (const config of configs) {
    const topicMatch = matchSignalTopic(signal.text, config.topics);
    if (!topicMatch) continue;

    return {
      guide: config.slug,
      guideTitle: config.title,
      topic: topicMatch.label,
      suggestedSection: suggestSectionForTopic(topicMatch, topicMatch.id),
      channel: `@${signal.channel_username.replace(/^@/, "")}`,
      postedAt: signal.posted_at.slice(0, 10),
      excerpt: excerpt(signal.text),
      source: "supabase",
    };
  }
  return null;
}

function mapSeedRow(
  seed: (typeof SEED_FACTCHECK_SIGNALS)[number],
  configs: GuideFactcheckConfig[],
  topicFilter?: string
): FactcheckRow | null {
  const config = configs.find((c) => c.slug === seed.guide_slug);
  if (!config) return null;
  if (topicFilter && !seed.topic_id.includes(topicFilter) && !seed.topic_id.startsWith(topicFilter)) {
    const topic = config.topics.find((t) => t.id === seed.topic_id);
    if (!topic || !topic.id.includes(topicFilter)) return null;
  }

  const topic = config.topics.find((t) => t.id === seed.topic_id);
  return {
    guide: config.slug,
    guideTitle: config.title,
    topic: topic?.label ?? seed.topic_id,
    suggestedSection: seed.suggested_section,
    channel: `@${seed.channel_username}`,
    postedAt: seed.posted_at.slice(0, 10),
    excerpt: excerpt(seed.text),
    source: "seed",
  };
}

async function querySupabaseSignals(
  keywords: string[],
  limit: number
): Promise<CommunitySignal[]> {
  const sb = createServerClient();
  const orParts = keywords
    .slice(0, 16)
    .map((k) => `text.ilike.%${k.replace(/[%_]/g, "")}%`);

  const { data, error } = await sb
    .from("community_signals")
    .select("*")
    .eq("country_key", "spain")
    .or(orParts.join(","))
    .order("posted_at", { ascending: false })
    .limit(Math.min(limit * 3, 120));

  if (error) throw new Error(error.message);
  return filterRelocantSignals((data ?? []) as CommunitySignal[]);
}

function filterByTopic(rows: FactcheckRow[], topicFilter?: string): FactcheckRow[] {
  if (!topicFilter) return rows;
  const q = topicFilter.toLowerCase();
  return rows.filter(
    (r) =>
      r.topic.toLowerCase().includes(q) ||
      r.suggestedSection.toLowerCase().includes(q) ||
      r.excerpt.toLowerCase().includes(q)
  );
}

function printReport(rows: FactcheckRow[], sourceLabel: string) {
  console.log(`\n=== Spain guide fact-check (${sourceLabel}) ===`);
  console.log(`Signals: ${rows.length}\n`);

  if (rows.length === 0) {
    console.log("No matching signals. Try --seed-only or run npm run spain:daily first.");
    return;
  }

  let currentGuide = "";
  for (const row of rows) {
    if (row.guide !== currentGuide) {
      currentGuide = row.guide;
      console.log(`\n## ${row.guideTitle}`);
      console.log(`   file: content/guides/ru/${row.guide}.md\n`);
    }
    console.log(`- [${row.topic}] → ${row.suggestedSection}`);
    console.log(`  ${row.channel} · ${row.postedAt} · ${row.source}`);
    console.log(`  «${row.excerpt}»`);
    console.log("");
  }
}

async function main() {
  const { guide, topic, limit, seedOnly, json } = parseArgs();
  const configs = resolveGuideFactcheckConfig(guide);

  if (configs.length === 0) {
    console.error(`No guide matched filter: ${guide ?? "(empty)"}`);
    console.error("Available aliases:", SPAIN_GUIDE_FACTCHECK.flatMap((g) => [g.slug, ...g.aliases]).join(", "));
    process.exit(1);
  }

  const keywords = collectKeywords(configs);
  let rows: FactcheckRow[] = [];
  let sourceLabel = "seed only";

  if (!seedOnly) {
    try {
      const signals = await querySupabaseSignals(keywords, limit);
      const mapped = signals
        .map((s) => mapDbRow(s, configs))
        .filter((r): r is FactcheckRow => r !== null);
      if (mapped.length > 0) {
        rows = mapped;
        sourceLabel = "community_signals (Supabase)";
      }
    } catch (e) {
      console.warn("[factcheck] Supabase unavailable, falling back to seed:", (e as Error).message);
    }
  }

  if (rows.length === 0) {
    rows = SEED_FACTCHECK_SIGNALS.map((s) => mapSeedRow(s, configs, topic)).filter(
      (r): r is FactcheckRow => r !== null
    );
    sourceLabel = seedOnly ? "seed (explicit)" : "seed (fallback)";
  }

  rows = filterByTopic(rows, topic).slice(0, limit);

  if (json) {
    console.log(JSON.stringify({ source: sourceLabel, count: rows.length, rows }, null, 2));
    return;
  }

  printReport(rows, sourceLabel);

  console.log("---");
  console.log("Guides covered:", configs.map((c) => c.slug).join(", "));
  console.log(
    "Review tiers:",
    configs.map((c) => `${c.slug}=${c.reviewTier}/${c.factcheckCadence}`).join(", ")
  );
  console.log("Topics:", configs.flatMap((c) => c.topics.map((t: GuideFactcheckTopic) => t.id)).join(", "));
  console.log("\nNext: embed citations with lib/guides/spain-telegram-citations.ts → formatSpainChatCitation()");
  console.log("Docs: docs/SPAIN_GUIDE_FACTCHECK.md");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

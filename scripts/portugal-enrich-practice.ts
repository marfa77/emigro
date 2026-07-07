/**
 * Targeted practice enrichment from community_signals — one note per run.
 *
 *   npm run portugal:enrich-practice -- --audit
 *   npm run portugal:enrich-practice -- --slug=vybor-internet-provaydera-portugaliya-2026
 *   npm run portugal:enrich-practice -- --next
 *   npm run portugal:enrich-practice -- --next --try=5
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  applyPracticeEnrichment,
  auditPracticeQuality,
  buildSearchKeywords,
  CURATED_PRACTICE,
  extractPracticeBullets,
} from "@/lib/community-notes/practice-enrichment";
import { validateOfficialPracticeCopy } from "@/lib/community-notes/official-vs-practice";
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { REWRITE_PRIORITY, SKIP_REWRITE_SLUGS } from "@/lib/community-notes/rewrite-queue";
import { filterRelocantSignals } from "@/lib/satellite/portugal";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, CommunitySignal, NoteBodySection } from "@/lib/community-notes/types";

function mapRow(row: Record<string, unknown>): CommunityNote {
  return {
    id: String(row.id),
    slug: String(row.slug),
    country_key: String(row.country_key),
    city: String(row.city),
    category: String(row.category),
    content_kind: (row.content_kind as CommunityNote["content_kind"]) ?? "guide",
    title: String(row.title),
    excerpt: String(row.excerpt),
    seo_title: String(row.seo_title),
    seo_description: String(row.seo_description),
    quick_answer: String(row.quick_answer),
    body_paragraphs: (row.body_paragraphs as string[]) ?? [],
    body_sections: (row.body_sections as NoteBodySection[]) ?? [],
    key_takeaways: (row.key_takeaways as string[]) ?? [],
    faq: (row.faq as CommunityNote["faq"]) ?? [],
    official_links: (row.official_links as CommunityNote["official_links"]) ?? [],
    source_channel: (row.source_channel as string | null) ?? null,
    source_label: (row.source_label as string | null) ?? null,
    topic_tags: (row.topic_tags as string[]) ?? [],
    hashtags: (row.hashtags as string[]) ?? [],
    status: row.status as CommunityNote["status"],
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function loadNotes(): Promise<CommunityNote[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("community_notes")
    .select("*")
    .eq("country_key", "portugal")
    .eq("status", "published")
    .order("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

async function searchSignals(
  note: CommunityNote,
  keywords: string[]
): Promise<CommunitySignal[]> {
  const sb = createServerClient();
  const topic = note.topic_tags.find((t) => t !== "portugal");

  const orParts = keywords
    .slice(0, 12)
    .map((k) => `text.ilike.%${k.replace(/[%_]/g, "")}%`);

  let query = sb
    .from("community_signals")
    .select("*")
    .eq("country_key", "portugal")
    .or(orParts.join(","))
    .order("posted_at", { ascending: false })
    .limit(40);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let signals = filterRelocantSignals((data ?? []) as CommunitySignal[]);

  if (topic) {
    const topicMatches = signals.filter((s) => s.topic_hints?.includes(topic));
    if (topicMatches.length >= 2) signals = [...topicMatches, ...signals.filter((s) => !topicMatches.includes(s))];
  }

  return signals.slice(0, 30);
}

async function enrichOne(note: CommunityNote, dryRun = false, force = false): Promise<{
  slug: string;
  status: "enriched" | "skipped" | "no_signals" | "OK";
  signalsFound: number;
  bulletsAdded: number;
}> {
  const audit = auditPracticeQuality(note);
  const hasCurated = Boolean(CURATED_PRACTICE[note.slug]?.length);
  if (audit.status === "OK" && !force && !hasCurated) {
    console.log(`[enrich] skip ${note.slug} — already OK (${audit.specificBulletCount} specific)`);
    return { slug: note.slug, status: "skipped", signalsFound: 0, bulletsAdded: 0 };
  }

  const keywords = buildSearchKeywords(note);
  console.log(`[enrich] ${note.slug} keywords: ${keywords.slice(0, 8).join(", ")}`);
  const signals = await searchSignals(note, keywords);
  const bullets = extractPracticeBullets(signals, 8);

  if (bullets.length === 0 && !hasCurated) {
    console.log(`[enrich] ${note.slug} — no matching signals (${signals.length} raw)`);
    return { slug: note.slug, status: "no_signals", signalsFound: signals.length, bulletsAdded: 0 };
  }

  const enriched = applyPracticeEnrichment(note, bullets);
  if (enriched.added === 0) {
    console.log(`[enrich] skip ${note.slug} — nothing new to add`);
    return { slug: note.slug, status: "skipped", signalsFound: signals.length, bulletsAdded: 0 };
  }

  const draft = {
    content_kind: note.content_kind,
    body_sections: enriched.body_sections,
    key_takeaways: enriched.key_takeaways,
  };
  const gate = validateOfficialPracticeCopy(draft);
  if (gate.length > 0) {
    console.warn(`[enrich] quality gate warnings for ${note.slug}: ${gate.join("; ")}`);
  }

  if (dryRun) {
    console.log(`[enrich] dry-run ${note.slug}: +${enriched.added} bullets from ${signals.length} signals`);
    enriched.body_sections
      .filter((s) => s.section_kind === "practice")
      .flatMap((s) => s.bullets ?? [])
      .slice(-enriched.added)
      .forEach((b) => console.log(`  + ${b.slice(0, 120)}`));
    return { slug: note.slug, status: "enriched", signalsFound: signals.length, bulletsAdded: enriched.added };
  }

  const sb = createServerClient();
  const { error } = await sb
    .from("community_notes")
    .update({
      body_sections: enriched.body_sections,
      key_takeaways: enriched.key_takeaways,
      body_paragraphs: flattenBodySections(enriched.body_sections),
      source_label: note.source_label?.includes("enrich:practice")
        ? note.source_label
        : [note.source_label, "enrich:practice"].filter(Boolean).join("+"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", note.id);

  if (error) throw new Error(error.message);

  console.log(`[enrich] ✓ ${note.slug} +${enriched.added} bullets (${signals.length} signals)`);
  return { slug: note.slug, status: "enriched", signalsFound: signals.length, bulletsAdded: enriched.added };
}

function sortForEnrichment(notes: CommunityNote[]): CommunityNote[] {
  const rank = new Map(REWRITE_PRIORITY.map((s, i) => [s, i]));
  return [...notes].sort((a, b) => (rank.get(a.slug) ?? 999) - (rank.get(b.slug) ?? 999));
}

async function main() {
  const auditOnly = process.argv.includes("--audit");
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const tryArg = process.argv.find((a) => a.startsWith("--try="));
  const slug = slugArg?.split("=")[1];
  const tryCount = tryArg ? Math.max(1, parseInt(tryArg.split("=")[1] ?? "1", 10)) : 1;
  const nextMode = process.argv.includes("--next") || (!slug && !auditOnly);

  const notes = await loadNotes();
  console.log(`[enrich] ${notes.length} published Portugal notes\n`);

  if (auditOnly) {
    const results = notes.map((n) => auditPracticeQuality(n));
    const ok = results.filter((r) => r.status === "OK");
    const need = results.filter((r) => r.status === "NEEDS_ENRICHMENT");
    console.log("| slug | status | specific | reasons |");
    console.log("|------|--------|----------|---------|");
    for (const r of results) {
      console.log(`| ${r.slug} | ${r.status} | ${r.specificBulletCount} | ${r.reasons.join("; ") || "—"} |`);
    }
    console.log(`\n${ok.length} OK, ${need.length} NEEDS_ENRICHMENT`);
    return;
  }

  const results: Array<{
    slug: string;
    status: string;
    signalsFound: number;
    bulletsAdded: number;
  }> = [];

  if (slug) {
    const note = notes.find((n) => n.slug === slug);
    if (!note) throw new Error(`Note not found: ${slug}`);
    results.push(await enrichOne(note, dryRun, force));
  } else if (nextMode) {
    const queue = sortForEnrichment(notes);
    let done = 0;
    for (const note of queue) {
      if (done >= tryCount) break;
      const audit = auditPracticeQuality(note);
      const hasCurated = Boolean(CURATED_PRACTICE[note.slug]?.length);
      if (audit.status === "OK" && !force && !hasCurated) {
        results.push({ slug: note.slug, status: "OK", signalsFound: 0, bulletsAdded: 0 });
        continue;
      }
      results.push(await enrichOne(note, dryRun, force));
      done += 1;
    }
  }

  console.log("\n=== enrichment report ===");
  console.log("| slug | status | signals | bullets added |");
  console.log("|------|--------|---------|---------------|");
  for (const r of results) {
    console.log(`| ${r.slug} | ${r.status} | ${r.signalsFound} | ${r.bulletsAdded} |`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

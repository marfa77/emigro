/**
 * Blueprint audit + structural/practice upgrades for published Portugal guides.
 *
 *   npx tsx scripts/portugal-blueprint-pass.ts --audit
 *   npx tsx scripts/portugal-blueprint-pass.ts --slug=elektromobil-tesla-v-portugalii-2026
 *   npx tsx scripts/portugal-blueprint-pass.ts --next
 *   npx tsx scripts/portugal-blueprint-pass.ts --next --try=3
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  applyBlueprintFixes,
  BLUEPRINT_PASS_SCORE,
  BLUEPRINT_SOURCE_SLUG,
  scoreBlueprint,
  validateAgainstBlueprint,
} from "@/lib/community-notes/article-blueprint";
import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { TOPIC_OFFICIAL_LINKS } from "@/lib/community-notes/editorial-voice";
import {
  applyPracticeEnrichment,
  auditPracticeQuality,
  buildSearchKeywords,
  extractPracticeBullets,
} from "@/lib/community-notes/practice-enrichment";
import { SKIP_REWRITE_SLUGS } from "@/lib/community-notes/rewrite-queue";
import { filterRelocantSignals } from "@/lib/satellite/portugal";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, CommunitySignal, NoteBodySection } from "@/lib/community-notes/types";

const HAND_GUIDE_SLUGS = SKIP_REWRITE_SLUGS;

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

async function loadNotes(slug?: string): Promise<CommunityNote[]> {
  const sb = createServerClient();
  let query = sb.from("community_notes").select("*").eq("country_key", "portugal").eq("status", "published");
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query.order("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

async function searchSignals(note: CommunityNote, keywords: string[]): Promise<CommunitySignal[]> {
  const sb = createServerClient();
  const orParts = keywords.slice(0, 12).map((k) => `text.ilike.%${k.replace(/[%_]/g, "")}%`);
  const { data, error } = await sb
    .from("community_signals")
    .select("*")
    .eq("country_key", "portugal")
    .or(orParts.join(","))
    .order("posted_at", { ascending: false })
    .limit(40);
  if (error) throw new Error(error.message);
  return filterRelocantSignals((data ?? []) as CommunitySignal[]).slice(0, 30);
}

function ensureOfficialLinks(note: CommunityNote): CommunityNote["official_links"] {
  const existing = [...(note.official_links ?? [])];
  if (existing.length >= 2) return existing;
  const topic = note.topic_tags.find((t) => t !== "portugal") ?? "general";
  const topicLinks = TOPIC_OFFICIAL_LINKS[topic] ?? TOPIC_OFFICIAL_LINKS.general;
  for (const link of topicLinks) {
    if (existing.length >= 2) break;
    if (!existing.some((l) => l.url === link.url)) existing.push(link);
  }
  for (const link of TOPIC_OFFICIAL_LINKS.general) {
    if (existing.length >= 2) break;
    if (!existing.some((l) => l.url === link.url)) existing.push(link);
  }
  return existing.length > 0 ? existing : topicLinks;
}

type PassResult = {
  slug: string;
  scoreBefore: number;
  scoreAfter: number;
  compliant: boolean;
  fixes: string[];
  errors: string[];
};

async function processNote(note: CommunityNote, dryRun: boolean): Promise<PassResult> {
  const fixes: string[] = [];
  const scoreBefore = scoreBlueprint({
    content_kind: note.content_kind,
    slug: note.slug,
    quick_answer: note.quick_answer,
    seo_description: note.seo_description,
    body_sections: note.body_sections,
    key_takeaways: note.key_takeaways,
    faq: note.faq,
    official_links: note.official_links,
  });

  if (HAND_GUIDE_SLUGS.has(note.slug)) {
    const validation = validateAgainstBlueprint({
      content_kind: note.content_kind,
      slug: note.slug,
      quick_answer: note.quick_answer,
      seo_description: note.seo_description,
      body_sections: note.body_sections,
      key_takeaways: note.key_takeaways,
      faq: note.faq,
      official_links: note.official_links,
    });
    return {
      slug: note.slug,
      scoreBefore,
      scoreAfter: validation.score,
      compliant: validation.errors.length === 0 && validation.score >= BLUEPRINT_PASS_SCORE,
      fixes: ["hand guide — skip auto-upgrade"],
      errors: validation.errors,
    };
  }

  let body_sections = [...note.body_sections];
  let key_takeaways = [...note.key_takeaways];
  let official_links = ensureOfficialLinks(note);
  if (official_links !== note.official_links) fixes.push("official_links from topic");

  const structural = applyBlueprintFixes({
    content_kind: note.content_kind,
    quick_answer: note.quick_answer,
    key_takeaways,
    body_sections,
    faq: note.faq,
    glossaryTerms: glossaryForSlug(note.slug),
  });
  if (structural.changed) {
    body_sections = structural.body_sections;
    key_takeaways = structural.key_takeaways;
    fixes.push("blueprint structure (glossary/gap/mistakes/bootstrap)");
  }

  const beforeAudit = auditPracticeQuality(
    { slug: note.slug, content_kind: note.content_kind, body_sections, key_takeaways },
    { strict: true }
  );
  if (beforeAudit.status !== "OK" || scoreBefore < BLUEPRINT_PASS_SCORE) {
    const keywords = buildSearchKeywords(note);
    const signals = await searchSignals(note, keywords);
    const bullets = extractPracticeBullets(signals, 8);
    if (bullets.length > 0) {
      const enriched = applyPracticeEnrichment(
        { slug: note.slug, body_sections, key_takeaways },
        bullets
      );
      if (enriched.added > 0) {
        body_sections = enriched.body_sections;
        key_takeaways = enriched.key_takeaways;
        fixes.push(`practice +${enriched.added} from ${signals.length} signals`);
      }
    } else if (beforeAudit.status !== "OK") {
      fixes.push(`no signals for practice (${signals.length} raw)`);
    }
  }

  const scoreAfter = scoreBlueprint({
    content_kind: note.content_kind,
    slug: note.slug,
    quick_answer: note.quick_answer,
    seo_description: note.seo_description,
    body_sections,
    key_takeaways,
    faq: note.faq,
    official_links,
  });

  const validation = validateAgainstBlueprint({
    content_kind: note.content_kind,
    slug: note.slug,
    quick_answer: note.quick_answer,
    seo_description: note.seo_description,
    body_sections,
    key_takeaways,
    faq: note.faq,
    official_links,
  });

  const qualityErrors =
    note.content_kind === "guide"
      ? validateNoteDraft({
          content_kind: note.content_kind,
          slug: note.slug,
          seo_title: note.seo_title,
          seo_description: note.seo_description,
          quick_answer: note.quick_answer,
          body_sections,
          body_paragraphs: flattenBodySections(body_sections),
          faq: note.faq,
          key_takeaways,
          official_links,
        })
      : [];

  const errors = Array.from(new Set([...validation.errors, ...qualityErrors]));
  const compliant = errors.length === 0 && scoreAfter >= BLUEPRINT_PASS_SCORE;

  if (!dryRun && fixes.length > 0 && fixes[0] !== "hand guide — skip auto-upgrade") {
    const sb = createServerClient();
    const { error } = await sb
      .from("community_notes")
      .update({
        body_sections,
        key_takeaways,
        body_paragraphs: flattenBodySections(body_sections),
        official_links,
        source_label: note.source_label?.includes("blueprint-pass")
          ? note.source_label
          : [note.source_label, "blueprint-pass"].filter(Boolean).join("+"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);
    if (error) throw new Error(`${note.slug}: ${error.message}`);
  }

  return { slug: note.slug, scoreBefore, scoreAfter, compliant, fixes, errors };
}

async function main() {
  const args = process.argv.slice(2);
  const auditOnly = args.includes("--audit");
  const dryRun = args.includes("--dry-run");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const tryArg = args.find((a) => a.startsWith("--try="));
  const tryCount = tryArg ? Math.max(1, parseInt(tryArg.split("=")[1] ?? "1", 10)) : 1;
  const nextMode = args.includes("--next") || (!slugArg && !auditOnly);

  const notes = await loadNotes(slugArg);
  console.log(`[blueprint] reference: ${BLUEPRINT_SOURCE_SLUG}`);
  console.log(`[blueprint] pass threshold: ${BLUEPRINT_PASS_SCORE}/100\n`);

  if (auditOnly) {
    console.log("| slug | score | compliant | errors |");
    console.log("|------|-------|-----------|--------|");
    let compliant = 0;
    for (const note of notes) {
      const validation = validateAgainstBlueprint({
        content_kind: note.content_kind,
        slug: note.slug,
        quick_answer: note.quick_answer,
        seo_description: note.seo_description,
        body_sections: note.body_sections,
        key_takeaways: note.key_takeaways,
        faq: note.faq,
        official_links: note.official_links,
      });
      const ok = validation.errors.length === 0 && validation.score >= BLUEPRINT_PASS_SCORE;
      if (ok) compliant += 1;
      console.log(
        `| ${note.slug} | ${validation.score} | ${ok ? "yes" : "no"} | ${validation.errors.slice(0, 2).join("; ") || "—"} |`
      );
    }
    console.log(`\n${compliant}/${notes.length} blueprint-compliant`);
    return;
  }

  const queue = slugArg
    ? notes
    : nextMode
      ? [...notes].sort((a, b) => {
          const scoreA = scoreBlueprint({
            content_kind: a.content_kind,
            slug: a.slug,
            quick_answer: a.quick_answer,
            seo_description: a.seo_description,
            body_sections: a.body_sections,
            key_takeaways: a.key_takeaways,
            faq: a.faq,
            official_links: a.official_links,
          });
          const scoreB = scoreBlueprint({
            content_kind: b.content_kind,
            slug: b.slug,
            quick_answer: b.quick_answer,
            seo_description: b.seo_description,
            body_sections: b.body_sections,
            key_takeaways: b.key_takeaways,
            faq: b.faq,
            official_links: b.official_links,
          });
          if (a.slug === "elektromobil-tesla-v-portugalii-2026") return -1;
          if (b.slug === "elektromobil-tesla-v-portugalii-2026") return 1;
          return scoreA - scoreB;
        })
      : notes;

  const results: PassResult[] = [];
  let processed = 0;
  for (const note of queue) {
    if (nextMode && processed >= tryCount) break;
    const result = await processNote(note, dryRun);
    results.push(result);
    processed += 1;
    console.log(
      `[${dryRun ? "dry" : "apply"}] ${result.slug}: ${result.scoreBefore}→${result.scoreAfter} ${result.compliant ? "OK" : "FAIL"} | ${result.fixes.join(", ") || "—"}`
    );
    if (result.errors.length) console.log(`  errors: ${result.errors.slice(0, 3).join("; ")}`);
  }

  console.log("\n=== blueprint pass report ===");
  console.log("| slug | score | compliant | fixes |");
  console.log("|------|-------|-----------|-------|");
  for (const r of results) {
    console.log(
      `| ${r.slug} | ${r.scoreAfter} | ${r.compliant ? "yes" : "no"} | ${r.fixes.join("; ") || "—"} |`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

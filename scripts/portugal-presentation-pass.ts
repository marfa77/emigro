/**
 * Presentation pass: audit + lighter rewrite for reading flow (not full blueprint rewrite).
 *
 *   npm run portugal:presentation-pass -- --audit
 *   npm run portugal:presentation-pass -- --slug=elektromobil-tesla-v-portugalii-2026
 *   npm run portugal:presentation-pass -- --next
 *   npm run portugal:presentation-pass -- --next --dry-run
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { rewriteCommunityNote } from "@/lib/community-notes/draft-from-signals";
import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { validateEditorialPresentation } from "@/lib/community-notes/editorial-presentation";
import { SKIP_REWRITE_SLUGS } from "@/lib/community-notes/rewrite-queue";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, NoteBodySection } from "@/lib/community-notes/types";

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

type PassResult = {
  slug: string;
  presentationScore: number;
  warnings: string[];
  applied: boolean;
  errors: string[];
};

async function processNote(note: CommunityNote, dryRun: boolean): Promise<PassResult> {
  const presentation = validateEditorialPresentation({
    content_kind: note.content_kind,
    quick_answer: note.quick_answer,
    key_takeaways: note.key_takeaways,
    body_sections: note.body_sections,
    faq: note.faq,
  });

  if (HAND_GUIDE_SLUGS.has(note.slug)) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: [...presentation.warnings, "hand guide — skip auto presentation rewrite"],
      applied: false,
      errors: [],
    };
  }

  if (note.content_kind !== "guide" || presentation.warnings.length === 0) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      errors: [],
    };
  }

  if (dryRun) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      errors: [],
    };
  }

  const rewritten = await rewriteCommunityNote(note);
  const body_sections = rewritten.body_sections;
  const key_takeaways = rewritten.key_takeaways;
  const quick_answer = rewritten.quick_answer;
  const faq = rewritten.faq;

  const errors = validateNoteDraft({
    content_kind: note.content_kind,
    slug: note.slug,
    seo_title: rewritten.seo_title,
    seo_description: rewritten.seo_description,
    quick_answer,
    body_sections,
    body_paragraphs: flattenBodySections(body_sections),
    faq,
    key_takeaways,
    official_links: note.official_links,
  });

  const blueprint = validateAgainstBlueprint({
    content_kind: note.content_kind,
    slug: note.slug,
    quick_answer,
    seo_description: rewritten.seo_description,
    body_sections,
    key_takeaways,
    faq,
    official_links: note.official_links,
  });
  errors.push(...blueprint.errors);

  if (errors.length > 0) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      errors,
    };
  }

  const sb = createServerClient();
  const { error } = await sb
    .from("community_notes")
    .update({
      quick_answer,
      key_takeaways,
      body_sections,
      body_paragraphs: flattenBodySections(body_sections),
      faq,
      excerpt: rewritten.excerpt,
      source_label: note.source_label?.includes("presentation-pass")
        ? note.source_label
        : [note.source_label, "presentation-pass"].filter(Boolean).join("+"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", note.id);
  if (error) throw new Error(`${note.slug}: ${error.message}`);

  const after = validateEditorialPresentation({
    content_kind: note.content_kind,
    quick_answer,
    key_takeaways,
    body_sections,
    faq,
  });

  return {
    slug: note.slug,
    presentationScore: after.score,
    warnings: after.warnings,
    applied: true,
    errors: [],
  };
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
  console.log(`[presentation] guides loaded: ${notes.length}\n`);

  if (auditOnly) {
    console.log("| slug | score | warnings |");
    console.log("|------|-------|----------|");
    for (const note of notes.filter((n) => n.content_kind === "guide")) {
      const p = validateEditorialPresentation({
        content_kind: note.content_kind,
        quick_answer: note.quick_answer,
        key_takeaways: note.key_takeaways,
        body_sections: note.body_sections,
        faq: note.faq,
      });
      console.log(
        `| ${note.slug} | ${p.score} | ${p.warnings.slice(0, 2).join("; ") || "—"} |`
      );
    }
    return;
  }

  const queue = nextMode
    ? [...notes]
        .filter((n) => n.content_kind === "guide")
        .sort((a, b) => {
          const scoreA = validateEditorialPresentation({
            content_kind: a.content_kind,
            quick_answer: a.quick_answer,
            key_takeaways: a.key_takeaways,
            body_sections: a.body_sections,
            faq: a.faq,
          }).score;
          const scoreB = validateEditorialPresentation({
            content_kind: b.content_kind,
            quick_answer: b.quick_answer,
            key_takeaways: b.key_takeaways,
            body_sections: b.body_sections,
            faq: b.faq,
          }).score;
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
      `[${dryRun ? "dry" : "apply"}] ${result.slug}: score ${result.presentationScore} | ${result.applied ? "REWRITTEN" : "skip"} | ${result.warnings.slice(0, 2).join("; ") || "ok"}`
    );
    if (result.errors.length) console.log(`  errors: ${result.errors.slice(0, 2).join("; ")}`);
  }

  console.log("\n=== presentation pass report ===");
  for (const r of results) {
    console.log(`${r.slug}: score ${r.presentationScore}, applied=${r.applied}, warnings=${r.warnings.length}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

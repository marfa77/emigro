/**
 * Voice pass: rewrite Portugal guides with «Опытный релокант за кофе» editorial voice
 * (warm relocant-blogger rhythm inspired by @portugal_and_me — style only; see editorial-voice.ts).
 *
 *   npm run portugal:voice-pass -- --audit
 *   npm run portugal:voice-pass -- --slug=aima-agora-zapis-2026
 *   npm run portugal:voice-pass -- --all
 *   npm run portugal:voice-pass -- --next --try=3
 *   npm run portugal:voice-pass -- --all --dry-run
 *   npm run portugal:voice-pass -- --all --local-only
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { rewriteCommunityNote } from "@/lib/community-notes/draft-from-signals";
import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { validateEditorialPresentation } from "@/lib/community-notes/editorial-presentation";
import { applyVoiceTransforms } from "@/lib/community-notes/voice-transforms";
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
  skipped: boolean;
  skipReason?: string;
  errors: string[];
};

async function processNote(note: CommunityNote, dryRun: boolean, options?: { forceHand?: boolean; localOnly?: boolean }): Promise<PassResult> {
  const presentation = validateEditorialPresentation({
    content_kind: note.content_kind,
    quick_answer: note.quick_answer,
    key_takeaways: note.key_takeaways,
    body_sections: note.body_sections,
    faq: note.faq,
  });

  if (HAND_GUIDE_SLUGS.has(note.slug) && !options?.forceHand) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      skipped: true,
      skipReason: "hand guide — update .ts + republish",
      errors: [],
    };
  }

  if (note.content_kind !== "guide") {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      skipped: true,
      skipReason: "not a guide",
      errors: [],
    };
  }

  if (dryRun) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      skipped: false,
      errors: [],
    };
  }

  let quick_answer = note.quick_answer;
  let key_takeaways = note.key_takeaways;
  let body_sections = note.body_sections;
  let faq = note.faq;
  let excerpt = note.excerpt;
  let applied = false;
  let rewriteErrors: string[] = [];

  try {
    if (!options?.localOnly) {
      const rewritten = await rewriteCommunityNote(note, { voicePass: true });
      quick_answer = rewritten.quick_answer;
      key_takeaways = rewritten.key_takeaways;
      body_sections = rewritten.body_sections;
      faq = rewritten.faq;
      excerpt = rewritten.excerpt;
      applied = true;
    } else {
      throw new Error("local-only");
    }
  } catch (e) {
    rewriteErrors = [e instanceof Error ? e.message : String(e)];
    const local = applyVoiceTransforms(note);
    if (local.changed) {
      quick_answer = local.quick_answer;
      key_takeaways = local.key_takeaways;
      body_sections = local.body_sections;
      faq = local.faq;
      applied = true;
    }
  }

  const errors = validateNoteDraft({
    content_kind: note.content_kind,
    slug: note.slug,
    seo_title: note.seo_title,
    seo_description: note.seo_description,
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
    seo_description: note.seo_description,
    body_sections,
    key_takeaways,
    faq,
    official_links: note.official_links,
  });
  if (!options?.localOnly) {
    errors.push(...blueprint.errors);
  }

  if (errors.length > 0) {
    const blocking = options?.localOnly
      ? errors.filter((e) => !e.startsWith("blueprint:"))
      : errors;
    if (blocking.length > 0) {
      return {
        slug: note.slug,
        presentationScore: presentation.score,
        warnings: [...presentation.warnings, ...rewriteErrors.slice(0, 1)],
        applied: false,
        skipped: false,
        errors: blocking,
      };
    }
  }

  if (!applied) {
    return {
      slug: note.slug,
      presentationScore: presentation.score,
      warnings: presentation.warnings,
      applied: false,
      skipped: false,
      errors: rewriteErrors.length ? rewriteErrors : ["no changes"],
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
      excerpt,
      source_label: note.source_label?.includes("voice-pass")
        ? note.source_label
        : [note.source_label, "voice-pass"].filter(Boolean).join("+"),
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
    skipped: false,
    errors: [],
  };
}

async function main() {
  const args = process.argv.slice(2);
  const auditOnly = args.includes("--audit");
  const dryRun = args.includes("--dry-run");
  const allMode = args.includes("--all");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const tryArg = args.find((a) => a.startsWith("--try="));
  const tryCount = tryArg ? Math.max(1, parseInt(tryArg.split("=")[1] ?? "1", 10)) : allMode ? 999 : 1;
  const localOnly = args.includes("--local-only");
  const nextMode = args.includes("--next") || (!slugArg && !auditOnly && !allMode);

  const notes = await loadNotes(slugArg);
  console.log(`[voice-pass] guides loaded: ${notes.length}\n`);

  if (auditOnly) {
    console.log("| slug | score | status |");
    console.log("|------|-------|--------|");
    for (const note of notes.filter((n) => n.content_kind === "guide")) {
      const p = validateEditorialPresentation({
        content_kind: note.content_kind,
        quick_answer: note.quick_answer,
        key_takeaways: note.key_takeaways,
        body_sections: note.body_sections,
        faq: note.faq,
      });
      const status = HAND_GUIDE_SLUGS.has(note.slug) ? "hand" : "cron";
      console.log(`| ${note.slug} | ${p.score} | ${status} |`);
    }
    return;
  }

  const queue = nextMode || allMode
    ? [...notes]
        .filter((n) => n.content_kind === "guide" && !HAND_GUIDE_SLUGS.has(n.slug))
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
    if ((nextMode || allMode) && processed >= tryCount) break;
    try {
      const result = await processNote(note, dryRun, { localOnly });
      results.push(result);
      processed += 1;
      const tag = result.skipped ? `SKIP (${result.skipReason})` : result.applied ? "VOICE-REWRITTEN" : "skip";
      console.log(
        `[${dryRun ? "dry" : "apply"}] ${result.slug}: score ${result.presentationScore} | ${tag} | ${result.warnings.slice(0, 2).join("; ") || "ok"}`
      );
      if (result.errors.length) console.log(`  errors: ${result.errors.slice(0, 2).join("; ")}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({
        slug: note.slug,
        presentationScore: 0,
        warnings: [],
        applied: false,
        skipped: false,
        errors: [msg],
      });
      processed += 1;
      console.log(`[error] ${note.slug}: ${msg.slice(0, 160)}`);
    }
  }

  console.log("\n=== voice pass report ===");
  for (const r of results) {
    const status = r.skipped ? `skipped (${r.skipReason})` : r.applied ? "updated" : "failed";
    console.log(`${r.slug}: ${status}, score=${r.presentationScore}`);
  }

  const handGuides = notes.filter((n) => HAND_GUIDE_SLUGS.has(n.slug) && n.content_kind === "guide");
  if (handGuides.length > 0) {
    console.log("\n=== hand guides (update .ts + republish) ===");
    for (const g of handGuides) {
      console.log(`  ${g.slug}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

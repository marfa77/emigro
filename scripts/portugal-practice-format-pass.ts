/**
 * Batch pass: rewrite telegraphic «На практике» blocks in published notes.
 *
 *   npm run portugal:practice-format-pass -- --audit
 *   npm run portugal:practice-format-pass -- --dry-run
 *   npm run portugal:practice-format-pass -- --slug=aima-agora-zapis-2026
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import {
  applyPracticeFormatToDraft,
  isTelegraphicPractice,
} from "@/lib/community-notes/practice-format";
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

function countTelegraphic(note: Pick<CommunityNote, "key_takeaways" | "body_sections">): number {
  let n = 0;
  for (const t of note.key_takeaways) {
    if (/^На практике:/i.test(t) && isTelegraphicPractice(t)) n += 1;
  }
  for (const s of note.body_sections) {
    if (s.section_kind !== "practice" && !/на практике|как обычно|в чате/i.test(s.heading)) continue;
    for (const b of s.bullets ?? []) {
      if (isTelegraphicPractice(b) || /^На практике \(@/i.test(b)) n += 1;
    }
  }
  return n;
}

async function loadNotes(country: string, slug?: string): Promise<CommunityNote[]> {
  const sb = createServerClient();
  let query = sb.from("community_notes").select("*").eq("country_key", country).eq("status", "published");
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query.order("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

async function processNote(note: CommunityNote, dryRun: boolean): Promise<{
  slug: string;
  telegraphicBefore: number;
  changed: number;
  applied: boolean;
  errors: string[];
}> {
  const telegraphicBefore = countTelegraphic(note);
  if (HAND_GUIDE_SLUGS.has(note.slug)) {
    return {
      slug: note.slug,
      telegraphicBefore,
      changed: 0,
      applied: false,
      errors: telegraphicBefore > 0 ? ["hand guide — republish from source"] : [],
    };
  }

  const formatted = applyPracticeFormatToDraft({
    key_takeaways: note.key_takeaways,
    body_sections: note.body_sections,
  });

  if (formatted.changed === 0) {
    return { slug: note.slug, telegraphicBefore, changed: 0, applied: false, errors: [] };
  }

  const draft = {
    content_kind: note.content_kind,
    seo_title: note.seo_title,
    seo_description: note.seo_description,
    quick_answer: note.quick_answer,
    body_sections: formatted.body_sections as NoteBodySection[],
    body_paragraphs: flattenBodySections(formatted.body_sections as NoteBodySection[]),
    faq: note.faq,
    key_takeaways: formatted.key_takeaways,
  };

  const errors = validateNoteDraft(draft);
  if (errors.length > 0) {
    return { slug: note.slug, telegraphicBefore, changed: formatted.changed, applied: false, errors };
  }

  if (dryRun) {
    console.log(`[practice-format] dry-run ${note.slug}: ${formatted.changed} fields`);
    return { slug: note.slug, telegraphicBefore, changed: formatted.changed, applied: false, errors: [] };
  }

  const sb = createServerClient();
  const { error } = await sb
    .from("community_notes")
    .update({
      body_sections: formatted.body_sections,
      key_takeaways: formatted.key_takeaways,
      body_paragraphs: draft.body_paragraphs,
      source_label: note.source_label?.includes("practice:format")
        ? note.source_label
        : [note.source_label, "practice:format"].filter(Boolean).join("+"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", note.id);

  if (error) throw new Error(error.message);

  console.log(`[practice-format] ✓ ${note.slug} (${formatted.changed} fields)`);
  return { slug: note.slug, telegraphicBefore, changed: formatted.changed, applied: true, errors: [] };
}

async function main() {
  const auditOnly = process.argv.includes("--audit");
  const dryRun = process.argv.includes("--dry-run");
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const slug = slugArg?.split("=")[1];
  const countryArg = process.argv.find((a) => a.startsWith("--country="));
  const country = countryArg?.split("=")[1] ?? "portugal";

  const notes = await loadNotes(country, slug);
  console.log(`[practice-format] ${notes.length} published ${country} notes\n`);

  if (auditOnly) {
    console.log("| slug | telegraphic | hand |");
    console.log("|------|-------------|------|");
    let bad = 0;
    for (const n of notes) {
      const t = countTelegraphic(n);
      if (t > 0) bad += 1;
      console.log(`| ${n.slug} | ${t} | ${HAND_GUIDE_SLUGS.has(n.slug) ? "yes" : "no"} |`);
    }
    console.log(`\n${bad} notes with telegraphic practice blocks`);
    return;
  }

  const results = [];
  for (const note of notes) {
    results.push(await processNote(note, dryRun));
  }

  console.log("\n=== practice format report ===");
  console.log("| slug | before | changed | applied | errors |");
  console.log("|------|--------|---------|---------|--------|");
  for (const r of results) {
    console.log(
      `| ${r.slug} | ${r.telegraphicBefore} | ${r.changed} | ${r.applied} | ${r.errors.join("; ") || "—"} |`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

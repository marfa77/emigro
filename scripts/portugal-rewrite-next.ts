/**
 * Deep AI rewrite — one note per run (stable JSON, no batch timeouts).
 *
 *   npm run portugal:rewrite-next              # next in priority queue
 *   npm run portugal:rewrite-next -- --list    # show queue
 *   npm run portugal:rewrite-next -- --slug=pervyj-mesyac-portugaliya-checklist
 *   npm run portugal:rewrite-next -- --try=3   # up to 3 notes, continue on failure
 *   npm run portugal:rewrite-next -- --force   # re-run even if already rewritten
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { rewriteCommunityNote } from "@/lib/community-notes/draft-from-signals";
import {
  countPendingRewrites,
  isRewriteCompleted,
  isRewritePending,
  noteToDraftInput,
  pickNextRewriteCandidate,
  REWRITE_PRIORITY,
  REWRITE_SOURCE_LABEL,
  SKIP_REWRITE_SLUGS,
  sortNotesForRewrite,
} from "@/lib/community-notes/rewrite-queue";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote } from "@/lib/community-notes/types";

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
    body_sections: (row.body_sections as CommunityNote["body_sections"]) ?? [],
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

async function rewriteOne(note: CommunityNote): Promise<CommunityNote> {
  console.log(`[rewrite] ${note.slug}…`);
  const draft = await rewriteCommunityNote(note);
  const errors = validateNoteDraft({
    content_kind: draft.content_kind,
    seo_title: draft.seo_title,
    seo_description: draft.seo_description,
    quick_answer: draft.quick_answer,
    body_sections: draft.body_sections,
    body_paragraphs: draft.body_paragraphs,
    faq: draft.faq,
    key_takeaways: draft.key_takeaways,
  });
  if (errors.length > 0) {
    throw new Error(`post-rewrite quality: ${errors.join("; ")}`);
  }

  const supabase = createServerClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("community_notes")
    .update({
      title: draft.title,
      excerpt: draft.excerpt,
      seo_title: draft.seo_title,
      seo_description: draft.seo_description,
      quick_answer: draft.quick_answer,
      body_paragraphs: draft.body_paragraphs,
      body_sections: draft.body_sections,
      key_takeaways: draft.key_takeaways,
      faq: draft.faq,
      official_links: draft.official_links,
      hashtags: draft.hashtags,
      category: draft.category,
      source_label: REWRITE_SOURCE_LABEL,
      updated_at: now,
    })
    .eq("id", note.id);

  if (error) throw new Error(error.message);
  console.log(`[rewrite] ✓ ${note.slug} — ${draft.body_sections.length} sections, ${draft.faq.length} faq`);
  return { ...note, source_label: REWRITE_SOURCE_LABEL };
}

async function loadNotes(): Promise<CommunityNote[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select("*")
    .eq("country_key", "portugal")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

async function main() {
  ensurePortugalCronEnv();
  const listOnly = process.argv.includes("--list");
  const force = process.argv.includes("--force");
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const tryArg = process.argv.find((a) => a.startsWith("--try="));
  const slug = slugArg?.split("=")[1];
  const tryCount = tryArg ? Math.max(1, parseInt(tryArg.split("=")[1] ?? "1", 10)) : 1;

  let notes = await loadNotes();

  if (listOnly) {
    console.log("=== rewrite queue (skip hand-curated) ===\n");
    for (const s of REWRITE_PRIORITY) {
      const note = notes.find((n) => n.slug === s);
      if (!note) continue;
      const tag = SKIP_REWRITE_SLUGS.has(s)
        ? "skip (curated)"
        : isRewriteCompleted(note) && !force
          ? "done"
          : "pending";
      console.log(`  [${tag}] ${s}`);
    }
    const extra = notes.filter((n) => !REWRITE_PRIORITY.includes(n.slug) && !SKIP_REWRITE_SLUGS.has(n.slug));
    for (const note of extra) {
      const tag = isRewriteCompleted(note) ? "done" : isRewritePending(note) ? "pending" : "ok";
      console.log(`  [${tag}] ${note.slug}`);
    }
    console.log(`\npending: ${countPendingRewrites(notes, force)}`);
    return;
  }

  const succeeded: string[] = [];
  const failed: Array<{ slug: string; error: string }> = [];
  const attempted = new Set<string>();

  for (let i = 0; i < tryCount; i += 1) {
    const target = slug
      ? notes.find((n) => n.slug === slug)
      : pickNextRewriteCandidate(
          notes.filter((n) => !attempted.has(n.slug)),
          force
        );

    if (!target) {
      if (i === 0) console.log("[rewrite] queue empty — all notes rewritten");
      break;
    }

    if (SKIP_REWRITE_SLUGS.has(target.slug)) {
      throw new Error(`${target.slug} is hand-curated — skip rewrite`);
    }

    attempted.add(target.slug);

    try {
      const updated = await rewriteOne(target);
      succeeded.push(target.slug);
      notes = notes.map((n) => (n.slug === updated.slug ? updated : n));
      if (slug) break;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[rewrite] ✗ ${target.slug}: ${msg}`);
      failed.push({ slug: target.slug, error: msg });
      if (slug) break;
    }
  }

  const remaining = countPendingRewrites(notes, force);
  console.log(`\n[rewrite] succeeded: ${succeeded.length} [${succeeded.join(", ") || "—"}]`);
  console.log(`[rewrite] failed: ${failed.length}`);
  for (const f of failed) console.log(`  ✗ ${f.slug}: ${f.error.slice(0, 120)}`);
  console.log(`[rewrite] remaining: ${remaining}`);
  if (remaining > 0) console.log(`[rewrite] next: npm run portugal:rewrite-next`);

  if (succeeded.length > 0) {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

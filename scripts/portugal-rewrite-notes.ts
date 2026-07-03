/**
 * Rewrite published community notes to rich editorial format (Gemini Pro + quality gate).
 *
 *   npm run portugal:rewrite -- --slug=pervyj-mesyac-portugaliya-checklist
 *   npm run portugal:rewrite -- --all
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { rewriteCommunityNote } from "@/lib/community-notes/draft-from-signals";
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

async function rewriteOne(note: CommunityNote) {
  console.log(`[rewrite] ${note.slug}…`);
  const draft = await rewriteCommunityNote(note);
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
      updated_at: now,
    })
    .eq("id", note.id);

  if (error) throw new Error(error.message);
  console.log(`[rewrite] ✓ ${note.slug} — ${draft.body_sections.length} sections, ${draft.faq.length} faq`);
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const all = process.argv.includes("--all");
  const slug = slugArg?.split("=")[1];

  if (!slug && !all) {
    throw new Error("Provide --slug=... or --all");
  }

  const supabase = createServerClient();
  let query = supabase.from("community_notes").select("*").eq("country_key", "portugal").eq("status", "published");
  if (slug) query = query.eq("slug", slug);

  const { data, error } = await query.order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error("No notes found");

  for (const row of data) {
    await rewriteOne(mapRow(row));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

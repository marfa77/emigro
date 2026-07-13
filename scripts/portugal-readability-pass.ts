/**
 * Readability pass — convert telegraphic editor notes to reader-facing prose.
 *
 *   npm run portugal:readability-pass -- --audit
 *   npm run portugal:readability-pass -- --all
 *   npm run portugal:readability-pass -- --slug=aima-agora-zapis-2026
 *   npm run portugal:readability-pass -- --republish-hand
 *   npm run portugal:readability-pass -- --all --dry-run
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import {
  applyReadabilityToDraft,
  isTelegraphicEditorial,
} from "@/lib/community-notes/editorial-readability";
import { validateEditorialPresentation } from "@/lib/community-notes/editorial-presentation";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";
import { SKIP_REWRITE_SLUGS } from "@/lib/community-notes/rewrite-queue";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, NoteBodySection } from "@/lib/community-notes/types";

import { APARTMENT_BUY_NORTE_GUIDE } from "@/lib/community-notes/guides/apartment-buy-norte-portugal";
import { CAR_PORTUGAL_GUIDE } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { DOMESTIC_TOURISM_NORTE_GUIDE } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { FOREIGN_PASSPORT_REPLACEMENT_GUIDE } from "@/lib/community-notes/guides/foreign-passport-replacement";
import { INTERNATIONAL_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/international-schools-portugal";
import { LAND_BUILD_NORTE_GUIDE } from "@/lib/community-notes/guides/land-build-norte-portugal";
import { MEDITSINA_NORTE_HEALTHCARE_GUIDE } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { NORTE_CLIMATE_COMFORT_GUIDE } from "@/lib/community-notes/guides/norte-climate-comfort";
import { PORTO_BRAGA_LONG_TERM_RENT_GUIDE } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { PORTUGAL_REGIONS_EXPAT_GUIDE } from "@/lib/community-notes/guides/portugal-regions-expat-guide";
import { VNJ_RENEWAL_GUIDE } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import { TOLLS_FINES_ACCIDENTS_GUIDE } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";

const HAND_GUIDES: Omit<CommunityNote, "id" | "created_at" | "updated_at">[] = [
  VNJ_RENEWAL_GUIDE,
  DRIVING_LICENSE_EXCHANGE_GUIDE,
  MEDITSINA_NORTE_HEALTHCARE_GUIDE,
  DOMESTIC_TOURISM_NORTE_GUIDE,
  PORTUGAL_REGIONS_EXPAT_GUIDE,
  APARTMENT_BUY_NORTE_GUIDE,
  PORTO_BRAGA_LONG_TERM_RENT_GUIDE,
  INTERNATIONAL_SCHOOLS_GUIDE,
  CAR_PORTUGAL_GUIDE,
  LAND_BUILD_NORTE_GUIDE,
  PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE,
  TOLLS_FINES_ACCIDENTS_GUIDE,
  FOREIGN_PASSPORT_REPLACEMENT_GUIDE,
  NORTE_CLIMATE_COMFORT_GUIDE,
];

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

function collectTelegraphic(note: Pick<CommunityNote, "quick_answer" | "key_takeaways" | "body_sections" | "faq">): string[] {
  const hits: string[] = [];
  if (isTelegraphicEditorial(note.quick_answer)) hits.push(`quick_answer: ${note.quick_answer.slice(0, 80)}…`);
  for (const t of note.key_takeaways ?? []) {
    if (isTelegraphicEditorial(t)) hits.push(`takeaway: ${t.slice(0, 80)}…`);
  }
  for (const s of note.body_sections ?? []) {
    for (const b of [...(s.bullets ?? []), ...(s.paragraphs ?? [])]) {
      if (isTelegraphicEditorial(b)) hits.push(`«${s.heading}»: ${b.slice(0, 70)}…`);
    }
  }
  for (const f of note.faq ?? []) {
    if (isTelegraphicEditorial(f.a)) hits.push(`faq: ${f.q.slice(0, 40)}…`);
  }
  return hits;
}

async function loadNotes(slug?: string): Promise<CommunityNote[]> {
  const sb = createServerClient();
  let query = sb.from("community_notes").select("*").eq("country_key", "portugal").eq("status", "published");
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query.order("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

async function applyToNote(note: CommunityNote, dryRun: boolean) {
  const before = collectTelegraphic(note);
  const improved = applyReadabilityToDraft(note);
  const after = collectTelegraphic(improved);

  const presentation = validateEditorialPresentation({
    content_kind: improved.content_kind,
    quick_answer: improved.quick_answer,
    key_takeaways: improved.key_takeaways,
    body_sections: improved.body_sections,
    faq: improved.faq,
  });

  if (dryRun) {
    return { slug: note.slug, before: before.length, after: after.length, presentation, applied: false };
  }

  const errors = validateNoteDraft({
    content_kind: improved.content_kind,
    slug: improved.slug,
    seo_title: improved.seo_title,
    seo_description: improved.seo_description,
    quick_answer: improved.quick_answer,
    body_sections: improved.body_sections,
    body_paragraphs: flattenBodySections(improved.body_sections),
    faq: improved.faq,
    key_takeaways: improved.key_takeaways,
    official_links: improved.official_links,
  }).filter((e) => !e.startsWith("blueprint:"));

  if (errors.length > 0) {
    throw new Error(`${note.slug}: ${errors.join("; ")}`);
  }

  const sb = createServerClient();
  const { error } = await sb
    .from("community_notes")
    .update({
      quick_answer: improved.quick_answer,
      key_takeaways: improved.key_takeaways,
      body_sections: improved.body_sections,
      body_paragraphs: flattenBodySections(improved.body_sections),
      faq: improved.faq,
      excerpt: improved.excerpt,
      source_label: note.source_label?.includes("readability-pass")
        ? note.source_label
        : [note.source_label, "readability-pass"].filter(Boolean).join("+"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", note.id);
  if (error) throw new Error(error.message);

  return { slug: note.slug, before: before.length, after: after.length, presentation, applied: true };
}

async function main() {
  const args = process.argv.slice(2);
  const auditOnly = args.includes("--audit");
  const dryRun = args.includes("--dry-run");
  const allMode = args.includes("--all");
  const republishHand = args.includes("--republish-hand");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  if (republishHand) {
    console.log(`[readability] republishing ${HAND_GUIDES.length} hand guides…\n`);
    for (const guide of HAND_GUIDES) {
      await publishHandGuide(guide);
      console.log("");
    }
    return;
  }

  if (auditOnly) {
    console.log("=== hand guides (source .ts) ===");
    for (const guide of HAND_GUIDES) {
      const raw = collectTelegraphic(guide);
      const fixed = collectTelegraphic(applyReadabilityToDraft(guide));
      console.log(`${guide.slug}: telegraphic ${raw.length} → ${fixed.length}`);
      for (const h of raw.slice(0, 2)) console.log(`  - ${h}`);
    }
    console.log("\n=== DB guides ===");
    const notes = await loadNotes();
    for (const note of notes.filter((n) => n.content_kind === "guide")) {
      const hits = collectTelegraphic(note);
      const hand = SKIP_REWRITE_SLUGS.has(note.slug) ? "hand" : "cron";
      console.log(`${note.slug} [${hand}]: ${hits.length} telegraphic`);
    }
    return;
  }

  const notes = await loadNotes(slugArg);
  const queue = allMode
    ? notes.filter((n) => n.content_kind === "guide" && !SKIP_REWRITE_SLUGS.has(n.slug))
    : notes;

  console.log(`[readability-pass] processing ${queue.length} DB guides (dry=${dryRun})\n`);

  let updated = 0;
  for (const note of queue) {
    try {
      const result = await applyToNote(note, dryRun);
      console.log(
        `[${dryRun ? "dry" : "apply"}] ${result.slug}: telegraphic ${result.before}→${result.after}, score=${result.presentation.score}`
      );
      if (result.applied) updated += 1;
    } catch (e) {
      console.error(`[error] ${note.slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  console.log(`\n=== done: ${updated} updated ===`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Upsert hand-curated Spain editorial guides into community_notes.
 *
 *   npm run spain:upsert-editorial
 *   npm run spain:upsert-editorial -- --dry-run
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  flattenBodySections,
  normalizeNoteDraftSeo,
  validateNoteDraft,
} from "@/lib/community-notes/editorial-quality";
import { validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { applyReadabilityToDraft } from "@/lib/community-notes/editorial-readability";
import { SPAIN_EDITORIAL_GUIDES } from "@/lib/community-notes/guides/spain-editorial-index";
import { ensureSectionVoiceClose } from "@/lib/community-notes/voice-transforms";
import { createServerClient } from "@/lib/supabase/server";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let upserted = 0;
  let skipped = 0;

  for (const guide of SPAIN_EDITORIAL_GUIDES) {
    const seo = normalizeNoteDraftSeo({
      seo_title: guide.seo_title,
      seo_description: guide.seo_description,
    });
    const readable = applyReadabilityToDraft({
      ...guide,
      ...seo,
    });
    const body_sections = (readable.body_sections ?? []).map(ensureSectionVoiceClose);
    const draft = {
      ...readable,
      body_sections,
      body_paragraphs: flattenBodySections(body_sections),
    };

    const gateErrors = validateNoteDraft(
      { ...draft, official_links: guide.official_links },
      "spain"
    );
    if (gateErrors.length > 0) {
      console.warn(`[skip] ${guide.slug} quality gate: ${gateErrors.join("; ")}`);
      skipped += 1;
      continue;
    }

    if (draft.content_kind === "guide") {
      const blueprint = validateAgainstBlueprint(
        {
          content_kind: draft.content_kind,
          slug: draft.slug,
          quick_answer: draft.quick_answer,
          seo_description: draft.seo_description,
          body_sections: draft.body_sections,
          key_takeaways: draft.key_takeaways,
          faq: draft.faq,
          official_links: guide.official_links,
        },
        "spain"
      );
      if (blueprint.errors.length > 0) {
        console.warn(`[skip] ${guide.slug} blueprint: ${blueprint.errors.join("; ")}`);
        skipped += 1;
        continue;
      }
    }

    const row = {
      slug: draft.slug,
      category: draft.category,
      content_kind: draft.content_kind,
      title: draft.title,
      excerpt: draft.excerpt,
      seo_title: draft.seo_title,
      seo_description: draft.seo_description,
      quick_answer: draft.quick_answer,
      body_sections: draft.body_sections,
      body_paragraphs: draft.body_paragraphs,
      key_takeaways: draft.key_takeaways,
      faq: draft.faq,
      official_links: guide.official_links,
      topic_tags: guide.topic_tags,
      hashtags: guide.hashtags,
      country_key: "spain",
      city: "valencia",
      source_channel: guide.source_channel,
      source_label: guide.source_label ?? "editorial:spain-seed",
      status: "published",
      published_at: now,
      updated_at: now,
    };

    if (dryRun) {
      console.log(`[dry-run] would upsert ${guide.slug}`);
      upserted += 1;
      continue;
    }

    const { error } = await supabase.from("community_notes").upsert(row, { onConflict: "slug" });
    if (error) {
      console.warn(`[fail] ${guide.slug}: ${error.message}`);
      skipped += 1;
    } else {
      console.log(`[upsert] ${guide.slug}`);
      upserted += 1;
    }
  }

  console.log(`[done] upserted=${upserted} skipped=${skipped}${dryRun ? " (dry-run)" : ""}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

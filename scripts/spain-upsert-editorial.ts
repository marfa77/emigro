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
import { SPAIN_EDITORIAL_GUIDES } from "@/lib/community-notes/guides/spain-editorial-index";
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
    const draft = {
      ...guide,
      ...seo,
      body_paragraphs: flattenBodySections(guide.body_sections),
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

    if (guide.content_kind === "guide") {
      const blueprint = validateAgainstBlueprint(
        {
          content_kind: guide.content_kind,
          slug: guide.slug,
          quick_answer: guide.quick_answer,
          seo_description: seo.seo_description,
          body_sections: guide.body_sections,
          key_takeaways: guide.key_takeaways,
          faq: guide.faq,
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
      slug: guide.slug,
      category: guide.category,
      content_kind: guide.content_kind,
      title: guide.title,
      excerpt: guide.excerpt,
      seo_title: seo.seo_title,
      seo_description: seo.seo_description,
      quick_answer: guide.quick_answer,
      body_sections: guide.body_sections,
      body_paragraphs: draft.body_paragraphs,
      key_takeaways: guide.key_takeaways,
      faq: guide.faq,
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

/** Archive off-topic notes, fix categories/links/hashtags, sanitize SNS/utente copy. */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { repairNoteContent, repairNoteRow } from "@/lib/community-notes/repair-note";
import { sanitizeSnsFields, validateSnsUtenteCopy, snsTextsFromDraft } from "@/lib/community-notes/sns-editorial";
import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

async function main() {
  ensurePortugalCronEnv();
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select(
      "id, slug, title, status, content_kind, topic_tags, hashtags, quick_answer, excerpt, seo_description, key_takeaways, body_paragraphs, body_sections, faq"
    )
    .eq("country_key", "portugal");

  if (error) throw new Error(error.message);

  let archived = 0;
  let repaired = 0;
  let snsFixed = 0;
  let contentFixed = 0;

  for (const row of data ?? []) {
    const patch = repairNoteRow({
      slug: String(row.slug),
      title: String(row.title),
      status: String(row.status),
      content_kind: (row.content_kind as ContentKind) ?? "guide",
      topic_tags: (row.topic_tags as string[]) ?? [],
      hashtags: (row.hashtags as string[]) ?? [],
    });

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    let noteSnsFixed = false;
    let contentChanged = false;
    if (patch.status === "archived") {
      update.status = "archived";
      archived += 1;
    } else if (row.status === "published") {
      update.category = patch.category;
      update.topic_tags = patch.topic_tags;
      update.official_links = patch.official_links;
      update.hashtags = patch.hashtags;
      repaired += 1;

      const bodySections = (row.body_sections as NoteBodySection[]) ?? [];
      const faq = (row.faq as CommunityNoteFaq[]) ?? [];
      const sns = sanitizeSnsFields({
        quick_answer: String(row.quick_answer ?? ""),
        key_takeaways: (row.key_takeaways as string[]) ?? [],
        body_paragraphs: (row.body_paragraphs as string[]) ?? [],
        body_sections: bodySections,
        faq,
      });
      if (sns.changed) {
        update.quick_answer = sns.patch.quick_answer;
        update.key_takeaways = sns.patch.key_takeaways;
        update.body_paragraphs = sns.patch.body_paragraphs;
        update.body_sections = sns.patch.body_sections;
        if (sns.patch.faq) update.faq = sns.patch.faq;
        noteSnsFixed = true;
        snsFixed += 1;
      }

      const content = repairNoteContent({
        content_kind: (row.content_kind as ContentKind) ?? "guide",
        quick_answer: String(update.quick_answer ?? row.quick_answer ?? ""),
        excerpt: String(row.excerpt ?? ""),
        seo_description: String(row.seo_description ?? ""),
        key_takeaways: (update.key_takeaways ?? row.key_takeaways) as string[],
        body_paragraphs: (update.body_paragraphs ?? row.body_paragraphs) as string[],
        body_sections: (update.body_sections ?? bodySections) as NoteBodySection[],
        faq: (update.faq ?? faq) as CommunityNoteFaq[],
      });
      if (content.changed) {
        Object.assign(update, content.patch);
        contentChanged = true;
        contentFixed += 1;
      }

      const remainingBodySections = (update.body_sections ?? bodySections) as NoteBodySection[];
      const remaining = validateSnsUtenteCopy(
        snsTextsFromDraft({
          quick_answer: String(update.quick_answer ?? row.quick_answer ?? ""),
          key_takeaways: (update.key_takeaways ?? row.key_takeaways) as string[],
          body_paragraphs: (update.body_paragraphs ?? row.body_paragraphs) as string[],
          body_sections: remainingBodySections,
          faq: (update.faq ?? faq) as CommunityNoteFaq[],
        })
      );
      if (remaining.length > 0) {
        console.warn(`[repair] ${row.slug} sns warnings after sanitize: ${remaining.join("; ")}`);
      }
    }

    await supabase.from("community_notes").update(update).eq("id", row.id);
    const tag =
      patch.status === "archived"
        ? "archived"
        : noteSnsFixed && contentChanged
          ? "sns+content+meta"
          : noteSnsFixed
            ? "sns+meta"
            : contentChanged
              ? "content+meta"
              : patch.status === "published"
                ? "meta"
                : "—";
    console.log(`[repair] ${row.slug} → ${tag}`);
  }

  const spotlight = await refreshDailySpotlight("portugal");
  console.log(`\nDone: ${repaired} meta, ${contentFixed} content, ${snsFixed} sns copy, ${archived} archived`);
  console.log("[spotlight]", spotlight?.note_slug);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

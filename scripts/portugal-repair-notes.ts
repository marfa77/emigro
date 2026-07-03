/** Archive off-topic notes, fix categories/links/hashtags on published notes. */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { repairNoteRow } from "@/lib/community-notes/repair-note";
import { createServerClient } from "@/lib/supabase/server";
import type { ContentKind } from "@/lib/community-notes/types";

async function main() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_notes")
    .select("id, slug, title, status, content_kind, topic_tags, hashtags")
    .eq("country_key", "portugal");

  if (error) throw new Error(error.message);

  let archived = 0;
  let repaired = 0;

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
    if (patch.status === "archived") {
      update.status = "archived";
      archived += 1;
    } else if (row.status === "published") {
      update.category = patch.category;
      update.topic_tags = patch.topic_tags;
      update.official_links = patch.official_links;
      update.hashtags = patch.hashtags;
      repaired += 1;
    }

    await supabase.from("community_notes").update(update).eq("id", row.id);
    console.log(`[repair] ${row.slug} → ${patch.status === "archived" ? "archived" : (patch.hashtags ?? []).join(", ")}`);
  }

  console.log(`\nDone: ${repaired} repaired, ${archived} archived`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

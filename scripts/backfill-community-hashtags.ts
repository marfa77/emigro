/** Backfill hashtags + content_kind on existing community_notes. */
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
    .select("id, slug, title, status, content_kind, topic_tags, hashtags");

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    const patch = repairNoteRow({
      slug: String(row.slug),
      title: String(row.title),
      status: String(row.status),
      content_kind: (row.content_kind as ContentKind) ?? "guide",
      topic_tags: (row.topic_tags as string[]) ?? [],
      hashtags: (row.hashtags as string[]) ?? [],
    });

    if (row.status !== "published" || patch.status === "archived") continue;

    await supabase
      .from("community_notes")
      .update({
        category: patch.category,
        topic_tags: patch.topic_tags,
        official_links: patch.official_links,
        hashtags: patch.hashtags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    console.log(`[backfill] ${row.slug} → ${(patch.hashtags ?? []).join(", ")}`);
  }
}

main().catch(console.error);

/** Backfill hashtags + content_kind on existing community_notes. */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { createServerClient } from "@/lib/supabase/server";
import type { ContentKind } from "@/lib/community-notes/types";

async function main() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("community_notes").select("id, slug, topic_tags, content_kind, hashtags");

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    const kind = (row.content_kind as ContentKind) ?? "guide";
    const tags = (row.topic_tags as string[]) ?? [];
    const hashtags = buildNoteHashtags({ topicTags: tags, contentKind: kind });

    await supabase
      .from("community_notes")
      .update({ content_kind: kind, hashtags, updated_at: new Date().toISOString() })
      .eq("id", row.id);

    console.log(`[backfill] ${row.slug} → ${hashtags.join(", ")}`);
  }
}

main().catch(console.error);

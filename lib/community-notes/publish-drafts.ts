import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { clusterSignals, draftNoteFromCluster } from "@/lib/community-notes/draft-from-signals";
import {
  isDuplicateTopic,
  latestSignalPostedAt,
  shouldAutoPublishCluster,
} from "@/lib/community-notes/editorial-filter";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";
import { filterRelocantSignals } from "@/lib/satellite/portugal";
import { createServerClient } from "@/lib/supabase/server";

export type PublishDraftsResult = {
  clusters: number;
  published: string[];
  skipped: string[];
  blockedPractice: string[];
  errors: string[];
};

async function loadNewSignals(limit = 120): Promise<CommunitySignalIngest[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("community_signals")
    .select("*")
    .eq("status", "new")
    .eq("country_key", "portugal")
    .order("posted_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return filterRelocantSignals(
    (data ?? []).map((row) => ({
      message_id: Number(row.message_id),
      channel_username: String(row.channel_username),
      channel_title: row.channel_title ? String(row.channel_title) : undefined,
      post_url: row.post_url ? String(row.post_url) : undefined,
      text: String(row.text),
      topic_hints: (row.topic_hints as string[]) ?? [],
      content_kind: (row.content_kind as CommunitySignalIngest["content_kind"]) ?? "tip",
      hashtags: (row.hashtags as string[]) ?? [],
      city: String(row.city),
      country_key: String(row.country_key),
      posted_at: String(row.posted_at),
    }))
  );
}

/** Gemini editorial drafts from `community_signals` with status=new. */
export async function publishDraftsFromNewSignals(maxNotes: number): Promise<PublishDraftsResult> {
  ensurePortugalCronEnv();
  const result: PublishDraftsResult = {
    clusters: 0,
    published: [],
    skipped: [],
    blockedPractice: [],
    errors: [],
  };

  const signals = await loadNewSignals();
  if (signals.length === 0) return result;

  const clusters = clusterSignals(signals)
    .filter((c) => shouldAutoPublishCluster(c))
    .slice(0, maxNotes);

  result.clusters = clusters.length;
  const supabase = createServerClient();

  const { data: existingNotes } = await supabase
    .from("community_notes")
    .select("topic_tags")
    .eq("country_key", "portugal")
    .eq("status", "published");

  const existingTopics = new Set(
    (existingNotes ?? []).flatMap((n) => ((n.topic_tags as string[]) ?? []).map((t) => t.toLowerCase()))
  );

  for (const cluster of clusters) {
    try {
      const draft = await draftNoteFromCluster(cluster);
      const primaryTopic = draft.topic_tags[0] ?? "general";

      if (isDuplicateTopic(primaryTopic, existingTopics, draft.title)) {
        result.skipped.push(`${draft.slug}:duplicate-topic`);
        continue;
      }

      const { data: existing } = await supabase
        .from("community_notes")
        .select("id")
        .eq("slug", draft.slug)
        .maybeSingle();

      if (existing) {
        result.skipped.push(draft.slug);
        continue;
      }

      const publishedAt = latestSignalPostedAt(cluster.signals);
      const now = new Date().toISOString();
      const { error: insertError } = await supabase.from("community_notes").insert({
        ...draft,
        country_key: "portugal",
        city: cluster.signals[0]?.city ?? "porto",
        status: "published",
        published_at: publishedAt,
        updated_at: now,
      });

      if (insertError) {
        result.errors.push(`${draft.slug}: ${insertError.message}`);
        continue;
      }

      const ids = cluster.signals.map((s) => s.message_id);
      await supabase
        .from("community_signals")
        .update({ status: "reviewed", updated_at: now })
        .eq("country_key", "portugal")
        .in("message_id", ids);

      result.published.push(draft.slug);
      existingTopics.add(primaryTopic);

      try {
        const og = await ensureNoteOgImage(draft);
        console.log(
          `[publish] og-image ${draft.slug}: ${og.path}${og.generated ? " (generated)" : ""}${
            og.manifestAppended ? " (manifest)" : ""
          }`
        );
        if (!og.generated && og.path.includes("/api/community-notes/hero/")) {
          console.log(`[publish] og-image ${draft.slug}: Vercel cron will warm dynamic hero`);
        }
      } catch (ogError) {
        const msg = ogError instanceof Error ? ogError.message : "og image failed";
        result.errors.push(`${draft.slug}: og-image: ${msg}`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "draft failed";
      if (/practice|official\/practice/i.test(message)) {
        const label = `${cluster.topic}:blocked-thin-practice`;
        result.blockedPractice.push(label);
        console.warn(`[publish] blocked — thin practice for ${cluster.topic}: ${message}`);
      } else {
        result.errors.push(message);
      }
    }
  }

  return result;
}

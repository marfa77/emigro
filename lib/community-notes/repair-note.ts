import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  ARCHIVE_SLUGS,
  reconcileTopic,
} from "@/lib/community-notes/editorial-filter";
import { TOPIC_LABELS, TOPIC_OFFICIAL_LINKS } from "@/lib/community-notes/editorial-voice";
import type { CommunityNote, ContentKind } from "@/lib/community-notes/types";

export type NoteRepairPatch = {
  slug: string;
  status?: "published" | "archived";
  category?: string;
  topic_tags?: string[];
  official_links?: Array<{ title: string; url: string }>;
  hashtags?: string[];
};

export function repairNoteRow(row: {
  slug: string;
  title: string;
  status: string;
  content_kind: ContentKind;
  topic_tags: string[];
  hashtags: string[];
}): NoteRepairPatch {
  const patch: NoteRepairPatch = { slug: row.slug };

  if (ARCHIVE_SLUGS.has(row.slug)) {
    patch.status = "archived";
    return patch;
  }

  const primaryHint = row.topic_tags.find((t) => t !== "portugal") ?? "general";
  const topic = reconcileTopic(primaryHint, row.title, row.slug);
  const topicTags = topic === "general" ? ["portugal"] : [topic, "portugal"];

  patch.category = TOPIC_LABELS[topic] ?? "Быт в Португалии";
  patch.topic_tags = topicTags;
  patch.official_links = TOPIC_OFFICIAL_LINKS[topic] ?? TOPIC_OFFICIAL_LINKS.general;
  patch.hashtags = buildNoteHashtags({ topicTags, contentKind: row.content_kind });

  return patch;
}

export function getRelatedNotes(note: CommunityNote, allNotes: CommunityNote[], limit = 3): CommunityNote[] {
  const topicSet = new Set(note.topic_tags.map((t) => t.toLowerCase()).filter((t) => t !== "portugal"));
  const tagSet = new Set(note.hashtags.map((t) => t.toLowerCase()));

  return allNotes
    .filter((n) => n.slug !== note.slug)
    .map((n) => {
      let score = 0;
      for (const t of n.topic_tags) {
        if (topicSet.has(t.toLowerCase())) score += 3;
      }
      for (const t of n.hashtags) {
        if (tagSet.has(t.toLowerCase())) score += 1;
      }
      if (n.content_kind === note.content_kind) score += 1;
      return { n, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.n);
}

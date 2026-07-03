import { TOPIC_OFFICIAL_LINKS } from "@/lib/community-notes/editorial-voice";
import type { CommunityNoteLink } from "@/lib/community-notes/types";

/** Slugs that span multiple relocation topics — merge official links. */
const MULTI_TOPIC_SLUGS: Record<string, string[]> = {
  "pervyj-mesyac-portugaliya-checklist": ["nif", "bank", "sns", "arenda", "aima"],
};

export function officialLinksForNote(slug: string, primaryTopic: string): CommunityNoteLink[] {
  const topics = MULTI_TOPIC_SLUGS[slug] ?? [primaryTopic];
  const seen = new Set<string>();
  const links: CommunityNoteLink[] = [];

  for (const topic of topics) {
    for (const link of TOPIC_OFFICIAL_LINKS[topic] ?? []) {
      if (seen.has(link.url)) continue;
      seen.add(link.url);
      links.push(link);
    }
  }

  if (links.length === 0) {
    return TOPIC_OFFICIAL_LINKS[primaryTopic] ?? TOPIC_OFFICIAL_LINKS.general;
  }
  return links.slice(0, 6);
}

export function topicTagsForNote(slug: string, primaryTopic: string): string[] {
  const topics = MULTI_TOPIC_SLUGS[slug];
  if (!topics) return primaryTopic === "general" ? ["portugal"] : [primaryTopic, "portugal"];
  return [...topics, "portugal"];
}

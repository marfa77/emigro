import { listGuides, type GuideFrontmatter } from "@/lib/guides/load";

export function listGuidesForTopic(topicKey: string, corridorSlug?: string | null): GuideFrontmatter[] {
  const key = topicKey.toLowerCase();
  return listGuides().filter((guide) => {
    const topics = (guide.topic_keys ?? []).map((k) => k.toLowerCase());
    if (topics.includes(key)) return true;
    if (corridorSlug && guide.corridor_slugs?.includes(corridorSlug)) return true;
    return false;
  });
}

export function countGuidesForTopic(topicKey: string, corridorSlug?: string | null): number {
  return listGuidesForTopic(topicKey, corridorSlug).length;
}

export function guidesTopicFilterHref(topicKey: string): string {
  return `/ru/guides?topic=${encodeURIComponent(topicKey)}`;
}

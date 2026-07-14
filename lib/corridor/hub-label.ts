import type { NewsTopicConfig } from "@/lib/news/topics/types";

export function corridorHubLabel(topic: NewsTopicConfig): string {
  return `${topic.flag} ${topic.countryRu} Hub`;
}

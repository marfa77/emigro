import type { NewsTopicConfig } from "@/lib/news/topics";
import { getNewsTopicByCorridorSlug, resolveNewsTopicFromParam } from "@/lib/news/topics";
import { isCorridorFull, isCorridorOnSite } from "@/lib/corridor/publish";

/** Resolve corridor slug from public URL segment (e.g. spain → ru-speaking-to-spain). */
export async function getTopicByCountrySegment(country: string): Promise<NewsTopicConfig | null> {
  return resolveNewsTopicFromParam(country);
}

export async function getCorridorSlugForCountry(country: string): Promise<string | null> {
  const topic = await getTopicByCountrySegment(country);
  return topic?.corridorSlug ?? null;
}

/** Corridor landing / digest — active or in_development. */
export async function requirePublishedCorridorTopic(country: string): Promise<NewsTopicConfig> {
  const topic = await getTopicByCountrySegment(country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.landing) {
    throw new Error(`Corridor not available for: ${country}`);
  }
  return topic;
}

/** Wizard, programs, results — active only. */
export async function requireActiveCorridorTopic(country: string): Promise<NewsTopicConfig> {
  const topic = await getTopicByCountrySegment(country);
  if (!topic?.corridorSlug || !isCorridorFull(topic.status) || !topic.sitePaths?.wizard) {
    throw new Error(`Corridor not available for: ${country}`);
  }
  return topic;
}

export { getNewsTopicByCorridorSlug };

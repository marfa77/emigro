import { CorridorHubStack } from "@/components/corridor/hub/CorridorHubStack";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { PORTUGAL_URL_SEGMENT } from "@/lib/portugal/hub";

export async function PortugalHubStack() {
  const topic = await getTopicByCountrySegment(PORTUGAL_URL_SEGMENT);
  if (!topic) return null;
  return <CorridorHubStack topic={topic} />;
}

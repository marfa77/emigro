import { CorridorHubPulse } from "@/components/corridor/hub/CorridorHubPulse";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { PORTUGAL_URL_SEGMENT } from "@/lib/portugal/hub";

export async function PortugalHubPulse() {
  const topic = await getTopicByCountrySegment(PORTUGAL_URL_SEGMENT);
  if (!topic) return null;
  return <CorridorHubPulse topic={topic} />;
}

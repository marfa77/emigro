import { CorridorHubShell } from "@/components/corridor/hub/CorridorHubShell";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { PORTUGAL_URL_SEGMENT, type PortugalHubTab } from "@/lib/portugal/hub";

type Props = {
  active: PortugalHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

export async function PortugalHubShell({ active, variant = "corridor", className = "mt-6" }: Props) {
  const topic = await getTopicByCountrySegment(PORTUGAL_URL_SEGMENT);
  if (!topic) return null;
  return <CorridorHubShell topic={topic} active={active} variant={variant} className={className} />;
}

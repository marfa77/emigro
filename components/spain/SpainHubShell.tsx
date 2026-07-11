import { CorridorHubShell } from "@/components/corridor/hub/CorridorHubShell";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { SPAIN_URL_SEGMENT, type SpainHubTab } from "@/lib/spain/hub";

type Props = {
  active: SpainHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

export async function SpainHubShell({ active, variant = "corridor", className = "mt-6" }: Props) {
  const topic = await getTopicByCountrySegment(SPAIN_URL_SEGMENT);
  if (!topic) return null;
  return <CorridorHubShell topic={topic} active={active} variant={variant} className={className} />;
}

import { CorridorHubShell } from "@/components/corridor/hub/CorridorHubShell";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { ITALY_URL_SEGMENT, type ItalyHubTab } from "@/lib/italy/hub";

type Props = {
  active: ItalyHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

export async function ItalyHubShell({ active, variant = "corridor", className = "mt-6" }: Props) {
  const topic = await getTopicByCountrySegment(ITALY_URL_SEGMENT);
  if (!topic) return null;
  return <CorridorHubShell topic={topic} active={active} variant={variant} className={className} />;
}

import { CorridorHubNav } from "@/components/corridor/hub/CorridorHubNav";
import type { CorridorHubTab } from "@/lib/corridor/hub";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

type Props = {
  topic: NewsTopicConfig;
  active: CorridorHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

export function CorridorHubShell({ topic, active, variant = "corridor", className = "mt-6" }: Props) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <CorridorHubNav topic={topic} active={active} variant={variant} />
    </div>
  );
}

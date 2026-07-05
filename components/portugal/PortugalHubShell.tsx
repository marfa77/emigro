import { PortugalHubNav } from "@/components/portugal/PortugalHubNav";
import type { PortugalHubTab } from "@/lib/portugal/hub";

type Props = {
  active: PortugalHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

export function PortugalHubShell({ active, variant = "corridor", className = "mt-6" }: Props) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <PortugalHubNav active={active} variant={variant} />
    </div>
  );
}

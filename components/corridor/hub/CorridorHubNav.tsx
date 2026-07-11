import Link from "next/link";
import {
  corridorHubLabel,
  corridorHubNavItems,
  type CorridorHubTab,
} from "@/lib/corridor/hub";
import { isSpainHubTopic } from "@/lib/spain/hub";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import { mobileScrollRow } from "@/lib/ui/mobile";

type Props = {
  topic: NewsTopicConfig;
  active: CorridorHubTab;
  variant?: "corridor" | "satellite";
  className?: string;
};

function hubNavItemClass(isActive: boolean, isSatellite: boolean, isSpain: boolean): string {
  const base = "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition";
  if (isActive) {
    if (isSatellite) {
      return isSpain ? `${base} bg-amber-700 text-white` : `${base} bg-teal-700 text-white`;
    }
    return `${base} bg-corridor-600 text-white`;
  }
  if (isSatellite) {
    return isSpain
      ? `${base} border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-900`
      : `${base} border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800`;
  }
  return `${base} border border-slate-200 bg-white text-slate-700 hover:border-corridor-300 hover:text-corridor-800`;
}

export function CorridorHubNav({ topic, active, variant = "corridor", className }: Props) {
  const items = corridorHubNavItems(topic, undefined, variant);
  const isSatellite = variant === "satellite";
  const isSpain = isSpainHubTopic(topic);

  return (
    <nav className={`${mobileScrollRow} ${className ?? ""}`} aria-label={corridorHubLabel(topic)}>
      <p
        className={`mr-1 w-full text-xs font-semibold uppercase tracking-wide sm:w-auto sm:self-center ${
          isSatellite ? (isSpain ? "text-amber-800" : "text-teal-700") : "text-corridor-700"
        }`}
      >
        {corridorHubLabel(topic)}
      </p>
      {items.map((item) => {
        const isActive = item.id === active;
        const itemClass = hubNavItemClass(isActive, isSatellite, isSpain);

        if (item.comingSoon) {
          return (
            <span
              key={item.id}
              className="shrink-0 rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-400"
              title="Скоро"
            >
              {item.label}
            </span>
          );
        }

        if (item.external) {
          return (
            <a
              key={item.id}
              href={item.href}
              target={isSatellite && item.id !== "market" ? undefined : "_blank"}
              rel={isSatellite && item.id !== "market" ? undefined : "noopener noreferrer"}
              className={itemClass}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </a>
          );
        }

        return (
          <Link key={item.id} href={item.href} className={itemClass} aria-current={isActive ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

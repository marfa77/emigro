import Link from "next/link";
import {
  portugalHubNavItems,
  type PortugalHubTab,
} from "@/lib/portugal/hub";

type Props = {
  active: PortugalHubTab;
  /** corridor = emigro.online; satellite = portugal.emigro.online */
  variant?: "corridor" | "satellite";
  className?: string;
};

export function PortugalHubNav({ active, variant = "corridor", className }: Props) {
  const items = portugalHubNavItems();
  const isSatellite = variant === "satellite";

  return (
    <nav
      className={`flex flex-wrap gap-2 ${className ?? ""}`}
      aria-label="Portugal Hub"
    >
      <p
        className={`mr-1 w-full text-xs font-semibold uppercase tracking-wide sm:w-auto sm:self-center ${
          isSatellite ? "text-teal-700" : "text-corridor-700"
        }`}
      >
        🇵🇹 Portugal Hub
      </p>
      {items.map((item) => {
        const isActive = item.id === active;
        const itemClass = isActive
          ? isSatellite
            ? "rounded-full bg-teal-700 px-3 py-1.5 text-sm font-medium text-white transition"
            : "rounded-full bg-corridor-600 px-3 py-1.5 text-sm font-medium text-white transition"
          : isSatellite
            ? "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
            : "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-corridor-300 hover:text-corridor-800";

        if (item.external) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClass}
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

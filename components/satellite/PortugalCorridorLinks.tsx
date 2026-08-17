import Link from "next/link";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { portugalHubPath } from "@/lib/satellite/paths";

/**
 * Visible corridor CTAs for satellite notes — strengthens crawl→index by linking
 * thin practice notes into indexed www money URLs (wizard / pillar / hub).
 */
export function PortugalCorridorLinks({ noteTitle }: { noteTitle?: string }) {
  return (
    <aside
      className="mt-8 rounded-xl border border-teal-100 bg-teal-50/60 p-5"
      aria-label="Коридор Emigro"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
        Дальше на Emigro
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {noteTitle
          ? `После «${noteTitle.slice(0, 80)}${noteTitle.length > 80 ? "…" : ""}» — проверьте маршрут ВНЖ и практику на основном сайте.`
          : "Практика на сателлите + маршрут ВНЖ на основном Emigro."}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <a
            href={PORTUGAL_SATELLITE.wizardUrl}
            className="font-medium text-teal-800 underline hover:text-teal-950"
          >
            Визард Португалия (D8/D7 и сценарии)
          </a>
        </li>
        <li>
          <a
            href={PORTUGAL_SATELLITE.pillarGuideUrl}
            className="font-medium text-teal-800 underline hover:text-teal-950"
          >
            Pillar-гид D8/D7 и гражданство 2026
          </a>
        </li>
        <li>
          <a
            href={PORTUGAL_SATELLITE.mainSiteUrl}
            className="font-medium text-teal-800 underline hover:text-teal-950"
          >
            Хаб /ru/portugal
          </a>
        </li>
        <li>
          <Link
            href={portugalHubPath()}
            className="font-medium text-teal-800 underline hover:text-teal-950"
          >
            Все заметки Norte (хаб сателлита)
          </Link>
        </li>
      </ul>
    </aside>
  );
}

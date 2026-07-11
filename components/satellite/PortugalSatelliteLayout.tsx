import Link from "next/link";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { mainSiteUrl, portugalHubPath } from "@/lib/satellite/paths";
import { spainHubPaths } from "@/lib/spain/hub";
import { PortugalHubShell } from "@/components/portugal/PortugalHubShell";
import { portugalHubPaths } from "@/lib/portugal/hub";
import { layoutContain, safeAreaTopStyle } from "@/lib/ui/mobile";

const MAIN_HUB_URL = mainSiteUrl(portugalHubPaths.landing);
const SPAIN_HUB_URL = mainSiteUrl(spainHubPaths.landing);

export function PortugalSatelliteHeader() {
  return (
    <header
      className="border-b border-slate-200 bg-white"
      style={safeAreaTopStyle}
    >
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Emigro · {PORTUGAL_SATELLITE.countryRu}</p>
            <Link href={portugalHubPath()} className="text-lg font-semibold text-slate-900 hover:text-teal-800">
              {PORTUGAL_SATELLITE.title}
            </Link>
          </div>
          <a
            href={MAIN_HUB_URL}
            className="shrink-0 text-xs text-slate-600 hover:text-teal-700 sm:text-sm"
          >
            emigro.online/ru/portugal
          </a>
        </div>
        <div className={layoutContain}>
          <PortugalHubShell active="practice" variant="satellite" className="mt-0 border-0 bg-transparent p-0" />
        </div>
      </div>
    </header>
  );
}

export function PortugalSatelliteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm text-slate-600">
        <div className={layoutContain}>
          <PortugalHubShell active="practice" variant="satellite" className="border-0 bg-transparent p-0" />
        </div>
        <p>
          Материалы на этом поддомене — <strong>редакционные заметки Emigro</strong>. Это не юридическая
          консультация; сверяйте сроки и суммы с{" "}
          <a href="https://aima.gov.pt/" className="text-teal-700 underline" target="_blank" rel="noopener noreferrer">
            AIMA
          </a>{" "}
          и{" "}
          <a
            href="https://www.portaldasfinancas.gov.pt/"
            className="text-teal-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Finanças
          </a>
          .
        </p>
        <p>
          Основной hub:{" "}
          <a href={MAIN_HUB_URL} className="text-teal-700 underline">
            emigro.online/ru/portugal
          </a>
          {" · "}
          <a href={SPAIN_HUB_URL} className="text-slate-500 underline hover:text-slate-700">
            Испания
          </a>
        </p>
      </div>
    </footer>
  );
}

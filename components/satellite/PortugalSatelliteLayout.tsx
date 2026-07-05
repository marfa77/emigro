import Link from "next/link";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { mainSiteUrl, portugalHubPath } from "@/lib/satellite/paths";
import { PortugalHubShell } from "@/components/portugal/PortugalHubShell";
import { portugalHubPaths } from "@/lib/portugal/hub";

const MAIN_HUB_URL = mainSiteUrl(portugalHubPaths.landing);

export function PortugalSatelliteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Emigro · Лиссабон</p>
            <Link href={portugalHubPath()} className="text-lg font-semibold text-slate-900 hover:text-teal-800">
              {PORTUGAL_SATELLITE.title}
            </Link>
          </div>
          <a href={MAIN_HUB_URL} className="text-sm text-slate-600 hover:text-teal-700">
            emigro.online/ru/portugal
          </a>
        </div>
        <PortugalHubShell active="practice" variant="satellite" className="mt-0 border-0 bg-transparent p-0" />
      </div>
    </header>
  );
}

export function PortugalSatelliteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm text-slate-600">
        <PortugalHubShell active="practice" variant="satellite" className="border-0 bg-transparent p-0" />
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
        </p>
      </div>
    </footer>
  );
}

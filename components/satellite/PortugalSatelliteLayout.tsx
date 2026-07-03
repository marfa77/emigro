import Link from "next/link";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";

export function PortugalSatelliteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Emigro · Лиссабон</p>
          <Link href="/" className="text-lg font-semibold text-slate-900 hover:text-teal-800">
            {PORTUGAL_SATELLITE.title}
          </Link>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600" aria-label="Satellite navigation">
          <a href={PORTUGAL_SATELLITE.mainSiteUrl} className="hover:text-teal-700">
            Коридор PT
          </a>
          <a href={PORTUGAL_SATELLITE.wizardUrl} className="hover:text-teal-700">
            Wizard
          </a>
        </nav>
      </div>
    </header>
  );
}

export function PortugalSatelliteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8 text-sm text-slate-600">
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
          Основной сайт:{" "}
          <a href={PORTUGAL_SATELLITE.mainSiteUrl} className="text-teal-700 underline">
            emigro.online/ru/portugal
          </a>
        </p>
      </div>
    </footer>
  );
}

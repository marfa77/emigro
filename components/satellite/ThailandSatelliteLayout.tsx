import Link from "next/link";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import { mainSiteUrl, thailandHubPath } from "@/lib/satellite/paths";
import { layoutContain, safeAreaTopStyle } from "@/lib/ui/mobile";

const MAIN_HUB_URL = mainSiteUrl("/ru/thailand");
const PILLAR_URL = mainSiteUrl("/ru/guides/tailand-dlya-rossiyan-2026");
const WIZARD_URL = mainSiteUrl("/ru/wizard");

function SatelliteNav() {
  return (
    <nav className={`${layoutContain} flex flex-wrap gap-x-4 gap-y-2 text-sm`} aria-label="Таиланд">
      <Link href={thailandHubPath()} className="font-medium text-indigo-950 underline">
        Практика
      </Link>
      <a href={MAIN_HUB_URL} className="text-slate-600 underline hover:text-indigo-950">
        Хаб Таиланда
      </a>
      <a href={PILLAR_URL} className="text-slate-600 underline hover:text-indigo-950">
        Гайд 2026
      </a>
      <a href={WIZARD_URL} className="text-slate-600 underline hover:text-indigo-950">
        Wizard
      </a>
    </nav>
  );
}

export function ThailandSatelliteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white" style={safeAreaTopStyle}>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-800">
              Emigro · {THAILAND_SATELLITE.countryRu}
            </p>
            <Link href={thailandHubPath()} className="text-lg font-semibold text-slate-900 hover:text-indigo-950">
              {THAILAND_SATELLITE.title}
            </Link>
          </div>
          <a href={MAIN_HUB_URL} className="shrink-0 text-xs text-slate-600 hover:text-indigo-950 sm:text-sm">
            emigro.online/ru/thailand
          </a>
        </div>
        <SatelliteNav />
      </div>
    </header>
  );
}

export function ThailandSatelliteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm text-slate-600">
        <SatelliteNav />
        <p>
          Материалы на этом поддомене — <strong>редакционные заметки Emigro</strong>. Это не юридическая
          консультация; визовые и миграционные условия сверяйте с{" "}
          <a
            href="https://www.immigration.go.th/"
            className="text-indigo-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Immigration Bureau Thailand
          </a>{" "}
          и официальным порталом{" "}
          <a
            href="https://www.thaievisa.go.th/"
            className="text-indigo-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thai e-Visa
          </a>
          .
        </p>
        <p>
          <a href={WIZARD_URL} className="font-medium text-indigo-900 underline">
            Подобрать маршрут →
          </a>
          {" · "}
          <a href={PILLAR_URL} className="text-indigo-900 underline">
            Таиланд для россиян 2026
          </a>
        </p>
      </div>
    </footer>
  );
}

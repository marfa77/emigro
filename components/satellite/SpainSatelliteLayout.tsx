import Link from "next/link";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { mainSiteUrl, spainHubPath } from "@/lib/satellite/paths";
import { spainHubPaths } from "@/lib/spain/hub";
import { SpainHubShell } from "@/components/spain/SpainHubShell";
import { layoutContain, safeAreaTopStyle } from "@/lib/ui/mobile";
import { portugalHubPaths } from "@/lib/portugal/hub";

const MAIN_HUB_URL = mainSiteUrl(spainHubPaths.landing);
const PORTUGAL_HUB_URL = mainSiteUrl(portugalHubPaths.landing);

export function SpainSatelliteHeader() {
  return (
    <header
      className="border-b border-slate-200 bg-white"
      style={safeAreaTopStyle}
    >
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-800">Emigro · {SPAIN_SATELLITE.countryRu}</p>
            <Link href={spainHubPath()} className="text-lg font-semibold text-slate-900 hover:text-amber-900">
              {SPAIN_SATELLITE.title}
            </Link>
          </div>
          <a
            href={MAIN_HUB_URL}
            className="shrink-0 text-xs text-slate-600 hover:text-amber-900 sm:text-sm"
          >
            emigro.online/ru/spain
          </a>
        </div>
        <div className={layoutContain}>
          <SpainHubShell active="practice" variant="satellite" className="mt-0 border-0 bg-transparent p-0" />
        </div>
      </div>
    </header>
  );
}

export function SpainSatelliteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm text-slate-600">
        <div className={layoutContain}>
          <SpainHubShell active="practice" variant="satellite" className="border-0 bg-transparent p-0" />
        </div>
        <p>
          Материалы на этом поддомене — <strong>редакционные заметки Emigro</strong>. Это не юридическая
          консультация; сверяйте сроки и суммы с{" "}
          <a
            href="https://extranjeros.inclusion.gob.es/"
            className="text-amber-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            extranjería
          </a>{" "}
          и{" "}
          <a
            href="https://www.agenciatributaria.gob.es/"
            className="text-amber-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia Tributaria
          </a>
          .
        </p>
        <p>
          <a href={SPAIN_SATELLITE.wizardUrl} className="font-medium text-amber-900 underline">
            Подобрать маршрут ВНЖ →
          </a>
          {" · "}
          Основной hub:{" "}
          <a href={MAIN_HUB_URL} className="text-amber-900 underline">
            emigro.online/ru/spain
          </a>
          {" · "}
          <a href={PORTUGAL_HUB_URL} className="text-slate-500 underline hover:text-slate-700">
            Португалия
          </a>
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { mainSiteUrl, italyHubPath } from "@/lib/satellite/paths";
import { italyHubPaths } from "@/lib/italy/hub";
import { ItalyHubShell } from "@/components/italy/ItalyHubShell";
import { layoutContain, safeAreaTopStyle } from "@/lib/ui/mobile";
import { portugalHubPaths } from "@/lib/portugal/hub";
import { spainHubPaths } from "@/lib/spain/hub";
import { ItalySatelliteRouteChrome } from "@/components/satellite/ItalySatelliteRouteChrome";

const MAIN_HUB_URL = mainSiteUrl(italyHubPaths.landing);
const PORTUGAL_HUB_URL = mainSiteUrl(portugalHubPaths.landing);
const SPAIN_HUB_URL = mainSiteUrl(spainHubPaths.landing);

export function ItalySatelliteHeader() {
  return (
    <header
      className="border-b border-slate-200 bg-white"
      style={safeAreaTopStyle}
    >
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">Emigro · {ITALY_SATELLITE.countryRu}</p>
            <Link href={italyHubPath()} className="text-lg font-semibold text-slate-900 hover:text-emerald-900">
              Emigro Italy · Milano &amp; Lake Como
            </Link>
          </div>
          <nav className="flex shrink-0 items-center gap-3 text-xs sm:text-sm" aria-label="Italy sections">
            <Link href="/en" className="font-semibold text-emerald-800 hover:text-emerald-950">
              Lake Como EN
            </Link>
            <a href={MAIN_HUB_URL} className="text-slate-600 hover:text-emerald-900">
              Relocation RU
            </a>
          </nav>
        </div>
        <ItalySatelliteRouteChrome
          english={null}
          russian={
            <div className={layoutContain}>
              <ItalyHubShell active="practice" variant="satellite" className="mt-0 border-0 bg-transparent p-0" />
            </div>
          }
        />
      </div>
    </header>
  );
}

export function ItalySatelliteFooter() {
  const englishFooter = (
      <footer className="mt-16 border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600 sm:px-6">
          <p>
            Lake Como guides are editorial content checked against official sources. Seasonal transport and opening
            hours can change; verify the linked operator page for your date. ComoStay accommodation links are
            commercial links to the owner&apos;s site.
          </p>
          <p className="mt-4">
            <Link href="/en" className="font-semibold text-emerald-900 underline">Lake Como guides</Link>
            {" · "}
            <a href={MAIN_HUB_URL} className="text-emerald-900 underline">Italy relocation in Russian</a>
          </p>
        </div>
      </footer>
  );

  const russianFooter = (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm text-slate-600">
        <div className={layoutContain}>
          <ItalyHubShell active="practice" variant="satellite" className="border-0 bg-transparent p-0" />
        </div>
        <p>
          Материалы на этом поддомене — <strong>редакционные заметки Emigro</strong>. Это не юридическая
          консультация; сверяйте сроки и суммы с{" "}
          <a
            href="https://www.interno.gov.it/"
            className="text-emerald-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ministero dell&apos;Interno
          </a>
          ,{" "}
          <a
            href="https://www.agenziaentrate.gov.it/"
            className="text-emerald-900 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agenzia delle Entrate
          </a>{" "}
          и Questura. Ссылки на Wise, Revolut и другие сервисы в материалах могут быть партнёрскими.
        </p>
        <p>
          Lake Como travel guides are editorial content checked against official sources. Seasonal transport and
          opening hours can change; verify the linked operator page for your date. ComoStay accommodation links are
          commercial links to the owner&apos;s site.
        </p>
        <p>
          <a href={ITALY_SATELLITE.wizardUrl} className="font-medium text-emerald-900 underline">
            Подобрать маршрут ВНЖ →
          </a>
          {" · "}
          Основной hub:{" "}
          <a href={MAIN_HUB_URL} className="text-emerald-900 underline">
            emigro.online/ru/italy
          </a>
          {" · "}
          <a href={SPAIN_HUB_URL} className="text-slate-500 underline hover:text-slate-700">
            Испания
          </a>
          {" · "}
          <a href={PORTUGAL_HUB_URL} className="text-slate-500 underline hover:text-slate-700">
            Португалия
          </a>
        </p>
      </div>
    </footer>
  );

  return <ItalySatelliteRouteChrome english={englishFooter} russian={russianFooter} />;
}

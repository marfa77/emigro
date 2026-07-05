import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { PortugalSatelliteFooter, PortugalSatelliteHeader } from "@/components/satellite/PortugalSatelliteLayout";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { mainSiteUrl, portugalHubPath } from "@/lib/satellite/paths";
import { portugalHubPaths } from "@/lib/portugal/hub";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: false },
};

function onSatelliteHost(): boolean {
  return headers().get("host")?.split(":")[0] === PORTUGAL_SATELLITE_HOST;
}

export default function NotFound() {
  const satellite = onSatelliteHost();
  const mainHubUrl = mainSiteUrl(portugalHubPaths.landing);
  const mainHomeUrl = mainSiteUrl("/ru");

  if (satellite) {
    return (
      <>
        <PortugalSatelliteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900">404</h1>
          <p className="mt-4 text-slate-600">Страница не найдена на portugal.emigro.online.</p>
          <div className="mt-6 flex flex-col items-center gap-3 text-sm">
            <a href={portugalHubPath()} className="text-teal-700 hover:underline">
              ← Практика (главная сателлита)
            </a>
            <a href={mainHubUrl} className="text-corridor-600 hover:underline">
              Portugal Hub на emigro.online
            </a>
            <a href={mainHomeUrl} className="text-slate-500 hover:underline">
              Все направления Emigro
            </a>
          </div>
        </main>
        <PortugalSatelliteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-slate-600">Страница не найдена.</p>
        <Link href="/ru" className="mt-6 inline-block text-corridor-600 hover:underline">
          ← На главную
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}

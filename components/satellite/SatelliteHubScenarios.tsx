import Link from "next/link";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import { satelliteTagPath } from "@/lib/satellite/paths";
import {
  satelliteAssistUrl,
  satelliteWizardUrl,
} from "@/lib/satellite/funnel-urls";

type Scenario = {
  id: string;
  title: string;
  blurb: string;
  /** Local tag path on satellite, or external www URL */
  href: string;
  external?: boolean;
};

function portugalScenarios(): Scenario[] {
  return [
    {
      id: "arrived",
      title: "Только приехал",
      blurb: "NIF, банк, SIM, первые 30 дней",
      href: satelliteTagPath("nif", "portugal"),
    },
    {
      id: "visa",
      title: "Оформляю D7 / D8",
      blurb: "AIMA, документы, wizard маршрута",
      href: satelliteWizardUrl({
        countryKey: "portugal",
        placement: "satellite_hub_scenarios",
        content: "visa",
      }),
      external: true,
    },
    {
      id: "housing",
      title: "Жильё и быт",
      blurb: "Аренда, районы Norte, покупка",
      href: satelliteTagPath("arenda", "portugal"),
    },
    {
      id: "assist",
      title: "Нужен разбор кейса",
      blurb: "Route Check €129 с командой Emigro",
      href: satelliteAssistUrl({
        countryKey: "portugal",
        placement: "satellite_hub_scenarios",
        content: "assist",
      }),
      external: true,
    },
  ];
}

function spainScenarios(): Scenario[] {
  return [
    {
      id: "arrived",
      title: "Только приехал",
      blurb: "NIE, empadronamiento, банк",
      href: satelliteTagPath("nie", "spain"),
    },
    {
      id: "visa",
      title: "Виза / digital nomad",
      blurb: "Маршрут ВНЖ и wizard",
      href: satelliteWizardUrl({
        countryKey: "spain",
        placement: "satellite_hub_scenarios",
        content: "visa",
      }),
      external: true,
    },
    {
      id: "housing",
      title: "Жильё",
      blurb: "Аренда Valencia / Madrid",
      href: satelliteTagPath("arenda", "spain"),
    },
    {
      id: "assist",
      title: "Нужен разбор кейса",
      blurb: "Route Check €129 с командой Emigro",
      href: satelliteAssistUrl({
        countryKey: "spain",
        placement: "satellite_hub_scenarios",
        content: "assist",
      }),
      external: true,
    },
  ];
}

function accent(countryKey: SatelliteCountryKey) {
  return countryKey === "spain"
    ? {
        card: "border-amber-200 hover:border-amber-400 hover:bg-amber-50/80",
        title: "text-amber-950",
      }
    : {
        card: "border-teal-200 hover:border-teal-400 hover:bg-teal-50/80",
        title: "text-teal-950",
      };
}

/** Scenario entry points on satellite hub — not hashtag soup. */
export function SatelliteHubScenarios({ countryKey }: { countryKey: SatelliteCountryKey }) {
  const scenarios = countryKey === "spain" ? spainScenarios() : portugalScenarios();
  const a = accent(countryKey);

  return (
    <section className="mt-8" aria-labelledby="hub-scenarios-heading">
      <h2 id="hub-scenarios-heading" className="text-lg font-semibold text-slate-900">
        С чего начать
      </h2>
      <p className="mt-1 text-sm text-slate-600">Выберите сценарий — дальше теги и гайды.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {scenarios.map((s) => {
          const className = `block rounded-xl border bg-white p-4 transition ${a.card}`;
          const inner = (
            <>
              <p className={`text-sm font-semibold ${a.title}`}>{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.blurb}</p>
            </>
          );
          return (
            <li key={s.id}>
              {s.external ? (
                <a href={s.href} className={className}>
                  {inner}
                </a>
              ) : (
                <Link href={s.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

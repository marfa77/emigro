import Link from "next/link";
import { getEmigroInventory } from "@/lib/emigro-inventory";
import { ES_PATHS } from "@/lib/es/corridor";

type Props = {
  locale: "es" | "ru";
  className?: string;
};

/**
 * Depth / authority strip: live counts so Emigro does not read as a thin SEO shell.
 */
export function EmigroDepthStrip({ locale, className = "" }: Props) {
  const inv = getEmigroInventory();

  if (locale === "es") {
    return (
      <section
        className={`rounded-2xl border border-slate-200 bg-slate-50/90 px-5 py-5 ${className}`}
        aria-label="Alcance Emigro"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          No es una landing fina
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Emigro ES: <strong>{inv.esPillars} pilares</strong> en español ·{" "}
          <strong>{inv.esOriginHubs} orígenes</strong> LATAM ·{" "}
          <strong>{inv.esDestinations} destinos</strong> (España y Portugal) · evaluador ·{" "}
          <Link href={ES_PATHS.assist} className="font-medium text-corridor-700 hover:underline">
            Assist
          </Link>
          {" · "}
          UniPrep / Prep2Go /{" "}
          <Link href={ES_PATHS.roleRadar} className="font-medium text-corridor-700 hover:underline">
            Role Radar
          </Link>
          . Misma casa que el corredor ruso:{" "}
          <Link href="/ru" className="font-medium text-corridor-700 hover:underline">
            {inv.ruGuides}+ guías RU
          </Link>
          , corredores UE y hubs de tránsito.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-slate-50/90 px-5 py-5 ${className}`}
      aria-label="Масштаб Emigro"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Не тонкий SEO-слой
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Emigro RU: <strong>{inv.ruGuides}+ гайдов</strong> · EU-коридоры ·{" "}
        <strong>{inv.transitHubs} транзитных хабов</strong> · wizard · Assist · UniPrep / Prep2Go / Role
        Radar. Испанский контур LATAM→ES/PT:{" "}
        <Link href={ES_PATHS.home} className="font-medium text-corridor-700 hover:underline">
          {inv.esPillars} pilares ES
        </Link>
        , {inv.esOriginHubs} origin hubs.
      </p>
    </section>
  );
}

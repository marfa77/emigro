import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import {
  ES_EC_SPAIN_CORRIDOR,
  ES_PATHS,
  ES_SEED_GUIDE_SLUGS,
  ES_UY_SPAIN_CORRIDOR,
  esGuidePath,
} from "@/lib/es/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import { heroTitle } from "@/lib/ui/mobile";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Emigro — Residencia en Europa para hispanohablantes",
  titleAbsolute: true,
  description:
    "Corredores Uruguay y Ecuador → España: residencia, nómada digital y primeros 30 días con fuentes oficiales. Base LATAM → Europa.",
  path: ES_PATHS.home,
  locale: "es",
  esHreflang: { destinationIso: "ES" },
});

export default function EsHubPage() {
  const guides = listGuides("es").filter((g) =>
    (ES_SEED_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Emigro — hispanohablantes hacia Europa",
    url: pageUrl(ES_PATHS.home),
    description:
      "Guías de residencia en España para ciudadanos de Uruguay y Ecuador, con expansión prevista a otros pasaportes LATAM.",
    inLanguage: "es",
    items: [
      { url: pageUrl(ES_PATHS.uruguay), name: ES_UY_SPAIN_CORRIDOR.title },
      { url: pageUrl(ES_PATHS.ecuador), name: ES_EC_SPAIN_CORRIDOR.title },
      { url: pageUrl(ES_PATHS.spain), name: "España para LATAM" },
      ...guides.map((g) => ({ url: pageUrl(esGuidePath(g.slug)), name: g.title })),
    ],
  });

  return (
    <>
      <SiteHeader locale="es" />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <HeroShell visual={<HubHeroVisual />}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <Globe2 className="h-4 w-4" />
            Wedges: {ES_UY_SPAIN_CORRIDOR.title} · {ES_EC_SPAIN_CORRIDOR.title}
          </div>
          <h1 className={`mt-4 ${heroTitle}`}>Residencia en Europa para hispanohablantes</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Segunda dirección de Emigro: corredores LATAM → España (luego Portugal). Empezamos por
            nichos con demanda real y baja saturación SEO — no por MX/CO/AR genéricos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ES_PATHS.uruguay}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Uruguay → España
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ES_PATHS.ecuador}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Ecuador → España
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </HeroShell>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href={ES_PATHS.uruguay}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Origen 1</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin className="h-5 w-5 text-corridor-600" />
              Uruguay
            </h2>
            <p className="mt-3 text-slate-600">
              Nicho limpio: pasaporte UY, baja competencia, rutas claras hacia España.
            </p>
          </Link>
          <Link
            href={ES_PATHS.ecuador}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Origen 2</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin className="h-5 w-5 text-corridor-600" />
              Ecuador
            </h2>
            <p className="mt-3 text-slate-600">
              Más demanda que UY, menos saturación que MX/CO/AR/VE. Schengen corto ≠ residencia.
            </p>
          </Link>
          <Link
            href={ES_PATHS.spain}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Destino</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin className="h-5 w-5 text-corridor-600" />
              España
            </h2>
            <p className="mt-3 text-slate-600">
              Nómada digital, no lucrativa, trabajo — enmarcado para LATAM.
            </p>
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-950">Guías</h2>
          <p className="mt-2 text-slate-600">
            Evergreen con fuentes oficiales. Evaluador en español: próximamente.
          </p>
          <ul className="mt-6 space-y-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={esGuidePath(guide.slug)}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:border-corridor-300"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{guide.title}</p>
                    {guide.excerpt ? (
                      <p className="mt-1 text-sm text-slate-600">{guide.excerpt}</p>
                    ) : null}
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-corridor-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-bold text-slate-950">Expansión</h2>
          <p className="mt-2 text-sm text-slate-700">
            Siguiente: PY/PE y luego AR/MX/CO/VE → España; después LATAM → Portugal. Cada origen =
            hub + guías, sin rehacer el locale.
          </p>
        </section>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

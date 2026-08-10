import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Globe2, MapPin } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import {
  ES_ACTIVE_CORRIDORS,
  ES_PATHS,
  ES_PILLAR_GUIDE_SLUGS,
  esGuidePath,
} from "@/lib/es/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import { heroTitle } from "@/lib/ui/mobile";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Emigro — LATAM → España y Portugal",
  titleAbsolute: true,
  description:
    "Residencia para hispanohablantes: Uruguay, Ecuador, Perú y Paraguay → España, con Portugal como segundo destino. Evaluador + pilares oficiales.",
  path: ES_PATHS.home,
  locale: "es",
  esHreflang: { destinationIso: "ES" },
});

const ORIGIN_CARDS = [
  {
    href: ES_PATHS.uruguay,
    label: "Origen",
    title: "Uruguay",
    body: "Nicho limpio: pasaporte UY, baja competencia SEO hacia España.",
  },
  {
    href: ES_PATHS.ecuador,
    label: "Origen",
    title: "Ecuador",
    body: "Más demanda; Schengen corto suele necesitar visado.",
  },
  {
    href: ES_PATHS.peru,
    label: "Origen",
    title: "Perú",
    body: "Demanda alta, SERP más usable que MX/CO/AR/VE.",
  },
  {
    href: ES_PATHS.paraguay,
    label: "Origen",
    title: "Paraguay",
    body: "Wedge limpio del Cono Sur — hermano lógico de Uruguay.",
  },
] as const;

export default function EsHubPage() {
  const guides = listGuides("es").filter((g) =>
    (ES_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Emigro — LATAM → España y Portugal",
    url: pageUrl(ES_PATHS.home),
    description:
      "Guías y evaluador de residencia en España y Portugal para ciudadanos de Uruguay, Ecuador, Perú y Paraguay.",
    inLanguage: "es",
    items: [
      { url: pageUrl(ES_PATHS.wizard), name: "Evaluador España y Portugal" },
      ...ES_ACTIVE_CORRIDORS.map((c) => ({
        url: pageUrl(
          c.passports[0] === "UY"
            ? ES_PATHS.uruguay
            : c.passports[0] === "EC"
              ? ES_PATHS.ecuador
              : c.passports[0] === "PE"
                ? ES_PATHS.peru
                : ES_PATHS.paraguay,
        ),
        name: c.title,
      })),
      { url: pageUrl(ES_PATHS.spain), name: "España para LATAM" },
      { url: pageUrl(ES_PATHS.portugal), name: "Portugal para LATAM" },
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
            LATAM → España y Portugal
          </div>
          <h1 className={`mt-4 ${heroTitle}`}>Residencia en España y Portugal para hispanohablantes</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Orígenes activos: Uruguay, Ecuador, Perú y Paraguay. Destinos profundos: España y luego
            Portugal — no una mini-rejilla de 20 países UE.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ES_PATHS.wizard}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              <Compass className="h-4 w-4" />
              Evaluar mi ruta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ES_PATHS.spain}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Hub España
            </Link>
            <Link
              href={ES_PATHS.portugal}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Hub Portugal
            </Link>
          </div>
        </HeroShell>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ORIGIN_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">{card.label}</p>
              <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
                <MapPin className="h-5 w-5 text-corridor-600" />
                {card.title}
              </h2>
              <p className="mt-3 text-slate-600">{card.body}</p>
            </Link>
          ))}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href={ES_PATHS.spain}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Destino 1</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin className="h-5 w-5 text-corridor-600" />
              España
            </h2>
            <p className="mt-3 text-slate-600">
              Nómada digital, no lucrativa, estudios, familia — pilares LATAM.
            </p>
          </Link>
          <Link
            href={ES_PATHS.portugal}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Destino 2</p>
            <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-slate-950">
              <MapPin className="h-5 w-5 text-corridor-600" />
              Portugal
            </h2>
            <p className="mt-3 text-slate-600">
              D8 / D7 / estudios — compare con España en el mismo evaluador.
            </p>
          </Link>
        </section>

        <section className="mt-12 rounded-2xl border border-corridor-200 bg-corridor-50/80 p-6">
          <h2 className="text-xl font-bold text-slate-950">Evaluador (UY / EC / PE / PY)</h2>
          <p className="mt-2 text-slate-700">
            Responda sobre ingresos, trabajo, familia y estudios. Emigro compara programas de
            España y Portugal y le señala el mejor encaje preliminar.
          </p>
          <Link
            href={ES_PATHS.wizard}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700"
          >
            Empezar evaluador
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-950">Pilares</h2>
          <p className="mt-2 text-slate-600">
            Guías profundas con fuentes oficiales — sin satélites informativos finos.
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
            Siguiente: CO (cuando lleguen los pilares), luego AR/MX/VE. Destinos: profundizar España,
            luego pilares Portugal. Cada origen = hub + 1 pilar.
          </p>
        </section>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

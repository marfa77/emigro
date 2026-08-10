import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { ES_PATHS, ES_SEED_GUIDE_SLUGS, esGuidePath } from "@/lib/es/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "España para hispanohablantes LATAM 2026",
  description:
    "España como destino de residencia para LATAM: nómada digital, no lucrativa, trabajo y llegada. Corredores Uruguay y Ecuador → España.",
  path: ES_PATHS.spain,
  locale: "es",
  esHreflang: { destinationIso: "ES" },
});

const ROUTES = [
  {
    title: "Nómada digital (teletrabajo)",
    body: "Ingresos remotos desde fuera de España; umbral ligado al SMI. Guías UY y EC.",
    href: esGuidePath("visa-nomada-digital-espana-ecuatorianos-2026"),
  },
  {
    title: "Residencia — overview por origen",
    body: "Elija su pasaporte: Uruguay o Ecuador. Mismas rutas españolas, distinto consulado y Schengen corto.",
    href: ES_PATHS.ecuador,
  },
  {
    title: "Primeros 30 días",
    body: "NIE, empadronamiento, cita de extranjería y TIE después de llegar con visado nacional.",
    href: esGuidePath("primeros-30-dias-en-espana-2026"),
  },
] as const;

export default function EsSpainHubPage() {
  const guides = listGuides("es").filter((g) =>
    (ES_SEED_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "España" },
  ]);

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <span>España</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
          España para hispanohablantes
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Destino principal del corredor LATAM → Europa en Emigro. Escrita para pasaportes
          hispanoamericanos — no es la versión rusófona de España.
        </p>

        <section className="mt-8 space-y-4">
          {ROUTES.map((route) => (
            <Link
              key={route.title}
              href={route.href}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-corridor-300"
            >
              <h2 className="text-lg font-semibold text-slate-950">{route.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{route.body}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-corridor-700">
                Abrir
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-corridor-200 bg-corridor-50/70 p-5">
          <h2 className="font-semibold text-slate-950">Corredores activos</h2>
          <p className="mt-2 text-sm text-slate-700">
            <Link href={ES_PATHS.uruguay} className="font-medium text-corridor-700 hover:underline">
              Uruguay → España
            </Link>
            {" · "}
            <Link href={ES_PATHS.ecuador} className="font-medium text-corridor-700 hover:underline">
              Ecuador → España
            </Link>
            . Después: PY/PE y los grandes (AR/MX/CO/VE).
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Todas las guías ES</h2>
          <ul className="mt-4 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={esGuidePath(guide.slug)} className="text-corridor-700 hover:underline">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8">
          <Disclaimer locale="es" />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { ES_PATHS } from "@/lib/es/corridor";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Portugal para hispanohablantes LATAM 2026",
  description:
    "Portugal como segundo destino Emigro ES: D8 nómada digital, D7 ingresos pasivos, estudios y familia. Use el evaluador UY/EC.",
  path: ES_PATHS.portugal,
  locale: "es",
  esHreflang: { destinationIso: "PT" },
});

const ROUTES = [
  {
    title: "D8 — nómada digital",
    body: "Ingresos remotos desde fuera de Portugal. Umbrales distintos a España; compare en el evaluador.",
  },
  {
    title: "D7 — ingresos pasivos",
    body: "Pensión, alquileres u otros ingresos pasivos demostrables. Análogo conceptual a la no lucrativa española.",
  },
  {
    title: "Estudios (D4) y familia",
    body: "Admisión + fondos, o reagrupación si ya hay familia legal en Portugal.",
  },
] as const;

export default function EsPortugalHubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Portugal" },
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
          <span>Portugal</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
          Portugal para hispanohablantes
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Segundo destino del marco <strong>LATAM → España y Portugal</strong>. Los pilares
          profundos en español llegan después; hoy puede evaluar D8/D7/estudios/familia junto a
          España en el mismo wizard.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Nota: la <strong>nacionalidad portuguesa</strong> tiene plazos y requisitos propios —
          no confunda con el plazo de <strong>2 años</strong> del art. 22 del Código Civil español
          para iberoamericanos. Si su horizonte es el pasaporte ES, priorice el{" "}
          <Link href={ES_PATHS.spain} className="font-medium text-corridor-700 hover:underline">
            hub España
          </Link>
          .
        </p>

        <div className="mt-8">
          <Link
            href={ES_PATHS.wizard}
            className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700"
          >
            Evaluar España vs Portugal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <section className="mt-8 space-y-4">
          {ROUTES.map((route) => (
            <div
              key={route.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-950">{route.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{route.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-corridor-200 bg-corridor-50/70 p-5">
          <h2 className="font-semibold text-slate-950">También en Emigro ES</h2>
          <p className="mt-2 text-sm text-slate-700">
            <Link href={ES_PATHS.spain} className="font-medium text-corridor-700 hover:underline">
              Hub España
            </Link>
            {" · "}
            <Link href={ES_PATHS.guides} className="font-medium text-corridor-700 hover:underline">
              Pilares
            </Link>
            {" · "}
            <Link href={ES_PATHS.uruguay} className="font-medium text-corridor-700 hover:underline">
              Uruguay
            </Link>
            {" · "}
            <Link href={ES_PATHS.ecuador} className="font-medium text-corridor-700 hover:underline">
              Ecuador
            </Link>
          </p>
        </section>

        <div className="mt-8">
          <Disclaimer locale="es" />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

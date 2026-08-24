import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { AssistLeadForm, type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ES_PATHS } from "@/lib/es/corridor";
import { getAssistLeadProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Emigro Assist — Route Check LATAM → ES/PT",
  description:
    "Emigro Assist en español: Route Check €129 (llamada + PDF en 48 h) y acompañamiento €100/hora para rutas España y Portugal desde Latinoamérica.",
  path: ES_PATHS.assist,
  locale: "es",
  aiDescription:
    "Emigro Assist for LATAM: Route Check €129 structured call + PDF case plan; hourly accompaniment €100. Destinations Spain and Portugal. Not a law firm.",
  aiCategory: "assist",
});

/** Reuse RU corridor slugs for lead storage (same ES/PT programs). */
const ES_ASSIST_COUNTRIES = [
  { value: "spain", label: "España", corridorSlug: "ru-speaking-to-spain" },
  { value: "portugal", label: "Portugal", corridorSlug: "ru-speaking-to-portugal" },
] as const;

const AUDIENCE_POINTS = [
  "No sabe qué visa le encaja (nómada, no lucrativa, D8/D7, estudios…)",
  "Planea mudarse pero no sabe por dónde empezar",
  "Ya está en trámite y se trabó en un paso concreto",
  "Recibió una denegación y no entiende el motivo",
  "Necesita ayuda para comunicarse con consulado o partners",
] as const;

const FLOW_STEPS = [
  {
    step: "1",
    title: "Solicitud",
    text: "País, estatus, ingresos, familia, plazos y objetivo — describe su caso en el formulario.",
  },
  {
    step: "2",
    title: "Confirmación",
    text: "Emigro propone horario; tras confirmar el slot — pago €129 (PayPal, Stars, crypto o tarjeta via Gumroad).",
  },
  {
    step: "3",
    title: "Llamada",
    text: "El equipo Emigro realiza la reunión según checklist en español.",
  },
  {
    step: "4",
    title: "PDF y partners",
    text: "En 48 h: PDF con ruta, timeline, presupuesto y riesgos + contactos de partners.",
  },
  {
    step: "5",
    title: "Después",
    text: "Sigue con el partner directamente o activa acompañamiento a €100/hora.",
  },
] as const;

export default function EsAssistPage({
  searchParams,
}: {
  searchParams: { session?: string; country?: string; program?: string };
}) {
  const providers: AssistProviderOption[] = getAssistLeadProviders().map((provider) => ({
    id: provider.id,
    name: provider.name,
    category: PROVIDER_CATEGORY_LABELS_RU[provider.category],
    corridorSlugs: provider.corridorSlugs ?? [],
  }));

  const origin = publicSiteUrl();
  const assistUrl = pageUrl(ES_PATHS.assist);
  const initialCountry =
    searchParams.country === "portugal" || searchParams.country === "spain"
      ? searchParams.country
      : undefined;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Assist" },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Assist",
    description:
      "Route Check: llamada con el equipo Emigro y PDF del caso; acompañamiento por hora para LATAM → España / Portugal.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "Spain and Portugal" },
    offers: [
      {
        "@type": "Offer",
        name: "Route Check",
        price: "129",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Acompañamiento",
        price: "100",
        priceCurrency: "EUR",
        unitText: "HOUR",
      },
    ],
  };

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <span>Assist</span>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-corridor-700">
          Emigro Assist · LATAM
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Route Check y acompañamiento
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Si el evaluador y los pilares no bastan: llamada estructurada + PDF (€129) o apoyo por hora (€100).
          Destinos: <strong>España</strong> y <strong>Portugal</strong>. No somos un bufete.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-slate-700">
          {AUDIENCE_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-corridor-600 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-corridor-700">Route Check</p>
            <p className="mt-1 text-3xl font-bold text-corridor-800">€129</p>
            <p className="mt-2 text-sm text-slate-600">Llamada + PDF en 48 h + partners</p>
            <a
              href="#assist-form"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-corridor-800 hover:underline"
            >
              Solicitar <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase text-slate-600">Acompañamiento</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">€100/h</p>
            <p className="mt-2 text-sm text-slate-600">Comunicación con consulado / partners</p>
            <a
              href="#assist-form-accompaniment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
            >
              Solicitar <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Cómo funciona</h2>
          <ol className="mt-4 space-y-3">
            {FLOW_STEPS.map((step) => (
              <li key={step.step} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-corridor-600 text-xs font-bold text-white">
                  {step.step}
                </span>
                <span>
                  <strong className="text-slate-900">{step.title}.</strong> {step.text}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="assist-form" className="mt-10 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-950">Solicitud</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complete el formulario. El pago se coordina después de confirmar el slot.
          </p>
          <div className="mt-4">
            <AssistLeadForm
              countries={[...ES_ASSIST_COUNTRIES]}
              providers={providers}
              initialSessionId={searchParams.session}
              initialCountry={initialCountry}
              initialProgramRoute={searchParams.program}
              locale="es"
            />
          </div>
        </section>

        <p className="mt-8 flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Emigro no garantiza visados ni nacionalidad. Los servicios jurídicos los presta el partner que usted elija.
        </p>

        <p className="mt-6 text-sm text-slate-600">
          <Link href={ES_PATHS.wizard} className="text-corridor-700 hover:underline">
            Volver al evaluador
          </Link>
          {" · "}
          <Link href={ES_PATHS.guides} className="text-corridor-700 hover:underline">
            Pilares
          </Link>
        </p>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

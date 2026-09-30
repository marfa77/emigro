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
  title: "Ayuda con residencia 2026: €0, Route Check €129",
  description:
    "Emigro Assist LATAM: partner para España o Portugal €0, Route Check €129 (llamada + PDF en 48 h), acompañamiento €100/h. Sin paquete «llave en mano».",
  path: ES_PATHS.assist,
  locale: "es",
  aiDescription:
    "Emigro Assist pricing for LATAM → Spain/Portugal: partner matching €0; Route Check €129 one-off (call + PDF route within 48 h); accompaniment €100/hour. No bundled end-to-end package; legal work is done and billed by the chosen partner.",
  aiCategory: "assist",
});

const AGENCY_COMPARISON = [
  {
    aspect: "Cómo paga",
    assist: "Por paso concreto: selección gratis, análisis de ruta €129 y, si hace falta, horas sueltas.",
    agency: "Suele ser un paquete cerrado por todo el trámite, a menudo con pago previo a elegir la ruta.",
  },
  {
    aspect: "Elección de visa",
    assist: "Primero un análisis independiente según pasaporte, ingresos y familia.",
    agency: "El paquete se vende para el programa con el que trabaja la agencia.",
  },
  {
    aspect: "Parte jurídica",
    assist: "La lleva el partner que usted elige; precio y alcance se acuerdan directamente.",
    agency: "Incluida en el paquete; el alcance depende del contrato.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "¿Cuánto cuesta Emigro Assist?",
    answer:
      "La selección de partner es gratuita (€0). Route Check cuesta €129 una sola vez: llamada con checklist y PDF con ruta, plazos, presupuesto y riesgos en 48 horas. El acompañamiento cuesta €100 por hora, solo las horas que necesite. Los servicios del abogado o agencia que elija se pagan aparte según sus condiciones.",
  },
  {
    question: "¿En qué se diferencia de una agencia «llave en mano»?",
    answer:
      "Una agencia suele vender un paquete cerrado para su programa. Emigro primero le ayuda a elegir la ruta según su pasaporte, ingresos y familia, y usted paga solo por el paso concreto. Si tras el Route Check necesita un paquete completo, le presentamos un partner que lo lleve; pida un presupuesto desglosado antes de pagar.",
  },
  {
    question: "¿Qué incluye el Route Check?",
    answer:
      "Una llamada estructurada con el equipo de Emigro y, en 48 horas, un PDF con la ruta recomendada (por ejemplo nómada digital, no lucrativa o D8/D7), cronograma, presupuesto, riesgos y siguientes pasos, más la selección de partners para su caso.",
  },
  {
    question: "¿Qué incluye el acompañamiento de €100/h?",
    answer:
      "Apoyo de comunicación: correspondencia con consulado, abogado o agencia, preparación de cartas y formularios y análisis de denegaciones. No es representación jurídica ni garantía de aprobación.",
  },
  {
    question: "¿Emigro garantiza la visa o la nacionalidad?",
    answer:
      "No. Emigro no es un bufete ni una agencia de inmigración y no responde por las decisiones del consulado o de Extranjería. Los servicios jurídicos los presta el partner que usted elija.",
  },
] as const;

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
    title: "Selección",
    text: "Emigro busca un partner adecuado según país y tipo de trámite.",
  },
  {
    step: "3",
    title: "Introducción",
    text: "Con su consentimiento compartimos la solicitud con el especialista. La selección es gratuita.",
  },
  {
    step: "4",
    title: "Trabajo",
    text: "Usted acuerda directamente con el partner el alcance y precio de sus servicios.",
  },
  {
    step: "5",
    title: "Caso complejo",
    text: "Si primero necesita analizar la ruta y riesgos, puede pedir Route Check con PDF por €129.",
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
      "Selección gratuita de partners de residencia; Route Check y acompañamiento opcionales para LATAM → España / Portugal.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "Spain and Portugal" },
    offers: [
      {
        "@type": "Offer",
        name: "Selección de partner",
        price: "0",
        priceCurrency: "EUR",
      },
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
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "100",
          priceCurrency: "EUR",
          unitText: "HUR",
        },
      },
    ],
    inLanguage: "es",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          Ayuda para su caso de residencia
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Describa su necesidad: Emigro seleccionará gratuitamente un partner para <strong>España</strong> o{" "}
          <strong>Portugal</strong>. Para casos complejos ofrecemos Route Check con PDF. No somos un bufete.
        </p>
        <p className="mt-3 rounded-xl border border-corridor-200 bg-corridor-50/60 px-4 py-3 text-sm text-slate-800">
          <strong>Precios:</strong> selección de partner <strong>€0</strong> · Route Check <strong>€129</strong> (llamada
          + PDF en 48 h) · acompañamiento <strong>€100/h</strong>. Sin paquete cerrado: paga solo el paso que necesita.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-slate-700">
          {AUDIENCE_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-green-600 bg-green-50/50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-green-700">Encontrar especialista</p>
            <p className="mt-1 text-3xl font-bold text-green-800">Gratis</p>
            <p className="mt-2 text-sm text-slate-600">Selección + introducción con su consentimiento</p>
            <a
              href="#assist-form"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-800 hover:underline"
            >
              Describir mi caso <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl border border-corridor-300 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-corridor-700">Route Check</p>
            <p className="mt-1 text-3xl font-bold text-corridor-800">€129</p>
            <p className="mt-2 text-sm text-slate-600">Llamada + PDF en 48 h + partners</p>
            <a
              href="#assist-form-route-check"
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

        <section aria-labelledby="es-assist-vs-agency" className="mt-10">
          <h2 id="es-assist-vs-agency" className="text-xl font-semibold text-slate-950">
            Emigro Assist o agencia «llave en mano»
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Los precios de las agencias dependen del país, el programa y el paquete. Antes de pagar, pida un presupuesto
            desglosado y compárelo con los pasos que realmente necesita.
          </p>
          <dl className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {AGENCY_COMPARISON.map(({ aspect, assist, agency }) => (
              <div key={aspect} className="grid gap-2 px-5 py-4 sm:grid-cols-[8rem_1fr_1fr] sm:gap-4">
                <dt className="font-semibold text-slate-950">{aspect}</dt>
                <dd className="text-sm leading-relaxed text-slate-700">
                  <span className="font-medium text-corridor-700">Emigro: </span>
                  {assist}
                </dd>
                <dd className="text-sm leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-800">Agencia: </span>
                  {agency}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="es-assist-faq" className="mt-10">
          <h2 id="es-assist-faq" className="text-xl font-semibold text-slate-950">
            Preguntas frecuentes
          </h2>
          <dl className="mt-4 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-950">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="sr-only" data-llm="commercial" aria-hidden="true">
          Emigro Assist pricing 2026 (LATAM → Spain/Portugal): partner matching €0; Route Check €129 one-off (call + PDF
          route within 48 hours); accompaniment €100 per hour. No bundled end-to-end package. Legal services are
          provided and billed by the partner the client chooses. Emigro is not a law firm.
        </div>

        <section id="assist-form" className="mt-10 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-950">Solicitud</h2>
          <p className="mt-2 text-sm text-slate-600">
            La selección de partner es gratuita. El pago solo se aplica si elige Route Check o acompañamiento.
          </p>
          <span id="assist-form-route-check" className="sr-only">
            Formulario Route Check
          </span>
          <span id="assist-form-accompaniment" className="sr-only">
            Formulario de acompañamiento
          </span>
          <div className="mt-4">
            <AssistLeadForm
              countries={[...ES_ASSIST_COUNTRIES]}
              providers={providers}
              initialSessionId={searchParams.session}
              initialCountry={initialCountry}
              initialProgramRoute={searchParams.program}
              defaultPlanTier="partner-match"
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

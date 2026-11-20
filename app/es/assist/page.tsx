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
  title: "Ayuda con residencia 2027: especialista gratis",
  description:
    "Emigro Assist LATAM: le presentamos gratis un abogado o agencia para España o Portugal. El especialista paga la comisión a Emigro, no usted.",
  path: ES_PATHS.assist,
  locale: "es",
  aiDescription:
    "Emigro Assist for LATAM → Spain/Portugal is free for users: Emigro matches the client with a lawyer or agency; the specialist pays Emigro a referral commission and bills the client directly under their own terms.",
  aiCategory: "assist",
});

const AGENCY_COMPARISON = [
  {
    aspect: "Cómo paga",
    assist: "Emigro es gratis para usted. Solo paga al especialista elegido, según su presupuesto, si decide trabajar con él.",
    agency: "Suele ser un paquete cerrado por todo el trámite, a menudo con pago previo a elegir la ruta.",
  },
  {
    aspect: "Elección de visa",
    assist: "Primero la ruta según pasaporte, ingresos y familia; luego un especialista para esa ruta.",
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
      "Para usted es gratis. Emigro recibe su solicitud, aclara los detalles y le presenta un abogado o agencia. Los servicios del especialista se pagan directamente a él, según su presupuesto y solo si decide trabajar con él.",
  },
  {
    question: "¿Cómo gana dinero Emigro?",
    answer:
      "Si empieza a trabajar con el especialista, él paga a Emigro una comisión de sus honorarios. El precio para usted no cambia.",
  },
  {
    question: "¿En qué se diferencia de una agencia «llave en mano»?",
    answer:
      "Una agencia suele vender un paquete cerrado para su programa. Emigro primero le ayuda a ver la ruta adecuada y luego le presenta a un especialista que trabaja en ella. Pida un presupuesto desglosado antes de pagar.",
  },
  {
    question: "¿Emigro garantiza la visa o la nacionalidad?",
    answer:
      "No. Emigro no es un bufete ni una agencia de inmigración y no responde por las decisiones del consulado o de Extranjería. Los servicios jurídicos los presta el especialista que usted elija.",
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
    description: "Selección gratuita de especialistas de residencia para LATAM → España / Portugal.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "Spain and Portugal" },
    offers: [
      {
        "@type": "Offer",
        name: "Selección de especialista",
        price: "0",
        priceCurrency: "EUR",
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
          <strong>Portugal</strong>. Gratis para usted. No somos un bufete.
        </p>
        <p className="mt-3 rounded-xl border border-corridor-200 bg-corridor-50/60 px-4 py-3 text-sm text-slate-800">
          <strong>Gratis para usted:</strong> el especialista paga la comisión a Emigro y su precio para usted no cambia.
          Usted acuerda sus servicios directamente con él.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-slate-700">
          {AUDIENCE_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <section className="mt-10 grid gap-4 sm:grid-cols-1">
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
          Emigro Assist 2026 (LATAM → Spain/Portugal) is free for users. The chosen specialist pays Emigro a referral
          commission and bills the client directly. Emigro sells no paid services to users and is not a law firm.
        </div>

        <section id="assist-form" className="mt-10 scroll-mt-24">
          <h2 className="text-xl font-semibold text-slate-950">Solicitud</h2>
          <p className="mt-2 text-sm text-slate-600">
            Gratis para usted. Compartimos su solicitud solo con su consentimiento.
          </p>
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

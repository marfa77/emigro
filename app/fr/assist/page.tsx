import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { AssistLeadForm, type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { FR_PATHS } from "@/lib/fr/corridor";
import { getAllProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Emigro Assist — Route Check Afrique → France",
  description:
    "Emigro Assist en français : Route Check €129 (appel + PDF en 48 h) et accompagnement €100/heure pour les routes France depuis le Maghreb et le Sénégal.",
  path: FR_PATHS.assist,
  locale: "fr",
  aiDescription:
    "Emigro Assist for Francophone Africa: Route Check €129 structured call + PDF case plan; hourly accompaniment €100. Destination France. Not a law firm.",
  aiCategory: "assist",
});

/** Reuse RU France corridor slug for lead storage (same FR programs). */
const FR_ASSIST_COUNTRIES = [
  { value: "france", label: "France", corridorSlug: "ru-speaking-to-france" },
] as const;

const AUDIENCE_POINTS = [
  "Vous ne savez pas quelle voie vous correspond (Talent, visiteur, études…)",
  "Vous prévoyez de déménager mais ne savez pas par où commencer",
  "Vous êtes déjà en procédure et bloqué sur une étape précise",
  "Vous avez reçu un refus et ne comprenez pas le motif",
  "Vous avez besoin d’aide pour communiquer avec le consulat ou des partenaires",
] as const;

const FLOW_STEPS = [
  {
    step: "1",
    title: "Demande",
    text: "Pays, statut, revenus, famille, délais et objectif — décrivez votre cas dans le formulaire.",
  },
  {
    step: "2",
    title: "Confirmation",
    text: "Emigro propose un créneau ; après confirmation — paiement €129 (PayPal, Stars, crypto ou carte via Gumroad).",
  },
  {
    step: "3",
    title: "Appel",
    text: "L’équipe Emigro mène la réunion selon une checklist en français.",
  },
  {
    step: "4",
    title: "PDF et partenaires",
    text: "Sous 48 h : PDF avec route, timeline, budget et risques + contacts partenaires.",
  },
  {
    step: "5",
    title: "Ensuite",
    text: "Vous continuez avec le partenaire directement ou activez l’accompagnement à €100/heure.",
  },
] as const;

export default function FrAssistPage({
  searchParams,
}: {
  searchParams: { session?: string; country?: string; program?: string };
}) {
  const providers: AssistProviderOption[] = getAllProviders()
    .filter((provider) => !provider.isFirstParty)
    .map((provider) => ({
      id: provider.id,
      name: provider.name,
      category: PROVIDER_CATEGORY_LABELS_RU[provider.category],
    }));

  const origin = publicSiteUrl();
  const assistUrl = pageUrl(FR_PATHS.assist);
  const initialCountry = searchParams.country === "france" ? "france" : undefined;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro FR", item: pageUrl(FR_PATHS.home) },
    { name: "Assist" },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Assist",
    description:
      "Route Check : appel avec l’équipe Emigro et PDF du cas ; accompagnement à l’heure pour Afrique francophone → France.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "France" },
    offers: [
      {
        "@type": "Offer",
        name: "Route Check",
        price: "129",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Accompagnement",
        price: "100",
        priceCurrency: "EUR",
        unitText: "HOUR",
      },
    ],
  };

  return (
    <>
      <SiteHeader locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro FR
          </Link>
          <span className="mx-2">/</span>
          <span>Assist</span>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-corridor-700">
          Emigro Assist · Afrique → France
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Route Check et accompagnement
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Si l’évaluateur et les piliers ne suffisent pas : appel structuré + PDF (€129) ou soutien à
          l’heure (€100). Destination : <strong>France</strong>. Nous ne sommes pas un cabinet
          d’avocats.
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
            <p className="mt-2 text-sm text-slate-600">Appel + PDF en 48 h + partenaires</p>
            <a
              href="#assist-form"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-corridor-800 hover:underline"
            >
              Demander <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase text-slate-600">Accompagnement</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">€100/h</p>
            <p className="mt-2 text-sm text-slate-600">Communication avec consulat / partenaires</p>
            <a
              href="#assist-form-accompaniment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-800 hover:underline"
            >
              Demander <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Comment ça marche</h2>
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
          <h2 className="text-xl font-semibold text-slate-950">Demande</h2>
          <p className="mt-2 text-sm text-slate-600">
            Remplissez le formulaire. Le paiement se coordonne après confirmation du créneau.
          </p>
          <div className="mt-4">
            <AssistLeadForm
              countries={[...FR_ASSIST_COUNTRIES]}
              providers={providers}
              initialSessionId={searchParams.session}
              initialCountry={initialCountry}
              initialProgramRoute={searchParams.program}
              locale="fr"
            />
          </div>
        </section>

        <p className="mt-8 flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Emigro ne garantit ni visa ni nationalité. Les services juridiques sont fournis par le
          partenaire que vous choisissez.
        </p>

        <p className="mt-6 text-sm text-slate-600">
          <Link href={FR_PATHS.wizard} className="text-corridor-700 hover:underline">
            Retour à l&apos;évaluateur
          </Link>
          {" · "}
          <Link href={FR_PATHS.guides} className="text-corridor-700 hover:underline">
            Piliers
          </Link>
        </p>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}

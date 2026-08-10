import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { UniPrep2GoPromo } from "@/components/sponsors/UniPrep2GoPromo";
import { FR_PATHS, FR_PILLAR_GUIDE_SLUGS, frGuidePath } from "@/lib/fr/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { getUniPrepOfferForTopic } from "@/lib/uniprep2go/catalog";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "France pour Afrique francophone 2026 — résidence",
  description:
    "Vivre en France depuis le Maghreb ou le Sénégal 2026 : VLS-TS, Passeport Talent (~€39.582), naturalisation ~5 ans. Hubs MA/DZ/TN/SN.",
  path: FR_PATHS.france,
  locale: "fr",
  aiDescription:
    "France destination hub for Maghreb and Senegal: VLS-TS, Talent passport, study/work, naturalisation ~5 years. Not a Maghreb 2-year nationality hook.",
  aiCategory: "destination-hub",
});

const ROUTES = [
  {
    title: "Passeport Talent",
    body: "Salarié qualifié et catégories Talent : seuils 2026 (référence ~€39.582 pour salarié qualifié — confirmez service-public).",
    href: frGuidePath("passeport-talent-france-afrique-2026"),
  },
  {
    title: "Résidence — overview par origine",
    body: "Choisissez votre passeport : Maroc, Algérie, Tunisie ou Sénégal. Mêmes voies françaises ; consulats et authentification différents.",
    href: FR_PATHS.home,
  },
  {
    title: "Naturalisation ~5 ans",
    body: "De la résidence régulière à la nationalité française : délais, langue, examen civique. Pas un raccourci « 2 ans Maghreb ».",
    href: frGuidePath("naturalisation-france-afrique-2026"),
  },
  {
    title: "Vue d'ensemble Afrique francophone",
    body: "Cadre commun visa / titre / erreurs fréquentes pour MA/DZ/TN/SN.",
    href: frGuidePath("residence-france-afrique-francophone-2026"),
  },
] as const;

export default function FrFranceHubPage() {
  const guides = listGuides("fr").filter((g) =>
    (FR_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );
  const franceOffer = getUniPrepOfferForTopic("france");

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro FR", item: pageUrl(FR_PATHS.home) },
    { name: "France" },
  ]);

  return (
    <>
      <SiteHeader locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro FR
          </Link>
          <span className="mx-2">/</span>
          <span>France</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
          France pour Afrique francophone
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Destination principale du cadre <strong>Maghreb &amp; Sénégal → France</strong>. Écrite pour passeports
          MA/DZ/TN/SN — ce n&apos;est pas le corridor russophone France.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={FR_PATHS.wizard}
            className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700"
          >
            <Compass className="h-4 w-4" />
            Prochaine étape
          </Link>
          <Link
            href={FR_PATHS.guides}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:border-corridor-300"
          >
            Tous les piliers
          </Link>
        </div>

        <section className="mt-10 space-y-4">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-corridor-300"
            >
              <p className="font-semibold text-slate-950">{route.title}</p>
              <p className="mt-2 text-sm text-slate-600">{route.body}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-corridor-700">
                Lire
                <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          ))}
        </section>

        {franceOffer ? (
          <UniPrep2GoPromo
            placement="destination_hub"
            offer={franceOffer}
            contentId="fr-france-hub"
            locale="fr"
            className="mt-10"
          />
        ) : null}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Guides</h2>
          <ul className="mt-4 space-y-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={frGuidePath(guide.slug)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-corridor-300"
                >
                  {guide.title}
                  <ArrowRight className="h-4 w-4 text-corridor-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Disclaimer locale="fr" />
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import {
  FR_TN_GUIDE_SLUGS,
  FR_TN_FRANCE_CORRIDOR,
  FR_PATHS,
  frGuidePath,
} from "@/lib/fr/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Résidence en France pour Tunisiens 2026",
  description:
    "Comment émigrer en France depuis la Tunisie 2026 : visa ≠ résidence, VLS-TS, Passeport Talent et naturalisation ~5 ans. Sources officielles.",
  path: FR_PATHS.tunisie,
  locale: "fr",
  aiDescription:
    "Tunisie→France hub: short-stay visa vs national long-stay (VLS-TS), Talent passport, consulates, naturalisation ~5 years.",
  aiCategory: "origin-corridor-hub",
});

export default function FrTunisieHubPage() {
  const guides = listGuides("fr").filter((g) =>
    (FR_TN_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro FR", item: pageUrl(FR_PATHS.home) },
    { name: "Tunisie" },
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
          <span>Tunisie</span>
        </nav>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-corridor-600">
          Corridor {FR_TN_FRANCE_CORRIDOR.slug}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Tunisie → France</h1>
        <p className="mt-4 text-lg text-slate-700">
          VLS-TS avant départ dans la plupart des cas. Passeport Talent, salarié, études. Naturalisation ~5 ans de
          résidence régulière — pas un « 2 ans Maghreb ».
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Ce que nous couvrons</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>• Visa court séjour vs résidence (VLS-TS)</li>
            <li>• Passeport Talent et salarié</li>
            <li>• Consulats et authentification des documents</li>
            <li>• Naturalisation ~5 ans (confirmez niveau langue / civique)</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
            <Link href={FR_PATHS.france} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Hub France
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={FR_PATHS.wizard} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Prochaine étape
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={FR_PATHS.contact} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Contact / Assist
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Guides du corridor</h2>
          <ul className="mt-4 space-y-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={frGuidePath(guide.slug)}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 hover:border-corridor-300"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{guide.title}</p>
                    {guide.excerpt ? <p className="mt-1 text-sm text-slate-600">{guide.excerpt}</p> : null}
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-corridor-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p>
            Passeports : <strong>{FR_TN_FRANCE_CORRIDOR.passports.join(", ")}</strong>. Aussi :{" "}
            <Link href={FR_PATHS.maroc} className="text-corridor-700 hover:underline">
              Maroc → France
            </Link>
            {" · "}
            <Link href={FR_PATHS.algerie} className="text-corridor-700 hover:underline">
              Algérie → France
            </Link>
            {" · "}
            <Link href={FR_PATHS.senegal} className="text-corridor-700 hover:underline">
              Sénégal → France
            </Link>
            .
          </p>
        </section>

        <div className="mt-8">
          <Disclaimer locale="fr" />
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}

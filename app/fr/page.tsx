import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Globe2, MapPin } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { EmigroDepthStrip } from "@/components/EmigroDepthStrip";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import {
  FR_ACTIVE_CORRIDORS,
  FR_PATHS,
  FR_PILLAR_GUIDE_SLUGS,
  frGuidePath,
} from "@/lib/fr/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import { heroTitle } from "@/lib/ui/mobile";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Emigro — Afrique francophone → France 2026",
  titleAbsolute: true,
  description:
    "Résidence en France depuis le Maghreb et le Sénégal 2026 : VLS-TS, Passeport Talent, naturalisation ~5 ans + B2/civique. Maroc, Algérie, Tunisie, Sénégal — sources officielles.",
  path: FR_PATHS.home,
  locale: "fr",
  frHreflang: { destinationIso: "FR" },
  aiDescription:
    "Emigro FR: residence navigator for Maghreb and Senegal passports to France. Pillars with official sources. Naturalisation ~5 years (not a Maghreb 2-year hook). Not legal advice.",
  aiCategory: "afrique-france-hub",
});

const ORIGIN_CARDS = [
  {
    href: FR_PATHS.maroc,
    label: "Origine",
    title: "Maroc",
    body: "Visa obligatoire · VLS-TS · consulats Rabat / Casablanca…",
  },
  {
    href: FR_PATHS.algerie,
    label: "Origine",
    title: "Algérie",
    body: "Visa + titre · régime historique · apostille depuis juil. 2026.",
  },
  {
    href: FR_PATHS.tunisie,
    label: "Origine",
    title: "Tunisie",
    body: "VLS-TS · Talent · naturalisation ~5 ans + B2.",
  },
  {
    href: FR_PATHS.senegal,
    label: "Origine",
    title: "Sénégal",
    body: "Afrique de l\'Ouest francophone · France first.",
  },
] as const;

export default function FrHubPage() {
  const guides = listGuides("fr").filter((g) =>
    (FR_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Emigro — Afrique francophone → France",
    url: pageUrl(FR_PATHS.home),
    description:
      "Guides de résidence en France pour passeports marocain, algérien, tunisien et sénégalais.",
    inLanguage: "fr",
    items: [
      { url: pageUrl(FR_PATHS.france), name: "France pour Afrique francophone" },
      ...FR_ACTIVE_CORRIDORS.map((c) => {
        const pathByPassport: Record<string, string> = {
          MA: FR_PATHS.maroc,
          DZ: FR_PATHS.algerie,
          TN: FR_PATHS.tunisie,
          SN: FR_PATHS.senegal,
        };
        return {
          url: pageUrl(pathByPassport[c.passports[0]] ?? FR_PATHS.home),
          name: c.title,
        };
      }),
      ...guides.map((g) => ({ url: pageUrl(frGuidePath(g.slug)), name: g.title })),
    ],
  });

  return (
    <>
      <SiteHeader locale="fr" />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <HeroShell visual={<HubHeroVisual />}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <Globe2 className="h-4 w-4" />
            Afrique francophone → France
          </div>
          <h1 className={`mt-4 ${heroTitle}`}>Résidence en France pour le Maghreb et le Sénégal</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Origines actives : Maroc, Algérie, Tunisie, Sénégal. Destination : France d&apos;abord — pas une mini
            grille UE. Naturalisation : environ 5 ans (pas un « 2 ans Maghreb »).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={FR_PATHS.wizard}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-corridor-900 hover:bg-corridor-50"
            >
              <Compass className="h-4 w-4" />
              Évaluer ma route
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={FR_PATHS.france}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Hub France
            </Link>
            <Link
              href={FR_PATHS.assist}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Assist — Route Check
            </Link>
            <Link
              href={FR_PATHS.guides}
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Voir les piliers
            </Link>
          </div>
        </HeroShell>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-950">Origines</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {ORIGIN_CARDS.map((card) => (
              <li key={card.href}>
                <Link
                  href={card.href}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-950/5 hover:border-corridor-300"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-corridor-600">{card.label}</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-950">
                    <MapPin className="h-4 w-4 text-corridor-600" />
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{card.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-950">Guides pillar</h2>
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

        <div className="mt-12">
          <EmigroDepthStrip locale="fr" />
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}

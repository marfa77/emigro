import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { FR_PATHS, FR_PILLAR_GUIDE_SLUGS, frGuidePath } from "@/lib/fr/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";

export const revalidate = 3600;

const DESCRIPTION =
  "Guides pillar Emigro en français 2026 : résidence France depuis MA/DZ/TN/SN, Passeport Talent, naturalisation ~5 ans — sources officielles.";

export const metadata: Metadata = pageMetadata({
  title: "Guides résidence France Afrique 2026",
  description: DESCRIPTION,
  path: FR_PATHS.guides,
  locale: "fr",
  frHreflang: { destinationIso: "FR" },
  aiDescription: DESCRIPTION,
  aiCategory: "relocation-guides-index",
});

export default function FrGuidesIndexPage() {
  const guides = listGuides("fr").filter((g) =>
    (FR_PILLAR_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Guides pillar Emigro (FR)",
    url: pageUrl(FR_PATHS.guides),
    description: DESCRIPTION,
    inLanguage: "fr",
    items: guides.map((guide) => ({
      url: pageUrl(frGuidePath(guide.slug)),
      name: guide.title,
    })),
  });

  return (
    <>
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <SiteHeader locale="fr" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={FR_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro FR
          </Link>
          <span className="mx-2">/</span>
          <span>Guides</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Piliers</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{DESCRIPTION}</p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {guides.map((guide) => {
            const cover = guide.og_image_path ?? guide.cover_path;
            return (
              <li key={guide.slug}>
                <Link
                  href={frGuidePath(guide.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100">
                    <Image
                      src={cover}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-semibold text-slate-950">{guide.title}</h2>
                    {guide.excerpt ? <p className="mt-2 text-sm text-slate-600">{guide.excerpt}</p> : null}
                    {guide.estimated_minutes ? (
                      <p className="mt-auto pt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                        ~{guide.estimated_minutes} min
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}

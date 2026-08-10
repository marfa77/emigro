import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ES_PATHS, esGuidePath } from "@/lib/es/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";

export const revalidate = 3600;

const DESCRIPTION =
  "Guías Emigro en español: residencia en España desde Uruguay, nómada digital y primeros 30 días — con fuentes oficiales.";

export const metadata: Metadata = pageMetadata({
  title: "Guías de residencia en Europa (español)",
  description: DESCRIPTION,
  path: ES_PATHS.guides,
  locale: "es",
  esHreflang: { originIso: "UY", destinationIso: "ES" },
  aiDescription: DESCRIPTION,
  aiCategory: "relocation-guides-index",
});

export default function EsGuidesIndexPage() {
  const guides = listGuides("es");

  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Guías de residencia Emigro (ES)",
    url: pageUrl(ES_PATHS.guides),
    description: DESCRIPTION,
    inLanguage: "es",
    items: guides.map((guide) => ({
      url: pageUrl(esGuidePath(guide.slug)),
      name: guide.title,
    })),
  });

  return (
    <>
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <SiteHeader locale="es" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <span>Guías</span>
        </nav>
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Guías</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{DESCRIPTION}</p>

        <ul className="mt-8 space-y-4">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={esGuidePath(guide.slug)}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-950/5 transition hover:border-corridor-300"
              >
                <h2 className="text-lg font-semibold text-slate-950">{guide.title}</h2>
                {guide.excerpt ? <p className="mt-2 text-sm text-slate-600">{guide.excerpt}</p> : null}
                {guide.estimated_minutes ? (
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                    ~{guide.estimated_minutes} min
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

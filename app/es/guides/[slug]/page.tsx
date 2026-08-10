import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { GuideOfficialSources } from "@/components/guides/GuideOfficialSources";
import { Disclaimer } from "@/components/Disclaimer";
import { ES_EC_SPAIN_CORRIDOR, ES_PATHS, ES_UY_SPAIN_CORRIDOR, esGuidePath } from "@/lib/es/corridor";
import { getRelatedGuides, listGuides, loadGuide } from "@/lib/guides/load";
import { stripInlineMarkdown } from "@/lib/markdown/inline";
import { buildGuideArticleMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";

export const revalidate = 3600;

function originIsoForGuide(corridorSlugs?: string[]): "UY" | "EC" | undefined {
  if (corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug)) return "EC";
  if (corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug)) return "UY";
  return undefined;
}

function corridorBadge(corridorSlugs?: string[]): string {
  if (corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug) && corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug)) {
    return `${ES_UY_SPAIN_CORRIDOR.title} · ${ES_EC_SPAIN_CORRIDOR.title}`;
  }
  if (corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug)) return ES_EC_SPAIN_CORRIDOR.title;
  if (corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug)) return ES_UY_SPAIN_CORRIDOR.title;
  return "LATAM → España";
}

function hubCtaForGuide(corridorSlugs?: string[]): string {
  if (corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug) && !corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug)) {
    return ES_PATHS.ecuador;
  }
  if (corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug) && !corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug)) {
    return ES_PATHS.uruguay;
  }
  return ES_PATHS.spain;
}

export function generateStaticParams() {
  return listGuides("es").map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = loadGuide(params.slug, "es");
  if (!guide) return {};
  const title = guide.seo_title ?? guide.title;
  const description = stripInlineMarkdown(
    guide.seo_description ?? guide.excerpt ?? guide.quick_answer ?? guide.title,
  );
  const originIso = originIsoForGuide(guide.corridor_slugs);
  return buildGuideArticleMetadata({
    title,
    description,
    path: esGuidePath(guide.slug),
    ogImage: guide.og_image_path,
    ogImageAlt: title,
    keywords: guide.tags,
    publishedTime: guide.date_published,
    modifiedTime: guide.date_modified ?? guide.date_published,
    aiDescription: guide.quick_answer
      ? stripInlineMarkdown(guide.quick_answer)
      : description,
    aiCategory: "relocation-guide",
    locale: "es",
    esHreflang: { ...(originIso ? { originIso } : {}), destinationIso: "ES" },
  });
}

export default function EsGuidePage({ params }: { params: { slug: string } }) {
  const guide = loadGuide(params.slug, "es");
  if (!guide) notFound();

  const related = getRelatedGuides(
    guide.slug,
    guide.corridor_slugs,
    guide.topic_keys,
    4,
    undefined,
    "es",
  );
  const path = esGuidePath(guide.slug);
  const url = pageUrl(path);
  const title = guide.seo_title ?? guide.title;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Guías", item: pageUrl(ES_PATHS.guides) },
    { name: guide.title },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: stripInlineMarkdown(guide.seo_description ?? guide.excerpt ?? guide.title),
    datePublished: guide.date_published,
    dateModified: guide.date_modified ?? guide.date_published,
    inLanguage: "es",
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    image: schemaImage(guide.og_image_path ?? guide.cover_path),
    mainEntityOfPage: url,
  };

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <Link href={ES_PATHS.guides} className="text-corridor-600 hover:underline">
            Guías
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{guide.title}</span>
        </nav>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-corridor-600">
          {corridorBadge(guide.corridor_slugs)}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{guide.title}</h1>
        {guide.estimated_minutes ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            ~{guide.estimated_minutes} min de lectura
          </p>
        ) : null}

        {guide.quick_answer ? (
          <aside className="mt-8 rounded-2xl border border-corridor-200 bg-corridor-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-corridor-700">Respuesta rápida</p>
            <p className="mt-2 text-slate-800 leading-relaxed">{stripInlineMarkdown(guide.quick_answer)}</p>
          </aside>
        ) : null}

        <article
          className="prose-emigro mt-8"
          dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
        />

        {guide.official_sources?.length ? (
          <GuideOfficialSources sources={guide.official_sources} locale="es" />
        ) : null}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Siguiente paso</h2>
          <p className="mt-2 text-sm text-slate-600">
            El evaluador de rutas en español llegará pronto. Mientras tanto: revise el hub del corredor
            o escríbanos.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={hubCtaForGuide(guide.corridor_slugs)}
              className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-700"
            >
              Hub del corredor
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={MAILTO_CONTACT}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-corridor-300"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-950">Guías relacionadas</h2>
            <ul className="mt-4 space-y-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={esGuidePath(item.slug)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-corridor-300"
                  >
                    {item.title}
                    <ArrowRight className="h-4 w-4 text-corridor-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10">
          <Disclaimer locale="es" />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}

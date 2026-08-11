import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { GuideOfficialSources } from "@/components/guides/GuideOfficialSources";
import { Disclaimer } from "@/components/Disclaimer";
import { UniPrep2GoPromo } from "@/components/sponsors/UniPrep2GoPromo";
import { RoleRadarPromo } from "@/components/sponsors/RoleRadarPromo";
import { HeroShell } from "@/components/visuals/HeroShell";
import {
  ES_CL_SPAIN_CORRIDOR,
  ES_CO_SPAIN_CORRIDOR,
  ES_EC_SPAIN_CORRIDOR,
  ES_PATHS,
  ES_PE_SPAIN_CORRIDOR,
  ES_PY_SPAIN_CORRIDOR,
  ES_UY_SPAIN_CORRIDOR,
  esGuidePath,
} from "@/lib/es/corridor";
import { getRelatedGuides, listGuides, loadGuide } from "@/lib/guides/load";
import { stripInlineMarkdown } from "@/lib/markdown/inline";
import { shouldShowRoleRadarOnGuide } from "@/lib/role-radar";
import { buildGuideArticleMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { heroTitle } from "@/lib/ui/mobile";
import {
  resolveUniPrepOfferForEsGuide,
  shouldShowUniPrepOnEsGuide,
} from "@/lib/uniprep2go/catalog";

export const revalidate = 3600;

function originIsoForGuide(corridorSlugs?: string[]): "UY" | "EC" | "PE" | "PY" | "CO" | "CL" | undefined {
  const matches = [
    corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug) ? ("EC" as const) : null,
    corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug) ? ("UY" as const) : null,
    corridorSlugs?.includes(ES_PE_SPAIN_CORRIDOR.slug) ? ("PE" as const) : null,
    corridorSlugs?.includes(ES_PY_SPAIN_CORRIDOR.slug) ? ("PY" as const) : null,
    corridorSlugs?.includes(ES_CO_SPAIN_CORRIDOR.slug) ? ("CO" as const) : null,
    corridorSlugs?.includes(ES_CL_SPAIN_CORRIDOR.slug) ? ("CL" as const) : null,
  ].filter(Boolean) as Array<"UY" | "EC" | "PE" | "PY" | "CO" | "CL">;
  return matches.length === 1 ? matches[0] : undefined;
}

function corridorBadge(corridorSlugs?: string[]): string {
  const titles: string[] = [];
  if (corridorSlugs?.includes(ES_UY_SPAIN_CORRIDOR.slug)) titles.push(ES_UY_SPAIN_CORRIDOR.title);
  if (corridorSlugs?.includes(ES_EC_SPAIN_CORRIDOR.slug)) titles.push(ES_EC_SPAIN_CORRIDOR.title);
  if (corridorSlugs?.includes(ES_PE_SPAIN_CORRIDOR.slug)) titles.push(ES_PE_SPAIN_CORRIDOR.title);
  if (corridorSlugs?.includes(ES_PY_SPAIN_CORRIDOR.slug)) titles.push(ES_PY_SPAIN_CORRIDOR.title);
  if (corridorSlugs?.includes(ES_CO_SPAIN_CORRIDOR.slug)) titles.push(ES_CO_SPAIN_CORRIDOR.title);
  if (corridorSlugs?.includes(ES_CL_SPAIN_CORRIDOR.slug)) titles.push(ES_CL_SPAIN_CORRIDOR.title);
  if (titles.length === 0) return "LATAM → España";
  if (titles.length === 1) return titles[0];
  return "LATAM → España";
}

function hubCtaForGuide(corridorSlugs?: string[]): string {
  const slugs = corridorSlugs ?? [];
  const only = (slug: string) =>
    slugs.includes(slug) &&
    slugs.filter((s) => s.startsWith("es-speaking-") && s !== "es-speaking-latam-to-europe").length === 1;

  if (only(ES_PE_SPAIN_CORRIDOR.slug)) return ES_PATHS.peru;
  if (only(ES_PY_SPAIN_CORRIDOR.slug)) return ES_PATHS.paraguay;
  if (only(ES_CO_SPAIN_CORRIDOR.slug)) return ES_PATHS.colombia;
  if (only(ES_CL_SPAIN_CORRIDOR.slug)) return ES_PATHS.chile;
  if (only(ES_EC_SPAIN_CORRIDOR.slug)) return ES_PATHS.ecuador;
  if (only(ES_UY_SPAIN_CORRIDOR.slug)) return ES_PATHS.uruguay;
  return ES_PATHS.spain;
}

function GuideHeroVisual({ visualPath }: { visualPath: string }) {
  return (
    <div
      className="relative aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl ring-1 ring-white/20"
      aria-hidden
    >
      {/* Corridor photo only — OG cards bake the title into the bitmap. */}
      <Image src={visualPath} alt="" fill sizes="360px" priority className="object-cover" />
    </div>
  );
}

function heroVisualForEsGuide(slug: string): string {
  if (slug.includes("portugal") || slug.includes("d8") || slug.includes("d7") || slug.includes("ciple")) {
    return "/images/corridor-portugal.webp";
  }
  return "/images/corridor-spain.webp";
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
  const coverPath = guide.og_image_path ?? guide.cover_path;
  const showUniPrep = shouldShowUniPrepOnEsGuide(guide);
  const uniPrepOffer = showUniPrep ? resolveUniPrepOfferForEsGuide(guide) : null;
  const showRoleRadar = shouldShowRoleRadarOnGuide(guide.slug);

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
    image: schemaImage(coverPath),
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

        <div className="mt-6">
          <HeroShell visual={<GuideHeroVisual visualPath={heroVisualForEsGuide(guide.slug)} />}>
            <p className="text-xs font-semibold uppercase tracking-wide text-corridor-100">
              {corridorBadge(guide.corridor_slugs)}
            </p>
            <h1 className={`mt-3 ${heroTitle}`}>{guide.title}</h1>
            {guide.excerpt ? (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-corridor-100">
                {stripInlineMarkdown(guide.excerpt)}
              </p>
            ) : null}
            {guide.estimated_minutes ? (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-corridor-100">
                <Clock className="h-4 w-4" />
                ~{guide.estimated_minutes} min de lectura
              </p>
            ) : null}
          </HeroShell>
        </div>

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

        {showUniPrep && uniPrepOffer ? (
          <UniPrep2GoPromo
            placement="guide_article"
            offer={uniPrepOffer}
            contentId={guide.slug}
            locale="es"
            className="mt-10"
          />
        ) : null}

        {showRoleRadar ? (
          <RoleRadarPromo
            medium="guide_article"
            content={guide.slug}
            locale="es"
            className="mt-8"
          />
        ) : null}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Siguiente paso</h2>
          <p className="mt-2 text-sm text-slate-600">
            Compare umbrales de España y Portugal con el evaluador, abra el hub del corredor o pida un Route
            Check con Emigro Assist.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={ES_PATHS.wizard}
              className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-700"
            >
              Evaluar mi ruta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hubCtaForGuide(guide.corridor_slugs)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-corridor-300"
            >
              Hub del corredor
            </Link>
            <Link
              href={ES_PATHS.assist}
              className="inline-flex items-center gap-2 rounded-lg border border-corridor-300 bg-corridor-50 px-4 py-2.5 text-sm font-medium text-corridor-900 hover:border-corridor-500"
            >
              Assist — Route Check €129
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

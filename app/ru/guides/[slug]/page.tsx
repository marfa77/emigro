import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, Clock, Compass, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { guidePath, listGuides, loadGuide } from "@/lib/guides/load";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = loadGuide(params.slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.seo_title ?? guide.title,
    description: guide.seo_description ?? guide.excerpt ?? guide.title,
    path: guidePath(guide.slug),
  });
}

function GuideHeroVisual() {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl" aria-hidden>
      <Image
        src="/images/emigro-guide-passive-income.webp"
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
      <div className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">
        2026
      </div>
    </div>
  );
}

function extractToc(bodyHtml: string) {
  return Array.from(bodyHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/g))
    .map((match) => match[1]?.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean)
    .slice(0, 7);
}

export default function GuideArticlePage({ params }: { params: { slug: string } }) {
  const guide = loadGuide(params.slug);
  if (!guide) notFound();
  const toc = extractToc(guide.bodyHtml);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.date_published,
    dateModified: guide.date_modified ?? guide.date_published,
    author: { "@type": "Organization", name: "Emigro" },
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <HeroShell visual={<GuideHeroVisual />} className="from-slate-950 via-corridor-800 to-sky-800">
          <Link href="/ru/guides" className="text-sm font-medium text-corridor-100 hover:text-white">
            ← Все гайды
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
              <BookOpen className="h-4 w-4" />
              Гайд Emigro
            </span>
            {guide.estimated_minutes ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
                <Clock className="h-4 w-4" />
                {guide.estimated_minutes} мин чтения
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{guide.title}</h1>
          {guide.excerpt && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100">{guide.excerpt}</p>}
          {guide.tags && guide.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {guide.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </HeroShell>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {guide.quick_answer && (
              <section className="rounded-2xl border border-corridor-200 bg-white p-6 shadow-sm">
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-700">
                  <Sparkles className="h-4 w-4" />
                  Короткий ответ
                </p>
                <p className="mt-3 text-lg leading-relaxed text-slate-800">{guide.quick_answer}</p>
              </section>
            )}

            <article
              className="prose prose-slate mt-8 max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm prose-h2:border-t prose-h2:border-slate-100 prose-h2:pt-8 prose-table:text-sm sm:p-8"
              dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {toc.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                  <Compass className="h-4 w-4 text-corridor-600" />
                  Внутри гайда
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-slate-600">
                  {toc.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="font-semibold text-corridor-600">{index + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="rounded-2xl border border-corridor-200 bg-corridor-50 p-5">
              <h2 className="font-semibold text-slate-900">Проверить свой случай</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Гайд даёт карту маршрутов, а wizard сопоставит паспорт, доход, семью и сроки с программами.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {guide.cta_primary && (
                  <Link
                    href={guide.cta_primary}
                    className="rounded-lg bg-corridor-600 px-5 py-3 text-center font-medium text-white hover:bg-corridor-700"
                  >
                    Подобрать маршрут
                  </Link>
                )}
                {guide.cta_secondary && (
                  <Link
                    href={guide.cta_secondary}
                    className="rounded-lg border border-corridor-200 bg-white px-5 py-3 text-center font-medium text-slate-700 hover:border-corridor-400"
                  >
                    Смотреть коридор
                  </Link>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

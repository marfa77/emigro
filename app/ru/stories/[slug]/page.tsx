import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, PenLine } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { StoryGenreBadge } from "@/components/stories/StoryGenreBadge";
import { GuideStoriesCta } from "@/components/stories/GuideStoriesCta";
import { ShareButtons } from "@/components/share/ShareButtons";
import { guidePath } from "@/lib/guides/paths";
import { listGuides } from "@/lib/guides/load";
import {
  STORY_GENRE_LABELS,
  STORY_ROLE_LABELS,
  STORY_VERIFICATION_LABELS,
} from "@/lib/stories/genres";
import { listStories, loadStory } from "@/lib/stories/load";
import { storyPath, STORIES_INDEX_PATH, STORIES_SUBMIT_PATH } from "@/lib/stories/paths";
import { DEFAULT_OG_IMAGE, pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";

export const revalidate = 3600;

export function generateStaticParams() {
  return listStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = loadStory(params.slug);
  if (!story) return {};
  return pageMetadata({
    title: story.seo_title ?? story.title,
    description: story.seo_description ?? story.excerpt ?? story.title,
    path: storyPath(story.slug),
    ogImageAlt: story.title,
  });
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = loadStory(params.slug);
  if (!story) notFound();

  const guides = listGuides();
  const relatedGuides = (story.related_guide_slugs ?? [])
    .map((slug) => guides.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const url = pageUrl(storyPath(story.slug));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Истории", item: pageUrl(STORIES_INDEX_PATH) },
    { name: story.title, item: url },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.seo_description ?? story.excerpt,
    datePublished: story.date_published,
    dateModified: story.date_modified ?? story.date_published,
    inLanguage: "ru-RU",
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: url,
    image: schemaImage(DEFAULT_OG_IMAGE),
    articleSection: STORY_GENRE_LABELS[story.genre],
  };

  const primaryGuideSlug = story.related_guide_slugs?.[0];

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={STORIES_INDEX_PATH} className="inline-flex items-center gap-1 text-corridor-600 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Все истории
          </Link>
        </nav>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <StoryGenreBadge genre={story.genre} />
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600">
              {STORY_VERIFICATION_LABELS[story.verification]}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{story.title}</h1>
          <p className="mt-4 text-sm text-slate-600">
            {story.author_display}
            {story.country ? ` · ${story.country}` : ""}
            {` · ${STORY_ROLE_LABELS[story.role]}`}
            {story.relocation_year ? ` · ${story.relocation_year}` : ""}
            {story.estimated_minutes ? (
              <span className="ml-2 inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {story.estimated_minutes} мин
              </span>
            ) : null}
          </p>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-amber-950">
            Личный опыт автора. Это не юридическая консультация и не официальная позиция Emigro по порогам и срокам —
            сверяйте факты с гайдами и первоисточниками.
          </p>
          <div className="mt-4">
            <ShareButtons url={url} title={story.title} />
          </div>
        </header>

        <article
          className="mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: story.bodyHtml }}
        />

        {story.backlink_url ? (
          <p className="mt-8 text-sm text-slate-600">
            Автор:{" "}
            <a href={story.backlink_url} target="_blank" rel="noopener noreferrer" className="font-medium text-corridor-700 hover:underline">
              {story.author_display}
            </a>
          </p>
        ) : null}

        {relatedGuides.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-950">Связанные гайды</h2>
            <ul className="mt-3 space-y-2">
              {relatedGuides.map((g) => (
                <li key={g.slug}>
                  <Link href={guidePath(g.slug)} className="text-sm font-medium text-corridor-700 hover:underline">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-5">
          <h2 className="text-lg font-semibold text-slate-950">Не согласны с автором?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Напишите контрапункт — разместим альтернативную точку зрения рядом после модерации.
          </p>
          <Link
            href={`${STORIES_SUBMIT_PATH}?disagree=1${primaryGuideSlug ? `&guide=${encodeURIComponent(primaryGuideSlug)}` : ""}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Дополнить своей версией
          </Link>
        </section>

        {primaryGuideSlug ? <GuideStoriesCta guideSlug={primaryGuideSlug} className="mt-8" /> : null}

        <RelocatorChatPromo variant="inline" source={`story_${story.slug}`} className="mt-8" />
      </main>
      <SiteFooter />
    </>
  );
}

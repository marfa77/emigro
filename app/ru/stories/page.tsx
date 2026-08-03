import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { StoryGenreBadge } from "@/components/stories/StoryGenreBadge";
import { HeroShell } from "@/components/visuals/HeroShell";
import { STORY_GENRE_LABELS, STORY_ROLE_LABELS, STORY_VERIFICATION_LABELS } from "@/lib/stories/genres";
import { listStories } from "@/lib/stories/load";
import { storyPath, STORIES_SUBMIT_PATH } from "@/lib/stories/paths";
import { STORY_GENRES, type StoryGenre } from "@/lib/stories/types";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Истории релокации читателей",
  description:
    "Реальные кейсы переезда: успехи, провалы, спорные мнения и лайфхаки. Курируемые истории читателей Emigro — не замена официальным гайдам.",
  path: "/ru/stories",
  ogImageAlt: "Истории релокации Emigro",
});

type SearchParams = { genre?: string; guide?: string };

export default function StoriesIndexPage({ searchParams }: { searchParams?: SearchParams }) {
  const all = listStories();
  const genreFilter = searchParams?.genre && searchParams.genre in STORY_GENRE_LABELS
    ? (searchParams.genre as StoryGenre)
    : null;
  const guideFilter = searchParams?.guide?.trim() || null;

  const stories = all.filter((s) => {
    if (genreFilter && s.genre !== genreFilter) return false;
    if (guideFilter && !s.related_guide_slugs?.includes(guideFilter)) return false;
    return true;
  });

  const indexUrl = pageUrl("/ru/stories");
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Истории", item: indexUrl },
  ]);
  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Истории релокации читателей Emigro",
    url: indexUrl,
    description:
      "Курируемые личные истории переезда: успехи, ошибки, спорные мнения и лайфхаки для русскоязычных релокантов.",
    inLanguage: "ru-RU",
    items: stories.slice(0, 20).map((s) => ({
      url: pageUrl(storyPath(s.slug)),
      name: s.title,
    })),
  });

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {collectionSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      ) : null}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Истории</span>
        </nav>

        <HeroShell className="mt-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Истории читателей</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Личный опыт рядом с гайдами: не «идеальный пост», а спасательный круг для того, кто сейчас с чемоданом и
            паникой. Каждая история проходит модерацию.
          </p>
          <Link
            href={STORIES_SUBMIT_PATH}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-corridor-900 transition hover:bg-corridor-50"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Рассказать свою
          </Link>
        </HeroShell>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/ru/stories"
            className={`rounded-full border px-3 py-1.5 text-sm ${
              !genreFilter ? "border-corridor-400 bg-corridor-50 text-corridor-900" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Все жанры
          </Link>
          {STORY_GENRES.map((g) => (
            <Link
              key={g}
              href={`/ru/stories?genre=${g}${guideFilter ? `&guide=${encodeURIComponent(guideFilter)}` : ""}`}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                genreFilter === g
                  ? "border-corridor-400 bg-corridor-50 text-corridor-900"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {STORY_GENRE_LABELS[g]}
            </Link>
          ))}
        </div>

        {guideFilter ? (
          <p className="mt-4 text-sm text-slate-600">
            Фильтр по гайду: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{guideFilter}</code>{" "}
            <Link href={genreFilter ? `/ru/stories?genre=${genreFilter}` : "/ru/stories"} className="text-corridor-700 hover:underline">
              сбросить
            </Link>
          </p>
        ) : null}

        <div className="mt-8 grid gap-4">
          {stories.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center text-slate-600">
              Пока нет историй с таким фильтром.{" "}
              <Link href={STORIES_SUBMIT_PATH} className="font-medium text-corridor-700 hover:underline">
                Будьте первым
              </Link>
              .
            </p>
          ) : (
            stories.map((story) => (
              <article
                key={story.slug}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-corridor-300 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StoryGenreBadge genre={story.genre} />
                  <span className="text-xs text-slate-500">{STORY_VERIFICATION_LABELS[story.verification]}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">
                  <Link href={storyPath(story.slug)} className="hover:text-corridor-700">
                    {story.title}
                  </Link>
                </h2>
                {story.excerpt ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{story.excerpt}</p>
                ) : null}
                <p className="mt-3 text-xs text-slate-500">
                  {story.author_display}
                  {story.country ? ` · ${story.country}` : ""}
                  {` · ${STORY_ROLE_LABELS[story.role]}`}
                  {story.relocation_year ? ` · ${story.relocation_year}` : ""}
                </p>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

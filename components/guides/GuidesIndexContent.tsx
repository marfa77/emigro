"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { GuidesCategoryFilter } from "@/components/guides/GuidesCategoryFilter";
import { HeroShell } from "@/components/visuals/HeroShell";
import {
  getGuideCategories,
  getGuideCategoryById,
  groupGuidesByCategory,
  GUIDE_CATEGORIES,
  isGuideCategoryId,
  pickFeaturedGuide,
  type GuideCategoryId,
  isGuideAudienceId,
  getGuideAudiences,
  type GuideAudienceId,
} from "@/lib/guides/categories";
import type { GuideFrontmatter } from "@/lib/guides/types";
import { guidePath } from "@/lib/guides/paths";

export type GuidesCorridorLink = {
  key: string;
  flag: string;
  countryRu: string;
  corridorSlug: string | null;
  landing?: string;
  wizard?: string;
};

type Props = {
  allGuides: GuideFrontmatter[];
  pillarGuides: GuideFrontmatter[];
  corridors: GuidesCorridorLink[];
};

function guideCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} гайд`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} гайда`;
  return `${count} гайдов`;
}

function filterGuidesForTopic(
  guides: GuideFrontmatter[],
  topicKey: string,
  corridorSlug?: string | null,
): GuideFrontmatter[] {
  const key = topicKey.toLowerCase();
  return guides.filter((guide) => {
    const topics = (guide.topic_keys ?? []).map((k) => k.toLowerCase());
    if (topics.includes(key)) return true;
    if (corridorSlug && guide.corridor_slugs?.includes(corridorSlug)) return true;
    return false;
  });
}

function GuideCard({ guide }: { guide: GuideFrontmatter }) {
  const categories = getGuideCategories(guide).filter((id) => id !== "general").slice(0, 2);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/5 transition hover:-translate-y-1 hover:border-corridor-300 hover:shadow-xl hover:shadow-slate-200/70">
      <Link href={guidePath(guide.slug)} className="block">
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <Image
            src={guide.cover_path}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {categories.length > 0 ? (
              categories.map((categoryId) => {
                const category = getGuideCategoryById(categoryId);
                return (
                  <span
                    key={categoryId}
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900"
                  >
                    {category.label}
                  </span>
                );
              })
            ) : (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                Гайд Emigro
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-6">
        <Link href={guidePath(guide.slug)} className="text-xl font-semibold text-slate-900 hover:text-corridor-700">
          {guide.title}
        </Link>
        {guide.excerpt && <p className="mt-2 text-sm text-slate-600">{guide.excerpt}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          {guide.estimated_minutes && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
              <Clock className="h-4 w-4" />
              {guide.estimated_minutes} мин
            </span>
          )}
          <Link href={guidePath(guide.slug)} className="ml-auto inline-flex items-center gap-1 font-semibold text-corridor-600 hover:text-corridor-800">
            Читать
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function GuideGrid({ guides }: { guides: GuideFrontmatter[] }) {
  if (guides.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
        В этой категории пока нет гайдов.
      </p>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {guides.map((guide) => (
        <GuideCard key={guide.slug} guide={guide} />
      ))}
    </div>
  );
}

function CategorySection({
  categoryId,
  guides,
}: {
  categoryId: GuideCategoryId;
  guides: GuideFrontmatter[];
}) {
  if (guides.length === 0) return null;

  const category = getGuideCategoryById(categoryId);
  const Icon = category.icon;

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-950">
            <Icon className="h-6 w-6 text-corridor-600" />
            {category.label}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{category.description}</p>
        </div>
        <Link
          href={`/ru/guides?cat=${category.id}`}
          className="text-sm font-semibold text-corridor-600 hover:text-corridor-800"
        >
          Только эта категория
        </Link>
      </div>
      <div className="mt-6">
        <GuideGrid guides={guides} />
      </div>
    </section>
  );
}

function GuidesIndexBody({ allGuides, pillarGuides, corridors }: Props) {
  const searchParams = useSearchParams();
  const activeTopicKey = searchParams.get("topic")?.trim().toLowerCase();
  const activeCategory = searchParams.get("cat");
  const activeAudience = searchParams.get("aud");

  const topic = useMemo(() => {
    if (!activeTopicKey) return null;
    return corridors.find((c) => c.key === activeTopicKey) ?? null;
  }, [activeTopicKey, corridors]);

  const parsedCategory = activeCategory && isGuideCategoryId(activeCategory) ? activeCategory : undefined;
  const parsedAudience =
    activeAudience && isGuideAudienceId(activeAudience) ? (activeAudience as GuideAudienceId) : undefined;

  const guides = useMemo(() => {
    if (!topic) return allGuides;
    return filterGuidesForTopic(allGuides, topic.key, topic.corridorSlug);
  }, [allGuides, topic]);

  const featuredGuide = pickFeaturedGuide(guides);
  const listGuidesExcludingFeatured = featuredGuide
    ? guides.filter((guide) => guide.slug !== featuredGuide.slug)
    : guides;

  const audienceFiltered = parsedAudience
    ? listGuidesExcludingFeatured.filter((guide) => getGuideAudiences(guide).includes(parsedAudience))
    : listGuidesExcludingFeatured;

  const grouped = groupGuidesByCategory(audienceFiltered);
  const filteredGuides = parsedCategory
    ? audienceFiltered.filter((guide) => getGuideCategories(guide).includes(parsedCategory))
    : [];

  const showFeatured =
    !topic &&
    featuredGuide &&
    (!parsedCategory || getGuideCategories(featuredGuide).includes(parsedCategory)) &&
    (!parsedAudience || getGuideAudiences(featuredGuide).includes(parsedAudience));

  return (
    <main className="bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34rem)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-[1360px]">
        <HeroShell
          visual={
            <div className="relative aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl ring-1 ring-white/20" aria-hidden>
              <Image
                src="/images/emigro-main-hero.webp"
                alt=""
                fill
                sizes="360px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-corridor-100">{guideCountLabel(guides.length)}</p>
                <p className="mt-1 text-lg font-bold">Маршруты, деньги, семья, отказы</p>
              </div>
            </div>
          }
          className="from-slate-950 via-corridor-800 to-sky-800"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
            <BookOpen className="h-4 w-4" />
            Библиотека Emigro
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl 2xl:max-w-4xl">
            {topic ? `Гайды: ${topic.flag} ${topic.countryRu}` : "Гайды по релокации и ВНЖ"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100 2xl:max-w-3xl">
            {topic
              ? `${guideCountLabel(guides.length)} про ${topic.countryRu} — маршруты, документы, бюджет и практика. Сравнительные материалы по нескольким странам тоже попадают в выборку.`
              : "Практические editorial-разборы для русскоязычных за рубежом и в СНГ: маршруты, доходы, семья, отказы и бюджет. Без воды — с проверкой через wizard."}
          </p>
          {topic?.landing && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={topic.landing}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-corridor-900 hover:bg-corridor-50"
              >
                {topic.countryRu} Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/ru/guides"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Все гайды
              </Link>
            </div>
          )}
        </HeroShell>

        <Suspense fallback={<div className="mt-8 h-10" aria-hidden />}>
          <GuidesCategoryFilter />
        </Suspense>

        {!parsedCategory && !parsedAudience && !topic && pillarGuides.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-corridor-100 bg-corridor-50/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Популярные pillar-гайды</h2>
            <p className="mt-2 text-sm text-slate-600">
              Материалы с наибольшим спросом: маршруты по паспортам, digital nomad, странам ЕС и транзитным хабам.{" "}
              <Link href="/ru/rossiyane" className="font-semibold text-corridor-700 hover:underline">
                Origin hub для граждан России →
              </Link>
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pillarGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guidePath(guide.slug)}
                  className="rounded-xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:border-corridor-300"
                >
                  {guide.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {showFeatured && featuredGuide && (
          <article className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/70 ring-1 ring-slate-950/5">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <Link href={guidePath(featuredGuide.slug)} className="group relative block min-h-[320px] overflow-hidden bg-slate-100">
                <Image
                  src={featuredGuide.cover_path}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-corridor-600" />
                  Главный материал
                </span>
              </Link>
              <div className="p-7 sm:p-9">
                <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Начните здесь</p>
                <Link href={guidePath(featuredGuide.slug)} className="mt-3 block text-3xl font-bold leading-tight text-slate-950 hover:text-corridor-700">
                  {featuredGuide.title}
                </Link>
                {featuredGuide.excerpt && <p className="mt-4 text-base leading-7 text-slate-600">{featuredGuide.excerpt}</p>}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {featuredGuide.estimated_minutes && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      <Clock className="h-4 w-4" />
                      {featuredGuide.estimated_minutes} мин
                    </span>
                  )}
                  <Link href={guidePath(featuredGuide.slug)} className="inline-flex items-center gap-2 rounded-full bg-corridor-600 px-5 py-2 text-sm font-semibold text-white hover:bg-corridor-700">
                    Читать гайд
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {parsedCategory ? (
          <div className="mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">{getGuideCategoryById(parsedCategory).label}</h2>
              <p className="mt-1 text-sm text-slate-600">{getGuideCategoryById(parsedCategory).description}</p>
            </div>
            <GuideGrid guides={filteredGuides} />
          </div>
        ) : (
          GUIDE_CATEGORIES.map((category) => (
            <CategorySection
              key={category.id}
              categoryId={category.id}
              guides={grouped.get(category.id) ?? []}
            />
          ))
        )}

        <RelocatorChatPromo source="guides_index" className="mt-14" />

        {corridors.length > 0 && (
          <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <MapPin className="h-5 w-5 text-corridor-600" />
              Коридоры Emigro
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              После гайда проверьте маршрут в wizard или откройте справочник выбранной страны.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {corridors.map((corridor) => (
                <Link
                  key={corridor.key}
                  href={corridor.wizard ?? corridor.landing ?? "/ru/wizard"}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-corridor-400"
                >
                  {corridor.flag} {corridor.countryRu}
                </Link>
              ))}
              <Link href="/ru/wizard" className="rounded-full bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700">
                Hub wizard
              </Link>
              <Link
                href="/ru/rossiyane"
                className="rounded-full border border-corridor-200 bg-corridor-50 px-4 py-2 text-sm font-medium text-corridor-800 hover:border-corridor-400"
              >
                🇷🇺 Origin hub
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export function GuidesIndexContent(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
      <GuidesIndexBody {...props} />
    </Suspense>
  );
}

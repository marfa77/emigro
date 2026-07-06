import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { GuidesCategoryFilter } from "@/components/guides/GuidesCategoryFilter";
import { HeroShell } from "@/components/visuals/HeroShell";
import {
  getGuideCategories,
  getGuideCategoryById,
  getGuideAudienceById,
  groupGuidesByCategory,
  GUIDE_CATEGORIES,
  isGuideCategoryId,
  pickFeaturedGuide,
  type GuideCategoryId,
  isGuideAudienceId,
  getGuideAudiences,
  type GuideAudienceId,
} from "@/lib/guides/categories";
import { guidePath, listGuides, type GuideFrontmatter } from "@/lib/guides/load";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { listGuidesForTopic } from "@/lib/guides/corridor-guides";
import { getActiveNewsTopics, getNewsTopic } from "@/lib/news/topics";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { schemaImage } from "@/lib/seo/schema";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const activeCategory =
    searchParams.cat && isGuideCategoryId(searchParams.cat) ? searchParams.cat : undefined;
  const activeAudience =
    searchParams.aud && isGuideAudienceId(searchParams.aud) ? searchParams.aud : undefined;
  const activeTopic = searchParams.topic?.trim().toLowerCase();
  const topic = activeTopic ? await getNewsTopic(activeTopic) : null;

  let title = "Гайды по релокации и ВНЖ в Европе";
  let description =
    "Практические pillar-гайды Emigro: маршруты для русскоязычных за рубежом и в СНГ — digital nomad, семья с детьми, отказы в визах, бюджет релокации и ВНЖ по странам ЕС.";

  if (topic) {
    title = `Гайды: ${topic.countryRu}`;
    description = `Pillar-гайды Emigro про ${topic.countryRu}: маршруты ВНЖ, документы, бюджет и практика переезда для русскоязычных.`;
  } else if (activeCategory && activeAudience) {
    const category = getGuideCategoryById(activeCategory);
    const audience = getGuideAudienceById(activeAudience);
    title = `Гайды: ${category.label} — ${audience.label}`;
    description = `${category.description} Материалы Emigro для ${audience.label.toLowerCase()}: маршруты ВНЖ, документы и wizard подбора.`;
  } else if (activeCategory) {
    const category = getGuideCategoryById(activeCategory);
    title = `Гайды: ${category.label}`;
    description = `${category.description} Pillar-гайды Emigro для русскоязычных за рубежом и в СНГ — wizard подбора маршрута ВНЖ.`;
  } else if (activeAudience) {
    const audience = getGuideAudienceById(activeAudience);
    title = `Гайды для ${audience.label}`;
    description = `Pillar-гайды Emigro для ${audience.label.toLowerCase()}: маршруты ВНЖ, документы, семья и бюджет релокации в Европу.`;
  }

  const metadata = pageMetadata({
    title,
    description,
    path: "/ru/guides",
    ogImage: schemaImage("/images/og/guides-index.jpg"),
  });

  if (activeCategory || activeAudience || topic) {
    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        canonical: pageUrl("/ru/guides"),
      },
    };
  }

  return metadata;
}

type Props = { searchParams: { cat?: string; aud?: string; topic?: string } };

function guideCountLabel(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} гайд`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} гайда`;
  return `${count} гайдов`;
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

export default async function GuidesIndexPage({ searchParams }: Props) {
  const activeTopicKey = searchParams.topic?.trim().toLowerCase();
  const topic = activeTopicKey ? await getNewsTopic(activeTopicKey) : null;
  const allGuides = listGuides();
  const guides = topic ? listGuidesForTopic(topic.key, topic.corridorSlug) : allGuides;
  const activeCategory = searchParams.cat && isGuideCategoryId(searchParams.cat) ? searchParams.cat : undefined;
  const activeAudience = searchParams.aud && isGuideAudienceId(searchParams.aud) ? (searchParams.aud as GuideAudienceId) : undefined;
  const featuredGuide = pickFeaturedGuide(guides);
  const listGuidesExcludingFeatured = featuredGuide
    ? guides.filter((guide) => guide.slug !== featuredGuide.slug)
    : guides;

  const audienceFiltered = activeAudience
    ? listGuidesExcludingFeatured.filter((guide) => getGuideAudiences(guide).includes(activeAudience))
    : listGuidesExcludingFeatured;

  const grouped = groupGuidesByCategory(audienceFiltered);
  const pillarGuides = listPillarGuides();
  const corridors = (await getActiveNewsTopics()).filter((t) => t.sitePaths?.landing).slice(0, 8);

  const filteredGuides = activeCategory
    ? audienceFiltered.filter((guide) => getGuideCategories(guide).includes(activeCategory))
    : [];

  const showFeatured =
    !topic &&
    featuredGuide &&
    (!activeCategory || getGuideCategories(featuredGuide).includes(activeCategory)) &&
    (!activeAudience || getGuideAudiences(featuredGuide).includes(activeAudience));

  return (
    <>
      <SiteHeader />
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
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl 2xl:max-w-4xl">
            {topic ? `Гайды: ${topic.flag} ${topic.countryRu}` : "Гайды по релокации и ВНЖ"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100 2xl:max-w-3xl">
            {topic
              ? `${guideCountLabel(guides.length)} про ${topic.countryRu} — маршруты, документы, бюджет и практика. Сравнительные материалы по нескольким странам тоже попадают в выборку.`
              : "Практические editorial-разборы для русскоязычных за рубежом и в СНГ: маршруты, доходы, семья, отказы и бюджет. Без воды — с проверкой через wizard."}
          </p>
          {topic && topic.sitePaths?.landing && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={topic.sitePaths.landing}
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

        {!activeCategory && !activeAudience && !topic && pillarGuides.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-corridor-100 bg-corridor-50/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Популярные pillar-гайды</h2>
            <p className="mt-2 text-sm text-slate-600">
              Материалы с наибольшим спросом: маршруты по паспортам, digital nomad, странам ЕС и транзитным хабам.
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

        {activeCategory ? (
          <div className="mt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">{getGuideCategoryById(activeCategory).label}</h2>
              <p className="mt-1 text-sm text-slate-600">{getGuideCategoryById(activeCategory).description}</p>
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
              {corridors.map((topic) => (
                <Link
                  key={topic.key}
                  href={topic.sitePaths!.landing}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-corridor-400"
                >
                  {topic.flag} {topic.countryRu}
                </Link>
              ))}
              <Link href="/ru/wizard" className="rounded-full bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700">
                Hub wizard
              </Link>
            </div>
          </section>
        )}
      </div>
      </main>
      <SiteFooter />
    </>
  );
}

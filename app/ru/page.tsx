import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Globe2, Newspaper } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import { ProductLevelCards } from "@/components/visuals/ProductLevelCards";
import { getActiveNewsTopics, newsIndexPath } from "@/lib/news/topics";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { guidePath, listGuides } from "@/lib/guides/load";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Emigro — релокация в Европу для русскоязычных",
  titleAbsolute: true,
  description:
    "Навигатор по ВНЖ и гражданству: европейские коридоры для русскоязычных — wizard подбора, справочники программ и еженедельные новости с источниками.",
  path: "/ru",
});

export default async function RuHubPage() {
  const topics = await getActiveNewsTopics();
  const featuredGuides = listGuides().slice(0, 4);
  const destinationCount = topics.length;
  const fullCorridors = topics.filter((t) => t.status === "active" && t.sitePaths);
  const developingCorridors = topics.filter((t) => t.status === "in_development" && t.sitePaths);
  const newsOnly = topics.filter((t) => t.status === "news_only");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Направления релокации Emigro",
    itemListElement: topics.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.countryRu,
      url: `${SITE_URL}${t.sitePaths?.landing ?? newsIndexPath(t.urlSegment)}`,
    })),
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <HeroShell visual={<HubHeroVisual />}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <Globe2 className="h-4 w-4" />
            {destinationCount} направлений
          </div>
          <h1 className="mt-4 text-4xl font-bold">Emigro</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Навигатор релокации для русскоязычных: еженедельные новости по Европе и полные коридоры с wizard,
            справочником и проверкой маршрутов.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={HUB_WIZARD_PATH}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Подобрать страну и маршрут
            </Link>
            <Link
              href="/ru/news"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              <Newspaper className="h-5 w-5" />
              Все новости
            </Link>
            <Link
              href="/ru/guides"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              <BookOpen className="h-5 w-5" />
              Гайды по ВНЖ
            </Link>
            {fullCorridors[0]?.sitePaths?.wizard && fullCorridors[0].key !== "portugal" && (
              <Link
                href={fullCorridors[0].sitePaths!.wizard}
                className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
              >
                Подбор маршрута — {fullCorridors[0].countryRu}
              </Link>
            )}
          </div>
        </HeroShell>

        <section id="destinations" className="mt-14 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-slate-900">Направления</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Выберите страну: полный коридор с wizard или еженедельные новости по ВНЖ и гражданству.
          </p>

          {fullCorridors.length > 0 && (
            <>
              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-corridor-700">
                Полные коридоры ({fullCorridors.length})
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fullCorridors.map((topic) => (
                  <DestinationCard key={topic.key} topic={topic} />
                ))}
              </div>
            </>
          )}

          {developingCorridors.length > 0 && (
            <>
              <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-amber-800">
                Коридоры в разработке ({developingCorridors.length})
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {developingCorridors.map((topic) => (
                  <DestinationCard key={topic.key} topic={topic} />
                ))}
              </div>
            </>
          )}

          {newsOnly.length > 0 && (
            <>
              <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Только новости ({newsOnly.length})
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {newsOnly.map((topic) => (
                  <DestinationCard key={topic.key} topic={topic} />
                ))}
              </div>
            </>
          )}
        </section>

        {featuredGuides.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-slate-900">Гайды по релокации</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Практические разборы: digital nomad, семья, отказы в визах, бюджет и выбор страны — с переходом в{" "}
              <Link href="/ru/wizard" className="text-corridor-600 hover:underline">
                hub wizard
              </Link>
              .
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {featuredGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={guidePath(guide.slug)}
                    className="block rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 transition hover:border-corridor-400 hover:shadow-sm"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/ru/guides" className="mt-4 inline-block text-sm font-medium text-corridor-600 hover:underline">
              Все гайды →
            </Link>
          </section>
        )}

        <section className="mt-14 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Три уровня продукта</h2>
          <ProductLevelCards />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

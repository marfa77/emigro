import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, Clock, MapPin } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { guidePath, listGuides } from "@/lib/guides/load";
import { getActiveNewsTopics } from "@/lib/news/topics";
import { pageMetadata } from "@/lib/seo";
import { schemaImage } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Гайды по релокации и ВНЖ в Европе",
  description:
    "Практические pillar-гайды Emigro: куда переехать из России, digital nomad, семья с детьми, отказы в визах, бюджет релокации и маршруты ВНЖ по странам ЕС.",
  path: "/ru/guides",
  ogImage: schemaImage("/images/emigro-main-hero.webp"),
});

export default async function GuidesIndexPage() {
  const guides = listGuides();
  const corridors = (await getActiveNewsTopics()).filter((t) => t.sitePaths?.landing).slice(0, 8);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-[1360px]">
        <HeroShell
          visual={
            <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border-2 border-white/30 bg-white shadow-2xl" aria-hidden>
              <Image
                src="/images/emigro-main-hero.webp"
                alt=""
                fill
                sizes="360px"
                priority
                className="object-cover"
              />
            </div>
          }
          className="from-slate-950 via-corridor-800 to-sky-800"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
            <BookOpen className="h-4 w-4" />
            Библиотека Emigro
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl 2xl:max-w-4xl">Гайды по rелокации и ВНЖ</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100 2xl:max-w-3xl">
            Практические разборы по маршрутам, доходам, семье, отказам и бюджету. Без воды — с проверкой через wizard.
          </p>
        </HeroShell>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <article key={guide.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-corridor-300 hover:shadow-md">
              <Link href={guidePath(guide.slug)} className="block">
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <Image
                    src={guide.cover_path}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-6">
                <Link href={guidePath(guide.slug)} className="text-xl font-semibold text-slate-900 hover:text-corridor-700">
                  {guide.title}
                </Link>
                {guide.excerpt && <p className="mt-2 text-sm text-slate-600">{guide.excerpt}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {guide.estimated_minutes && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {guide.estimated_minutes} мин
                    </span>
                  )}
                  <Link href={guidePath(guide.slug)} className="ml-auto font-medium text-corridor-600 hover:underline">
                    Читать →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {corridors.length > 0 && (
          <section className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
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
      </main>
      <SiteFooter />
    </>
  );
}

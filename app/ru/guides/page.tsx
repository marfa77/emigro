import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Clock, MapPin, Sparkles } from "lucide-react";
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
  ogImage: schemaImage("/images/og/guides-index.jpg"),
});

export default async function GuidesIndexPage() {
  const guides = listGuides();
  const [featuredGuide, ...otherGuides] = guides;
  const corridors = (await getActiveNewsTopics()).filter((t) => t.sitePaths?.landing).slice(0, 8);

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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-corridor-100">10 guides</p>
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
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl 2xl:max-w-4xl">Гайды по релокации и ВНЖ</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100 2xl:max-w-3xl">
            Практические editorial-разборы по маршрутам, доходам, семье, отказам и бюджету. Без воды — с проверкой через wizard.
          </p>
        </HeroShell>

        {featuredGuide && (
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

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {otherGuides.map((guide) => (
            <article key={guide.slug} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/5 transition hover:-translate-y-1 hover:border-corridor-300 hover:shadow-xl hover:shadow-slate-200/70">
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
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                    Гайд Emigro
                  </span>
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
          ))}
        </div>

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

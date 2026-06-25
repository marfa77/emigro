import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, Clock } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { guidePath, listGuides } from "@/lib/guides/load";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Гайды по релокации и ВНЖ в Европе",
  description: "Практические pillar-гайды Emigro: куда переехать, digital nomad, семья, отказы в визах, бюджет.",
  path: "/ru/guides",
});

export default function GuidesIndexPage() {
  const guides = listGuides();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <HeroShell
          visual={
            <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
              <Image
                src="/images/emigro-guide-passive-income.webp"
                alt=""
                fill
                sizes="360px"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
            </div>
          }
          className="from-slate-950 via-corridor-800 to-sky-800"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
            <BookOpen className="h-4 w-4" />
            Библиотека Emigro
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Гайды по релокации и ВНЖ</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100">
            Практические разборы по маршрутам, доходам, семье, отказам и бюджету. Без воды — с проверкой через wizard.
          </p>
        </HeroShell>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <article key={guide.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-corridor-300 hover:shadow-md">
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
                {guide.cta_primary && (
                  <Link href={guidePath(guide.slug)} className="ml-auto font-medium text-corridor-600 hover:underline">
                    Читать →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

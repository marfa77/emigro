import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COMO_GUIDES, COMO_STAY } from "@/lib/italy/como-guides";
import { italySatelliteUrl } from "@/lib/site-url";

const description =
  "Independent, fact-checked Lake Como guides from a Tremezzo base: ferries, hiking, Madesimo skiing, transport and the best things to do in 2026.";

export const metadata: Metadata = {
  title: "Lake Como 2026: practical guides from Tremezzo",
  description,
  alternates: {
    canonical: italySatelliteUrl("/en"),
    languages: { en: italySatelliteUrl("/en"), "x-default": italySatelliteUrl("/en") },
  },
  openGraph: {
    title: "Lake Como 2026: practical guides from Tremezzo",
    description,
    url: italySatelliteUrl("/en"),
    type: "website",
    locale: "en_GB",
    images: [{ url: italySatelliteUrl("/images/como/lake-como-attractions.webp"), width: 1200, height: 630 }],
  },
};

export default function ComoEnglishHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Lake Como practical guides",
    description,
    url: italySatelliteUrl("/en"),
    inLanguage: "en",
    about: {
      "@type": "Place",
      name: "Lake Como",
      address: { "@type": "PostalAddress", addressRegion: "Lombardy", addressCountry: "IT" },
      geo: { "@type": "GeoCoordinates", latitude: 45.984, longitude: 9.216 },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: COMO_GUIDES.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: italySatelliteUrl(`/en/guides/${guide.slug}`),
      })),
    },
  };

  return (
    <main lang="en" className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="sr-only" data-llm="facts">
        Lake Como travel information checked against official transport, attraction and destination sources.
        Seasonal timetables are linked live instead of copied without validity dates.
      </section>

      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Lake Como · 2026</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Practical Lake Como, from a Tremezzo base
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            Real ferry links, trail choices, winter plans and opening-hour checks. Built for travellers who want to
            use the lake—not lose a day to an expired timetable.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={COMO_STAY.tulipaniUrl}
              className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
              rel="sponsored"
            >
              Stay at Tulipani 11
            </a>
            <a
              href={COMO_STAY.siteUrl}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-emerald-700"
              rel="sponsored"
            >
              Browse all ComoStay homes
            </a>
          </div>
        </div>
        <a href={COMO_STAY.tulipaniUrl} rel="sponsored" className="group overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="/images/como/tulipani-11-balcony.webp"
            alt="Apartment Tulipani 11 in Tremezzo"
            width={1200}
            height={800}
            className="aspect-[3/2] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            priority
          />
          <div className="bg-slate-950 px-5 py-4 text-white">
            <p className="font-semibold">Apartment Tulipani 11 · Tremezzo</p>
            <p className="mt-1 text-sm text-slate-300">4 guests · 2 bedrooms · 2 bathrooms · balcony</p>
          </div>
        </a>
      </div>

      <section className="mt-14" aria-labelledby="guides-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Plan with current sources</p>
            <h2 id="guides-heading" className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Lake Como guides
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">Updated 5 October 2026</p>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {COMO_GUIDES.map((guide) => (
            <article key={guide.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Link href={`/en/guides/${guide.slug}`} className="group block">
                <Image
                  src={guide.hero}
                  alt={guide.heroAlt}
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">{guide.category}</p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-950 group-hover:text-emerald-900">
                    {guide.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{guide.excerpt}</p>
                  <p className="mt-4 text-sm font-semibold text-emerald-800">Read the guide →</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-emerald-950 px-6 py-8 text-white sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Stay in the middle of the plan</p>
        <h2 className="mt-2 text-2xl font-bold">Tremezzo for ferries, villas and the Greenway</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-emerald-50">
          Tulipani 11 is the featured two-bedroom home. If it is unavailable, ComoStay’s full collection keeps the
          accommodation search on Lake Como instead of sending readers to an unrelated global booking funnel.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={COMO_STAY.tulipaniUrl} rel="sponsored" className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-emerald-950">
            View Tulipani 11
          </a>
          <a href={COMO_STAY.siteUrl} rel="sponsored" className="rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-bold text-white">
            See all ComoStay apartments
          </a>
        </div>
      </section>
    </main>
  );
}

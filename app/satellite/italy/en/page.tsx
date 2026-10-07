import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ComoStayLink } from "@/components/satellite/ComoStayLink";
import { COMO_GUIDES, COMO_MERCATINO_TG, COMO_STAY_OFFER, comoStayUrl } from "@/lib/italy/como-guides";
import { getComoGuideMedia } from "@/lib/italy/como-media";
import { italySatelliteUrl } from "@/lib/site-url";

const description =
  "Independent, fact-checked Lake Como guides from a Tremezzo base: ferries, hiking, Madesimo skiing, transport and the best things to do in 2026.";
const hubHero = getComoGuideMedia("best-things-to-do-lake-como-tremezzo")?.photos[0];

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
    images: hubHero
      ? [{ url: italySatelliteUrl(hubHero.src), width: hubHero.width, height: hubHero.height, alt: hubHero.alt }]
      : undefined,
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
        Local buy/sell Telegram: {COMO_MERCATINO_TG.url} ({COMO_MERCATINO_TG.handle}).
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
          <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-950">
            {COMO_STAY_OFFER.headline} · code {COMO_STAY_OFFER.code}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ComoStayLink
              href={comoStayUrl("lake-como-hub", "early", "tulipani")}
              guideSlug="lake-como-hub"
              placement="early"
              destination="tulipani"
              className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900"
            >
              Stay at Tulipani 11
            </ComoStayLink>
            <ComoStayLink
              href={comoStayUrl("lake-como-hub", "early", "inventory")}
              guideSlug="lake-como-hub"
              placement="early"
              destination="inventory"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-emerald-700"
            >
              Browse all ComoStay homes
            </ComoStayLink>
          </div>
        </div>
        <ComoStayLink
          href={comoStayUrl("lake-como-hub", "property-image", "tulipani")}
          guideSlug="lake-como-hub"
          placement="property-image"
          destination="tulipani"
          className="group overflow-hidden rounded-2xl bg-slate-100"
        >
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
            <p className="mt-2 text-sm font-semibold text-amber-300">{COMO_STAY_OFFER.headline}</p>
          </div>
        </ComoStayLink>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Local flea market · Telegram</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{COMO_MERCATINO_TG.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
          {COMO_MERCATINO_TG.blurb} Useful for used skis before Madesimo, hiking kit, kids gear and apartment extras.
          Community classifieds only—not ferries, pharmacies or municipal services.
        </p>
        <a
          href={COMO_MERCATINO_TG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950"
        >
          {COMO_MERCATINO_TG.url}
        </a>
        <p className="mt-1 text-xs text-slate-500">{COMO_MERCATINO_TG.handle}</p>
      </section>

      <section className="mt-14" aria-labelledby="guides-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Plan with current sources</p>
            <h2 id="guides-heading" className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Lake Como guides
            </h2>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">Updated 7 October 2026</p>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {COMO_GUIDES.map((guide) => {
            const hero = getComoGuideMedia(guide.slug)?.photos[0];
            if (!hero) return null;
            return (
            <article key={guide.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Link href={`/en/guides/${guide.slug}`} className="group block">
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  width={hero.width}
                  height={hero.height}
                  sizes="(min-width: 768px) 480px, calc(100vw - 32px)"
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
            );
          })}
        </div>
      </section>

      <section className="mt-14 rounded-2xl bg-emerald-950 px-6 py-8 text-white sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Stay in the middle of the plan</p>
        <h2 className="mt-2 text-2xl font-bold">Tremezzo for ferries, villas and the Greenway</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-emerald-50">
          Tulipani 11 is the featured two-bedroom home. If it is unavailable, ComoStay’s full collection keeps the
          accommodation search on Lake Como instead of sending readers to an unrelated global booking funnel.{" "}
          {COMO_STAY_OFFER.detail}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ComoStayLink
            href={comoStayUrl("lake-como-hub", "final", "tulipani")}
            guideSlug="lake-como-hub"
            placement="final"
            destination="tulipani"
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
          >
            View Tulipani 11
          </ComoStayLink>
          <ComoStayLink
            href={comoStayUrl("lake-como-hub", "final", "inventory")}
            guideSlug="lake-como-hub"
            placement="final"
            destination="inventory"
            className="rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            See all ComoStay apartments
          </ComoStayLink>
        </div>
      </section>
    </main>
  );
}

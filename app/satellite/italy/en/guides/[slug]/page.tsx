import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComoGuideMap } from "@/components/satellite/ComoGuideMap";
import { ComoGuidePhoto } from "@/components/satellite/ComoGuidePhoto";
import { ComoStayLink } from "@/components/satellite/ComoStayLink";
import { parseInlineMarkdown } from "@/lib/community-notes/note-body-render";
import { COMO_GUIDES, COMO_STAY_OFFER, comoStayUrl, getComoGuide } from "@/lib/italy/como-guides";
import { getComoGuideMedia } from "@/lib/italy/como-media";
import { italySatelliteUrl } from "@/lib/site-url";

export function generateStaticParams() {
  return COMO_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getComoGuide(params.slug);
  const media = getComoGuideMedia(params.slug);
  if (!guide || !media) return {};
  const hero = media.photos[0];
  const canonical = italySatelliteUrl(`/en/guides/${guide.slug}`);
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: {
      canonical,
      languages: { en: canonical, "x-default": canonical },
      types: { "text/plain": italySatelliteUrl("/llms.txt") },
    },
    openGraph: {
      title: guide.seoTitle,
      description: guide.description,
      url: canonical,
      siteName: "Emigro Lake Como",
      locale: "en_GB",
      type: "article",
      images: [{ url: italySatelliteUrl(hero.src), width: hero.width, height: hero.height, alt: hero.alt }],
    },
    twitter: { card: "summary_large_image", title: guide.seoTitle, description: guide.description, images: [italySatelliteUrl(hero.src)] },
    other: { "ai:description": guide.quickAnswer },
  };
}

export default function ComoGuidePage({ params }: { params: { slug: string } }) {
  const guide = getComoGuide(params.slug);
  const media = getComoGuideMedia(params.slug);
  if (!guide || !media) notFound();
  const hero = media.photos[0];
  const photosBySrc = new Map(media.photos.map((photo) => [photo.src, photo]));

  const canonical = italySatelliteUrl(`/en/guides/${guide.slug}`);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    image: italySatelliteUrl(hero.src),
    datePublished: guide.updated,
    dateModified: guide.updated,
    inLanguage: "en",
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Emigro" },
    publisher: { "@type": "Organization", name: "Emigro", url: "https://www.emigro.online" },
    about: {
      "@type": "Place",
      name: "Lake Como",
      geo: { "@type": "GeoCoordinates", latitude: 45.984, longitude: 9.216 },
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Lake Como", item: italySatelliteUrl("/en") },
      { "@type": "ListItem", position: 2, name: guide.title, item: canonical },
    ],
  };

  return (
    <main lang="en" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="sr-only" data-llm="facts">
        <h2>AI summary</h2>
        <p>{guide.quickAnswer}</p>
      </section>

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/en" className="hover:text-emerald-900">Lake Como guides</Link>
        <span aria-hidden="true"> › </span>
        <span>{guide.category}</span>
      </nav>

      <header className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{guide.category}</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">{guide.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{guide.excerpt}</p>
        <p className="mt-4 text-sm text-slate-500">
          Tremezzo, Lake Como · Updated <time dateTime={guide.updated}>5 October 2026</time>
        </p>
      </header>

      <div className="mt-7">
        <ComoGuidePhoto photo={hero} priority />
      </div>

      <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5" aria-labelledby="quick-answer">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">Quick answer</p>
        <h2 id="quick-answer" className="sr-only">Quick answer</h2>
        <p className="mt-2 leading-relaxed text-slate-800">{guide.quickAnswer}</p>
      </section>

      <ComoGuideMap map={media.map} />

      <aside className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white" data-llm="commercial">
        <div className="grid sm:grid-cols-[13rem_1fr]">
          <ComoStayLink
            href={comoStayUrl(guide.slug, "property-image", "tulipani")}
            guideSlug={guide.slug}
            placement="property-image"
            destination="tulipani"
            aria-label="View Apartment Tulipani 11"
          >
            <Image
              src="/images/como/tulipani-11-balcony.webp"
              alt="Tulipani 11 apartment in Tremezzo"
              width={800}
              height={600}
              className="h-full min-h-48 w-full object-cover"
            />
          </ComoStayLink>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Featured Tremezzo stay</p>
            <h2 className="mt-2 text-xl font-bold">Apartment Tulipani 11</h2>
            <p className="mt-2 text-sm font-semibold text-amber-300">{COMO_STAY_OFFER.headline} · {COMO_STAY_OFFER.code}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Four guests, two bedrooms, two bathrooms, balcony, kitchen, air conditioning and Wi-Fi.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ComoStayLink
                href={comoStayUrl(guide.slug, "early", "tulipani")}
                guideSlug={guide.slug}
                placement="early"
                destination="tulipani"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-emerald-950"
              >
                Check Tulipani 11
              </ComoStayLink>
              <ComoStayLink
                href={comoStayUrl(guide.slug, "early", "inventory")}
                guideSlug={guide.slug}
                placement="early"
                destination="inventory"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-white"
              >
                All ComoStay homes
              </ComoStayLink>
            </div>
          </div>
        </div>
      </aside>

      <article className="mt-10 space-y-10">
        {guide.sections.map((section) => {
          const sectionPhotos = (media.sectionPhotos[section.heading] ?? [])
            .map((src) => photosBySrc.get(src))
            .filter((photo): photo is NonNullable<typeof photo> => Boolean(photo));

          return (
          <section key={section.heading} aria-labelledby={`section-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            <h2 id={`section-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-2xl font-bold tracking-tight text-slate-950">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-[1.02rem] leading-7 text-slate-700">
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 70)}>{parseInlineMarkdown(paragraph)}</p>)}
            </div>
            {section.table && (
              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>{section.table.columns.map((column) => <th key={column} className="px-4 py-3 font-semibold">{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={`${row[0]}-${rowIndex}`} className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60">
                        {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className={`px-4 py-3 align-top text-slate-700 ${cellIndex === 0 ? "font-semibold text-slate-900" : ""}`}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.bullets && (
              <ul className="mt-5 space-y-3 border-l-2 border-emerald-200 pl-5 text-slate-700">
                {section.bullets.map((bullet) => <li key={bullet.slice(0, 70)}>{parseInlineMarkdown(bullet)}</li>)}
              </ul>
            )}
            {sectionPhotos.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {sectionPhotos.map((photo) => (
                  <ComoGuidePhoto key={photo.src} photo={photo} />
                ))}
              </div>
            )}
          </section>
          );
        })}
      </article>

      <section className="mt-12" aria-labelledby="official-sources">
        <h2 id="official-sources" className="text-2xl font-bold text-slate-950">Official sources</h2>
        <ul className="mt-4 space-y-2">
          {guide.officialSources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-800 underline">
                {source.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-bold text-slate-950">Frequently asked questions</h2>
        <div className="mt-5 space-y-3">
          {guide.faq.map((item) => (
            <details key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">{item.q}</summary>
              <p className="mt-3 leading-relaxed text-slate-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl bg-emerald-950 p-6 text-white sm:p-8" data-llm="commercial">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Plan the stay</p>
        <h2 className="mt-2 text-2xl font-bold">Use Tremezzo as your central-lake base</h2>
        <p className="mt-3 leading-relaxed text-emerald-50">
          Start with Tulipani 11 for four guests, then browse the full ComoStay inventory if you need different dates, capacity or location. {COMO_STAY_OFFER.detail}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ComoStayLink
            href={comoStayUrl(guide.slug, "final", "tulipani")}
            guideSlug={guide.slug}
            placement="final"
            destination="tulipani"
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-emerald-950"
          >
            View Tulipani 11
          </ComoStayLink>
          <ComoStayLink
            href={comoStayUrl(guide.slug, "final", "inventory")}
            guideSlug={guide.slug}
            placement="final"
            destination="inventory"
            className="rounded-lg border border-emerald-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            Browse ComoStay
          </ComoStayLink>
        </div>
      </section>

      <p className="mt-10 text-center text-sm">
        <Link href="/en" className="font-semibold text-emerald-800 underline">← All Lake Como guides</Link>
      </p>
    </main>
  );
}

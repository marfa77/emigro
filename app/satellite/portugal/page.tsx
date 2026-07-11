import type { Metadata } from "next";
import { DailySpotlightTile } from "@/components/satellite/DailySpotlight";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteValueProp } from "@/components/satellite/RelatedNotes";
import { BarakhloPromo } from "@/components/satellite/BarakhloPromo";
import { getDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практические заметки для русскоязычных релокантов в Португалии (Norte: Порту, Брага, Minho и вся страна): NIF, AIMA, аренда, SNS, банки. Короткие ответы, FAQ и официальные ссылки — не юридическая консультация.";

export const metadata: Metadata = {
  title: PORTUGAL_SATELLITE.title,
  description: fitMetaDescription(HUB_DESCRIPTION),
  keywords: [
    "Португалия",
    "Порту",
    "Norte",
    "релокация",
    "NIF Portugal",
    "AIMA",
    "русскоязычные экспаты",
  ],
  alternates: {
    canonical: portugalSatelliteUrl("/"),
    languages: { "ru-RU": portugalSatelliteUrl("/"), ru: portugalSatelliteUrl("/"), "x-default": portugalSatelliteUrl("/") },
  },
  openGraph: {
    title: PORTUGAL_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    url: portugalSatelliteUrl("/"),
    siteName: "Emigro Portugal",
    locale: "ru_RU",
    type: "website",
    images: [socialImageMetadata(DEFAULT_OG_IMAGE, PORTUGAL_SATELLITE.title)],
  },
  twitter: {
    card: "summary_large_image",
    title: PORTUGAL_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    images: [socialImageMetadata(DEFAULT_OG_IMAGE, PORTUGAL_SATELLITE.title).url],
  },
};

export default async function PortugalSatelliteHomePage() {
  const [spotlight, notes] = await Promise.all([getDailySpotlight("portugal"), getPublishedCommunityNotes("portugal")]);
  const listNotes = spotlight ? notes.filter((n) => n.slug !== spotlight.note_slug) : notes;
  const llmsUrl = portugalSatelliteUrl("/llms");
  const hubUrl = portugalSatelliteUrl("/");

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PORTUGAL_SATELLITE.title,
    description: HUB_DESCRIPTION,
    url: hubUrl,
    inLanguage: "ru-RU",
    about: {
      "@type": "Place",
      name: "Porto, Portugal",
      address: {
        "@type": "PostalAddress",
        addressCountry: "PT",
        addressLocality: "Porto",
        addressRegion: "Norte",
      },
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>
          {HUB_DESCRIPTION} Материалы: новости, лайфхаки, советы и гайды по жизни в Португалии для релокантов с
          паспортами RU/BY/UA/KZ.
        </p>
        <a href={llmsUrl}>llms.txt</a>
      </section>
      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{PORTUGAL_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>

      <SatelliteValueProp />

      <BarakhloPromo context="hub" placement="satellite_hub" compact />

      {spotlight && (
        <div className="mt-8">
          <DailySpotlightTile spotlight={spotlight} />
        </div>
      )}

      <HashtagNav notes={notes} />

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          Материалы
        </h2>
        <ul className="mt-6 space-y-4">
          {listNotes.map((note) => (
            <li key={note.slug}>
              <NoteCard note={note} />
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-center text-sm text-slate-500">
        <a href={PORTUGAL_SATELLITE.digestUrl} className="text-teal-700 underline">
          Справочник коридора на emigro.online →
        </a>
        {" · "}
        <a href={llmsUrl} className="text-teal-700 underline">
          llms.txt
        </a>
      </p>
    </main>
  );
}

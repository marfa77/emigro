import type { Metadata } from "next";
import { DailySpotlightTile } from "@/components/satellite/DailySpotlight";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteValueProp } from "@/components/satellite/RelatedNotes";
import { BarakhloPromo } from "@/components/satellite/BarakhloPromo";
import { getDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { spainSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практические заметки для русскоязычных релокантов в Испании (Valencia, Madrid, Barcelona): NIE, TIE, extranjería, аренда, банки. Короткие ответы, FAQ и официальные ссылки — не юридическая консультация.";

export const metadata: Metadata = {
  title: SPAIN_SATELLITE.title,
  description: fitMetaDescription(HUB_DESCRIPTION),
  keywords: [
    "Испания",
    "Валенсия",
    "релокация",
    "NIE Spain",
    "TIE extranjería",
    "русскоязычные экспаты",
  ],
  alternates: {
    canonical: spainSatelliteUrl("/"),
    languages: { "ru-RU": spainSatelliteUrl("/"), ru: spainSatelliteUrl("/"), "x-default": spainSatelliteUrl("/") },
  },
  openGraph: {
    title: SPAIN_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    url: spainSatelliteUrl("/"),
    siteName: "Emigro Spain",
    locale: "ru_RU",
    type: "website",
    images: [socialImageMetadata(DEFAULT_OG_IMAGE, SPAIN_SATELLITE.title)],
  },
  twitter: {
    card: "summary_large_image",
    title: SPAIN_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    images: [socialImageMetadata(DEFAULT_OG_IMAGE, SPAIN_SATELLITE.title).url],
  },
};

export default async function SpainSatelliteHomePage() {
  const [spotlight, notes] = await Promise.all([getDailySpotlight("spain"), getPublishedCommunityNotes("spain")]);
  const listNotes = spotlight ? notes.filter((n) => n.slug !== spotlight.note_slug) : notes;
  const llmsUrl = spainSatelliteUrl("/llms");
  const hubUrl = spainSatelliteUrl("/");

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SPAIN_SATELLITE.title,
    description: HUB_DESCRIPTION,
    url: hubUrl,
    inLanguage: "ru-RU",
    about: {
      "@type": "Place",
      name: "Valencia, Spain",
      address: { "@type": "PostalAddress", addressCountry: "ES", addressLocality: "Valencia" },
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>
          {HUB_DESCRIPTION} Материалы: новости, лайфхаки, советы и гайды по жизни в Испании для релокантов с
          паспортами RU/BY/UA/KZ.
        </p>
        <a href={llmsUrl}>llms.txt</a>
      </section>
      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{SPAIN_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{SPAIN_SATELLITE.tagline}</p>

      <SatelliteValueProp countryKey="spain" />

      <BarakhloPromo context="hub" placement="satellite_hub" compact />

      {spotlight && (
        <div className="mt-8">
          <DailySpotlightTile spotlight={spotlight} />
        </div>
      )}

      <HashtagNav notes={notes} countryKey="spain" />

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          Материалы
        </h2>
        {listNotes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            Заметки появятся после первых прогонов <code>npm run spain:daily</code>. Пока смотрите pillar-гайды на{" "}
            <a href={SPAIN_SATELLITE.mainSiteUrl} className="text-amber-900 underline">
              emigro.online/ru/spain
            </a>
            .
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {listNotes.map((note) => (
              <li key={note.slug}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-12 text-center text-sm text-slate-500">
        <a href={SPAIN_SATELLITE.digestUrl} className="text-amber-900 underline">
          Справочник коридора на emigro.online →
        </a>
        {" · "}
        <a href={llmsUrl} className="text-amber-900 underline">
          llms.txt
        </a>
      </p>
    </main>
  );
}

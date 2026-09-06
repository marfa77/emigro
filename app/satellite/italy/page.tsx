import type { Metadata } from "next";
import { DailySpotlightTile } from "@/components/satellite/DailySpotlight";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteValueProp } from "@/components/satellite/RelatedNotes";
import { SatelliteFunnelCta } from "@/components/satellite/SatelliteFunnelCta";
import { SatelliteHubScenarios } from "@/components/satellite/SatelliteHubScenarios";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { SatelliteHubDepth } from "@/components/satellite/SatelliteHubDepth";
import { SatelliteCityChatCta } from "@/components/satellite/SatelliteCityChatCta";
import { getDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { satelliteDigestUrl, satelliteHubUrl, satelliteWizardUrl } from "@/lib/satellite/funnel-urls";
import { buildSatelliteHubPlace, withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { DEFAULT_OG_IMAGE, fitMetaDescription, socialImageMetadata } from "@/lib/seo";
import { italySatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практические заметки для русскоязычных релокантов в Италии (Milano и север, включая Como): codice fiscale, permesso / Questura, аренда, SSN, банки. Короткие ответы, FAQ и официальные ссылки — не юридическая консультация.";

export const metadata: Metadata = withSatelliteAiMetadata(
  {
    title: ITALY_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    keywords: [
      "Италия",
      "Милан",
      "релокация",
      "codice fiscale",
      "permesso di soggiorno",
      "русскоязычные экспаты",
    ],
    alternates: {
      canonical: italySatelliteUrl("/"),
      languages: { "ru-RU": italySatelliteUrl("/"), ru: italySatelliteUrl("/"), "x-default": italySatelliteUrl("/") },
    },
    openGraph: {
      title: ITALY_SATELLITE.title,
      description: fitMetaDescription(HUB_DESCRIPTION),
      url: italySatelliteUrl("/"),
      siteName: "Emigro Italy",
      locale: "ru_RU",
      type: "website",
      images: [socialImageMetadata(DEFAULT_OG_IMAGE, ITALY_SATELLITE.title)],
    },
    twitter: {
      card: "summary_large_image",
      title: ITALY_SATELLITE.title,
      description: fitMetaDescription(HUB_DESCRIPTION),
      images: [socialImageMetadata(DEFAULT_OG_IMAGE, ITALY_SATELLITE.title).url],
    },
  },
  "italy",
  HUB_DESCRIPTION
);

export default async function ItalySatelliteHomePage() {
  const [spotlight, notes] = await Promise.all([
    getDailySpotlight("italy"),
    requirePublishedCommunityNotes("italy"),
  ]);
  const listNotes = spotlight ? notes.filter((n) => n.slug !== spotlight.note_slug) : notes;
  const guideNotes = listNotes.filter((n) => n.content_kind === "guide");
  const feedNotes = listNotes.filter((n) => n.content_kind !== "guide");
  const allGuides = notes.filter((n) => n.content_kind === "guide");
  const topicTags = Array.from(new Set(notes.flatMap((n) => n.topic_tags.filter((t) => t !== "italy")))).sort();
  const destinationsLabel = topicTags.slice(0, 8).join(", ") || "codice fiscale, permesso, Milano, Como, аренда";
  const llmsUrl = italySatelliteUrl("/llms");
  const hubUrl = italySatelliteUrl("/");

  const listForSchema = (spotlight ? [spotlight.note_slug, ...listNotes.map((n) => n.slug)] : listNotes.map((n) => n.slug))
    .map((slug) => notes.find((n) => n.slug === slug))
    .filter(Boolean)
    .slice(0, 20);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: ITALY_SATELLITE.title,
    description: HUB_DESCRIPTION,
    url: hubUrl,
    inLanguage: "ru-RU",
    about: buildSatelliteHubPlace("italy"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: listForSchema.map((note, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: italySatelliteUrl(`/notes/${note!.slug}`),
        name: note!.title,
      })),
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="sr-only" aria-label="AI description" data-llm="facts">
        <h2>ai:description</h2>
        <p>
          {HUB_DESCRIPTION} Материалы: новости, лайфхаки, советы и гайды по жизни в Италии для релокантов с
          паспортами RU/BY/UA/KZ.
        </p>
        <a href={llmsUrl} data-llm="commercial">
          llms.txt
        </a>
      </section>
      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{ITALY_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{ITALY_SATELLITE.tagline}</p>

      <SatelliteHubDepth
        countryKey="italy"
        guideCount={allGuides.length}
        noteCount={notes.length}
        feedCount={notes.filter((n) => n.content_kind !== "guide").length}
        topicCount={topicTags.length}
        destinationsLabel={destinationsLabel}
      />

      <SatelliteValueProp countryKey="italy" />

      <SatelliteCityChatCta countryKey="italy" source="italy_satellite_hub" />

      <SatelliteFunnelCta countryKey="italy" placement="satellite_hub" />

      <SatelliteHubScenarios countryKey="italy" />

      {spotlight && (
        <div className="mt-8">
          <DailySpotlightTile spotlight={spotlight} />
        </div>
      )}

      <HashtagNav notes={notes} countryKey="italy" />

      {guideNotes.length > 0 && (
        <section className="mt-10" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-xl font-semibold text-slate-900">
            Гайды ({guideNotes.length})
          </h2>
          <ul className="mt-6 space-y-4">
            {guideNotes.map((note) => (
              <li key={note.slug}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          {feedNotes.length > 0 ? `Новости и заметки (${feedNotes.length})` : "Материалы"}
        </h2>
        {listNotes.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            Заметки появятся после первых прогонов <code>npm run italy:daily</code>. Пока смотрите pillar-гайды на{" "}
            <a
              href={satelliteHubUrl({ countryKey: "italy", placement: "satellite_hub", content: "empty_state" })}
              className="text-emerald-900 underline"
            >
              emigro.online/ru/italy
            </a>
            .
          </p>
        ) : feedNotes.length === 0 ? null : (
          <ul className="mt-6 space-y-4">
            {feedNotes.map((note) => (
              <li key={note.slug}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <SatelliteAssistIntake countryKey="italy" />

      <p className="mt-12 text-center text-sm text-slate-500">
        <a
          href={satelliteWizardUrl({ countryKey: "italy", placement: "satellite_hub", content: "footer" })}
          className="font-medium text-emerald-900 underline"
        >
          Подобрать маршрут ВНЖ →
        </a>
        {" · "}
        <a
          href={satelliteDigestUrl({ countryKey: "italy", placement: "satellite_hub", content: "footer" })}
          className="text-emerald-900 underline"
        >
          Справочник коридора
        </a>
        {" · "}
        <a href={llmsUrl} className="text-emerald-900 underline">
          llms.txt
        </a>
      </p>
    </main>
  );
}

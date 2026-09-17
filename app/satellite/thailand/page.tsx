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
import { ProviderPartnerRecruitment } from "@/components/providers/ProviderPartnerRecruitment";
import { getDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import { satelliteDigestUrl, satelliteHubUrl, satelliteWizardUrl } from "@/lib/satellite/funnel-urls";
import { buildSatelliteHubPlace, withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { DEFAULT_OG_IMAGE, fitMetaDescription, socialImageMetadata } from "@/lib/seo";
import { thailandSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практические заметки для русскоязычных релокантов в Таиланде с фокусом на Пхукет: DTV, LTR, TM30, аренда, банки, медицина и быт. Сигналы из сообществ, официальные источники и FAQ — не юридическая консультация.";

export const metadata: Metadata = withSatelliteAiMetadata(
  {
    title: THAILAND_SATELLITE.title,
    description: fitMetaDescription(HUB_DESCRIPTION),
    keywords: ["Таиланд", "Пхукет", "релокация", "DTV Thailand", "LTR Thailand", "русскоязычные экспаты"],
    alternates: {
      canonical: thailandSatelliteUrl("/"),
      languages: {
        "ru-RU": thailandSatelliteUrl("/"),
        ru: thailandSatelliteUrl("/"),
        "x-default": thailandSatelliteUrl("/"),
      },
    },
    openGraph: {
      title: THAILAND_SATELLITE.title,
      description: fitMetaDescription(HUB_DESCRIPTION),
      url: thailandSatelliteUrl("/"),
      siteName: "Emigro Thailand",
      locale: "ru_RU",
      type: "website",
      images: [socialImageMetadata(DEFAULT_OG_IMAGE, THAILAND_SATELLITE.title)],
    },
    twitter: {
      card: "summary_large_image",
      title: THAILAND_SATELLITE.title,
      description: fitMetaDescription(HUB_DESCRIPTION),
      images: [socialImageMetadata(DEFAULT_OG_IMAGE, THAILAND_SATELLITE.title).url],
    },
  },
  "thailand",
  HUB_DESCRIPTION,
);

export default async function ThailandSatelliteHomePage() {
  const [spotlight, notes] = await Promise.all([
    getDailySpotlight("thailand"),
    requirePublishedCommunityNotes("thailand"),
  ]);
  const listNotes = spotlight ? notes.filter((note) => note.slug !== spotlight.note_slug) : notes;
  const guideNotes = listNotes.filter((note) => note.content_kind === "guide");
  const feedNotes = listNotes.filter((note) => note.content_kind !== "guide");
  const topicTags = Array.from(
    new Set(notes.flatMap((note) => note.topic_tags.filter((tag) => tag !== "thailand"))),
  ).sort();
  const destinationsLabel = topicTags.slice(0, 8).join(", ") || "DTV, LTR, TM30, Пхукет, аренда, банки";
  const llmsUrl = thailandSatelliteUrl("/llms");
  const hubUrl = thailandSatelliteUrl("/");
  const listForSchema = (
    spotlight ? [spotlight.note_slug, ...listNotes.map((note) => note.slug)] : listNotes.map((note) => note.slug)
  )
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter(Boolean)
    .slice(0, 20);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: THAILAND_SATELLITE.title,
    description: HUB_DESCRIPTION,
    url: hubUrl,
    inLanguage: "ru-RU",
    about: buildSatelliteHubPlace("thailand"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: listForSchema.map((note, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: thailandSatelliteUrl(`/notes/${note!.slug}`),
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
          {HUB_DESCRIPTION} Материалы предназначены для релокантов с паспортами RU/BY/UA/KZ и не заменяют
          проверку требований Thai Immigration.
        </p>
        <a href={llmsUrl} data-llm="commercial">llms.txt</a>
      </section>

      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{THAILAND_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{THAILAND_SATELLITE.tagline}</p>

      <SatelliteHubDepth
        countryKey="thailand"
        guideCount={notes.filter((note) => note.content_kind === "guide").length}
        noteCount={notes.length}
        feedCount={notes.filter((note) => note.content_kind !== "guide").length}
        topicCount={topicTags.length}
        destinationsLabel={destinationsLabel}
      />
      <SatelliteValueProp countryKey="thailand" />
      <SatelliteCityChatCta countryKey="thailand" source="thailand_satellite_hub" />
      <SatelliteFunnelCta countryKey="thailand" placement="satellite_hub" />
      <SatelliteHubScenarios countryKey="thailand" />

      {spotlight && <div className="mt-8"><DailySpotlightTile spotlight={spotlight} /></div>}
      <HashtagNav notes={notes} countryKey="thailand" />

      {guideNotes.length > 0 && (
        <section className="mt-10" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-xl font-semibold text-slate-900">Гайды ({guideNotes.length})</h2>
          <ul className="mt-6 space-y-4">
            {guideNotes.map((note) => <li key={note.slug}><NoteCard note={note} /></li>)}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          {feedNotes.length > 0 ? `Новости и заметки (${feedNotes.length})` : "Материалы"}
        </h2>
        {feedNotes.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {feedNotes.map((note) => <li key={note.slug}><NoteCard note={note} /></li>)}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Редакционные заметки ещё не опубликованы. Пока используйте{" "}
            <a
              href={satelliteHubUrl({ countryKey: "thailand", placement: "satellite_hub", content: "empty_state" })}
              className="text-indigo-900 underline"
            >
              основной хаб Таиланда
            </a>.
          </p>
        )}
      </section>

      <SatelliteAssistIntake countryKey="thailand" />
      <div className="mt-10">
        <ProviderPartnerRecruitment
          placement="satellite_hub"
          corridorSlug="ru-speaking-to-thailand"
          topicKey="thailand"
          countryRu="Таиланд"
        />
      </div>

      <p className="mt-12 text-center text-sm text-slate-500">
        <a
          href={satelliteWizardUrl({ countryKey: "thailand", placement: "satellite_hub", content: "footer" })}
          className="font-medium text-indigo-900 underline"
        >
          Подобрать маршрут →
        </a>
        {" · "}
        <a
          href={satelliteDigestUrl({ countryKey: "thailand", placement: "satellite_hub", content: "footer" })}
          className="text-indigo-900 underline"
        >
          Хаб Таиланда
        </a>
        {" · "}
        <a href={llmsUrl} className="text-indigo-900 underline">llms.txt</a>
      </p>
    </main>
  );
}

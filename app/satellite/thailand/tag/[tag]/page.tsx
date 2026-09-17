import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteCityChatCta } from "@/components/satellite/SatelliteCityChatCta";
import { hashtagLabel, normalizeHashtag, resolveTagParam } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { DEFAULT_OG_IMAGE, fitMetaDescription, socialImageMetadata } from "@/lib/seo";
import { tagPageRobots } from "@/lib/seo/thin-content";
import { corridorHreflangTag } from "@/lib/seo/hreflang";
import { thailandHubPath } from "@/lib/satellite/paths";
import { thailandSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("thailand");
  const tags = new Set(notes.flatMap((note) => note.hashtags.map(normalizeHashtag)));
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = resolveTagParam(params.tag);
  const allNotes = await getPublishedCommunityNotes("thailand");
  const notes = allNotes.filter((note) => note.hashtags.some((hashtag) => normalizeHashtag(hashtag) === tag));
  const label = hashtagLabel(tag);
  const url = thailandSatelliteUrl(`/tag/${encodeURIComponent(tag)}`);
  const description = fitMetaDescription(
    `#${label} — материалы для релокантов в Таиланде с фокусом на Пхукет: практика, короткие ответы, FAQ и официальные ссылки. Не юридическая консультация.`,
  );
  const regionTag = corridorHreflangTag("thailand");
  const languages: Record<string, string> = { "ru-RU": url, ru: url, "x-default": url };
  if (regionTag) languages[regionTag] = url;
  const image = socialImageMetadata(DEFAULT_OG_IMAGE, `#${label} — Таиланд`);

  return {
    title: `#${label} — Таиланд`,
    description,
    alternates: { canonical: url, languages },
    robots: tagPageRobots(notes.length),
    openGraph: {
      title: `#${label} — Таиланд`,
      description,
      url,
      siteName: "Emigro Thailand",
      locale: "ru_RU",
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `#${label} — Таиланд`, description, images: [image.url] },
  };
}

export default async function ThailandTagPage({ params }: { params: { tag: string } }) {
  const tag = resolveTagParam(params.tag);
  const allNotes = await getPublishedCommunityNotes("thailand");
  const notes = allNotes.filter((note) => note.hashtags.some((hashtag) => normalizeHashtag(hashtag) === tag));
  const label = hashtagLabel(tag);
  const url = thailandSatelliteUrl(`/tag/${encodeURIComponent(tag)}`);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${label} — Таиланд`,
    description: `Материалы Emigro Thailand с тегом #${label} для релокантов на Пхукете и в Таиланде.`,
    inLanguage: "ru-RU",
    url,
    about: {
      "@type": "Place",
      name: "Phuket, Thailand",
      address: {
        "@type": "PostalAddress",
        addressCountry: "TH",
        addressLocality: "Phuket",
        addressRegion: "Phuket Province",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: notes.map((note, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: thailandSatelliteUrl(`/notes/${note.slug}`),
        name: note.title,
      })),
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>#{label} — материалы Emigro для релокантов в Таиланде с фокусом на Пхукет.</p>
        <a href={thailandSatelliteUrl("/llms")}>llms.txt</a>
      </section>
      <nav className="text-sm text-slate-500">
        <Link href={thailandHubPath()} className="hover:text-indigo-950">Таиланд</Link>
        <span aria-hidden="true"> › </span>
        <span>#{label}</span>
      </nav>
      <h1 className={`mt-4 ${heroTitle} text-slate-900`}>#{label}</h1>
      <p className="mt-2 text-slate-600">
        {notes.length} {notes.length === 1 ? "материал" : notes.length < 5 ? "материала" : "материалов"}
      </p>
      <SatelliteCityChatCta countryKey="thailand" source="thailand_satellite_tag" />
      <HashtagNav notes={allNotes} activeTag={tag} countryKey="thailand" />
      <ul className="mt-10 space-y-4">
        {notes.map((note) => <li key={note.slug}><NoteCard note={note} /></li>)}
      </ul>
      {notes.length === 0 && (
        <p className="mt-8 text-slate-600">
          Пока нет материалов с этим тегом.{" "}
          <Link href={thailandHubPath()} className="text-indigo-900 underline">Смотреть все</Link>
        </p>
      )}
    </main>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteCityChatCta } from "@/components/satellite/SatelliteCityChatCta";
import { hashtagLabel, normalizeHashtag, resolveTagParam } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { tagPageRobots } from "@/lib/seo/thin-content";
import { corridorHreflangTag } from "@/lib/seo/hreflang";
import { italyHubPath } from "@/lib/satellite/paths";
import { italySatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("italy");
  const tags = new Set<string>();
  for (const n of notes) {
    for (const t of n.hashtags) tags.add(normalizeHashtag(t));
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = resolveTagParam(params.tag);
  const allNotes = await getPublishedCommunityNotes("italy");
  const notes = allNotes.filter((n) => n.hashtags.some((h) => normalizeHashtag(h) === tag));
  const label = hashtagLabel(tag);
  const url = italySatelliteUrl(`/tag/${encodeURIComponent(tag)}`);
  const description = fitMetaDescription(
    `#${label} — материалы для релокантов в Италии (Milano и север, включая Como): новости, лайфхаки, советы и гайды. Короткие ответы и FAQ, не юридическая консультация.`
  );
  const ogImage = socialImageMetadata(DEFAULT_OG_IMAGE, `#${label} — Италия`);
  const regionTag = corridorHreflangTag("italy");
  const languages: Record<string, string> = { "ru-RU": url, ru: url, "x-default": url };
  if (regionTag) languages[regionTag] = url;
  return {
    title: `#${label} — Италия`,
    description,
    alternates: { canonical: url, languages },
    robots: tagPageRobots(notes.length),
    openGraph: {
      title: `#${label} — Италия`,
      description,
      url,
      siteName: "Emigro Italy",
      locale: "ru_RU",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${label} — Италия`,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function ItalyTagPage({ params }: { params: { tag: string } }) {
  const tag = resolveTagParam(params.tag);
  const allNotes = await getPublishedCommunityNotes("italy");
  const notes = allNotes.filter((n) => n.hashtags.some((h) => normalizeHashtag(h) === tag));
  const url = italySatelliteUrl(`/tag/${encodeURIComponent(tag)}`);
  const label = hashtagLabel(tag);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${label} — Италия`,
    description: `Материалы Emigro Italy satellite с тегом #${label} для релокантов в Milano и на севере Италии.`,
    inLanguage: "ru-RU",
    url,
    about: {
      "@type": "Place",
      name: "Milan, Italy",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IT",
        addressLocality: "Milan",
        addressRegion: "Lombardy",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: notes.map((note, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: italySatelliteUrl(`/notes/${note.slug}`),
        name: note.title,
      })),
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>
          #{label} — материалы Italy satellite Emigro для релокантов в Италии: новости, лайфхаки, советы и гайды. Не
          юридическая консультация.
        </p>
        <a href={italySatelliteUrl("/llms")}>llms.txt</a>
      </section>
      <nav className="text-sm text-slate-500">
        <Link href={italyHubPath()} className="hover:text-emerald-900">
          Италия
        </Link>
        <span aria-hidden="true"> › </span>
        <span>#{hashtagLabel(tag)}</span>
      </nav>

      <h1 className={`mt-4 ${heroTitle} text-slate-900`}>#{hashtagLabel(tag)}</h1>
      <p className="mt-2 text-slate-600">
        {notes.length} {notes.length === 1 ? "материал" : notes.length < 5 ? "материала" : "материалов"}
      </p>

      <SatelliteCityChatCta countryKey="italy" source="italy_satellite_tag" />

      <HashtagNav notes={allNotes} activeTag={tag} countryKey="italy" />

      <ul className="mt-10 space-y-4">
        {notes.map((note) => (
          <li key={note.slug}>
            <NoteCard note={note} />
          </li>
        ))}
      </ul>

      {notes.length === 0 && (
        <p className="mt-8 text-slate-600">
          Пока нет материалов с этим тегом.{" "}
          <Link href={italyHubPath()} className="text-emerald-900 underline">
            Смотреть все
          </Link>
        </p>
      )}
    </main>
  );
}

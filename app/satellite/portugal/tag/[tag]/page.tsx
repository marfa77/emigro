import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes, getPublishedCommunityNotesByHashtag } from "@/lib/community-notes/queries";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { portugalHubPath } from "@/lib/satellite/paths";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("portugal");
  const tags = new Set<string>();
  for (const n of notes) {
    for (const t of n.hashtags) tags.add(normalizeHashtag(t));
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const label = hashtagLabel(params.tag);
  const url = portugalSatelliteUrl(`/tag/${normalizeHashtag(params.tag)}`);
  const description = fitMetaDescription(
    `#${label} — материалы для релокантов в Португалии (Norte: Порту, Брага, Minho): новости, лайфхаки, советы и гайды. Короткие ответы и FAQ, не юридическая консультация.`
  );
  const ogImage = socialImageMetadata(DEFAULT_OG_IMAGE, `#${label} — Португалия`);
  return {
    title: `#${label} — Португалия`,
    description,
    alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
    openGraph: {
      title: `#${label} — Португалия`,
      description,
      url,
      siteName: "Emigro Portugal",
      locale: "ru_RU",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${label} — Португалия`,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function PortugalTagPage({ params }: { params: { tag: string } }) {
  const tag = normalizeHashtag(params.tag);
  const allNotes = await getPublishedCommunityNotes("portugal");
  const notes = await getPublishedCommunityNotesByHashtag(tag, "portugal");
  const url = portugalSatelliteUrl(`/tag/${tag}`);
  const label = hashtagLabel(tag);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${label} — Португалия`,
    description: `Материалы Emigro Portugal satellite с тегом #${label} для релокантов в Norte (Порту, Брага).`,
    inLanguage: "ru-RU",
    url,
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
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: notes.map((note, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: portugalSatelliteUrl(`/notes/${note.slug}`),
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
          #{label} — материалы Portugal satellite Emigro для релокантов в Norte (Порту, Брага): новости, лайфхаки, советы и гайды.
          Не юридическая консультация.
        </p>
        <a href={portugalSatelliteUrl("/llms")}>llms.txt</a>
      </section>
      <nav className="text-sm text-slate-500">
        <Link href={portugalHubPath()} className="hover:text-teal-700">
          Португалия
        </Link>
        <span aria-hidden="true"> › </span>
        <span>#{hashtagLabel(tag)}</span>
      </nav>

      <h1 className={`mt-4 ${heroTitle} text-slate-900`}>#{hashtagLabel(tag)}</h1>
      <p className="mt-2 text-slate-600">
        {notes.length} {notes.length === 1 ? "материал" : notes.length < 5 ? "материала" : "материалов"}
      </p>

      <HashtagNav notes={allNotes} activeTag={tag} />

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
          <Link href={portugalHubPath()} className="text-teal-700 underline">
            Смотреть все
          </Link>
        </p>
      )}
    </main>
  );
}

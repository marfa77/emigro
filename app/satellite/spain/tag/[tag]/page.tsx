import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes, getPublishedCommunityNotesByHashtag } from "@/lib/community-notes/queries";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { tagPageRobots } from "@/lib/seo/thin-content";
import { corridorHreflangTag } from "@/lib/seo/hreflang";
import { spainHubPath } from "@/lib/satellite/paths";
import { spainSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("spain");
  const tags = new Set<string>();
  for (const n of notes) {
    for (const t of n.hashtags) tags.add(normalizeHashtag(t));
  }
  return Array.from(tags).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const tag = normalizeHashtag(params.tag);
  const notes = await getPublishedCommunityNotesByHashtag(tag, "spain");
  const label = hashtagLabel(params.tag);
  const url = spainSatelliteUrl(`/tag/${tag}`);
  const description = fitMetaDescription(
    `#${label} — материалы для релокантов в Испании (Valencia, Madrid, Barcelona): новости, лайфхаки, советы и гайды. Короткие ответы и FAQ, не юридическая консультация.`
  );
  const ogImage = socialImageMetadata(DEFAULT_OG_IMAGE, `#${label} — Испания`);
  const regionTag = corridorHreflangTag("spain");
  const languages: Record<string, string> = { "ru-RU": url, ru: url, "x-default": url };
  if (regionTag) languages[regionTag] = url;
  return {
    title: `#${label} — Испания`,
    description,
    alternates: { canonical: url, languages },
    robots: tagPageRobots(notes.length),
    openGraph: {
      title: `#${label} — Испания`,
      description,
      url,
      siteName: "Emigro Spain",
      locale: "ru_RU",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${label} — Испания`,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function SpainTagPage({ params }: { params: { tag: string } }) {
  const tag = normalizeHashtag(params.tag);
  const allNotes = await getPublishedCommunityNotes("spain");
  const notes = await getPublishedCommunityNotesByHashtag(tag, "spain");
  const url = spainSatelliteUrl(`/tag/${tag}`);
  const label = hashtagLabel(tag);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${label} — Испания`,
    description: `Материалы Emigro Spain satellite с тегом #${label} для релокантов в Valencia и Испании.`,
    inLanguage: "ru-RU",
    url,
    about: {
      "@type": "Place",
      name: "Valencia, Spain",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ES",
        addressLocality: "Valencia",
        addressRegion: "Comunitat Valenciana",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: notes.map((note, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: spainSatelliteUrl(`/notes/${note.slug}`),
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
          #{label} — материалы Spain satellite Emigro для релокантов в Испании: новости, лайфхаки, советы и гайды. Не
          юридическая консультация.
        </p>
        <a href={spainSatelliteUrl("/llms")}>llms.txt</a>
      </section>
      <nav className="text-sm text-slate-500">
        <Link href={spainHubPath()} className="hover:text-amber-900">
          Испания
        </Link>
        <span aria-hidden="true"> › </span>
        <span>#{hashtagLabel(tag)}</span>
      </nav>

      <h1 className={`mt-4 ${heroTitle} text-slate-900`}>#{hashtagLabel(tag)}</h1>
      <p className="mt-2 text-slate-600">
        {notes.length} {notes.length === 1 ? "материал" : notes.length < 5 ? "материала" : "материалов"}
      </p>

      <HashtagNav notes={allNotes} activeTag={tag} countryKey="spain" />

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
          <Link href={spainHubPath()} className="text-amber-900 underline">
            Смотреть все
          </Link>
        </p>
      )}
    </main>
  );
}

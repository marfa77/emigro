import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { hashtagLabel, normalizeHashtag } from "@/lib/community-notes/hashtags";
import { getPublishedCommunityNotes, getPublishedCommunityNotesByHashtag } from "@/lib/community-notes/queries";
import { portugalSatelliteUrl } from "@/lib/site-url";

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
  return {
    title: `#${label} — Португалия`,
    description: `Материалы Emigro по тегу #${label}: новости, лайфхаки, советы и гайды для релокантов в Португалии.`,
    alternates: { canonical: portugalSatelliteUrl(`/tag/${normalizeHashtag(params.tag)}`) },
  };
}

export default async function PortugalTagPage({ params }: { params: { tag: string } }) {
  const tag = normalizeHashtag(params.tag);
  const allNotes = await getPublishedCommunityNotes("portugal");
  const notes = await getPublishedCommunityNotesByHashtag(tag, "portugal");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-700">
          Португалия
        </Link>
        <span aria-hidden="true"> › </span>
        <span>#{hashtagLabel(tag)}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">#{hashtagLabel(tag)}</h1>
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
          <Link href="/" className="text-teal-700 underline">
            Смотреть все
          </Link>
        </p>
      )}
    </main>
  );
}

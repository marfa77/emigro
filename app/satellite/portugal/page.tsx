import Link from "next/link";
import type { Metadata } from "next";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: PORTUGAL_SATELLITE.title,
  description: PORTUGAL_SATELLITE.tagline,
  openGraph: {
    title: PORTUGAL_SATELLITE.title,
    description: PORTUGAL_SATELLITE.tagline,
    url: portugalSatelliteUrl("/"),
    siteName: "Emigro Portugal",
    type: "website",
  },
};

export default async function PortugalSatelliteHomePage() {
  const notes = await getPublishedCommunityNotes("portugal");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium text-teal-700">portugal.emigro.online</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{PORTUGAL_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>

      <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/80 p-4 text-sm text-slate-700">
        <p className="font-medium text-teal-900">Что здесь публикуем</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Новости</strong> — изменения правил (с официальным источником)
          </li>
          <li>
            <strong>Лайфхаки и советы</strong> — практика из чатов @chatlisboa и @por_tugal
          </li>
          <li>
            <strong>Гайды</strong> — пошаговые заметки редакции Emigro
          </li>
        </ul>
      </div>

      <HashtagNav notes={notes} />

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          Все материалы
        </h2>
        <ul className="mt-6 space-y-4">
          {notes.map((note) => (
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
      </p>
    </main>
  );
}

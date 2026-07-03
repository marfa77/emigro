import Link from "next/link";
import type { Metadata } from "next";
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

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function PortugalSatelliteHomePage() {
  const notes = await getPublishedCommunityNotes("portugal");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium text-teal-700">Тестовый сателлит · portugal.emigro.online</p>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{PORTUGAL_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>

      <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/80 p-4 text-sm text-slate-700">
        <p className="font-medium text-teal-900">Как это работает</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Парсер (как в Barakhlo) собирает <strong>текстовые сигналы</strong> из{" "}
            <a href={PORTUGAL_SATELLITE.sourceChannelUrl} className="text-teal-800 underline" target="_blank" rel="noopener noreferrer">
              @chatlisboa
            </a>
            .
          </li>
          <li>Редакция пишет заметку своим голосом и проверяет официальные источники.</li>
          <li>Заметка публикуется здесь, полный коридор — на основном Emigro.</li>
        </ol>
      </div>

      <section className="mt-12" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
          Заметки
        </h2>
        <ul className="mt-6 space-y-4">
          {notes.map((note) => (
            <li key={note.slug}>
              <article className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-200">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{note.category}</p>
                <h3 className="mt-2 text-lg font-semibold">
                  <Link href={`/notes/${note.slug}`} className="text-slate-900 hover:text-teal-800">
                    {note.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{note.excerpt}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {note.published_at && <time dateTime={note.published_at}>{formatDate(note.published_at)}</time>}
                  {note.source_label && <span>{note.source_label}</span>}
                </div>
              </article>
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

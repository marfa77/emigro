import { PORTUGAL_FEATURED_NOTES } from "@/lib/portugal/featured-notes";
import { portugalSatelliteHubUrl } from "@/lib/portugal/hub";
import { portugalSatellitePublicUrl } from "@/lib/site-url";

export function PortugalFeaturedNotes() {
  return (
    <section
      className="mt-12 rounded-xl border border-teal-200 bg-teal-50/50 p-6"
      aria-labelledby="portugal-practice-heading"
    >
      <h2 id="portugal-practice-heading" className="text-xl font-semibold text-slate-900">
        Практика для жизни в Португалии
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Гайды из Telegram-сигналов релокантов на{" "}
        <a href={portugalSatelliteHubUrl()} className="font-medium text-teal-800 underline hover:text-teal-950">
          portugal.emigro.online
        </a>
        — NIF, аренда, климат Norte, AIMA и быт.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {PORTUGAL_FEATURED_NOTES.map((note) => (
          <li key={note.slug}>
            <a
              href={portugalSatellitePublicUrl(`/notes/${note.slug}`)}
              className="group block rounded-lg border border-white bg-white p-4 transition hover:border-teal-300 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900 group-hover:text-teal-800">{note.title}</p>
              <p className="mt-1 text-sm text-slate-600">{note.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <a href={portugalSatelliteHubUrl()} className="font-medium text-teal-800 underline hover:text-teal-950">
          Все заметки на portugal.emigro.online →
        </a>
      </p>
    </section>
  );
}

import { ITALY_FEATURED_NOTES } from "@/lib/italy/featured-notes";
import { italySatelliteHubUrl } from "@/lib/italy/hub";
import { italySatellitePublicUrl } from "@/lib/site-url";

export function ItalyFeaturedNotes() {
  return (
    <section
      className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6"
      aria-labelledby="italy-practice-heading"
    >
      <h2 id="italy-practice-heading" className="text-xl font-semibold text-slate-900">
        Практика для жизни в Италии
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Гайды из Telegram-сигналов релокантов на{" "}
        <a href={italySatelliteHubUrl()} className="font-medium text-emerald-900 underline hover:text-emerald-950">
          italy.emigro.online
        </a>
        — codice fiscale, permesso, аренда в Milano и север (Como).
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {ITALY_FEATURED_NOTES.map((note) => (
          <li key={note.slug}>
            <a
              href={italySatellitePublicUrl(`/notes/${note.slug}`)}
              className="group block rounded-lg border border-white bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900 group-hover:text-emerald-900">{note.title}</p>
              <p className="mt-1 text-sm text-slate-600">{note.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <a href={italySatelliteHubUrl()} className="font-medium text-emerald-900 underline hover:text-emerald-950">
          Все заметки на italy.emigro.online →
        </a>
      </p>
    </section>
  );
}

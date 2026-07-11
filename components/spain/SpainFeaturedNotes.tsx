import { SPAIN_FEATURED_NOTES } from "@/lib/spain/featured-notes";
import { spainSatelliteHubUrl } from "@/lib/spain/hub";
import { spainSatellitePublicUrl } from "@/lib/site-url";

export function SpainFeaturedNotes() {
  return (
    <section
      className="mt-12 rounded-xl border border-amber-200 bg-amber-50/50 p-6"
      aria-labelledby="spain-practice-heading"
    >
      <h2 id="spain-practice-heading" className="text-xl font-semibold text-slate-900">
        Практика для жизни в Испании
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Гайды из Telegram-сигналов релокантов на{" "}
        <a href={spainSatelliteHubUrl()} className="font-medium text-amber-900 underline hover:text-amber-950">
          spain.emigro.online
        </a>
        — NIE, TIE, extranjería, аренда в Valencia и быт.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {SPAIN_FEATURED_NOTES.map((note) => (
          <li key={note.slug}>
            <a
              href={spainSatellitePublicUrl(`/notes/${note.slug}`)}
              className="group block rounded-lg border border-white bg-white p-4 transition hover:border-amber-300 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900 group-hover:text-amber-900">{note.title}</p>
              <p className="mt-1 text-sm text-slate-600">{note.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <a href={spainSatelliteHubUrl()} className="font-medium text-amber-900 underline hover:text-amber-950">
          Все заметки на spain.emigro.online →
        </a>
      </p>
    </section>
  );
}

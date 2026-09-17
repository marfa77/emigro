import { THAILAND_FEATURED_NOTES } from "@/lib/thailand/featured-notes";
import { thailandSatellitePublicUrl } from "@/lib/site-url";

export function ThailandFeaturedNotes() {
  return (
    <section
      className="mt-12 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6"
      aria-labelledby="thailand-practice-heading"
    >
      <h2 id="thailand-practice-heading" className="text-xl font-semibold text-slate-900">
        Практика для жизни на Пхукете
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Полные гайды на{" "}
        <a
          href={thailandSatellitePublicUrl("/")}
          className="font-medium text-emerald-900 underline hover:text-emerald-950"
        >
          thailand.emigro.online
        </a>
        : первый месяц, аренда, районы, медицина, банки и миграционные процедуры.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {THAILAND_FEATURED_NOTES.map((note) => (
          <li key={note.slug}>
            <a
              href={thailandSatellitePublicUrl(`/notes/${note.slug}`)}
              className="group block rounded-lg border border-white bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900 group-hover:text-emerald-900">{note.title}</p>
              <p className="mt-1 text-sm text-slate-600">{note.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <a
          href={thailandSatellitePublicUrl("/")}
          className="font-medium text-emerald-900 underline hover:text-emerald-950"
        >
          Все гайды о жизни на Пхукете →
        </a>
      </p>
    </section>
  );
}

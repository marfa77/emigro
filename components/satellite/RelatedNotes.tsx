import { NoteCard } from "@/components/satellite/NoteCard";
import type { CommunityNote } from "@/lib/community-notes/types";

export function RelatedNotes({ notes }: { notes: CommunityNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section
      className="mt-12 rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6"
      aria-labelledby="related-heading"
    >
      <h2 id="related-heading" className="text-lg font-semibold text-slate-900 sm:text-xl">
        Читайте также
      </h2>
      <ul className="mt-4 space-y-4">
        {notes.map((note) => (
          <li key={note.slug}>
            <NoteCard note={note} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SatelliteValueProp({ countryKey = "portugal" }: { countryKey?: "portugal" | "spain" }) {
  if (countryKey === "spain") {
    return (
      <section className="mt-6 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <p>
          <strong className="text-slate-900">Зачем этот раздел:</strong> короткие ответы на частые вопросы из чатов
          релокантов — NIE, TIE, extranjería, аренда, банки. Без пересказа Telegram, с официальными ссылками.
        </p>
        <p className="mt-2">
          Полный коридор с новостями, wizard и digest — на{" "}
          <a href="https://www.emigro.online/ru/spain" className="font-medium text-amber-900 underline hover:text-amber-950">
            emigro.online/ru/spain
          </a>
          . Pillar-гид:{" "}
          <a
            href="https://www.emigro.online/ru/guides/vnj-ispaniya-2026"
            className="font-medium text-amber-900 underline hover:text-amber-950"
          >
            Digital nomad Испания 2026
          </a>
          .
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-xl border border-teal-100 bg-teal-50/60 p-4 text-sm leading-relaxed text-slate-700">
      <p>
        <strong className="text-slate-900">Зачем этот раздел:</strong> короткие ответы на частые вопросы из чатов
        релокантов — NIF, AIMA, аренда, SNS, банки. Без пересказа Telegram, с официальными ссылками.
      </p>
      <p className="mt-2">
        Полный коридор с новостями, wizard и digest — на{" "}
        <a href="https://www.emigro.online/ru/portugal" className="font-medium text-teal-700 underline hover:text-teal-900">
          emigro.online/ru/portugal
        </a>
        . Pillar-гид:{" "}
        <a
          href="https://www.emigro.online/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026"
          className="font-medium text-teal-700 underline hover:text-teal-900"
        >
          D8 и D7 Португалия 2026
        </a>
        .
      </p>
    </section>
  );
}

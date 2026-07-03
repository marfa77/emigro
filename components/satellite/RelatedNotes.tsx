import { NoteCard } from "@/components/satellite/NoteCard";
import type { CommunityNote } from "@/lib/community-notes/types";

export function RelatedNotes({ notes }: { notes: CommunityNote[] }) {
  if (notes.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-lg font-semibold text-slate-900">
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

export function SatelliteValueProp() {
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
        .
      </p>
    </section>
  );
}

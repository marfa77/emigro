"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EventSaveButton, savedEventSlugs } from "@/components/satellite/EventSaveButton";
import { EventTypeIcon } from "@/components/satellite/EventTypeIcon";
import {
  eventKind,
  eventMeta,
  formatClock,
  formatLisbonDayLabel,
  lisbonDay,
  type CalendarEvent,
} from "@/lib/events/calendar-types";

export type CalendarSection = {
  id: string;
  kicker?: string;
  events: CalendarEvent[];
};

export function CalendarBoard({
  sections,
  savedPool,
  pathPrefix,
}: {
  sections: CalendarSection[];
  savedPool: CalendarEvent[];
  pathPrefix: string;
}) {
  const [onlySaved, setOnlySaved] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setSaved(savedEventSlugs());
    sync();
    window.addEventListener("emigro-pt-saves", sync);
    return () => window.removeEventListener("emigro-pt-saves", sync);
  }, []);

  const savedEvents = savedPool.filter((event) => saved.includes(event.slug));
  const visible = onlySaved
    ? [{ id: "saved", kicker: "Сохранённые", events: savedEvents }]
    : sections.filter((section) => section.events.length > 0);
  const savedHere = savedEvents.filter((event) => sections.some((section) => section.events.some((item) => item.slug === event.slug)));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {saved.length ? `${saved.length} на этом устройстве` : "Сердечко хранит выбор на этом устройстве"}
        </p>
        <button
          type="button"
          aria-pressed={onlySaved}
          onClick={() => setOnlySaved((value) => !value)}
          className={`rounded-full border px-3 py-1 text-sm ${
            onlySaved ? "border-rose-300 bg-rose-50 text-rose-800" : "border-slate-300 text-slate-700"
          }`}
        >
          Мои{saved.length ? ` ${saved.length}` : ""}
        </button>
      </div>
      {!onlySaved && savedHere.length ? (
        <section>
          <h2 className="text-xl font-semibold text-slate-900">Ваши на эти дни</h2>
          <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
            {savedHere.map((event) => (
              <EventRow key={event.slug} event={event} href={`${pathPrefix}/${event.slug}`} />
            ))}
          </ul>
        </section>
      ) : null}
      {visible.length === 0 || visible.every((section) => section.events.length === 0) ? (
        <p className="text-slate-600">
          {onlySaved ? "Пока пусто. Сердечко на строке оставляет событие здесь." : "На эти дни событий нет."}
        </p>
      ) : null}
      {visible.map((section) => (
        <DayGroups key={section.id} section={section} pathPrefix={pathPrefix} />
      ))}
    </div>
  );
}

function DayGroups({ section, pathPrefix }: { section: CalendarSection; pathPrefix: string }) {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of section.events) {
    const day = lisbonDay(event.start_at);
    groups.set(day, [...(groups.get(day) ?? []), event]);
  }
  return (
    <div className="space-y-6">
      {section.kicker ? <h2 className="text-xl font-semibold text-slate-900">{section.kicker}</h2> : null}
      {[...groups.entries()].map(([day, items]) => {
        const timed = items.filter((event) => formatClock(event.start_at, event.end_at));
        const open = items.filter((event) => !formatClock(event.start_at, event.end_at));
        return (
          <section key={day} id={`d-${day}`} className="scroll-mt-24">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {formatLisbonDayLabel(items[0]!.start_at)}
            </h3>
            {timed.length ? (
              <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
                {timed.map((event) => (
                  <EventRow key={event.slug} event={event} href={`${pathPrefix}/${event.slug}`} />
                ))}
              </ul>
            ) : null}
            {open.length ? (
              <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                Без точного часа:{" "}
                {open.map((event, index) => (
                  <span key={event.slug}>
                    {index ? ", " : ""}
                    <Link href={`${pathPrefix}/${event.slug}`} className="text-slate-800 underline">
                      <EventTypeIcon type={eventKind(event)} size="inline" />
                      {event.title}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function EventRow({ event, href }: { event: CalendarEvent; href: string }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <EventTypeIcon type={eventKind(event)} />
      <div className="min-w-0 flex-1">
        <Link href={href} className="block break-words font-medium text-slate-900 hover:text-teal-800">
          {event.title}
        </Link>
        <p className="break-words text-sm text-slate-500">{eventMeta(event)}</p>
      </div>
      <EventSaveButton slug={event.slug} variant="icon" />
    </li>
  );
}

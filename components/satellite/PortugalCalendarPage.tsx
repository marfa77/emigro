import type { Metadata } from "next";
import Link from "next/link";
import { CalendarBoard, type CalendarSection } from "@/components/satellite/CalendarBoard";
import { EventTypeIcon } from "@/components/satellite/EventTypeIcon";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import {
  displayTags,
  eventKind,
  eventTagsOf,
  formatClock,
  lisbonDay,
  lisbonWeekIndex,
  PLACE_TAGS,
  planDays,
  tagLabel,
  themeDot,
  themeOrder,
  TYPE_TAGS,
  venueName,
  type CalendarEvent,
} from "@/lib/events/calendar-types";
import { listPortugalEvents } from "@/lib/events/portugal-calendar";
import { portugalCalendarPath } from "@/lib/satellite/paths";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export type CalendarPlace = "porto" | "lisboa";

const COPY = {
  all: {
    title: "Куда пойти в Порту и Лиссабоне 2026",
    h1: "Календарь Порту и Лиссабона",
    path: "/calendar",
    lede: "Куда пойти в Порту и Лиссабоне в 2026: походы севера, концерты, ночи, театр и матчи. Час, место и цена на эти выходные. Для тех, кто живёт в Португалии.",
    description:
      "Куда пойти в Порту и Лиссабоне в 2026: походы севера, концерты, ночи, театр и матчи. Час, место и цена на эти выходные. Для тех, кто живёт в Португалии.",
  },
  porto: {
    title: "Куда пойти в Порту 2026: выходные",
    h1: "Куда пойти в Порту",
    path: "/calendar/porto",
    lede: "Куда пойти в Порту на выходных 2026: концерты, ночи и матчи в городе, походы в Жереше, Браге и на севере. Час, место и цена. Для жизни в Порту и на севере.",
    description:
      "Куда пойти в Порту на выходных 2026: концерты, ночи и матчи в городе, походы в Жереше, Браге и на севере. Час, место и цена. Для жизни в Порту и на севере.",
  },
  lisboa: {
    title: "Афиша Лиссабона 2026: куда пойти",
    h1: "Афиша Лиссабона",
    path: "/calendar/lisboa",
    lede: "Афиша Лиссабона 2026: концерты, театр, кино и выставки с часом и местом. Куда пойти сегодня и на ближайшие выходные. Для тех, кто живёт в Лиссабоне.",
    description:
      "Афиша Лиссабона 2026: концерты, театр, кино и выставки с часом и местом. Куда пойти сегодня и на ближайшие выходные. Для тех, кто живёт в Лиссабоне.",
  },
} as const;

function byStart(a: CalendarEvent, b: CalendarEvent): number {
  return Date.parse(a.start_at) - Date.parse(b.start_at);
}

function onDays(events: CalendarEvent[], days: string[]): CalendarEvent[] {
  const set = new Set(days);
  return events.filter((event) => set.has(lisbonDay(event.start_at))).sort(byStart);
}

function ruCount(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} ${few}`;
  return `${count} ${many}`;
}

function named(event: CalendarEvent): string {
  const where = venueName(event);
  const clock = formatClock(event.start_at, event.end_at);
  const price = event.price_label ? `, ${event.price_label}` : "";
  return `${event.title} в ${where}${clock ? `, ${clock}` : ""}${price}`;
}

function hourOf(event: CalendarEvent): number | null {
  const clock = formatClock(event.start_at, event.end_at);
  if (!clock) return null;
  const hour = Number(clock.slice(0, 2));
  return Number.isFinite(hour) ? hour : null;
}

function eveningPick(events: CalendarEvent[], theme: string): CalendarEvent | undefined {
  const timed = events.filter((event) => event.theme === theme && hourOf(event) !== null).sort(byStart);
  return timed.find((event) => {
    const hour = hourOf(event) ?? 0;
    return hour >= 17 || hour < 6;
  }) || timed[0];
}

type TodayTile = { href: string; kind: string; kicker: string; title: string; meta: string };

function todayTiles(events: CalendarEvent[], path: string): TodayTile[] {
  const timed = events.filter((event) => formatClock(event.start_at, event.end_at));
  const tiles: TodayTile[] = [];
  const hikes = timed.filter((event) => event.theme === "hike");
  if (hikes.length) {
    tiles.push({
      href: `#d-${lisbonDay(hikes[0]!.start_at)}`,
      kind: "hike",
      kicker: "Днём",
      title: ruCount(hikes.length, "поход", "похода", "походов"),
      meta: "старт с утра",
    });
  }
  const night = eveningPick(timed, "night");
  const show = eveningPick(timed, "culture");
  const match = eveningPick(timed, "sport");
  for (const event of [show, night && night !== show ? night : undefined, match]) {
    if (!event) continue;
    const clock = formatClock(event.start_at, event.end_at);
    tiles.push({
      href: `${path}/${event.slug}`,
      kind: eventKind(event),
      kicker: clock || tagLabel(eventKind(event)),
      title: event.title,
      meta: [venueName(event), event.price_label].filter(Boolean).join(" · "),
    });
  }
  return tiles;
}

function weekendSentence(events: CalendarEvent[], todayIsWeekend: boolean): string {
  const timed = events.filter((event) => formatClock(event.start_at, event.end_at));
  if (!timed.length) return "На эти выходные пока нет событий с часом. Ближайшие даты — ниже.";
  const hikes = timed.filter((event) => event.theme === "hike").length;
  const night = eveningPick(timed, "night");
  const show = eveningPick(timed, "culture");
  const match = eveningPick(timed, "sport");
  const when = todayIsWeekend ? "Сегодня" : "На этих выходных";
  const bits = [
    hikes ? `днём ${ruCount(hikes, "поход", "похода", "походов")}` : "",
    show ? named(show) : "",
    night && night !== show ? named(night) : "",
    match ? `Матч ${match.title}` : "",
  ].filter(Boolean);
  return `${when}: ${bits.join(". ")}.`.replace(/\s+/g, " ").trim();
}

export async function calendarMetadata(place?: CalendarPlace): Promise<Metadata> {
  const events = await listPortugalEvents();
  const plan = planDays();
  const copy = COPY[place || "all"];
  const weekend = onDays(eventsForPlace(events, place), plan.weekend);
  const live = weekendSentence(weekend, lisbonWeekIndex(plan.today) >= 5);
  const description = fitMetaDescription(copy.description);
  const title = fitSeoTitlePart(copy.title);
  const url = portugalSatelliteUrl(copy.path);
  return withSatelliteAiMetadata(
    {
      title,
      description,
      alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
      openGraph: {
        title,
        description,
        url,
        siteName: "Emigro Portugal",
        locale: "ru_RU",
        type: "website",
        images: [socialImageMetadata(DEFAULT_OG_IMAGE, title)],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [socialImageMetadata(DEFAULT_OG_IMAGE, title).url],
      },
    },
    "portugal",
    `${copy.lede} ${live}`
  );
}

const FAQ = [
  {
    q: "Куда пойти в Порту на выходных?",
    a: "В Порту на эти выходные есть концерты, ночи и матчи с часом и ценой. Походы вынесены на север: Жереш, Брага и окрестности. Отдельный список — на странице Порту.",
  },
  {
    q: "Где афиша Лиссабона?",
    a: "Концерты, театр, кино и выставки Лиссабона с часом и местом собраны на странице афиши. Часы, которых не было в карточке, стоят у организатора. Основа списка — Agenda Cultural de Lisboa.",
  },
  {
    q: "Какие походы есть на севере Португалии?",
    a: "В календаре походы с часом старта и ценой: Жереш, Пенеда-Жереш, Брага и выезды из Порту. Запись идёт на странице организатора, часто это Gerês Viver Turismo и клубы севера.",
  },
  {
    q: "Это все события Португалии?",
    a: "Нет. Здесь Порту, Лиссабон и север: походы, ночи, концерты Casa da Música, афиша Лиссабона и матчи Primeira Liga в этих городах. Алгарве, Мадейра и центр страны в календарь не входят. Закрытые площадки без открытой афиши тоже.",
  },
  {
    q: "Как не забыть событие?",
    a: "Сердечко сохраняет его в этом браузере. Кнопка «Мои» показывает только сохранённые. На странице события есть файл для календаря телефона.",
  },
  {
    q: "Как попасть на событие?",
    a: "На карточке есть страница организатора: там билет и точное время, если на афише его не было. Карта открывает точку старта или клуб.",
  },
] as const;

function eventsForPlace(events: CalendarEvent[], place?: CalendarPlace): CalendarEvent[] {
  if (place === "lisboa") return events.filter((event) => eventTagsOf(event).includes("lisboa"));
  if (place === "porto") {
    return events.filter((event) => eventTagsOf(event).some((tag) => tag === "porto" || tag === "braga" || tag === "geres" || tag === "norte"));
  }
  return events;
}

export async function PortugalCalendarPage({
  searchParams,
  place,
}: {
  searchParams?: { when?: string; tag?: string; theme?: string; city?: string; place?: string };
  place?: CalendarPlace;
}) {
  const events = eventsForPlace(await listPortugalEvents(), place);
  const plan = planDays();
  const copy = COPY[place || "all"];
  const when = searchParams?.when === "all" ? "all" : "weekend";
  const rawTag = searchParams?.tag || searchParams?.theme || "";
  const rawCity = searchParams?.city || searchParams?.place || "";
  const type = (TYPE_TAGS as readonly string[]).includes(rawTag) ? rawTag : undefined;
  const city = (PLACE_TAGS as readonly string[]).includes(rawCity)
    ? rawCity
    : (PLACE_TAGS as readonly string[]).includes(rawTag)
      ? rawTag
      : undefined;
  const path = `${portugalCalendarPath()}${place ? `/${place}` : ""}`;

  const dated = when === "all" ? events : [...onDays(events, plan.weekend), ...onDays(events, plan.nextWeekend)];
  const tagged = dated.filter((event) => {
    const tags = eventTagsOf(event);
    return (!type || tags.includes(type)) && (!city || tags.includes(city));
  });
  const placed = applyPlace(tagged, place);
  const sections = buildSections(placed, plan, when, place);
  const weekendEvents = onDays(events, plan.weekend);
  const todayIsWeekend = lisbonWeekIndex(plan.today) >= 5;
  const answer = weekendSentence(weekendEvents, todayIsWeekend);
  const tiles = todayTiles(weekendEvents, path);

  const inCity = city ? dated.filter((event) => eventTagsOf(event).includes(city)) : dated;
  const inType = type ? dated.filter((event) => eventTagsOf(event).includes(type)) : dated;
  const typeCounts = Object.fromEntries(TYPE_TAGS.map((item) => [item, inCity.filter((event) => eventTagsOf(event).includes(item)).length]));
  const cityCounts = Object.fromEntries(PLACE_TAGS.map((item) => [item, inType.filter((event) => eventTagsOf(event).includes(item)).length]));
  const months = [...new Set(events.map((event) => lisbonDay(event.start_at).slice(0, 7)))];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className={`${satelliteMain} overflow-x-clip`}>
      <p className="sr-only" data-llm="facts">
        {copy.lede} {answer} Аудитория: русскоязычные в Порту, Лиссабоне и на севере Португалии.
      </p>
      <p className="text-sm font-medium text-teal-800">Порту · Лиссабон · север</p>
      <h1 className={`${heroTitle} mt-2`}>{copy.h1}</h1>
      <p className="mt-3 text-lg text-slate-800">{copy.lede}</p>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        <Link href={portugalCalendarPath()} className={place ? "text-teal-800 underline" : "font-medium text-slate-900"}>
          Все города
        </Link>
        <Link href={`${portugalCalendarPath()}/porto`} className={place === "porto" ? "font-medium text-slate-900" : "text-teal-800 underline"}>
          Куда пойти в Порту
        </Link>
        <Link href={`${portugalCalendarPath()}/lisboa`} className={place === "lisboa" ? "font-medium text-slate-900" : "text-teal-800 underline"}>
          Афиша Лиссабона
        </Link>
      </p>
      <div className="mt-4 flex min-w-0 flex-wrap gap-2">
        <Filter href={linkTo(path, { tag: type, city })} active={when === "weekend"} label="Эти выходные" />
        <Filter href={linkTo(path, { when: "all", tag: type, city })} active={when === "all"} label="Все даты" />
        {TYPE_TAGS.map((item) =>
          typeCounts[item] ? (
            <Filter
              key={item}
              href={linkTo(path, { when, city, tag: type === item ? undefined : item })}
              active={type === item}
              label={`${tagLabel(item)} ${typeCounts[item]}`}
            />
          ) : null
        )}
      </div>
      <div className="mt-2 flex min-w-0 flex-wrap gap-2">
        {PLACE_TAGS.map((item) =>
          cityCounts[item] ? (
            <Filter
              key={item}
              href={
                item === "porto" || item === "lisboa"
                  ? place === item
                    ? portugalCalendarPath()
                    : `${portugalCalendarPath()}/${item}`
                  : linkTo(path, { when, tag: type, city: city === item ? undefined : item })
              }
              active={place === item || city === item}
              label={`${tagLabel(item)} ${cityCounts[item]}`}
            />
          ) : null
        )}
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {todayIsWeekend ? "Сегодня" : "На этих выходных"}
      </p>
      {tiles.length ? (
        <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tiles.map((tile) => (
            <li key={`${tile.kind}-${tile.title}`}>
              <Link href={tile.href} className="flex h-full min-h-[44px] flex-col gap-1 rounded-2xl bg-slate-50 p-3 hover:bg-slate-100">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <EventTypeIcon type={tile.kind} size="inline" />
                  {tile.kicker}
                </span>
                <span className="line-clamp-3 font-medium leading-snug text-slate-900">{tile.title}</span>
                {tile.meta ? <span className="text-sm text-slate-500">{tile.meta}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-slate-600">На эти выходные пока нет событий с часом.</p>
      )}
      <p className="mt-2 text-sm text-slate-600">
        Следующие выходные — {formatShort(plan.nextWeekend[0]!)} и {formatShort(plan.nextWeekend[1]!)}.
      </p>

      <div className="mt-6 space-y-4">
        {months.map((month) => (
          <MonthGrid key={month} month={month} events={events} path={path} today={plan.today} />
        ))}
      </div>

      <div className="mt-8">
        <CalendarBoard sections={sections} savedPool={events} pathPrefix={path} />
      </div>

      <section className="mt-12 space-y-3">
        <h2 className="text-xl font-semibold">Вопросы</h2>
        {FAQ.map((item) => (
          <details key={item.q} className="rounded-xl border border-slate-200 px-4 py-3">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 text-slate-700">{item.a}</p>
          </details>
        ))}
      </section>

      <p className="mt-8 text-sm text-slate-500">
        Три карточки в день уходят в{" "}
        <a className="text-teal-800 underline" href="https://t.me/emigro_portugal">
          @emigro_portugal
        </a>
        . Здесь весь список.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd(copy, weekendEvents)) }} />
    </main>
  );
}

function applyPlace(events: CalendarEvent[], place?: string): { main: CalendarEvent[]; trips: CalendarEvent[] } {
  if (place === "lisboa") return { main: events.filter((event) => event.city === "Lisboa"), trips: [] };
  if (place === "geres") return { main: events.filter((event) => event.city === "Gerês"), trips: [] };
  if (place === "porto") {
    return {
      main: events.filter((event) => event.city === "Porto"),
      trips: events.filter(
        (event) =>
          (event.theme === "hike" || event.theme === "sport") &&
          (event.city === "Norte" || event.city === "Gerês" || event.city === "Braga")
      ),
    };
  }
  return { main: events, trips: [] };
}

function buildSections(
  placed: { main: CalendarEvent[]; trips: CalendarEvent[] },
  plan: { today: string; weekend: string[]; nextWeekend: string[] },
  when: "weekend" | "all",
  place?: string
): CalendarSection[] {
  if (when === "all") {
    const sections: CalendarSection[] = [
      { id: "all", kicker: place === "porto" ? "В Порту" : "Ближайшие недели", events: placed.main },
    ];
    if (placed.trips.length) sections.push({ id: "trips", kicker: "На север", events: placed.trips });
    return sections;
  }
  const weekendMain = onDays(placed.main, plan.weekend);
  const nextMain = onDays(placed.main, plan.nextWeekend);
  const weekendTrips = onDays(placed.trips, plan.weekend);
  const nextTrips = onDays(placed.trips, plan.nextWeekend);
  const todayLabel = lisbonWeekIndex(plan.today) >= 5 ? "Сегодня и эти выходные" : "Эти выходные";
  const sections: CalendarSection[] = [
    { id: `d-${plan.weekend[0]}`, kicker: todayLabel, events: weekendMain },
    { id: `d-${plan.nextWeekend[0]}`, kicker: "Следующие выходные", events: nextMain },
  ];
  if (weekendTrips.length) sections.push({ id: "trips-now", kicker: "На север в эти дни", events: weekendTrips });
  if (nextTrips.length) sections.push({ id: "trips-next", kicker: "На север на следующих выходных", events: nextTrips });
  return sections;
}

function linkTo(path: string, params: { when?: string; tag?: string; city?: string }): string {
  const query = new URLSearchParams();
  if (params.when === "all") query.set("when", "all");
  if (params.tag) query.set("tag", params.tag);
  if (params.city) query.set("city", params.city);
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}

function formatShort(day: string): string {
  return new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Lisbon", day: "numeric", month: "long" }).format(
    new Date(`${day}T12:00:00Z`)
  );
}

function MonthGrid({ month, events, path, today }: { month: string; events: CalendarEvent[]; path: string; today: string }) {
  const [year, monthNum] = month.split("-").map(Number);
  const days = new Date(Date.UTC(year!, monthNum!, 0, 12)).getUTCDate();
  const lead = lisbonWeekIndex(`${month}-01`);
  const byDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const day = lisbonDay(event.start_at);
    if (!day.startsWith(month)) continue;
    byDay.set(day, [...(byDay.get(day) ?? []), event]);
  }
  const label = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Lisbon", month: "long", year: "numeric" }).format(
    new Date(`${month}-01T12:00:00Z`)
  );
  const cells: Array<string | null> = [...Array(lead).fill(null)];
  for (let day = 1; day <= days; day++) cells.push(`${month}-${String(day).padStart(2, "0")}`);

  return (
    <div>
      <p className="mb-2 text-sm font-medium capitalize text-slate-700">{label}</p>
      <div className="grid w-full min-w-0 grid-cols-7 gap-1 text-center text-[11px]">
        {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((name) => (
          <div key={name} className="py-1 text-slate-400">
            {name}
          </div>
        ))}
        {cells.map((iso, index) => {
          if (!iso) return <div key={`empty-${index}`} />;
          const items = byDay.get(iso) ?? [];
          const weekend = lisbonWeekIndex(iso) >= 5;
          const themes = [...new Set(items.flatMap((event) => displayTags(event)))].sort(
            (a, b) => themeOrder(a) - themeOrder(b)
          );
          const className = `min-w-0 overflow-hidden rounded-md py-1 ${iso === today ? "bg-teal-700 text-white" : weekend ? "bg-amber-50 text-slate-800" : "text-slate-700"}`;
          const inner = (
            <>
              <span className="block font-medium leading-none">{Number(iso.slice(-2))}</span>
              <span className="mt-1 flex h-3 items-center justify-center gap-px overflow-hidden">
                {themes[0] ? (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${iso === today ? "bg-white" : themeDot(themes[0])}`} />
                ) : null}
                {items.length > 1 ? (
                  <span className={`text-[10px] leading-none ${iso === today ? "text-white/80" : "text-slate-500"}`}>{items.length}</span>
                ) : null}
              </span>
            </>
          );
          return items.length ? (
            <a key={iso} href={`${path}?when=all#d-${iso}`} className={className}>
              {inner}
            </a>
          ) : (
            <div key={iso} className={`${className} text-slate-300`}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function collectionLd(
  copy: (typeof COPY)[CalendarPlace] | (typeof COPY)["all"],
  events: CalendarEvent[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.h1,
    description: copy.lede,
    url: portugalSatelliteUrl(copy.path),
    inLanguage: "ru-RU",
    audience: "Russian-speaking residents in Porto, Lisbon and the north of Portugal",
    about: [
      placeSchema("Porto", "Norte", 41.1579, -8.6291),
      placeSchema("Lisbon", "Lisboa", 38.7223, -9.1393),
    ],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: Math.min(events.length, 12),
      itemListElement: events.slice(0, 12).map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: event.title,
        url: portugalSatelliteUrl(`/calendar/${event.slug}`),
      })),
    },
  };
}

function placeSchema(city: string, region: string, latitude: number, longitude: number) {
  return {
    "@type": "Place",
    name: `${city}, Portugal`,
    address: { "@type": "PostalAddress", addressLocality: city, addressRegion: region, addressCountry: "PT" },
    geo: { "@type": "GeoCoordinates", latitude, longitude },
  };
}

function Filter({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center rounded-full px-3 text-sm ${active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
    >
      {label}
    </Link>
  );
}

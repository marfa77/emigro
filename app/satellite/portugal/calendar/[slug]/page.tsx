import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventSaveButton } from "@/components/satellite/EventSaveButton";
import { EventTypeIcon } from "@/components/satellite/EventTypeIcon";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { displayTags, eventKind, eventMeta, formatClock, formatEventWhen, tagLabel, venueName } from "@/lib/events/calendar-types";
import { mainSiteUrl, portugalCalendarPath } from "@/lib/satellite/paths";
import { getPortugalEvent, themeChip } from "@/lib/events/portugal-calendar";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

/**
 * Empty list on purpose: nothing is prerendered at build, but declaring static params
 * makes this an ISR route. Without it Vercel deployed the page as a plain function and
 * rendered every hit (cache-control: private, x-vercel-cache MISS); now the first hit
 * renders and the CDN serves the rest until `revalidate` expires.
 */
export function generateStaticParams() {
  return [];
}

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const event = await getPortugalEvent(params.slug);
  if (!event) return { title: "Событие", robots: { index: false, follow: false } };
  const when = formatEventWhen(event.start_at, event.end_at);
  const fact = `${event.title}. ${eventMeta(event)}. Билет и карта на странице организатора, календарь выходных Порту и Лиссабона.`;
  const title = fitSeoTitlePart(`${event.title} — ${when}`);
  const description = fitMetaDescription(fact);
  const url = portugalSatelliteUrl(`/calendar/${event.slug}`);
  const past = Date.parse(event.start_at) < Date.now() - 6 * 60 * 60 * 1000;
  return withSatelliteAiMetadata(
    {
      title,
      description,
      robots: past ? { index: false, follow: true } : { index: true, follow: true },
      alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        // Football fixtures and some listings carry no image; fall back to the Portugal card so shares never go blank.
        images: [
          socialImageMetadata(event.image_url || mainSiteUrl("/images/og/corridor-portugal.jpg"), event.title),
        ],
      },
    },
    "portugal",
    fact
  );
}

export default async function PortugalEventPage({ params }: Params) {
  const event = await getPortugalEvent(params.slug);
  if (!event) notFound();
  const when = formatEventWhen(event.start_at, event.end_at);
  const clock = formatClock(event.start_at, event.end_at);
  const blurb =
    event.description && event.description.length > 120 && event.description.trim() !== event.location.trim()
      ? event.description.trim()
      : null;
  const pageUrl = portugalSatelliteUrl(`/calendar/${event.slug}`);
  const price = event.price_label?.match(/(\d+(?:[.,]\d{1,2})?)/)?.[1]?.replace(",", ".");
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.start_at,
    endDate: event.end_at || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.image_url || undefined,
    url: pageUrl,
    location: {
      "@type": "Place",
      name: event.location,
      address: event.address || event.location,
    },
    organizer: event.organizer ? { "@type": "Organization", name: event.organizer } : undefined,
    offers: event.price_label
      ? {
          "@type": "Offer",
          price: price || "0",
          priceCurrency: "EUR",
          url: event.source_url,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <main className={`${satelliteMain} overflow-x-clip`}>
      <p className="text-sm">
        <Link href={portugalCalendarPath()} className="text-teal-800 underline">
          К выходным
        </Link>
      </p>
      <p className="mt-4 flex flex-wrap gap-2">
        {displayTags(event).map((tag) => (
          <Link
            key={tag}
            href={`${portugalCalendarPath()}?tag=${tag}`}
            className={`rounded-full px-2 py-0.5 text-xs ${themeChip(tag)}`}
          >
            {tagLabel(tag)}
          </Link>
        ))}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <EventTypeIcon type={eventKind(event)} />
        <h1 className="break-words text-3xl font-bold tracking-tight">{event.title}</h1>
      </div>
      <p className="mt-2 break-words text-lg text-slate-800">{eventMeta(event)}</p>
      <dl className="mt-4 space-y-2 text-slate-800">
        <div>
          <dt className="text-sm text-slate-500">Когда</dt>
          <dd>{when}{clock ? "" : ". Точный час — на странице билета"}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Где</dt>
          <dd>{event.location}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Цена</dt>
          <dd>{event.price_label || "На странице организатора"}</dd>
        </div>
        {event.organizer && event.organizer !== venueName(event) ? (
          <div>
            <dt className="text-sm text-slate-500">Кто ведёт</dt>
            <dd>{event.organizer}</dd>
          </div>
        ) : null}
      </dl>
      {blurb ? <p className="mt-4 text-slate-700">{blurb}</p> : null}
      {event.image_url ? (
        // Organizer photos come from many hosts; the card does not go through the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.image_url} alt="" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover" />
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <EventSaveButton slug={event.slug} />
        <a
          href={`${portugalCalendarPath(event.slug)}/ics`}
          className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 px-3 text-sm text-slate-700"
        >
          В календарь телефона
        </a>
        {event.maps_url ? (
          <a href={event.maps_url} className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 px-3 text-sm text-slate-700">
            Карта
          </a>
        ) : null}
        <a href={event.source_url} className="inline-flex min-h-[44px] items-center rounded-full bg-slate-900 px-3 text-sm text-white">
          Страница организатора
        </a>
        {event.telegram_message_id ? (
          <a
            href={`https://t.me/emigro_portugal/${event.telegram_message_id}`}
            className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 px-3 text-sm text-slate-700"
          >
            Пост в канале
          </a>
        ) : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}

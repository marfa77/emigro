import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParqueMap } from "@/components/properties/ParqueMap";
import { QuarterCover, QuarterPlan } from "@/components/properties/QuarterCover";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { formatEur, formatEurExact, formatM2, formatRuDate } from "@/lib/properties/catalog";
import {
  HOUSE_LANDMARKS,
  KIND_LABEL,
  getHouseQuarter,
  indicators,
  listHouseQuarters,
  priceLine,
  type CatalogQuarter,
} from "@/lib/properties/house-catalog";
import { QUARTER_GEO } from "@/lib/properties/house-geo";
import type { QuarterListing } from "@/lib/properties/houses";
import type { SourceKind } from "@/lib/properties/types";
import { portugalDomaPath } from "@/lib/satellite/paths";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export function generateStaticParams() {
  return listHouseQuarters().map((q) => ({ slug: q.slug }));
}

type Params = { params: { slug: string } };

const SOURCE_KIND: Record<SourceKind, string> = {
  developer: "застройщик",
  agency: "агентство",
  portal: "портал",
  press: "источник",
};

const WHERE: Record<QuarterListing["where"], string> = {
  pin: "точка продавца внутри квартала",
  street: "улица квартала",
  named: "квартал назван в объявлении",
};

function factLine(q: CatalogQuarter): string {
  const r = q.roads;
  return [
    `${q.name} (${q.freguesia}, ${q.municipality}): ${KIND_LABEL[q.kind].toLowerCase()}`,
    `до океана ${r.sea.km.toLocaleString("ru-RU")} км, до центра ${r.centre.km.toLocaleString("ru-RU")} км, до аэропорта ${r.airport.km.toLocaleString("ru-RU")} км`,
    priceLine(q).toLowerCase(),
  ].join("; ");
}

export function generateMetadata({ params }: Params): Metadata {
  const q = getHouseQuarter(params.slug);
  if (!q) return {};
  const url = portugalSatelliteUrl(`/doma/${q.slug}`);
  const title = fitSeoTitlePart(`${q.name}: фото, дома и цены`);
  const description = fitMetaDescription(`${factLine(q)}.`);
  return withSatelliteAiMetadata(
    {
      title,
      description,
      alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        images: [socialImageMetadata(q.photo ? q.photo.src : DEFAULT_OG_IMAGE, title)],
      },
    },
    "portugal",
    description
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-xl font-bold text-slate-900">{value}</dd>
      {sub ? <dd className="break-words text-xs text-slate-600">{sub}</dd> : null}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-t border-slate-100 py-2 text-sm sm:grid-cols-[180px_1fr]">
      <dt className="text-slate-500">{k}</dt>
      <dd className={v ? "text-slate-900" : "text-slate-400"}>{v ?? "неизвестно"}</dd>
    </div>
  );
}

function ppm(l: QuarterListing): string {
  return l.area_m2 ? `${Math.round(l.price_eur / l.area_m2).toLocaleString("ru-RU")} €/м²` : "—";
}

export default function QuarterPage({ params }: Params) {
  const q = getHouseQuarter(params.slug);
  if (!q) notFound();
  const all = listHouseQuarters();
  const listings = [...q.listings].sort((a, b) => (a.status === b.status ? a.price_eur - b.price_eur : a.status === "active" ? -1 : 1));
  const hasPlan = Boolean(QUARTER_GEO[q.slug]);
  const url = portugalSatelliteUrl(`/doma/${q.slug}`);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: q.name,
    alternateName: q.altName ?? undefined,
    url,
    geo: { "@type": "GeoCoordinates", latitude: q.lat, longitude: q.lng },
    address: { "@type": "PostalAddress", addressLocality: q.freguesia, addressRegion: q.municipality, addressCountry: "PT" },
  };

  return (
    <main className="mx-auto min-w-0 max-w-5xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href={portugalDomaPath()} className="hover:text-teal-800">
          Дома без соседей
        </Link>{" "}
        / {q.name}
      </nav>

      <QuarterCover quarter={q} sizes="(min-width: 1024px) 992px, 100vw" priority className="mt-6 aspect-[16/9] rounded-3xl sm:aspect-[21/9]" />
      {q.photo ? (
        <p className="mt-2 text-xs text-slate-500">
          Фото: {q.photo.credit},{" "}
          <a href={q.photo.url} className="underline" target="_blank" rel="noopener nofollow">
            источник
          </a>
          .
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        <span className={`rounded-full px-2.5 py-0.5 ring-1 ${q.kind === "gated" ? "bg-sky-50 text-sky-900 ring-sky-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
          {KIND_LABEL[q.kind]}
        </span>
        <span className="text-slate-500">
          {q.freguesia}, {q.municipality}
          {q.altName ? ` · ${q.altName}` : ""}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{q.name}</h1>
      <p className="mt-2 text-lg text-slate-700">{q.tagline}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {indicators(q).map((x) => (
          <Tile key={x.key} label={x.label} value={x.value} sub={x.sub} />
        ))}
      </dl>
      <p className="mt-2 text-xs text-slate-500">
        Маршруты по улицам (OSRM, OpenStreetMap); на машине — без пробок.
        {q.approx ? " Точка примерная: контура на карте нет, считали от улицы." : ""}
      </p>

      <p className="mt-8 max-w-3xl text-base leading-relaxed text-slate-800">{q.summary}</p>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{q.kind === "gated" ? "Паспорт посёлка" : "Паспорт квартала"}</h2>
          <dl className="mt-3">
            <Row k="Какие дома" v={q.houseType} />
            <Row k="Построен" v={q.built} />
            <Row k="Архитектор" v={q.architect} />
            <Row k="Кто строил" v={q.programme} />
            <Row k="Сколько домов" v={q.houses} />
            <Row k="В продаже" v={priceLine(q)} />
          </dl>
        </div>
        {hasPlan ? (
          <figure>
            <QuarterPlan slug={q.slug} className="aspect-square w-full rounded-3xl ring-1 ring-slate-200" />
            <figcaption className="mt-2 text-xs text-slate-500">План: зелёным — контур квартала, тёмным — дома. © OpenStreetMap.</figcaption>
          </figure>
        ) : null}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">Что продаётся</h2>
        <p className="mt-1 text-sm text-slate-600">Объявления на Imovirtual, которые мы видели {formatRuDate(q.verified)}. Цены запрашиваемые.</p>
        {listings.length ? (
          <ul className="mt-4 space-y-3">
            {listings.map((l) => (
              <li key={l.url} className={`rounded-2xl p-4 ring-1 ${l.status === "active" ? "bg-white ring-slate-200" : "bg-slate-50 ring-slate-200"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a href={l.url} target="_blank" rel="noopener nofollow" className="font-medium text-teal-900 underline-offset-2 hover:underline">
                    {l.title}
                  </a>
                  <span className={`text-lg font-bold ${l.status === "active" ? "text-slate-900" : "text-slate-400 line-through"}`}>{formatEurExact(l.price_eur)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {l.typology} · {formatM2(l.area_m2)}
                  {l.plot_m2 ? ` · участок ${formatM2(l.plot_m2)}` : ""} · {ppm(l)}
                  {l.built ? ` · построен ${l.built}` : ""}
                </p>
                {l.note ? <p className="mt-1 text-sm text-slate-600">{l.note}</p> : null}
                <p className="mt-1 text-xs text-slate-500">
                  {l.status === "removed" ? "Снято с продажи · " : ""}
                  {l.seller} · {WHERE[l.where]}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-700">Объявлений на Imovirtual сейчас нет.</p>
        )}
      </section>

      {q.notes.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">На что смотреть</h2>
          <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800">
            {q.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {q.unknowns.length ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Пока не знаем</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {q.unknowns.map((n) => (
              <li key={n} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
                {n}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">На карте</h2>
        <div className="relative isolate mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <ParqueMap
            focus={q.slug}
            className="h-[360px]"
            landmarks={HOUSE_LANDMARKS}
            points={all.map((x) => ({
              slug: x.slug,
              pin: x.pin,
              name: x.name,
              lat: x.lat,
              lng: x.lng,
              href: portugalDomaPath(x.slug),
              caption: KIND_LABEL[x.kind],
            }))}
          />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">Источники</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {q.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener nofollow" className="text-teal-800 underline">
                {s.label}
              </a>{" "}
              <span className="text-slate-500">
                · {SOURCE_KIND[s.kind]}, проверено {formatRuDate(s.checked)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">Другие места</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {all
            .filter((x) => x.slug !== q.slug)
            .slice(0, 6)
            .map((x) => (
              <li key={x.slug}>
                <Link href={portugalDomaPath(x.slug)} className="block overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-slate-400">
                  <QuarterCover quarter={x} sizes="(min-width: 640px) 320px, 100vw" className="aspect-[16/10]" />
                  <div className="p-3">
                    <p className="font-medium text-slate-900">{x.name}</p>
                    <p className="text-xs text-slate-600">
                      {x.freguesia} · {x.priceFrom != null ? `от ${formatEur(x.priceFrom)}` : "сейчас в продаже нет"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <div className="max-w-3xl">
        <SatelliteAssistIntake countryKey="portugal" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}

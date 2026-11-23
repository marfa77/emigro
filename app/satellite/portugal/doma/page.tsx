import type { Metadata } from "next";
import Link from "next/link";
import { ParqueMap } from "@/components/properties/ParqueMap";
import { QuarterCover } from "@/components/properties/QuarterCover";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { formatEur, formatRuDate } from "@/lib/properties/catalog";
import { HOUSE_LANDMARKS, KIND_LABEL, housesVerifiedDate, indicators, listHouseQuarters, priceLine, type CatalogQuarter } from "@/lib/properties/house-catalog";
import { portugalDomaPath, portugalHubPath, portugalNovostroykiPath } from "@/lib/satellite/paths";
import { fitMetaDescription, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const TITLE = "Дома без соседей сверху и снизу: закрытые посёлки и кварталы в Порту";
const LEDE =
  "Закрытые посёлки и кварталы рядных домов в Порту, Gaia, Matosinhos и Maia. У каждого места одна карточка: как оно устроено, какие там дома, что сейчас продаётся и сколько оттуда до океана, Parque da Cidade, центра, NorteShopping и аэропорта.";

export function generateMetadata(): Metadata {
  const quarters = listHouseQuarters();
  const url = portugalSatelliteUrl("/doma");
  const description = fitMetaDescription(
    `${quarters.length} закрытых посёлков и кварталов домов в Порту, Gaia, Matosinhos и Maia: описания, фото, цены домов в продаже и расстояния до океана, парка, центра и аэропорта.`
  );
  return withSatelliteAiMetadata(
    {
      title: TITLE,
      description,
      alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
      openGraph: { title: TITLE, description, url, type: "website", images: [socialImageMetadata(DEFAULT_OG_IMAGE, TITLE)] },
    },
    "portugal",
    description
  );
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
      {note ? <dd className="break-words text-xs text-slate-500">{note}</dd> : null}
    </div>
  );
}

function QuarterCard({ q, priority }: { q: CatalogQuarter; priority: boolean }) {
  return (
    <li className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
      <Link href={portugalDomaPath(q.slug)} className="grid sm:grid-cols-[300px_1fr]">
        <QuarterCover quarter={q} sizes="(min-width: 640px) 300px, 100vw" priority={priority} className="aspect-[4/3] sm:aspect-auto sm:h-full" />
        <div className="min-w-0 p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">{q.pin}</span>
            <span className={`rounded-full px-2 py-0.5 ring-1 ${q.kind === "gated" ? "bg-sky-50 text-sky-900 ring-sky-200" : "bg-amber-50 text-amber-900 ring-amber-200"}`}>
              {KIND_LABEL[q.kind]}
            </span>
            <span className="text-slate-500">
              {q.freguesia}, {q.municipality}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{q.name}</h2>
          <p className="text-sm text-slate-600">{q.tagline}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-5">
            {indicators(q).map((x) => (
              <Tile key={x.key} label={x.label} value={x.value} note={x.sub} />
            ))}
          </dl>
          <p className="mt-4 text-sm font-medium text-slate-900">{priceLine(q)}</p>
        </div>
      </Link>
    </li>
  );
}

export default function DomaPage() {
  const quarters = listHouseQuarters();
  const verified = housesVerifiedDate(quarters);
  const url = portugalSatelliteUrl("/doma");
  const gated = quarters.filter((q) => q.kind === "gated");
  const estates = quarters.filter((q) => q.kind === "estate");
  const gatedPrices = gated.flatMap((q) => q.active.map((l) => l.price_eur)).sort((a, b) => a - b);
  const cheapest = estates
    .flatMap((q) => q.active.map((l) => ({ q, l })))
    .sort((a, b) => a.l.price_eur - b.l.price_eur)[0];
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Дома без соседей сверху и снизу в Порту",
    url,
    numberOfItems: quarters.length,
    itemListElement: quarters.map((q) => ({
      "@type": "ListItem",
      position: q.pin,
      url: portugalSatelliteUrl(`/doma/${q.slug}`),
      name: q.name,
    })),
  };

  return (
    <main className="mx-auto min-w-0 max-w-5xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href={portugalHubPath()} className="hover:text-teal-800">
          Португалия на практике
        </Link>{" "}
        / Дома
      </nav>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Porto · Gaia · Matosinhos · Maia</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">Дома без соседей сверху и снизу</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{LEDE}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Коротко">
        <div className="rounded-3xl bg-sky-50 p-5">
          <p className="text-3xl font-bold text-sky-900">{gated.length}</p>
          <p className="mt-1 text-sm text-sky-950">
            закрытых посёлков и кондоминиумов: дома за общей оградой, с общим садом, у части — бассейн и охрана на въезде. Самый
            большой — Quinta Marques Gomes в Gaia, 27 га.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p className="text-3xl font-bold text-slate-900">
            {gatedPrices.length ? `${formatEur(gatedPrices[0])} – ${formatEur(gatedPrices[gatedPrices.length - 1])}` : "—"}
          </p>
          <p className="mt-1 text-sm text-slate-800">цены домов, которые сейчас продаются в закрытых посёлках.</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-5">
          <p className="text-3xl font-bold text-amber-900">{estates.length}</p>
          <p className="mt-1 text-sm text-amber-950">
            кварталов рядных домов без ограды у Parque da Cidade. Дешевле всего здесь{cheapest ? `: ${cheapest.q.name}, ${cheapest.l.typology} за ${formatEur(cheapest.l.price_eur)}` : ""}, почти всегда под ремонт.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">На карте</h2>
        <p className="mt-1 text-sm text-slate-600">Сначала закрытые посёлки, потом кварталы; внутри — по расстоянию до центра. Синие метки — аэропорт, NorteShopping и центр, M — метро, MB — метробус.</p>
        <div className="relative isolate mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <ParqueMap
            className="h-[420px]"
            landmarks={HOUSE_LANDMARKS}
            points={quarters.map((q) => ({
              slug: q.slug,
              pin: q.pin,
              name: q.name,
              lat: q.lat,
              lng: q.lng,
              href: portugalDomaPath(q.slug),
              caption: `${KIND_LABEL[q.kind]} · ${priceLine(q)}`,
            }))}
          />
        </div>
      </section>

      <ul className="mt-10 space-y-4">
        {quarters.map((q, i) => (
          <QuarterCard key={q.slug} q={q} priority={i < 2} />
        ))}
      </ul>

      <section className="mt-14 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Как считаем</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              <strong>Расстояния</strong> — маршруты по улицам от центра посёлка (OSRM по данным OpenStreetMap). До океана — до
              ближайшего атлантического пляжа, до парка — до ближайшей точки Parque da Cidade. Если пешком меньше получаса,
              показываем минуты пешком, иначе километры и минуты на машине без пробок.
            </li>
            <li>
              <strong>Ориентиры</strong> — одни для всех: океан, Parque da Cidade, центр (Avenida dos Aliados), NorteShopping и
              терминал аэропорта.
            </li>
            <li>
              <strong>Место</strong> — контур из OpenStreetMap или точка по улице, если контура нет. Фото — из объявлений и прессы с
              указанием источника; визуализации подписаны. В продаже — только объявления, которые точно относятся к месту: по точке
              продавца, по улице или по названию в тексте.
            </li>
            <li>
              <strong>Цены</strong> — запрашиваемые, с датой, когда мы видели объявление. Один дом у нескольких агентств считаем один
              раз.
            </li>
            <li>
              <strong>Пусто — значит неизвестно.</strong> Год постройки, правила перестройки и сумму condomínio не подставляем
              «примерно».
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Что проверить до задатка</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              Certidão permanente: нет ли права преференции кооператива или ónus — у кооперативных кварталов (Carriçal, Telefonistas,
              Lar Familiar) это главный вопрос.
            </li>
            <li>Caderneta predial против факта: пристройки и надстройки без лицензии потом не узаконить.</li>
            <li>
              Правила перестройки: António Aroso, Vilarinha, Ramalde и Lar Familiar — в зонах интереса PDM и под правилами Câmara
              для «bairros habitacionais»; Leão XIII и Telefonistas — нет.
            </li>
            <li>Шум: пройдите квартал вечером в час пик — у части домов рядом Circunvalação или A28.</li>
            <li>
              В закрытом посёлке попросите регламент кондоминиума и протоколы последних собраний (atas): что входит в condomínio, кто платит за
              охрану и бассейн, какие стройки ещё впереди.
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-700">
            Ищете квартиру в новом доме?{" "}
            <Link href={portugalNovostroykiPath()} className="font-medium text-teal-800 underline">
              Новостройки у Parque da Cidade
            </Link>
            .
          </p>
        </div>
      </section>

      <p className="mt-10 text-xs text-slate-500">
        Данные собраны {formatRuDate(verified)} с Imovirtual, OpenStreetMap, SIPA, LNEC и прессы. Это не оферта и не
        инвестиционная рекомендация. Продавцов мы не представляем.
      </p>

      <div className="max-w-3xl">
        <SatelliteAssistIntake countryKey="portugal" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}

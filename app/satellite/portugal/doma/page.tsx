import type { Metadata } from "next";
import Link from "next/link";
import { ParqueMap } from "@/components/properties/ParqueMap";
import { QuarterCover } from "@/components/properties/QuarterCover";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { formatEur, formatRuDate } from "@/lib/properties/catalog";
import { CLIP, KIND_LABEL, housesVerifiedDate, listHouseQuarters, priceLine, transitLine, type CatalogQuarter } from "@/lib/properties/house-catalog";
import { portugalDomaPath, portugalHubPath, portugalNovostroykiPath } from "@/lib/satellite/paths";
import { fitMetaDescription, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const TITLE = "Дома без соседей сверху и снизу у Parque da Cidade и CLIP";
const LEDE =
  "Кварталы таунхаусов и закрытые кондоминиумы в Aldoar, Ramalde, Nevogilde и Senhora da Hora. У каждого одна карточка: сколько ехать на велосипеде до школы CLIP, идти до парка, океана и метро, какие дома там стоят и что сейчас продаётся.";

export function generateMetadata(): Metadata {
  const quarters = listHouseQuarters();
  const url = portugalSatelliteUrl("/doma");
  const description = fitMetaDescription(
    `${quarters.length} кварталов домов и кондоминиумов у Parque da Cidade в Порту: минуты на велосипеде до CLIP, пешком до парка, океана и метро, цены домов в продаже.`
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

function Tile({ label, value, note, good }: { label: string; value: string; note?: string; good?: boolean }) {
  return (
    <div className={`min-w-0 rounded-2xl px-3 py-2 ${good ? "bg-emerald-50" : "bg-slate-50"}`}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`font-semibold ${good ? "text-emerald-900" : "text-slate-900"}`}>{value}</dd>
      {note ? <dd className="break-words text-xs text-slate-500">{note}</dd> : null}
    </div>
  );
}

function QuarterCard({ q, priority }: { q: CatalogQuarter; priority: boolean }) {
  const t = transitLine(q);
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
          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Tile label="CLIP на велосипеде" value={`≈ ${q.clip.min} мин`} note={`${q.clip.km.toLocaleString("ru-RU")} км`} good={q.clip.min <= 15} />
            <Tile label="Парк пешком" value={`≈ ${q.dist.park.min} мин`} good={q.dist.park.min <= 10} />
            <Tile label="Океан пешком" value={`≈ ${q.dist.ocean.min} мин`} good={q.dist.ocean.min <= 15} />
            <Tile label={t.label} value={`≈ ${t.min} мин`} note={t.name} good={t.min <= 10} />
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
  const fit = quarters.filter((q) => q.clip.min <= 15);
  const cheapest = quarters
    .flatMap((q) => q.active.map((l) => ({ q, l })))
    .filter(({ q }) => q.clip.min <= 15)
    .sort((a, b) => a.l.price_eur - b.l.price_eur)[0];
  const gated = quarters.filter((q) => q.kind === "gated");
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Дома без соседей сверху и снизу у Parque da Cidade",
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
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Porto · Matosinhos · CLIP · Parque da Cidade</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">Дома без соседей сверху и снизу</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{LEDE}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Коротко">
        <div className="rounded-3xl bg-emerald-50 p-5">
          <p className="text-3xl font-bold text-emerald-900">{fit.length}</p>
          <p className="mt-1 text-sm text-emerald-950">
            из {quarters.length} мест — в 15 минутах на велосипеде от CLIP: {fit.map((q) => q.name).join(", ")}.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p className="text-3xl font-bold text-slate-900">{cheapest ? formatEur(cheapest.l.price_eur) : "—"}</p>
          <p className="mt-1 text-sm text-slate-800">
            самый дешёвый дом в продаже в 15 минутах от CLIP{cheapest ? ` — ${cheapest.q.name}, ${cheapest.l.typology}, ${cheapest.l.area_m2 ?? "?"} м²` : ""}. Почти всё в этой цене — под ремонт.
          </p>
        </div>
        <div className="rounded-3xl bg-sky-50 p-5">
          <p className="text-3xl font-bold text-sky-900">{gated.length}</p>
          <p className="mt-1 text-sm text-sky-950">
            закрытых кондоминиума — ближе всего к посёлкам вроде Elan или Sea Glade. Больших посёлков на сотни домов у парка нет: здесь
            за забором стоят 4–10 домов.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">На карте</h2>
        <p className="mt-1 text-sm text-slate-600">Номера — по времени на велосипеде до CLIP. Синяя метка — школа, M — метро, MB — метробус.</p>
        <div className="relative isolate mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <ParqueMap
            className="h-[420px]"
            landmarks={[CLIP]}
            points={quarters.map((q) => ({
              slug: q.slug,
              pin: q.pin,
              name: q.name,
              lat: q.lat,
              lng: q.lng,
              href: portugalDomaPath(q.slug),
              caption: `CLIP ≈ ${q.clip.min} мин · ${priceLine(q)}`,
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
              <strong>CLIP на велосипеде</strong> — маршрут по улицам от центра квартала до школы (OSRM, велосипедный профиль, по
              данным OpenStreetMap). Время с запасом: взрослый доедет быстрее, ребёнок — примерно так.
            </li>
            <li>
              <strong>Пешком</strong> до парка, океана и метро — прямая от центра квартала плюс 35% на улицы, 80 м в минуту. Это
              оценка, не маршрут.
            </li>
            <li>
              <strong>Квартал</strong> — контур из OpenStreetMap, на обложке без фото нарисованы его дома. В продаже — только
              объявления, которые точно внутри квартала: по точке продавца, по улице или по названию в тексте.
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

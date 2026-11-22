import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParqueMap } from "@/components/properties/ParqueMap";
import { ProjectCover } from "@/components/properties/ProjectCover";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import {
  SIDE_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  formatEur,
  formatEurExact,
  formatM2,
  formatRuDate,
  getParqueProject,
  listParqueProjects,
  type CatalogProject,
} from "@/lib/properties/catalog";
import { ppmLabel } from "@/lib/properties/explorer";
import type { PropertyUnit, SourceKind, UnitStatus } from "@/lib/properties/types";
import { portugalNovostroykiPath } from "@/lib/satellite/paths";
import { fitMetaDescription, fitSeoTitlePart, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export function generateStaticParams() {
  return listParqueProjects().map((p) => ({ slug: p.slug }));
}

type Params = { params: { slug: string } };

const UNIT_STATUS: Record<UnitStatus, string> = {
  available: "в продаже",
  reserved: "бронь",
  sold: "продано",
  assignment: "переуступка",
};

const SOURCE_KIND: Record<SourceKind, string> = {
  developer: "застройщик",
  agency: "агентство",
  portal: "портал",
  press: "пресса",
};

function typologyRange(p: CatalogProject): string {
  if (!p.typologies.length) return "";
  return p.typologies.length === 1 ? p.typologies[0]! : `${p.typologies[0]}–${p.typologies[p.typologies.length - 1]}`;
}

function factLine(p: CatalogProject): string {
  const parts = [
    `${p.name}: ${typologyRange(p)}${p.units_total ? `, ${p.units_total} юнитов` : ""}`,
    p.dist
      ? `пешком ≈ ${p.dist.park.min} мин до Parque da Cidade, ≈ ${p.dist.ocean.min} мин до океана, ≈ ${(p.dist.metrobus ?? p.dist.metro).min} мин до ${p.dist.metrobus ? "метробуса" : "метро"}`
      : "адрес не подтверждён",
    p.priceFrom != null ? `в продаже от ${formatEur(p.priceFrom)}` : "",
    STATUS_LABEL[p.status].toLowerCase(),
  ].filter(Boolean);
  return parts.join(", ") + ".";
}

export function generateMetadata({ params }: Params): Metadata {
  const p = getParqueProject(params.slug);
  if (!p) return { title: "Проект", robots: { index: false, follow: false } };
  const title = fitSeoTitlePart(`${p.name} у Parque da Cidade: ${typologyRange(p)}, цены и лэйауты`);
  const description = fitMetaDescription(`${factLine(p)} Площади, этажи, €/м², сроки и расхождения в источниках.`);
  const url = portugalSatelliteUrl(`/novostroyki/${p.slug}`);
  return withSatelliteAiMetadata(
    {
      title,
      description,
      alternates: { canonical: url, languages: { "ru-RU": url, ru: url, "x-default": url } },
      openGraph: { title, description, url, type: "article", images: [socialImageMetadata(DEFAULT_OG_IMAGE, p.name)] },
    },
    "portugal",
    factLine(p)
  );
}

function ruUnits(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "юнит";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "юнита";
  return "юнитов";
}

function Unknown({ children = "не публикуется" }: { children?: string }) {
  return <span className="italic text-slate-400">{children}</span>;
}

function unitPpm(u: PropertyUnit): string {
  if (!u.price_eur || !u.area_m2) return "—";
  return `${Math.round(u.price_eur / u.area_m2).toLocaleString("ru-RU")} €`;
}

export default function NovostroykaPage({ params }: Params) {
  const p = getParqueProject(params.slug);
  if (!p) notFound();
  const all = listParqueProjects();
  const sourceNo = new Map(p.sources.map((s, i) => [s.id, i + 1]));
  const km = (a: CatalogProject, b: CatalogProject) =>
    a.lat != null && b.lat != null ? Math.hypot((a.lat - b.lat) * 111, (a.lng! - b.lng!) * 84) : Infinity;
  const neighbours = all
    .filter((x) => x.slug !== p.slug && x.lat != null)
    .sort((a, b) => km(a, p) - km(b, p))
    .slice(0, 3);
  const units = [...p.units].sort((a, b) => a.typology.localeCompare(b.typology) || (a.price_eur ?? Infinity) - (b.price_eur ?? Infinity));
  const url = portugalSatelliteUrl(`/novostroyki/${p.slug}`);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: p.name,
    description: p.summary,
    url,
    address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.side === "porto" ? "Porto" : "Matosinhos", addressCountry: "PT" },
    ...(p.lat != null ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } } : {}),
    ...(p.units_total ? { numberOfAccommodationUnits: p.units_total } : {}),
  };

  const passport: { label: string; value: React.ReactNode }[] = [
    { label: "Адрес", value: p.address },
    { label: "Застройщик", value: p.developer ?? <Unknown /> },
    { label: "Архитектор", value: p.architect ?? <Unknown /> },
    { label: "Юнитов в проекте", value: p.units_total ?? <Unknown /> },
    { label: "Типологии", value: p.typologies.join(", ") || <Unknown /> },
    { label: "Видно в продаже", value: p.onSale ? `${p.onSale} ${ruUnits(p.onSale)} с ценой` : <Unknown>цен нет</Unknown> },
    { label: "€ за м²", value: p.ppmMin != null ? ppmLabel(p) : <Unknown>—</Unknown> },
    { label: "Сдача", value: p.completion ?? <Unknown /> },
    { label: "Энергокласс", value: p.energy_class ?? <Unknown /> },
  ];

  return (
    <main className="mx-auto min-w-0 max-w-5xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href={portugalNovostroykiPath()} className="hover:text-teal-800">
          Новостройки у Parque da Cidade
        </Link>{" "}
        / {p.name}
      </nav>

      <header className="mt-6 flex flex-wrap items-start gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white shadow"
          aria-label={`Номер на карте ${p.pin}`}
        >
          {p.pin}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{p.name}</h1>
          <p className="mt-1 text-lg text-slate-700">{p.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <span className={`rounded-full px-2 py-0.5 ring-1 ${STATUS_TONE[p.status]}`}>{STATUS_LABEL[p.status]}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">{SIDE_LABEL[p.side]}</span>
          </div>
        </div>
      </header>

      <section className="mt-8 overflow-hidden rounded-3xl ring-1 ring-slate-200">
        <ProjectCover project={p} sizes="(min-width: 1024px) 1024px, 100vw" priority className="aspect-[16/9] w-full sm:aspect-[21/9]" />
      </section>
      {p.photo ? (
        <p className="mt-1.5 text-xs text-slate-500">
          Фото:{" "}
          <a href={p.photo.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
            {p.photo.credit}, объявление на Imovirtual
          </a>
        </p>
      ) : null}

      <section className="mt-4 grid grid-cols-3 gap-2 sm:gap-3" aria-label="Пешком">
        {[
          { label: "Парк", sub: "Parque da Cidade", d: p.dist?.park },
          { label: "Океан", sub: "линия берега", d: p.dist?.ocean },
          p.dist?.metrobus
            ? { label: "Метробус", sub: `${p.dist.metrobus.name}; метро ≈ ${p.dist.metro.min} мин`, d: p.dist.metrobus }
            : { label: "Метро", sub: p.dist?.metro.name ?? "", d: p.dist?.metro },
        ].map((w) => (
          <div key={w.label} className="min-w-0 rounded-2xl bg-slate-50 p-3 sm:p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{w.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{w.d ? `≈ ${w.d.min} мин` : "—"}</p>
            <p className="mt-0.5 text-xs text-slate-500">{w.d ? `${w.d.m} м по прямой` : "адрес не подтверждён"}</p>
            {w.d && w.sub ? <p className="mt-0.5 break-words text-xs leading-snug text-slate-500">{w.sub}</p> : null}
          </div>
        ))}
      </section>

      <section className="mt-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-3xl bg-white p-5 text-sm ring-1 ring-slate-200 sm:grid-cols-3">
          {passport.map((row) => (
            <div key={row.label} className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
              <dd className="mt-0.5 break-words text-slate-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-800">{p.summary}</p>
      {p.features.length ? (
        <ul className="mt-4 flex max-w-3xl flex-wrap gap-2">
          {p.features.map((f) => (
            <li key={f} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
              {f}
            </li>
          ))}
        </ul>
      ) : null}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">Лэйауты и цены</h2>
        {units.length ? (
          <>
            <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-slate-200">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Тип</th>
                    <th className="px-3 py-2">Площадь</th>
                    <th className="px-3 py-2">Снаружи</th>
                    <th className="px-3 py-2">Этаж</th>
                    <th className="px-3 py-2">Парковка</th>
                    <th className="px-3 py-2 text-right">Цена</th>
                    <th className="px-3 py-2 text-right">€/м²</th>
                    <th className="px-3 py-2">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {units.map((u, i) => (
                    <tr key={i} className={u.status === "sold" ? "text-slate-400" : "text-slate-900"}>
                      <td className="px-3 py-2 font-semibold">
                        {u.typology}
                        {u.label ? <div className="text-xs font-normal text-slate-500">{u.label}</div> : null}
                      </td>
                      <td className="px-3 py-2">{formatM2(u.area_m2)}</td>
                      <td className="px-3 py-2">{u.outdoor_m2 ? formatM2(u.outdoor_m2) : "—"}</td>
                      <td className="px-3 py-2">{u.floor ?? "—"}</td>
                      <td className="px-3 py-2">{u.parking ? `${u.parking} м/м` : "—"}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatEurExact(u.price_eur)}</td>
                      <td className="px-3 py-2 text-right">{unitPpm(u)}</td>
                      <td className="px-3 py-2">
                        {UNIT_STATUS[u.status]}{" "}
                        <a href={`#src-${sourceNo.get(u.source)}`} className="text-xs text-teal-800 underline">
                          [{sourceNo.get(u.source)}]
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Цены запрашиваемые, из объявления по ссылке в скобках. Площадь — как в объявлении (обычно área bruta
              privativa).
            </p>
          </>
        ) : (
          <p className="mt-3 text-slate-700">Цен и лэйаутов в открытом доступе нет.</p>
        )}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {p.notes.length ? (
          <div className="rounded-3xl bg-emerald-50/60 p-5">
            <h2 className="text-lg font-semibold text-slate-900">На что смотреть</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800">
              {p.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {p.conflicts.length ? (
          <div className="rounded-3xl bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Где источники расходятся</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-amber-950">
              {p.conflicts.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {p.unknowns.length ? (
          <div className="rounded-3xl bg-slate-50 p-5 md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Чего застройщик не публикует</h2>
            <p className="mt-1 text-sm text-slate-600">Спросите это у продавца до визита.</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.unknowns.map((n) => (
                <li key={n} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 ring-1 ring-slate-200">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {p.lat != null ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">На карте</h2>
          <p className="mt-1 text-sm text-slate-600">{p.location_basis}.</p>
          <div className="relative isolate mt-4 overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <ParqueMap
              focus={p.slug}
              className="h-[340px]"
              points={all
                .filter((x) => x.lat != null && x.lng != null)
                .map((x) => ({
                  slug: x.slug,
                  pin: x.pin,
                  name: x.name,
                  lat: x.lat!,
                  lng: x.lng!,
                  href: portugalNovostroykiPath(x.slug),
                  caption: x.priceFrom != null ? `от ${formatEur(x.priceFrom)}` : "",
                }))}
            />
          </div>
        </section>
      ) : (
        <p className="mt-12 rounded-2xl bg-rose-50 p-4 text-sm text-rose-900">{p.location_basis}.</p>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">Источники</h2>
        <ol className="mt-3 space-y-2 text-sm">
          {p.sources.map((s, i) => (
            <li key={s.id} id={`src-${i + 1}`} className="flex gap-2">
              <span className="w-6 shrink-0 text-slate-500">[{i + 1}]</span>
              <span className="min-w-0">
                <a href={s.url} className="break-words text-teal-800 underline" target="_blank" rel="noopener noreferrer nofollow">
                  {s.label}
                </a>{" "}
                <span className="text-slate-500">
                  · {SOURCE_KIND[s.kind]} · открыто {formatRuDate(s.checked)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {neighbours.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Ближайшие соседи</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {neighbours.map((n) => (
              <li key={n.slug} className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
                <Link href={portugalNovostroykiPath(n.slug)} className="block hover:bg-slate-50">
                  <ProjectCover project={n} sizes="(min-width: 640px) 320px, 100vw" className="aspect-[4/3] w-full" />
                  <div className="p-4">
                    <p className="font-semibold text-slate-900">{n.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {n.priceFrom != null ? `от ${formatEur(n.priceFrom)}` : "цен нет"}
                      {n.dist ? ` · океан ≈ ${n.dist.ocean.min} мин · метро ≈ ${(n.dist.metrobus ?? n.dist.metro).min} мин` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link href={`${portugalNovostroykiPath("sravnit")}?p=${[p.slug, ...neighbours.slice(0, 2).map((n) => n.slug)].join(",")}`} className="font-medium text-teal-800 underline">
              Сравнить {p.name} с соседями в одной таблице →
            </Link>
          </p>
        </section>
      ) : null}

      <p className="mt-10 text-xs text-slate-500">
        Проверено {formatRuDate(p.verified)}. Это не оферта и не реклама застройщика: цифры взяты из открытых источников
        выше, со ссылкой на каждый.
      </p>
      <div className="max-w-3xl">
        <SatelliteAssistIntake countryKey="portugal" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}

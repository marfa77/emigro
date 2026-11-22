import type { Metadata } from "next";
import Link from "next/link";
import { CatalogExplorer } from "@/components/properties/CatalogExplorer";
import { ProjectCover } from "@/components/properties/ProjectCover";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { catalogVerifiedDate, formatEur, formatRuDate, listParqueProjects } from "@/lib/properties/catalog";
import { toExplorerProject } from "@/lib/properties/explorer";
import { portugalHubPath, portugalNovostroykiPath } from "@/lib/satellite/paths";
import { fitMetaDescription, socialImageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const TITLE = "Новостройки у Parque da Cidade: Фож и Матозиньюш, цены за м²";
const LEDE =
  "Новые дома вокруг Parque da Cidade — со стороны Фож, Невожилде и Матозиньюш Сул. У каждого проекта одна и та же карточка: сколько идти пешком до парка, океана и метро, лэйауты, цены, сроки и чего застройщик не публикует.";

function ruProjects(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "проект";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "проекта";
  return "проектов";
}

function quickFacts() {
  const projects = listParqueProjects();
  const nearOcean = projects
    .filter((p) => p.dist && p.dist.ocean.min <= 10)
    .sort((a, b) => a.dist!.ocean.m - b.dist!.ocean.m);
  const t2 = projects
    .filter((p) => p.fromByTypology.T2 != null)
    .sort((a, b) => a.fromByTypology.T2! - b.fromByTypology.T2!);
  const t2Under900 = t2.filter((p) => p.fromByTypology.T2! <= 900_000);
  const t2Porto = t2.filter((p) => p.side === "porto");
  const t2Matosinhos = t2.filter((p) => p.side === "matosinhos");
  const embargo = projects.filter((p) => p.status === "embargo");
  return { projects, nearOcean, t2Under900, t2Porto, t2Matosinhos, embargo };
}

export function generateMetadata(): Metadata {
  const { projects } = quickFacts();
  const url = portugalSatelliteUrl("/novostroyki");
  const description = fitMetaDescription(
    `${projects.length} новостроек у Parque da Cidade в Порту и Матозиньюше: минуты до парка, T2 и T3 с ценой и площадью, €/м², сроки сдачи и что не раскрывает застройщик.`
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

export default function NovostroykiPage() {
  const { projects, nearOcean, t2Under900, t2Porto, t2Matosinhos, embargo } = quickFacts();
  const verified = catalogVerifiedDate(projects);
  const covers = Object.fromEntries(
    projects.map((p, i) => [
      p.slug,
      <ProjectCover key={p.slug} project={p} sizes="(min-width: 640px) 300px, 100vw" priority={i < 2} className="h-full w-full" />,
    ])
  );
  const url = portugalSatelliteUrl("/novostroyki");
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Новостройки у Parque da Cidade",
    url,
    numberOfItems: projects.length,
    itemListElement: projects.map((p) => ({
      "@type": "ListItem",
      position: p.pin,
      url: portugalSatelliteUrl(`/novostroyki/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <main className="mx-auto min-w-0 max-w-5xl px-4 py-10">
      <nav className="text-sm text-slate-500">
        <Link href={portugalHubPath()} className="hover:text-teal-800">
          Португалия на практике
        </Link>{" "}
        / Новостройки
      </nav>
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Porto · Matosinhos · Parque da Cidade</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">Новостройки у Parque da Cidade</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{LEDE}</p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Коротко">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <p className="text-3xl font-bold text-slate-900">
            {t2Porto.length ? formatEur(t2Porto[0]!.fromByTypology.T2) : "—"}
          </p>
          <p className="mt-1 text-sm text-slate-800">
            самый дешёвый T2 на стороне Порту.{" "}
            {t2Under900.length
              ? `До 900 тыс. € T2 есть в ${t2Under900.length} проектах: ${t2Under900.map((p) => p.name).join(", ")}.`
              : "T2 до 900 тыс. € в продаже нет."}
          </p>
        </div>
        <div className="rounded-3xl bg-sky-50 p-5">
          <p className="text-3xl font-bold text-sky-900">
            {t2Matosinhos.length ? formatEur(t2Matosinhos[0]!.fromByTypology.T2) : "—"}
          </p>
          <p className="mt-1 text-sm text-sky-950">
            самый дешёвый T2 в Матозиньюш Сул, через Circunvalação от парка. Квартиры там меньше, рядом метро и пляж.
          </p>
        </div>
        <div className="rounded-3xl bg-cyan-50 p-5">
          <p className="text-3xl font-bold text-cyan-900">{nearOcean.length}</p>
          <p className="mt-1 text-sm text-cyan-950">
            {ruProjects(nearOcean.length)} в 10 минутах пешком от океана:{" "}
            {nearOcean.map((p) => `${p.name} (≈ ${p.dist!.ocean.min} мин)`).join(", ")}.
          </p>
        </div>
      </section>
      {embargo.length ? (
        <p className="mt-3 max-w-3xl text-sm text-rose-900">
          Осторожно: стройка {embargo.map((p) => p.name).join(", ")} у самого парка частично остановлена Câmara do Porto (апрель 2026).
        </p>
      ) : null}

      <section className="mt-10">
        <CatalogExplorer
          projects={projects.map(toExplorerProject)}
          covers={covers}
          compareHref={portugalNovostroykiPath("sravnit")}
        />
      </section>

      <section className="mt-14 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Как считаем</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            <li>
              <strong>Пешком</strong> — прямая от дома до кромки парка, до линии берега и до ближайшей станции метро (все три —
              по OpenStreetMap). К прямой добавляем 35% на улицы и переходы, шаг 80 м в минуту. Это оценка, не маршрут.
            </li>
            <li>
              <strong>Метро и метробус</strong> — ближайшие станции Metro do Porto: линия A в Матозиньюше и Francos на
              Boavista. Метробус по Boavista с апреля 2026 доходит до Praça do Império; если его остановка ближе метро, в
              карточке стоит она. Продление метробуса к Castelo do Queijo ещё строится и не учитывается.
            </li>
            <li>
              <strong>Фото</strong> — из объявления агентства или с сайта застройщика, подпись на фото и ссылка под ним. Это рендеры
              или снимки продавца, а не наши.
            </li>
            <li>
              <strong>Цены</strong> — запрашиваемые цены из объявления, на которое стоит ссылка в карточке. Торг, комиссия
              агентства и IMT в них не входят.
            </li>
            <li>
              <strong>Пусто — значит неизвестно.</strong> Если застройщик не публикует срок, энергокласс или condomínio,
              мы так и пишем и не подставляем «примерно».
            </li>
            <li>
              <strong>Расхождения</strong> — когда два источника дают разные цифры, в карточке стоят обе.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Что проверить до брони</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
            <li>Лицензию на строительство (alvará) и номер процесса в Câmara — особенно у парка, где уже был эмбарго.</li>
            <li>Certidão permanente участка: кто собственник и нет ли ипотеки на землю.</li>
            <li>CPCV у своего advogado: график платежей, что будет при переносе сдачи, банковская гарантия на задаток.</li>
            <li>Площадь: área bruta privativa или útil. Агентства пишут по-разному, поэтому один и тот же T2 бывает «102 м²» и «112 м²».</li>
          </ul>
        </div>
      </section>

      <p className="mt-10 text-xs text-slate-500">
        Данные собраны {formatRuDate(verified)} со страниц застройщиков, Imovirtual и прессы. Это не оферта и не
        инвестиционная рекомендация. Застройщиков мы не представляем.
      </p>

      <div className="max-w-3xl">
        <SatelliteAssistIntake countryKey="portugal" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}

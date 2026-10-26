import type { Metadata } from "next";
import Link from "next/link";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import type { CommunityNote } from "@/lib/community-notes/types";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { buildSatelliteHubPlace, withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практический справочник по жизни и переезду в Португалию: NIF, жильё, банк, ВНЖ, медицина и повседневные дела. Понятные маршруты по задачам, связанные руководства и официальные источники.";

const JOURNEYS = [
  {
    number: "01",
    eyebrow: "Документы и налоги",
    title: "Нужен NIF",
    description: "Разберитесь, где оформить налоговый номер и что подготовить для Finanças.",
    slugs: ["nif-porto-kak-poluchit-2026", "kak-otkryt-bankovskiy-schet-portugalia-2026"],
    accent: "border-teal-200 bg-teal-50/70",
  },
  {
    number: "02",
    eyebrow: "Адрес и жильё",
    title: "Ищете квартиру или подтверждаете адрес",
    description: "Проверьте договор и документы до оплаты и подачи в ведомства.",
    slugs: ["arenda-lissabon-do-podpisi", "termo-responsabilidade-podtverzhdenie-zhilya-2026", "arenda-dolgosrok-porto-braga-2026"],
    accent: "border-amber-200 bg-amber-50/70",
  },
  {
    number: "03",
    eyebrow: "ВНЖ и процедуры",
    title: "Разбираетесь с AIMA",
    description: "Сначала определите нужный канал: запись на приём и продление — разные задачи.",
    slugs: ["aima-agora-zapis-2026", "prodlenie-vnzh-portugaliya-aima-2026"],
    accent: "border-violet-200 bg-violet-50/70",
  },
  {
    number: "04",
    eyebrow: "Жизнь на месте",
    title: "Настраиваете повседневную жизнь",
    description: "Медицина, связь и базовые услуги — выбирайте тему, которая актуальна сейчас.",
    slugs: ["meditsina-norte-sns-chastnaya-stomatologiya-2026", "vybor-internet-provaydera-portugaliya-2026", "zheltye-stranitsy-relokanta-portugaliya-2026"],
    accent: "border-sky-200 bg-sky-50/70",
  },
] as const;

function selectBySlugs(notes: CommunityNote[], slugs: readonly string[]): CommunityNote[] {
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  return slugs.flatMap((slug) => {
    const note = bySlug.get(slug);
    return note ? [note] : [];
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const title = PORTUGAL_SATELLITE.title;
  const description = fitMetaDescription(HUB_DESCRIPTION);

  return withSatelliteAiMetadata(
    {
      title,
      description,
      alternates: {
        canonical: portugalSatelliteUrl("/"),
        languages: {
          "ru-RU": portugalSatelliteUrl("/"),
          ru: portugalSatelliteUrl("/"),
          "x-default": portugalSatelliteUrl("/"),
        },
      },
      openGraph: {
        title,
        description,
        url: portugalSatelliteUrl("/"),
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
    description,
  );
}

export default async function PortugalSatelliteHomePage() {
  const notes = await requirePublishedCommunityNotes("portugal");
  const journeys = JOURNEYS.map((journey) => ({ ...journey, notes: selectBySlugs(notes, journey.slugs) }));
  const featured = journeys.flatMap(({ notes: journeyNotes }) => journeyNotes);
  const hubUrl = portugalSatelliteUrl("/");
  const items = featured.map((note, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    url: portugalSatelliteUrl(`/notes/${note.slug}`),
    name: note.title,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PORTUGAL_SATELLITE.title,
    description: HUB_DESCRIPTION,
    url: hubUrl,
    inLanguage: "ru-RU",
    about: buildSatelliteHubPlace("portugal"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items,
    },
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-amber-50 px-5 py-8 sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">Практический справочник · Португалия</p>
        <h1 className={`${heroTitle} mt-3 max-w-3xl leading-tight text-slate-950`}>{PORTUGAL_SATELLITE.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Начните с вопроса, который стоит перед вами сегодня. Материалы объясняют следующий шаг, отделяют официальные правила от практического опыта и ведут к первоисточникам.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          <span>Редактор Emigro</span><span aria-hidden="true">·</span><span>Проверяйте дату и источники в каждом руководстве</span>
        </div>
      </section>

      <section className="mt-9" aria-labelledby="routes-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">Выберите свою ситуацию</p>
          <h2 id="routes-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Куда идти дальше</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Универсальной очереди действий нет: откройте нужный маршрут, а затем переходите к следующему связанному материалу.</p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {journeys.map((journey) => (
            <section key={journey.number} className={`rounded-2xl border p-5 sm:p-6 ${journey.accent}`}>
              <div className="flex items-start gap-4">
                <span className="rounded-lg bg-white/80 px-2.5 py-1 font-mono text-sm font-semibold text-slate-500">{journey.number}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{journey.eyebrow}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950">{journey.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{journey.description}</p>
                </div>
              </div>
              {journey.notes.length > 0 ? (
                <ol className="mt-4 space-y-2 border-l border-slate-300/80 pl-4">
                  {journey.notes.map((note, index) => (
                    <li key={note.slug}>
                      <Link href={`/notes/${note.slug}`} className="group inline-flex items-start gap-2 text-sm font-medium leading-relaxed text-slate-800 hover:text-teal-900">
                        <span className="mt-0.5 text-teal-800" aria-hidden="true">{index === 0 ? "↗" : "→"}</span>
                        <span className="underline decoration-slate-300 underline-offset-4 group-hover:decoration-teal-700">{note.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 rounded-lg bg-white/70 p-3 text-sm text-slate-600">Материалы этого маршрута скоро появятся.</p>
              )}
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-slate-950 px-5 py-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-200">Ещё выбираете основание для переезда?</p>
          <h2 className="mt-2 text-xl font-semibold">Сначала сравните визовые маршруты</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">Отдельный разбор поможет понять, подходит ли вашей ситуации D7 или D8.</p>
        </div>
        <a href={PORTUGAL_SATELLITE.pillarGuideUrl} className="mt-4 inline-flex shrink-0 items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-50 sm:mt-0">
          Сравнить D7 и D8 <span className="ml-2" aria-hidden="true">→</span>
        </a>
      </section>

      <section className="mt-10 grid gap-6 border-t border-slate-200 pt-7 md:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Как устроены материалы</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            В руководствах официальные требования отделены от опыта релокантов. Практические наблюдения помогают подготовиться, но не гарантируют такой же результат в другом городе или деле. Перед подачей документов сверяйте список и сроки с ведомством.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Официальные точки проверки</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li><a href="https://www.portaldasfinancas.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline underline-offset-4">Finanças · налоги и NIF</a></li>
            <li><a href="https://aima.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline underline-offset-4">AIMA · миграционные процедуры</a></li>
            <li><a href="https://www.seg-social.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline underline-offset-4">Segurança Social · соцвыплаты</a></li>
            <li><a href="https://www.sns24.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline underline-offset-4">SNS 24 · здравоохранение</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}

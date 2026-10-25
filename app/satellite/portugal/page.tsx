import type { Metadata } from "next";
import { NoteCard } from "@/components/satellite/NoteCard";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import type { CommunityNote } from "@/lib/community-notes/types";
import { PORTUGAL_SATELLITE, rankPortugalHubGuides } from "@/lib/satellite/portugal";
import { buildSatelliteHubPlace, withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

const HUB_DESCRIPTION =
  "Практический справочник по первым месяцам в Португалии: NIF, банковский счёт, жильё, документы, SNS и обращения в AIMA. Подборка руководств с ссылками на официальные источники.";

const HUB_GUIDE_SLUGS = [
  "nif-porto-kak-poluchit-2026",
  "aima-agora-zapis-2026",
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "arenda-dolgosrok-porto-braga-2026",
  "termo-responsabilidade-podtverzhdenie-zhilya-2026",
  "pervyj-mesyac-portugaliya-checklist",
  "sns-registration-changes-2026",
  "aima-residence-card-sent-abroad-2026",
] as const;

function selectHubGuides(notes: CommunityNote[]): CommunityNote[] {
  const guides = rankPortugalHubGuides(notes.filter((note) => note.content_kind === "guide"));
  const bySlug = new Map(guides.map((note) => [note.slug, note]));
  return HUB_GUIDE_SLUGS.flatMap((slug) => {
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
  const guides = selectHubGuides(notes);
  const hubUrl = portugalSatelliteUrl("/");
  const items = guides.map((note, index) => ({
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

      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{PORTUGAL_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
        Если вы уже в Португалии, начните с задачи, которая мешает следующим шагам: налоговый номер, подтверждение
        адреса, банковский счёт, жильё или документы AIMA. Здесь собраны отдельные руководства по этим темам; требования
        могут зависеть от вашей ситуации, поэтому сверяйте их с официальными источниками.
      </p>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="first-steps-heading">
        <h2 id="first-steps-heading" className="text-xl font-semibold text-slate-900">
          С чего начать после приезда
        </h2>
        <ol className="mt-4 grid gap-4 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
          <li className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">1. NIF и налоговые вопросы</h3>
            <p className="mt-1">Посмотрите, какие вопросы подготовить перед обращением в Finanças.</p>
            <a href="/notes/nif-porto-kak-poluchit-2026" className="mt-2 inline-block font-medium text-teal-800 underline">
              Руководство по NIF в Порту →
            </a>
          </li>
          <li className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">2. Адрес и жильё</h3>
            <p className="mt-1">Разберитесь в документах по жилью и отдельно проверьте условия аренды.</p>
            <a href="/notes/termo-responsabilidade-podtverzhdenie-zhilya-2026" className="mt-2 inline-block font-medium text-teal-800 underline">
              Подтверждение адреса →
            </a>
            <span className="mx-2 text-slate-400">·</span>
            <a href="/notes/arenda-dolgosrok-porto-braga-2026" className="font-medium text-teal-800 underline">
              Аренда в Porto и Braga →
            </a>
          </li>
          <li className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">3. Счёт и повседневные дела</h3>
            <p className="mt-1">Сверьте список документов и банковские условия напрямую у выбранного банка.</p>
            <a href="/notes/kak-otkryt-bankovskiy-schet-portugalia-2026" className="mt-2 inline-block font-medium text-teal-800 underline">
              Банковский счёт в Португалии →
            </a>
          </li>
          <li className="rounded-lg bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">4. AIMA и документы</h3>
            <p className="mt-1">Выбирайте официальный канал по вашему уведомлению и типу процедуры.</p>
            <a href="/notes/aima-agora-zapis-2026" className="mt-2 inline-block font-medium text-teal-800 underline">
              Разбор Agora и других каналов AIMA →
            </a>
          </li>
        </ol>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Это навигация по материалам, а не персональная юридическая или налоговая консультация. Перед подачей документов
          проверяйте актуальные требования на сайтах ведомств.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="guides-heading">
        <h2 id="guides-heading" className="text-xl font-semibold text-slate-900">
          Руководства по жизни в Португалии
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Подборка охватывает NIF, жильё, банковские вопросы, SNS и документы. Откройте материал по своей задаче и
          переходите к первоисточникам внутри руководства.
        </p>
        <ul className="mt-6 space-y-4">
          {guides.map((note) => (
            <li key={note.slug}>
              <NoteCard note={note} />
            </li>
          ))}
        </ul>
        {guides.length === 0 && (
          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            Подборка временно недоступна. Попробуйте открыть нужный материал из раздела заметок позже.
          </p>
        )}
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6" aria-labelledby="official-heading">
        <h2 id="official-heading" className="text-lg font-semibold text-slate-900">
          Официальные источники
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Проверяйте требования и доступность услуг у ведомства: правила и каналы подачи могут меняться.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm">
          <li>
            <a href="https://www.portaldasfinancas.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              Portal das Finanças — налоги и NIF
            </a>
          </li>
          <li>
            <a href="https://aima.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              AIMA — миграционные процедуры
            </a>
          </li>
          <li>
            <a href="https://agora.imigrante.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              AIMA Agora
            </a>
          </li>
          <li>
            <a href="https://www.sns24.gov.pt/" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              SNS 24 — здравоохранение
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-10 border-t border-slate-200 pt-6" aria-labelledby="more-help-heading">
        <h2 id="more-help-heading" className="text-lg font-semibold text-slate-900">
          Нужен другой маршрут?
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Эта страница посвящена повседневным вопросам после переезда. Если вы ещё выбираете основание для ВНЖ, откройте
          отдельный справочник по визовым маршрутам Португалии.
        </p>
        <a href={PORTUGAL_SATELLITE.pillarGuideUrl} className="mt-3 inline-block font-medium text-teal-800 underline">
          Сравнить маршруты D7 и D8 →
        </a>
      </section>
    </main>
  );
}

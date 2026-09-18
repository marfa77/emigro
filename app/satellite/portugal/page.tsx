import type { Metadata } from "next";
import { DailySpotlightTile } from "@/components/satellite/DailySpotlight";
import { HashtagNav } from "@/components/satellite/HashtagNav";
import { NoteCard } from "@/components/satellite/NoteCard";
import { SatelliteValueProp } from "@/components/satellite/RelatedNotes";
import { SatelliteFunnelCta } from "@/components/satellite/SatelliteFunnelCta";
import { SatelliteHubScenarios } from "@/components/satellite/SatelliteHubScenarios";
import { SatelliteHubDepth } from "@/components/satellite/SatelliteHubDepth";
import { SatelliteAssistIntake } from "@/components/satellite/SatelliteAssistIntake";
import { PortoChatCta } from "@/components/satellite/PortoChatCta";
import { ProviderPartnerRecruitment } from "@/components/providers/ProviderPartnerRecruitment";
import { getDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { requirePublishedCommunityNotes } from "@/lib/community-notes/queries";
import {
  PORTUGAL_SATELLITE,
  portugalHubPracticeTagsLabel,
  rankPortugalHubGuides,
} from "@/lib/satellite/portugal";
import {
  satelliteDigestUrl,
  satelliteWizardUrl,
} from "@/lib/satellite/funnel-urls";
import { buildSatelliteHubPlace, withSatelliteAiMetadata } from "@/lib/community-notes/seo-page";
import { fitMetaDescription } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, socialImageMetadata } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { heroTitle, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

/** Hub content revision — bump when strengthening for indexation. */
const HUB_CONTENT_UPDATED = "2026-09-18";

/** Competitor-beating hub meta: demonym + 2026 + NIF/AIMA + Norte destinations + inventory hooks. */
function buildHubDescription(guideCount: number, noteCount: number): string {
  return (
    `Португалия 2026 — полевая практика (не визовый каталог): ${guideCount}+ гайдов, ${noteCount} материалов. ` +
    `NIF Porto/Finanças, AIMA Agora ≠ portal-renovacoes, аренда Norte, SNS, банк. FAQ + aima.gov.pt. Не юрконсультация.`
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const notes = await requirePublishedCommunityNotes("portugal");
  const guideCount = notes.filter((n) => n.content_kind === "guide").length;
  const description = fitMetaDescription(buildHubDescription(guideCount || 30, notes.length || 40));
  const title = PORTUGAL_SATELLITE.title;

  return withSatelliteAiMetadata(
    {
      title,
      description,
      keywords: [
        "Португалия 2026",
        "NIF Porto",
        "AIMA Agora",
        "portal-renovacoes",
        "аренда Porto Braga",
        "Norte релокация",
        "SNS Португалия",
        "русскоязычные экспаты",
      ],
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
    description
  );
}

const HUB_FAQ = [
  {
    q: "Чем portugal.emigro.online отличается от pillar-гида на emigro.online?",
    a: "Сателлит — практика на месте после въезда: NIF в Finanças / Loja do Cidadão, слот Agora vs portal-renovacoes, contrato de arrendamento Norte, SNS, банк, consulado. Pillar и wizard на emigro.online — выбор визы D7/D8, пороги дохода и коридор ВНЖ до вылета. Это два слоя: маршрут там, поле здесь.",
  },
  {
    q: "Schengen-туризм = ВНЖ Португалии?",
    a: "Нет. Туристический въезд по шенгену не заменяет autorização de residência. Типовой путь: виза D в консульстве → въезд → канал AIMA (portal / Agora / письмо). Сверяйте aima.gov.pt.",
  },
  {
    q: "С чего начать в первые недели в Porto / Norte?",
    a: "NIF (Finanças / Loja do Cidadão), португальский номер, банк, morada по contrato или Termo, затем мониторинг канала AIMA для вашей процедуры. Смотрите тег #nif и гайд AIMA/Agora на этом сателлите — не путайте с записью на CIPLE.",
  },
  {
    q: "Agora и portal-renovacoes — это одно и то же?",
    a: "Нет. Agora (agora.imigrante.pt) — обычно presencial / биометрия, когда вас направили. portal-renovacoes — отдельный онлайн-канал renovação. В чатах их часто смешивают; без нужного канала слот «пропадает» зря. Полевой чек-лист — в гайде AIMA / Agora.",
  },
  {
    q: "Где CIPLE и гражданство Португалии?",
    a: "CIPLE / nacionalidade — не запись Agora AIMA. Экзамен CAPLE и гражданство — отдельные треки (MJ / cidadaniaonline). Timed mock CIPLE A2 — на Prep2Go; маршрут ВНЖ — wizard Emigro.",
  },
  {
    q: "Нужен ли NIF до аренды и банка?",
    a: "На практике без NIF договор arrendamento и счёт в банке часто встают. Номер бесплатно присваивает AT при личном обращении; представитель и apostille — отдельно по рынку. Пошагово для Porto: гайд NIF на этом сателлите; правила — portaldasfinancas.gov.pt.",
  },
] as const;

export default async function PortugalSatelliteHomePage() {
  const [spotlight, notes] = await Promise.all([
    getDailySpotlight("portugal"),
    requirePublishedCommunityNotes("portugal"),
  ]);
  const listNotes = spotlight ? notes.filter((n) => n.slug !== spotlight.note_slug) : notes;
  const guideNotesAll = rankPortugalHubGuides(listNotes.filter((n) => n.content_kind === "guide"));
  const feedNotesAll = listNotes.filter((n) => n.content_kind !== "guide");
  /** Cap hub lists — full dump (~60 cards / 500KB) → GSC "Crawled - not indexed" doorway signal. */
  const HUB_GUIDES_PREVIEW = 10;
  const HUB_FEED_PREVIEW = 6;
  const guideNotes = guideNotesAll.slice(0, HUB_GUIDES_PREVIEW);
  const feedNotes = feedNotesAll.slice(0, HUB_FEED_PREVIEW);
  const guidesHidden = Math.max(0, guideNotesAll.length - guideNotes.length);
  const feedHidden = Math.max(0, feedNotesAll.length - feedNotes.length);
  const allGuides = notes.filter((n) => n.content_kind === "guide");
  const feedCount = notes.filter((n) => n.content_kind !== "guide").length;
  const topicTags = Array.from(
    new Set(notes.flatMap((n) => n.topic_tags.filter((t) => t !== "portugal")))
  ).sort();
  const destinationsLabel = portugalHubPracticeTagsLabel(topicTags);
  const llmsUrl = portugalSatelliteUrl("/llms");
  const hubUrl = portugalSatelliteUrl("/");
  const hubDescription = buildHubDescription(allGuides.length, notes.length);
  const corridorUrl = PORTUGAL_SATELLITE.mainSiteUrl;
  const pillarUrl = PORTUGAL_SATELLITE.pillarGuideUrl;

  const listForSchema = rankPortugalHubGuides(allGuides)
    .slice(0, 16)
    .map((note, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      url: portugalSatelliteUrl(`/notes/${note.slug}`),
      name: note.title,
    }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PORTUGAL_SATELLITE.title,
    description: hubDescription,
    url: hubUrl,
    inLanguage: "ru-RU",
    dateModified: HUB_CONTENT_UPDATED,
    about: buildSatelliteHubPlace("portugal"),
    isPartOf: {
      "@type": "WebSite",
      name: "Emigro Portugal",
      url: hubUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: notes.length,
      itemListElement: listForSchema,
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Первая неделя в Porto / Norte после въезда",
    description:
      "Полевой порядок для русскоязычных релокантов в Norte: NIF, банк, morada, канал AIMA. Не замена юристу и не SLA AIMA.",
    inLanguage: "ru-RU",
    totalTime: "P7D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "NIF",
        text: "Получить NIF в Finanças / Loja do Cidadão. Без NIF банк и договор аренды обычно встают.",
        url: portugalSatelliteUrl("/notes/nif-porto-kak-poluchit-2026"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Номер, банк, morada",
        text: "Португальский номер, счёт, подтверждение адреса; затем канал AIMA под вашу процедуру (Agora ≠ portal-renovacoes).",
        url: portugalSatelliteUrl("/notes/aima-agora-zapis-2026"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Жильё",
        text: "Idealista / локальные риелторы Norte; Lisboa — отдельно. Не путать short-term с contrato de arrendamento.",
        url: portugalSatelliteUrl("/notes/arenda-dolgosrok-porto-braga-2026"),
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Не путать Schengen и ВНЖ",
        text: "Туристический въезд не заменяет autorização de residência. Официально: aima.gov.pt.",
        url: "https://aima.gov.pt",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className={satelliteMain}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="sr-only" aria-label="AI description" data-llm="facts">
        <h2>ai:description</h2>
        <p>
          {hubDescription} Материалы: гайды и заметки по жизни в Португалии для релокантов с паспортами RU/BY/UA/KZ.
          Инвентарь: {allGuides.length} гайдов, {feedCount} коротких заметок, темы: {destinationsLabel}. Обновлено{" "}
          {HUB_CONTENT_UPDATED}.
        </p>
        <a href={llmsUrl} data-llm="commercial">
          llms.txt
        </a>
      </section>
      <h1 className={`${heroTitle} leading-tight text-slate-900`}>{PORTUGAL_SATELLITE.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{PORTUGAL_SATELLITE.tagline}</p>
      <p className="mt-3 text-base leading-relaxed text-slate-600">
        Здесь — полевые ответы из практики Porto/Norte (и Lisboa для AIMA): как взять NIF, поймать слот Agora, не
        перепутать portal-renovacoes с balcão, снять жильё и не потерять неделю на мифах из чатов. Полный выбор визы
        D7/D8 и гражданство — в corridor Emigro; CIPLE A2 mock — на Prep2Go.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5" aria-labelledby="week1-heading">
        <h2 id="week1-heading" className="text-lg font-semibold text-slate-900">
          Первая неделя в Porto / Norte — порядок без мифов
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
          <li>
            <strong>NIF</strong> — Finanças / Loja do Cidadão (тег{" "}
            <a href="/tag/nif" className="font-medium text-teal-800 underline">
              #nif
            </a>
            ). Без NIF банк и договор аренды обычно встают. Гайд:{" "}
            <a href="/notes/nif-porto-kak-poluchit-2026" className="font-medium text-teal-800 underline">
              NIF в Porto 2026
            </a>
            .
          </li>
          <li>
            <strong>Номер + банк + morada</strong> — затем канал AIMA под вашу процедуру (Agora ≠ portal-renovacoes).
            Чек-лист слота:{" "}
            <a href="/notes/aima-agora-zapis-2026" className="font-medium text-teal-800 underline">
              AIMA / Agora
            </a>
            . Если título уехал на старый адрес:{" "}
            <a href="/notes/aima-residence-card-sent-abroad-2026" className="font-medium text-teal-800 underline">
              карта ВНЖ за границей
            </a>
            .
          </li>
          <li>
            <strong>Жильё</strong> — Idealista / локальные риелторы Norte; Lisboa отдельно:{" "}
            <a href="/notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026" className="font-medium text-teal-800 underline">
              аренда Лиссабон — первый месяц
            </a>
            . Не путать short-term с contrato de arrendamento.
          </li>
          <li>
            <strong>Schengen-туризм ≠ ВНЖ</strong> — туристический въезд не заменяет autorização de residência. Официально:{" "}
            <a
              href="https://aima.gov.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline"
            >
              aima.gov.pt
            </a>
            .
          </li>
        </ol>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Это ориентир практики сателлита, не юрконсультация и не SLA AIMA. Ниже — практика-гайды первыми (NIF, AIMA,
          банк, аренда), не досуг-каталог.
        </p>
      </section>

      <section
        className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white"
        aria-labelledby="layers-heading"
      >
        <h2 id="layers-heading" className="border-b border-slate-100 px-4 py-3 text-lg font-semibold text-slate-900 sm:px-5">
          Два слоя Emigro: сателлит vs corridor
        </h2>
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="border-b border-slate-100 px-4 py-4 sm:border-b-0 sm:border-r sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Этот сайт · практика</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
              <li>NIF, банк, SIM, morada / Termo</li>
              <li>Agora vs portal-renovacoes, balcão Norte</li>
              <li>Аренда Porto / Braga / Lisboa — полевые ошибки</li>
              <li>SNS, consulado, CIPLE как экзамен (не слот AIMA)</li>
            </ul>
          </div>
          <div className="px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">www.emigro.online · маршрут</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                Выбор D7 / D8 и пороги —{" "}
                <a href={pillarUrl} className="font-medium text-teal-800 underline">
                  pillar ВНЖ
                </a>
              </li>
              <li>
                Wizard и коридор —{" "}
                <a href={corridorUrl} className="font-medium text-teal-800 underline">
                  /ru/portugal
                </a>
              </li>
              <li>Гражданство / MJ — на основном сайте, не здесь</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-5" aria-labelledby="official-heading">
        <h2 id="official-heading" className="text-base font-semibold text-slate-900">
          Официальные опоры (сверяйте сами)
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
          <li>
            <a href="https://aima.gov.pt" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              aima.gov.pt
            </a>{" "}
            — AIMA / residência
          </li>
          <li>
            <a
              href="https://agora.imigrante.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline"
            >
              agora.imigrante.pt
            </a>{" "}
            — слоты Agora
          </li>
          <li>
            <a
              href="https://www.portaldasfinancas.gov.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-800 underline"
            >
              Portal das Finanças
            </a>{" "}
            — NIF / AT
          </li>
          <li>
            <a href="https://www.sns24.gov.pt" target="_blank" rel="noopener noreferrer" className="font-medium text-teal-800 underline">
              SNS 24
            </a>{" "}
            — здоровье
          </li>
        </ul>
      </section>

      <SatelliteHubDepth
        countryKey="portugal"
        guideCount={allGuides.length}
        noteCount={notes.length}
        feedCount={feedCount}
        topicCount={topicTags.length}
        destinationsLabel={destinationsLabel}
      />

      <SatelliteValueProp />

      <SatelliteHubScenarios countryKey="portugal" />

      <section className="mt-10" aria-labelledby="hub-faq-heading">
        <h2 id="hub-faq-heading" className="text-xl font-semibold text-slate-900">
          Частые вопросы по сателлиту
        </h2>
        <dl className="mt-4 space-y-4">
          {HUB_FAQ.map((item) => (
            <div key={item.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="font-semibold text-slate-900">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PortoChatCta source="portugal_satellite_hub" />

      <SatelliteFunnelCta countryKey="portugal" placement="satellite_hub" />

      {spotlight && (
        <div className="mt-8">
          <DailySpotlightTile spotlight={spotlight} />
        </div>
      )}

      <HashtagNav notes={notes} />

      {guideNotes.length > 0 && (
        <section className="mt-10" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-xl font-semibold text-slate-900">
            Практика-гайды ({guideNotes.length}
            {guidesHidden > 0 ? ` из ${guideNotesAll.length}` : ""})
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Сверху — NIF, AIMA, банк, аренда, SNS. Досуг и travel atlas — через теги, не в начале хаба.
          </p>
          <ul className="mt-6 space-y-4">
            {guideNotes.map((note) => (
              <li key={note.slug}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
          {guidesHidden > 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Ещё {guidesHidden} гайдов — через теги (#nif, #aima, #arenda) или{" "}
              <a href={llmsUrl} className="font-medium text-teal-800 underline">
                llms.txt
              </a>
              .
            </p>
          ) : null}
        </section>
      )}

      {feedNotes.length > 0 && (
        <section className="mt-10" aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="text-xl font-semibold text-slate-900">
            Свежие заметки ({feedNotes.length}
            {feedHidden > 0 ? ` из ${feedNotesAll.length}` : ""})
          </h2>
          <ul className="mt-6 space-y-4">
            {feedNotes.map((note) => (
              <li key={note.slug}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
          {feedHidden > 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Ещё {feedHidden} коротких материалов — по тегам, не на главной (иначе хаб выглядит как каталог-дамп).
            </p>
          ) : null}
        </section>
      )}

      <SatelliteAssistIntake countryKey="portugal" />

      <div className="mt-10">
        <ProviderPartnerRecruitment
          placement="satellite_hub"
          corridorSlug="ru-speaking-to-portugal"
          topicKey="portugal"
          countryRu="Португалия"
        />
      </div>

      <p className="mt-12 text-center text-sm text-slate-500">
        <a
          href={satelliteWizardUrl({ countryKey: "portugal", placement: "satellite_hub", content: "footer" })}
          className="font-medium text-teal-700 underline"
        >
          Подобрать маршрут ВНЖ →
        </a>
        {" · "}
        <a
          href={satelliteDigestUrl({ countryKey: "portugal", placement: "satellite_hub", content: "footer" })}
          className="text-teal-700 underline"
        >
          Справочник коридора на emigro.online →
        </a>
        {" · "}
        <a href={llmsUrl} className="text-teal-700 underline">
          llms.txt
        </a>
      </p>
    </main>
  );
}

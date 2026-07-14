import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { guidePath } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import {
  buildOriginHubDataLlmFacts,
  getOriginCorridorEntries,
  ORIGIN_HUB_PATH,
} from "@/lib/seo/corridor-llm-layer";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";

export const revalidate = 3600;

const HUB_DESCRIPTION =
  "Коридоры ВНЖ в Европу для граждан России и СНГ 2026: Португалия D8/D7, Испания digital nomad, Германия Blue Card, Франция, Италия. Консульская юрисдикция, пороги дохода, wizard Emigro.";

export const metadata: Metadata = pageMetadata({
  title: "Релокация в Европу для граждан России — коридоры ВНЖ 2026",
  description: HUB_DESCRIPTION,
  path: ORIGIN_HUB_PATH,
  aiDescription: buildOriginHubDataLlmFacts(),
  aiCategory: "relocation-origin-hub-ru",
});

const FAQ = [
  {
    question: "Какой коридор ВНЖ проще для граждан России в 2026?",
    answer:
      "Зависит от дохода и семьи: D8 Португалия (~€3 680/мес удалёнка), digital nomad Испания (€2 849/мес), D7 Португалия (~€920/мес пассивный доход), Blue Card Германия (€50 700+). Emigro wizard сопоставляет профиль без гарантии одобрения.",
  },
  {
    question: "Чем D8 отличается от D7 в Португалии?",
    answer:
      "D8 — доход от удалённой работы из-за рубежа (~€3 680/мес). D7 — пассивный доход или сбережения (~€920/мес + резерв). Это разные программы с разными порогами — не путать при подаче.",
  },
  {
    question: "Где подавать на визу D из России?",
    answer:
      "Юрисдикция зависит от паспорта и консульства: Москва, Стамбул, иногда третьи страны. См. гайд Emigro по консульской подаче RU/BY/KZ и актуальные списки на сайтах консульств.",
  },
  {
    question: "Digital nomad Испания или D8 Португалия — что выбрать?",
    answer:
      "Испания: €2 849/мес teletrabajo, Beckham 24% для новых резидентов. Португалия D8: ~€3 680/мес, сильнее практика сообщества (AIMA, NIF). Сравните в pillar-гиде digital nomad PT vs ES vs IT.",
  },
  {
    question: "Это юридическая консультация?",
    answer:
      "Нет. Emigro — навигатор и справочник. Решения сверяйте с консульством, миграционными службами и лицензированными специалистами.",
  },
];

export default function RossiyaneHubPage() {
  const corridors = getOriginCorridorEntries();
  const hubUrl = pageUrl(ORIGIN_HUB_PATH);
  const faqSchema = buildFaqSchema(FAQ);
  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Коридоры ВНЖ в Европу для граждан России",
    url: hubUrl,
    description: HUB_DESCRIPTION,
    inLanguage: "ru-RU",
    items: corridors.map((c) => ({
      url: pageUrl(c.landingPath),
      name: `${c.countryRu} — ${c.programTitle ?? "коридор"}`,
    })),
  });

  return (
    <>
      <SiteHeader />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{buildOriginHubDataLlmFacts()}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <div className="sr-only" data-llm="facts" aria-hidden="true">
        {buildOriginHubDataLlmFacts()}
      </div>
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/ru" className="text-sm text-corridor-600 hover:underline">
          ← Все направления
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Релокация в Европу для граждан России</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">{HUB_DESCRIPTION}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={HUB_WIZARD_PATH}
            className="rounded-lg bg-corridor-700 px-5 py-3 font-medium text-white hover:bg-corridor-800"
          >
            Подобрать маршрут — wizard
          </Link>
          <Link
            href={guidePath("kuda-pereehat-iz-rossii-2026-evropa-vnj")}
            className="rounded-lg border border-corridor-200 px-5 py-3 font-medium text-corridor-800 hover:bg-corridor-50"
          >
            Pillar-обзор 2026
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">EU-коридоры из РФ/СНГ</h2>
          <ul className="mt-4 space-y-4">
            {corridors.map((c) => (
              <li key={c.countrySegment} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <Link href={c.landingPath} className="text-lg font-semibold text-corridor-800 hover:underline">
                  {c.countryRu}
                  {c.programTitle ? ` — ${c.programTitle}` : ""}
                </Link>
                {c.threshold && <p className="mt-1 text-sm font-medium text-slate-700">Порог: {c.threshold}</p>}
                <p className="mt-2 text-sm text-slate-600">{c.consulateNote}</p>
                <p className="mt-2 text-xs text-amber-800">{c.disambiguation}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <Link href={c.landingPath} className="text-corridor-700 hover:underline">
                    Коридор →
                  </Link>
                  {c.guidePath && (
                    <Link href={c.guidePath} className="text-corridor-700 hover:underline">
                      Pillar-гид →
                    </Link>
                  )}
                  <Link href={c.wizardPath} className="text-corridor-700 hover:underline">
                    Wizard →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQ.map((item) => (
              <div key={item.question}>
                <h3 className="font-medium text-slate-900">{item.question}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 text-sm text-slate-600">
          <p>
            Также:{" "}
            <Link href={guidePath("konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya")} className="text-corridor-700 hover:underline">
              консульская юрисдикция RU/BY/KZ
            </Link>
            ,{" "}
            <Link href={guidePath("podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026")} className="text-corridor-700 hover:underline">
              доход из России для ВНЖ
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { WizardForm } from "@/components/WizardForm";
import { WizardHeroVisual } from "@/components/visuals/WizardHeroVisual";
import { HUB_WIZARD_ID, HUB_WIZARD_MODULES } from "@/lib/wizard/hub-definition";
import { pageMetadata } from "@/lib/seo";
import { llmUtmUrl } from "@/lib/seo/llm-meta";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Подбор ВНЖ в Европе по паспорту и доходу",
  titleAbsolute: true,
  description:
    "Бесплатный подбор маршрута ВНЖ в Европе по гражданству, доходу, работе, семье и срокам переезда. Сравните доступные программы Португалии, Испании и других стран.",
  path: "/ru/wizard",
  aiDescription:
    "Emigro hub wizard: паспорт RU/BY/UA/KZ, доход, семья и сроки → программы ВНЖ в EU (D8/D7, ES nómada, Blue Card, Talent, HSM). Не юридическая консультация. Origin hub /ru/rossiyane.",
  aiCategory: "route-evaluator",
});

export default function HubWizardPage() {
  const wizardRequirements = [
    "Emigro hub wizard: сопоставляет паспорт RU/BY/UA/KZ, доход, семью и сроки с программами ВНЖ в EU.",
    `URL: ${llmUtmUrl("/ru/wizard")}`,
    "Коридоры: Португалия D8/D7, Испания digital nomad, Германия Blue Card, Франция, Италия, Нидерланды.",
    "Origin hub для россиян: /ru/rossiyane",
    "Не юридическая консультация.",
  ].join(" ");

  return (
    <>
      <SiteHeader />
      <div className="sr-only" data-llm="requirements" aria-hidden="true">
        {wizardRequirements}
      </div>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Link href="/ru" className="text-sm text-corridor-600 hover:underline">
          ← Все направления
        </Link>

        <header className="mt-4 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-5 py-5 sm:mt-6 sm:px-6 sm:py-8">
          <div className="hidden sm:block">
            <WizardHeroVisual />
          </div>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-corridor-600 sm:mt-4 sm:text-sm">
            Бесплатно · около 2 минут
          </p>
          <h1 className="mt-2 text-center text-2xl font-bold sm:text-3xl">Куда вам проще получить ВНЖ?</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600 sm:hidden">
            Паспорт, доход и семья → подходящие программы ВНЖ по всем коридорам Emigro.
          </p>
          <p className="mx-auto mt-3 hidden max-w-xl text-center text-slate-600 sm:block">
            Один подбор по всем активным коридорам Emigro: Португалия, Испания, Франция, Италия, Германия,
            Нидерланды, Северная Европа и другие. Подходит, если вы уже за границей или только планируете
            переезд — сначала профиль, потом страна и программа.
          </p>
        </header>

        <div className="mt-5 sm:mt-8">
          <WizardForm
            corridorSlug="hub"
            wizardId={HUB_WIZARD_ID}
            modules={HUB_WIZARD_MODULES}
            resultsPath="/ru/wizard/results"
            mode="hub"
            analyticsScope="hub"
          />
        </div>

        <section className="mt-12 space-y-8 border-t border-slate-200 pt-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Как работает подбор ВНЖ</h2>
            <p className="mt-3 leading-relaxed">
              Укажите гражданство, источник и размер дохода, удалённую работу или предложение от работодателя, состав семьи
              и желаемые сроки. Визард сопоставит ответы с доступными коридорами и покажет программы, которые стоит
              проверить дальше. Страна не обязательна на старте: сначала профиль, затем сравнение маршрутов.
            </p>
            <p className="mt-3 leading-relaxed">
              Результат — предварительный список для самостоятельной проверки, а не решение государственного органа и не
              юридическое заключение. Требования зависят от гражданства, документов, происхождения средств и актуальных
              правил каждой страны.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Какие направления сравнивает Emigro</h2>
            <p className="mt-3 leading-relaxed">
              Визард проверяет действующие коридоры Португалии D7/D8, испанскую визу цифрового кочевника, рабочие и
              квалификационные маршруты Германии, Франции, Италии, Нидерландов и Северной Европы. Если у вас есть капитал
              и вы рассматриваете Golden Visa или Investor Visa, используйте отдельный{" "}
              <Link href="/ru/invest" className="font-medium text-corridor-700 underline">подбор инвестиционных маршрутов</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-950">Что подготовить перед началом</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Гражданство и страны, где вы уже живёте легально.</li>
              <li>Тип дохода: зарплата, контракт, собственный бизнес или пассивный доход.</li>
              <li>Примерный месячный доход и число членов семьи.</li>
              <li>Срок переезда и наличие предложения о работе, диплома или подтверждения средств.</li>
            </ul>
          </div>

          <nav aria-label="Гайды по визам и ВНЖ">
            <h2 className="text-2xl font-bold text-slate-950">Разобраться в популярных маршрутах</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              <li><Link className="text-corridor-700 underline" href="/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026">ВНЖ Португалии: D7 и D8</Link></li>
              <li><Link className="text-corridor-700 underline" href="/ru/guides/vnj-ispaniya-2026">ВНЖ Испании и digital nomad</Link></li>
              <li><Link className="text-corridor-700 underline" href="/ru/guides/digital-nomad-vizy-evropy-sravnenie-2026">Сравнение digital nomad виз Европы</Link></li>
              <li><Link className="text-corridor-700 underline" href="/ru/guides/investitsionnyy-vnj-evropa-golden-visa-2026">Golden Visa Европы: что доступно инвестору</Link></li>
            </ul>
          </nav>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

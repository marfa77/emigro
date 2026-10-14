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
  title: "Подбор страны и маршрута ВНЖ",
  titleAbsolute: true,
  description:
    "Ответьте на вопросы о паспорте, доходе, работе и семье — Emigro проверит европейские коридоры и покажет подходящие программы.",
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
      </main>
      <SiteFooter />
    </>
  );
}

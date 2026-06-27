import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { WizardForm } from "@/components/WizardForm";
import { WizardHeroVisual } from "@/components/visuals/WizardHeroVisual";
import { HUB_WIZARD_ID, HUB_WIZARD_MODULES } from "@/lib/wizard/hub-definition";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Подбор страны и маршрута ВНЖ",
  titleAbsolute: true,
  description:
    "Ответьте на вопросы о паспорте, доходе, работе и семье — Emigro проверит все европейские коридоры и покажет подходящие программы.",
  path: "/ru/wizard",
});

export default function HubWizardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/ru" className="text-sm text-corridor-600 hover:underline">
          ← Все направления
        </Link>

        <header className="mt-6 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-6 py-8">
          <WizardHeroVisual />
          <p className="mt-4 text-center text-sm font-semibold uppercase tracking-wide text-corridor-600">
            Глобальный подбор
          </p>
          <h1 className="mt-2 text-center text-3xl font-bold">Куда вам проще получить ВНЖ?</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Один wizard по всем активным коридорам Emigro: Португалия, Испания, Франция, Италия, Германия,
            Нидерланды, Скандинавия. Сначала профиль — потом страна и программа.
          </p>
        </header>

        <div className="mt-8">
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

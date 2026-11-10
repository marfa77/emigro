import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ScreeningForm } from "@/components/screening/ScreeningForm";

export const metadata: Metadata = {
  title: "Анкета для разбора вашего случая | Emigro",
  description: "Анкета для первичного разбора маршрута переезда: статус, цель, семья, доход и задача.",
  robots: { index: false, follow: false },
};

/**
 * Screening questionnaire. Pavel sends this link to people who asked for a consultation
 * (free or Route Check). Optional ?ref= tags the submission, e.g. ?ref=ivan-route-check.
 */
export default function ScreeningPage({ searchParams }: { searchParams: { ref?: string } }) {
  const refTag = (searchParams.ref ?? "").replace(/[^a-zA-Z0-9_\-.@]/g, "").slice(0, 80);
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-950">Анкета для разбора вашего случая</h1>
        <p className="mt-3 text-slate-600">
          10 минут. Чем точнее ответы, тем быстрее поймём, какие маршруты вам реально доступны и кто из специалистов
          подойдёт. Поля со звёздочкой обязательны.
        </p>
        <div className="mt-8">
          <ScreeningForm refTag={refTag || undefined} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

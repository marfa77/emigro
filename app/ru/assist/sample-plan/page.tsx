import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { AssistSamplePlanActions } from "@/components/assist/AssistSamplePlanActions";
import { AssistSamplePlanDocument } from "@/components/assist/AssistSamplePlanDocument";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ROUTE_CHECK_PDF_PATH } from "@/lib/assist/sample-plan-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Пример Route Check — Emigro Assist",
  description:
    "Образец PDF Route Check Emigro Assist: IT-фрилансер из Белграда, Digital Nomad Visa Испании, таймлайн 5,5 месяцев, бюджет €6 330–8 630, риски и чек-лист документов для переезда в Валенсию.",
  path: "/ru/assist/sample-plan",
});

export default function AssistSamplePlanPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-slate-100 py-10 print:bg-white print:py-0">
        <div className="mx-auto max-w-5xl px-4 print:max-w-none print:px-0">
          <nav className="text-sm text-slate-500 print:hidden">
            <Link href="/ru" className="text-corridor-600 hover:underline">
              Emigro
            </Link>
            <span className="mx-2">/</span>
            <Link href="/ru/assist" className="text-corridor-600 hover:underline">
              Emigro Assist
            </Link>
            <span className="mx-2">/</span>
            <span>Пример Route Check</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6 print:hidden">
            <div>
              <div className="flex items-center gap-2 text-corridor-700">
                <FileText className="h-5 w-5" aria-hidden />
                <p className="text-sm font-semibold uppercase tracking-wide">Образец deliverable</p>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Route Check: Белград → Валенсия, DNV
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Реальный формат PDF после созвона €129: IT-фрилансер с семьёй, подача через консульство в Белграде,
                Beckham Law, бюджет €6 330–8 630. Команда Emigro готовит такой документ в течение 48 часов после
                Route Check.
              </p>
              <p className="mt-3 text-sm">
                <Link href={ROUTE_CHECK_PDF_PATH} className="font-medium text-corridor-700 hover:underline">
                  Скачать PDF-пример
                </Link>
              </p>
            </div>
            <AssistSamplePlanActions />
          </div>

          <div className="mt-8 print:mt-0">
            <AssistSamplePlanDocument />
          </div>

          <div className="mt-8 flex flex-wrap gap-4 print:hidden">
            <Link
              href="/ru/assist#assist-form"
              className="rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
            >
              Записаться на Route Check — €129
            </Link>
            <Link
              href="/ru/assist"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Назад к Emigro Assist
            </Link>
          </div>
        </div>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </>
  );
}

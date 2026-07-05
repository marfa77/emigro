"use client";

import Link from "next/link";
import { Download, ExternalLink, Printer } from "lucide-react";
import { ROUTE_CHECK_PDF_PATH } from "@/lib/assist/sample-plan-data";

export function AssistSamplePlanActions() {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <Link
        href={ROUTE_CHECK_PDF_PATH}
        download
        className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-700"
      >
        <Download className="h-4 w-4" aria-hidden />
        Скачать PDF-пример
      </Link>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
      >
        <ExternalLink className="h-4 w-4" aria-hidden />
        Сохранить веб-версию
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
      >
        <Printer className="h-4 w-4" aria-hidden />
        Печать
      </button>
      <p className="w-full text-xs text-slate-500">
        PDF — реальный образец Route Check после созвона. Веб-версия повторяет структуру документа для просмотра на
        сайте.
      </p>
    </div>
  );
}

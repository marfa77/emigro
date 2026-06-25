import Link from "next/link";
import type { ReactNode } from "react";
import { Check, Clock, FileText, Lock, Phone, Sparkles } from "lucide-react";

type Props = {
  formAnchor?: string;
};

export function AssistPricingCards({ formAnchor = "#assist-form" }: Props) {
  return (
    <section aria-labelledby="assist-pricing-heading" className="mt-10">
      <h2 id="assist-pricing-heading" className="text-2xl font-bold text-slate-950">
        Тарифы
      </h2>
      <p className="mt-2 max-w-2xl text-slate-600">
        Начните с Route Check — короткий созвон и письменное резюме. После этого вы получите детальный план
        переезда в PDF, как в{" "}
        <Link href="/ru/assist/sample-plan" className="font-medium text-corridor-700 hover:underline">
          примере для семьи из Петербурга
        </Link>
        .
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="relative flex flex-col rounded-2xl border-2 border-corridor-600 bg-white p-6 shadow-md">
          <span className="absolute -top-3 left-5 rounded-full bg-corridor-600 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Рекомендуем
          </span>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Route Check</h3>
              <p className="mt-1 text-sm text-slate-600">Первый шаг — проверка маршрута</p>
            </div>
            <p className="text-right">
              <span className="text-3xl font-bold text-corridor-700">€129</span>
            </p>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
            <PricingFeature icon={<Phone className="h-4 w-4" />} text="45-минутный созвон (RU/EN)" />
            <PricingFeature icon={<FileText className="h-4 w-4" />} text="Письменное резюме в течение 48 часов" />
            <PricingFeature icon={<Check className="h-4 w-4" />} text="Оценка 1–2 маршрутов под ваш профиль" />
            <PricingFeature icon={<Clock className="h-4 w-4" />} text="Чек-лист документов и красные флаги" />
          </ul>

          <a
            href={formAnchor}
            className="mt-6 block rounded-lg bg-corridor-600 px-5 py-3 text-center font-medium text-white hover:bg-corridor-700"
          >
            Записаться на Route Check
          </a>
        </article>

        <article
          aria-disabled="true"
          className="relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 opacity-75"
        >
          <span className="absolute -top-3 left-5 rounded-full bg-slate-400 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Скоро
          </span>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-500">Full Assist</h3>
              <p className="mt-1 text-sm text-slate-400">Полное сопровождение — по заявке</p>
            </div>
            <p className="text-right">
              <span className="text-3xl font-bold text-slate-400">от €990</span>
            </p>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-400">
            <PricingFeature icon={<Sparkles className="h-4 w-4" />} text="Детальный PDF-план на 15–25 стр." muted />
            <PricingFeature icon={<FileText className="h-4 w-4" />} text="Таймлайн, бюджет, провайдеры, риски" muted />
            <PricingFeature icon={<Phone className="h-4 w-4" />} text="Сопровождение переписки с gestoría" muted />
            <PricingFeature icon={<Lock className="h-4 w-4" />} text="Доступно после Route Check" muted />
          </ul>

          <button
            type="button"
            disabled
            className="mt-6 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-center font-medium text-slate-400"
          >
            По заявке · скоро
          </button>
        </article>
      </div>
    </section>
  );
}

function PricingFeature({
  icon,
  text,
  muted = false,
}: {
  icon: ReactNode;
  text: string;
  muted?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 shrink-0 ${muted ? "text-slate-300" : "text-corridor-600"}`}>{icon}</span>
      <span>{text}</span>
    </li>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Check,
  Clock,
  FileText,
  Languages,
  Lock,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";

type Props = {
  routeCheckFormAnchor?: string;
  accompanimentFormAnchor?: string;
};

export function AssistPricingCards({
  routeCheckFormAnchor = "#assist-form",
  accompanimentFormAnchor = "#assist-form-accompaniment",
}: Props) {
  return (
    <section aria-labelledby="assist-pricing-heading" className="mt-10">
      <h2 id="assist-pricing-heading" className="text-2xl font-bold text-slate-950">
        Тарифы
      </h2>
      <p className="mt-2 max-w-2xl text-slate-600">
        Emigro Assist — наш сервис навигации и коммуникационной поддержки. Выберите формат под ваш этап.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <article className="relative flex flex-col rounded-2xl border-2 border-corridor-600 bg-white p-6 shadow-md">
          <span className="absolute -top-3 left-5 rounded-full bg-corridor-600 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Route Check
          </span>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Route Check</h3>
              <p className="mt-1 text-sm text-slate-600">Созвон с командой Emigro + PDF с разбором кейса</p>
            </div>
            <p className="text-right">
              <span className="text-3xl font-bold text-corridor-700">€129</span>
            </p>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
            <PricingFeature icon={<Check className="h-4 w-4" />} text="Вы описываете ситуацию в заявке" />
            <PricingFeature
              icon={<Phone className="h-4 w-4" />}
              text="Emigro проводит созвон по структурированному чек-листу"
            />
            <PricingFeature
              icon={<FileText className="h-4 w-4" />}
              text="После встречи — PDF: маршрут, таймлайн, бюджет, риски, следующие шаги"
            />
            <PricingFeature
              icon={<MessageSquare className="h-4 w-4" />}
              text="Подбор профильных партнёров под ваш коридор"
            />
            <PricingFeature icon={<Clock className="h-4 w-4" />} text="Оплата после согласования времени" />
          </ul>

          <p className="mt-5 rounded-xl border border-corridor-100 bg-corridor-50/60 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <span className="font-medium text-slate-800">Пример:</span> семья из Петербурга → Валенсия, Digital Nomad
            Visa. Таймлайн 5,5 месяцев, бюджет €8 400, чек-лист документов.{" "}
            <Link href="/ru/assist/sample-plan" className="font-medium text-corridor-700 hover:underline">
              Смотреть образец PDF
            </Link>
          </p>

          <a
            href={routeCheckFormAnchor}
            className="mt-6 block rounded-lg bg-corridor-600 px-5 py-3 text-center font-medium text-white hover:bg-corridor-700"
          >
            Запросить Route Check — €129
          </a>
        </article>

        <article
          id="assist-accompaniment"
          className="relative flex flex-col scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <span className="absolute -top-3 left-5 rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Сопровождение
          </span>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Сопровождение</h3>
              <p className="mt-1 text-sm text-slate-600">Помощь в процессе после Route Check</p>
            </div>
            <p className="text-right">
              <span className="text-3xl font-bold text-slate-900">€100</span>
              <span className="block text-xs text-slate-500">/ час</span>
            </p>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
            <PricingFeature
              icon={<Languages className="h-4 w-4" />}
              text="Коммуникация с консульством, юристом, агентством на нужном языке"
            />
            <PricingFeature
              icon={<FileText className="h-4 w-4" />}
              text="Подготовка и проверка писем, запросов, форм"
            />
            <PricingFeature icon={<Check className="h-4 w-4" />} text="Разбор отказов и следующие шаги" />
            <PricingFeature
              icon={<MessageSquare className="h-4 w-4" />}
              text="Координация с партнёром на этапе подачи и переписки"
            />
          </ul>

          <p className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <span className="font-medium text-slate-800">Подходит если:</span> получили отказ и не понимаете почему.
            Нужно написать в AIMA или MA35. Не уверены, правильно ли заполнена форма.
          </p>

          <a
            href={accompanimentFormAnchor}
            className="mt-6 block rounded-lg border border-slate-300 bg-white px-5 py-3 text-center font-medium text-slate-900 hover:bg-slate-50"
          >
            Узнать про сопровождение
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
              <p className="mt-1 text-sm text-slate-400">Полное сопровождение от маршрута до карты ВНЖ</p>
            </div>
            <p className="text-right">
              <span className="text-3xl font-bold text-slate-400">от €990</span>
            </p>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-400">
            <PricingFeature icon={<Sparkles className="h-4 w-4" />} text="Детальный PDF-план 15–25 страниц" muted />
            <PricingFeature icon={<FileText className="h-4 w-4" />} text="Таймлайн, бюджет, провайдеры, риски" muted />
            <PricingFeature icon={<MessageSquare className="h-4 w-4" />} text="Сопровождение всей переписки" muted />
            <PricingFeature icon={<Lock className="h-4 w-4" />} text="Координация с партнёром на каждом этапе" muted />
          </ul>

          <button
            type="button"
            disabled
            className="mt-6 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-center font-medium text-slate-400"
          >
            Скоро · лист ожидания
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

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Check,
  Clock,
  FileText,
  Languages,
  MessageSquare,
  Phone,
  UserCheck,
} from "lucide-react";
import { ROUTE_CHECK_PDF_PATH } from "@/lib/assist/sample-plan-data";
import { pricingCardHeaderRow } from "@/lib/ui/mobile";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";

type Props = {
  routeCheckFormAnchor?: string;
  accompanimentFormAnchor?: string;
};

export function AssistPricingCards({
  routeCheckFormAnchor = "#assist-form-route-check",
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
        <article className="relative flex flex-col rounded-2xl border-2 border-green-600 bg-green-50/40 p-6 shadow-md">
          <span className="absolute -top-3 left-5 rounded-full bg-green-700 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Бесплатно
          </span>
          <PricingCardHeader
            title="Найти специалиста"
            subtitle="Передадим запрос подходящему партнёру"
            price={<span className="text-3xl font-bold text-green-700">€0</span>}
          />

          <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
            <PricingFeature icon={<MessageSquare className="h-4 w-4" />} text="Вы кратко описываете ситуацию" />
            <PricingFeature icon={<UserCheck className="h-4 w-4" />} text="Мы ищем партнёра по стране и задаче" />
            <PricingFeature icon={<Check className="h-4 w-4" />} text="Передаём контакт только с вашего согласия" />
            <PricingFeature icon={<Clock className="h-4 w-4" />} text="Ответим, когда найдём подходящего специалиста" />
          </ul>

          <p className="mt-5 rounded-xl border border-green-200 bg-white/70 px-4 py-3 text-xs leading-relaxed text-slate-600">
            Услуги выбранного специалиста оплачиваются отдельно по его условиям. Emigro не берёт плату за знакомство.
          </p>

          <TrackedAssistLink
            href="#assist-form"
            placement="ru_assist_pricing"
            linkLabel="Описать задачу бесплатно"
            className="mt-6 block rounded-lg bg-green-700 px-5 py-3 text-center font-medium text-white hover:bg-green-800"
          >
            Описать задачу бесплатно
          </TrackedAssistLink>
        </article>

        <article
          id="assist-route-check"
          className="relative flex flex-col scroll-mt-24 rounded-2xl border border-corridor-300 bg-white p-6 shadow-sm"
        >
          <span className="absolute -top-3 left-5 rounded-full bg-corridor-600 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Route Check
          </span>
          <PricingCardHeader
            title="Route Check"
            subtitle="Созвон с командой Emigro + PDF с разбором кейса"
            price={<span className="text-3xl font-bold text-corridor-700">€129</span>}
          />

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
            <span className="font-medium text-slate-800">Пример:</span> IT-фрилансер из Белграда → Валенсия, DNV через
            консульство в Сербии. Таймлайн 5,5 месяцев, бюджет €6 330–8 630, 8 разделов PDF.{" "}
            <Link href="/ru/assist/sample-plan" className="font-medium text-corridor-700 hover:underline">
              Смотреть образец
            </Link>
            {" · "}
            <Link href={ROUTE_CHECK_PDF_PATH} className="font-medium text-corridor-700 hover:underline">
              PDF
            </Link>
          </p>

          <TrackedAssistLink
            href={routeCheckFormAnchor}
            placement="ru_assist_pricing"
            linkLabel="Запросить Route Check — €129"
            className="mt-6 block rounded-lg border border-corridor-300 bg-white px-5 py-3 text-center font-medium text-corridor-800 hover:bg-corridor-50"
          >
            Запросить Route Check — €129
          </TrackedAssistLink>
        </article>

        <article
          id="assist-accompaniment"
          className="relative flex flex-col scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <span className="absolute -top-3 left-5 rounded-full bg-slate-800 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Сопровождение
          </span>
          <PricingCardHeader
            title="Сопровождение"
            subtitle="Помощь в процессе после Route Check"
            price={
              <>
                <span className="text-3xl font-bold text-slate-900">€100</span>
                <span className="block text-xs text-slate-500">/ час</span>
              </>
            }
          />

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

          <TrackedAssistLink
            href={accompanimentFormAnchor}
            placement="ru_assist_pricing"
            linkLabel="Узнать про сопровождение"
            className="mt-6 block rounded-lg border border-slate-300 bg-white px-5 py-3 text-center font-medium text-slate-900 hover:bg-slate-50"
          >
            Узнать про сопровождение
          </TrackedAssistLink>
        </article>

      </div>
    </section>
  );
}

function PricingCardHeader({
  title,
  subtitle,
  price,
  titleClassName = "text-slate-950",
  subtitleClassName = "text-slate-600",
}: {
  title: string;
  subtitle: string;
  price: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className={pricingCardHeaderRow}>
      <div>
        <h3 className={`text-xl font-bold ${titleClassName}`}>{title}</h3>
        <p className={`mt-1 text-sm ${subtitleClassName}`}>{subtitle}</p>
      </div>
      <p className="sm:text-right">{price}</p>
    </div>
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

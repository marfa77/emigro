import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { buildAssistUrl } from "@/lib/assist/build-url";
import { ruCountryTo } from "@/lib/ru-country-cases";

type Props = {
  wizardHref: string;
  placement: string;
  source: string;
  countryRu?: string;
  countrySegment?: string;
  className?: string;
};

/** Compact product step right after the lead of a guide or news post. */
export function RouteNextStep({ wizardHref, placement, source, countryRu, countrySegment, className = "" }: Props) {
  const route = countryRu ? `маршрут ${ruCountryTo(countryRu)}` : "маршрут";
  const assistHref = buildAssistUrl({ country: countrySegment, source });

  return (
    <section
      aria-label="Следующий шаг"
      className={`rounded-2xl border border-corridor-200 bg-corridor-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5 ${className}`}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-corridor-700">Следующий шаг</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          Проверьте, какой {route} подходит под ваш паспорт, доход и семью. Сложный случай — Route Check: созвон и
          PDF с планом за 48 часов.
        </p>
      </div>
      <div className="mt-3 flex shrink-0 flex-wrap items-center gap-2 sm:mt-0">
        <Link
          href={wizardHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
        >
          Подобрать маршрут
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <TrackedAssistLink
          href="/ru/route-check"
          placement={`${placement}_route_check`}
          linkLabel="Route Check — €129"
          country={countrySegment}
          className="inline-flex rounded-lg border border-corridor-300 bg-white px-4 py-2 text-sm font-medium text-corridor-800 hover:bg-corridor-50"
        >
          Route Check — €129
        </TrackedAssistLink>
        <TrackedAssistLink
          href={assistHref}
          placement={`${placement}_assist`}
          linkLabel="Найти специалиста"
          country={countrySegment}
          className="px-1 text-sm font-medium text-corridor-700 hover:underline"
        >
          Найти специалиста
        </TrackedAssistLink>
      </div>
    </section>
  );
}

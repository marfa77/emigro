import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { pageMetadata } from "@/lib/seo";
import { roleRadarBotHref } from "@/lib/role-radar";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Role Radar — senior-дайджесты вакансий в Telegram",
  description:
    "Role Radar подбирает senior IT-роли под ваше CV и присылает дайджест в Telegram. Free, Scout и Operator. Регионы EU / UK / remote.",
  path: "/ru/role-radar",
});

const PLANS = [
  {
    name: "Free",
    blurb: "Старт без оплаты: профиль, регионы и первые совпадения в Telegram.",
  },
  {
    name: "Scout",
    blurb: "Больше сигналов и прицельные дайджесты, когда ищете активно.",
  },
  {
    name: "Operator",
    blurb: "Полный режим на 30 дней или год: приоритет, Build CV и операторский фильтр.",
  },
] as const;

const GETS = [
  "Роли по вашему уровню и стеку — не общий канал вакансий",
  "Регионы: EU, UK, remote — настраиваете в боте",
  "Build CV для Founder / Operator — черновик под конкретную роль",
  "Всё в Telegram — без ещё одного личного кабинета",
] as const;

export default function RoleRadarPage() {
  const ctaHref = roleRadarBotHref("web_emigro");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e0f2fe_0%,_#f8fafc_45%,_#f1f5f9_100%)] text-slate-900">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200/70">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">Role Radar</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Senior-роли под ваше CV — в Telegram
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              Дайджест вакансий для IT-лидеров: совпадения по опыту, региону и уровню. Открываете бота —
              дальше всё в чате.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Открыть в Telegram
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                href="/ru/guides/rabota-v-evrope-dlya-rossiyan-2026"
                className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                Гайд Emigro: работа в Европе
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Что получаете</h2>
          <p className="mt-2 text-slate-600">Один канал — Telegram. Без дашборда и лишних аккаунтов.</p>
          <ul className="mt-8 space-y-4">
            {GETS.map((item) => (
              <li key={item} className="flex gap-3 text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-slate-200/80 bg-white/70">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Тарифы</h2>
            <p className="mt-2 text-slate-600">
              Не подписка с автосписанием: Free, Scout или Operator на 30 дней / год — в боте.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-5">
                  <p className="text-sm font-semibold text-sky-800">{plan.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.blurb}</p>
                </div>
              ))}
            </div>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-900 hover:text-sky-950"
            >
              Запустить Role Radar в Telegram
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="text-sm leading-relaxed text-slate-500">
            Role Radar — сестринский продукт Emigro для тех, кто уже смотрит на работу и Blue Card в EU.
            Бот на английском; эта страница — для русскоязычной аудитории Emigro.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

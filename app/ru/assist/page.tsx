import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { AssistLeadForm, type AssistCountryOption, type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { getAllProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Emigro Assist",
  description: "Заявка в Emigro Assist: помощь с коммуникацией, сравнением ответов провайдеров и подготовкой вопросов.",
  path: "/ru/assist",
});

const COUNTRY_OPTIONS: AssistCountryOption[] = [
  { value: "portugal", label: "Португалия", corridorSlug: "ru-speaking-to-portugal" },
  { value: "spain", label: "Испания", corridorSlug: "ru-speaking-to-spain" },
  { value: "france", label: "Франция", corridorSlug: "ru-speaking-to-france" },
  { value: "italy", label: "Италия", corridorSlug: "ru-speaking-to-italy" },
  { value: "germany", label: "Германия", corridorSlug: "ru-speaking-to-germany" },
  { value: "netherlands", label: "Нидерланды", corridorSlug: "ru-speaking-to-netherlands" },
  { value: "scandinavia", label: "Скандинавия", corridorSlug: "ru-speaking-to-scandinavia" },
];

export default function AssistPage() {
  const providers: AssistProviderOption[] = getAllProviders()
    .filter((provider) => !provider.isFirstParty)
    .map((provider) => ({
      id: provider.id,
      name: provider.name,
      category: PROVIDER_CATEGORY_LABELS_RU[provider.category],
    }));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Emigro Assist</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section>
            <p className="inline-flex rounded-full bg-corridor-50 px-3 py-1 text-sm font-medium text-corridor-800">
              Сервис Emigro
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Emigro Assist: помощь с провайдерами без mailto
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Поможем сформулировать запрос, подготовить вопросы, сравнить ответы агентств и вести переписку на
              английском, португальском, испанском, французском или немецком.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <MessageCircle className="h-5 w-5 text-corridor-600" aria-hidden />
                <h2 className="mt-3 font-semibold text-slate-950">Что происходит после заявки</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Владелец получает заявку в Telegram DM, проверяет контекст и отвечает вам напрямую по указанному
                  контакту.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-corridor-600" aria-hidden />
                <h2 className="mt-3 font-semibold text-slate-950">Честная рамка</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Это помощь с коммуникацией и сравнением ответов. Emigro не оказывает юридические услуги, не
                  рекомендует конкретного провайдера и не гарантирует результат.
                </p>
              </div>
            </div>
          </section>

          <AssistLeadForm countries={COUNTRY_OPTIONS} providers={providers} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

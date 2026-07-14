import Link from "next/link";
import { Building2, Handshake, Scale, Users } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CONTACT_EMAIL, MAILTO_PARTNERS } from "@/lib/site-contact";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "Партнёрам",
  description:
    "Emigro ищет партнёров: иммиграционные юристы и адвокаты, релокационные агентства, бухгалтеры, языковые школы и сервис-провайдеры по ВНЖ в Европе. Оставьте заявку.",
  path: "/ru/partners",
});

const PARTNER_TYPES = [
  {
    icon: Scale,
    title: "Иммиграционные юристы и адвокаты",
    text: "Лицензированные специалисты по ВНЖ, воссоединению семьи, гражданству в странах коридоров Emigro.",
  },
  {
    icon: Building2,
    title: "Релокационные агентства",
    text: "Компании полного цикла: документы, консульства, сопровождение после переезда.",
  },
  {
    icon: Users,
    title: "Сервис-провайдеры",
    text: "Открытие счёта, регистрация в налоговых органах, страховки, аренда, переводчики, бухгалтерия.",
  },
  {
    icon: Handshake,
    title: "Образование и язык",
    text: "Языковые школы, подготовка к государственным экзаменам, курсы для заявителей на ВНЖ и гражданство.",
  },
];

export default function PartnersPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Партнёрам" },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Партнёрам</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold">Партнёрская программа</h1>
        <p className="mt-4 text-lg text-slate-600">
          Emigro — навигатор релокации для русскоязычных заявителей. Мы ищем надёжных партнёров в Европе, которым можем
          передавать квалифицированные запросы после wizard-подбора маршрута.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Кого ищем</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PARTNER_TYPES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-5">
                <Icon className="h-5 w-5 text-corridor-600" aria-hidden />
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-corridor-200 bg-corridor-50 p-6">
          <h2 className="text-xl font-semibold text-corridor-900">Что предлагаем партнёрам</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-corridor-900/90">
            <li>Заявки с контекстом: маршрут, паспорт, ответы wizard (без обещаний «горячих лидов»).</li>
            <li>Присутствие в shortlist после прохождения пользователем подбора.</li>
            <li>Прозрачные правила: мы не юридическая фирма и не конкурируем с вами за клиента.</li>
            <li>Фокус на качестве и репутации — приоритет лицензированным специалистам.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Как подать заявку</h2>
          <p className="mt-3 text-slate-600">
            Напишите на{" "}
            <a href={MAILTO_PARTNERS} className="font-medium text-corridor-600 hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            с темой «Партнёрство» и кратко укажите:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>страны присутствия и типы услуг (ВНЖ, воссоединение семьи, гражданство и т.д.);</li>
            <li>лицензии / регистрация (если применимо);</li>
            <li>языки работы с клиентами;</li>
            <li>ссылку на сайт или профиль.</li>
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={MAILTO_PARTNERS}
            className="rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700"
          >
            Написать о партнёрстве
          </a>
          <Link
            href="/ru/contact"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Все контакты
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

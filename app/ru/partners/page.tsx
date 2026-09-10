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
    "Emigro приглашает партнёров по релокации, визам, недвижимости и сервисам за рубежом. Подключение и первые лиды на этапе запуска — бесплатно.",
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
    icon: Building2,
    title: "Недвижимость и инвестиции",
    text: "Покупка, аренда и инвестиционные объекты для переезда или получения резидентского статуса.",
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
          Emigro — навигатор релокации для русскоязычных заявителей. Мы собираем сеть партнёров по направлениям
          Emigro и передаём им запросы пользователей, которым нужна профессиональная помощь.
        </p>

        <section className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-950">На старте — бесплатно</h2>
          <p className="mt-3 text-sm leading-relaxed text-green-900/90">
            Подключение, размещение в справочнике и первые пилотные передачи лидов бесплатны. Сначала проверяем,
            подходит ли формат обеим сторонам. Платную модель вводим только после появления стабильных запросов и
            отдельно согласовываем её с партнёром.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Зачем это обеим сторонам</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-sky-200 bg-sky-50/60 p-5">
              <Users className="h-5 w-5 text-sky-700" aria-hidden />
              <h3 className="mt-3 font-semibold text-slate-900">Для человека, которому нужна помощь</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Не нужно писать десяти фирмам. Пользователь описывает страну и задачу один раз, получает знакомство с
                профильным специалистом и сам решает, продолжать ли работу. Контакт передаём только с явного согласия.
              </p>
            </article>
            <article className="rounded-xl border border-corridor-200 bg-corridor-50/60 p-5">
              <Handshake className="h-5 w-5 text-corridor-700" aria-hidden />
              <h3 className="mt-3 font-semibold text-slate-900">Для фирмы</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Не список Telegram-ников, а opt-in запрос с контекстом страны, маршрута и задачи. Показываем компанию
                только на релевантных направлениях; первые передачи бесплатны, чтобы проверить качество и конверсию.
              </p>
            </article>
          </div>
        </section>

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
          <h2 className="text-xl font-semibold text-corridor-900">Как мы работаем</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-corridor-900/90">
            <li>Принимаем партнёров разных форматов, если компания реальна и её услуги соответствуют заявленному.</li>
            <li>Передаём контакт только с согласием пользователя и с контекстом его запроса.</li>
            <li>Не обещаем объём: на запуске вместе тестируем спрос, коммуникацию и качество обработки.</li>
            <li>Emigro не конкурирует за сопровождение — клиент продолжает работу напрямую с выбранным партнёром.</li>
            <li>После пилота смотрим на скорость ответа, результат и обратную связь; неработающие профили отключаем.</li>
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
            <li>название компании, сайт или публичный профиль;</li>
            <li>языки работы с клиентами;</li>
            <li>лицензии / регистрация, если они обязательны для ваших услуг.</li>
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

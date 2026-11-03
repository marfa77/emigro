import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Shield } from "lucide-react";
import { TelegramCommunityDirectory } from "@/components/community/TelegramCommunityDirectory";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { NewsBotSubscribeCta } from "@/components/news/NewsBotSubscribeCta";
import { guidePath } from "@/lib/guides/load";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { buildCommunityPageSchema } from "@/lib/seo/community-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { NEWS_TELEGRAM_URL } from "@/lib/community";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "Сообщества Emigro в Telegram — Португалия, Испания, Италия",
  description:
    "Пять сообществ Emigro: «Порту и вокруг» @emigro_portugal, @valencia_echat, @emigro_Italy, @milan_echat, @comomercatino. Новости региона и быт релокантов.",
  path: "/ru/community",
  ogImageAlt: "Сообщества Emigro в Telegram",
});

const RULES = [
  "Это не юридическая консультация — для официальных решений обращайтесь к лицензированным специалистам.",
  "Уважайте участников: без оскорблений, политики и токсичности.",
  "Без рекламы, спама и «гарантированных» услуг — нарушители удаляются.",
  "Не публикуйте персональные данные третьих лиц без согласия.",
] as const;

export default function CommunityPage() {
  const communityUrl = pageUrl("/ru/community");
  const pillarGuides = listPillarGuides().slice(0, 6);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Сообщества Emigro", item: communityUrl },
  ]);
  const structuredData = buildCommunityPageSchema();

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {structuredData.map((schema, index) => (
        <script
          key={`community-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Сообщества Emigro</span>
        </nav>

        <HeroShell className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Telegram
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Сообщества Emigro</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Каналы и чаты для релокантов на русском: новости региона, быт и обмен опытом по Португалии, Valenciana и
            северу Италии. Прямые ссылки — без бота.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-corridor-200">
            Общая лента Emigro —{" "}
            <a href={NEWS_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              @Emigro_news
            </a>
            . Персональные дайджесты страны в личку — в боте @emigro_chat_bot («новости Португалия» и др.).
          </p>
        </HeroShell>

        <NewsBotSubscribeCta source="community_landing" className="mt-8" />

        <section className="mt-12" aria-labelledby="communities-list-heading">
          <h2 id="communities-list-heading" className="text-2xl font-semibold text-slate-900">
            Куда зайти
          </h2>
          <div className="mt-6">
            <TelegramCommunityDirectory />
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
            <Shield className="h-5 w-5 text-amber-700" aria-hidden />
            Правила
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-900">Гайды для шаринга</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Если материал на сайте помог — отправьте ссылку в чат или канал по стране.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {pillarGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={guidePath(guide.slug)}
                  className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-corridor-700 hover:border-corridor-300 hover:bg-corridor-50"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            Все гайды:{" "}
            <Link href="/ru/guides" className="text-corridor-600 hover:underline">
              /ru/guides
            </Link>
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Подобрать маршрут на сайте</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Wizard сопоставит профиль с программами ВНЖ. Telegram — для новостей и живого опыта, не вместо проверки
            документов.
          </p>
          <Link
            href="/ru/wizard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-corridor-700 px-5 py-3 font-medium text-white hover:bg-corridor-800"
          >
            Подбор маршрута
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

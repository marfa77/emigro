import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Shield, Users, Zap, BookOpen } from "lucide-react";
import { CommunityJoinButton } from "@/components/community/CommunityJoinButton";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { DISCUSSION_ACCESS_HINT, DISCUSSION_GROUP_HANDLE, DISCUSSION_GROUP_LABEL, NEWS_TELEGRAM_URL } from "@/lib/community";
import { guidePath } from "@/lib/guides/load";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { buildCommunityPageSchema } from "@/lib/seo/community-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "Дискуссионная группа Emigro — Telegram",
  description:
    "Официальная страница сообщества Emigro для русскоязычных релокантов: канал @Emigro_news, обсуждения в комментариях, опыт переезда и новости маршрутов ВНЖ в Европе.",
  path: "/ru/community",
  ogImageAlt: "Сообщество Emigro в Telegram",
});

const BENEFITS = [
  {
    icon: Users,
    title: "Обмен опытом",
    text: "Реальные истории переезда, банки, аренда, школы и подача документов — от тех, кто уже прошёл путь.",
  },
  {
    icon: MessageCircle,
    title: "Ответы на вопросы",
    text: "Задайте вопрос по маршруту, доходу или семье — участники и команда Emigro помогут сориентироваться.",
  },
  {
    icon: Zap,
    title: "Новости маршрутов",
    text: "Изменения в программах ВНЖ, консульства и практика подачи — быстрее, чем ждать еженедельный дайджест.",
  },
  {
    icon: BookOpen,
    title: "Pillar-гайды",
    text: "Делитесь ссылками на гайды Emigro в комментариях — digital nomad Испания, D8 Португалия, Blue Card и транзитные хабы.",
  },
  {
    icon: Shield,
    title: "Без спама",
    text: "Модерация, без рекламы и «гарантированных ВНЖ». Только полезный контент для релокантов.",
  },
] as const;

const RULES = [
  "Это не юридическая консультация — для официальных решений обращайтесь к лицензированным специалистам.",
  "Уважайте участников: без оскорблений, политики и токсичности.",
  "Без рекламы, спама и «гарантированных» услуг — нарушители удаляются.",
  "Не публикуйте персональные данные третьих лиц без согласия.",
] as const;

export default function CommunityPage() {
  const communityUrl = pageUrl("/ru/community");
  const pillarGuides = listPillarGuides().slice(0, 8);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Дискуссионная группа", item: communityUrl },
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
          <span>Дискуссионная группа</span>
        </nav>

        <HeroShell className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <MessageCircle className="h-4 w-4" />
            Telegram-сообщество
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{DISCUSSION_GROUP_LABEL}</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            <strong>{DISCUSSION_GROUP_HANDLE}</strong> — чат обсуждений, привязанный к каналу <strong>@Emigro_news</strong>.
            Отдельно «вступить» в него нельзя: подпишитесь на канал и задавайте вопросы в комментариях к постам. Это площадка
            Emigro для читателей канала — без спама и рекламы.
          </p>
          <p className="mt-3 text-sm text-corridor-200">{DISCUSSION_ACCESS_HINT}</p>
          <div className="mt-8">
            <CommunityJoinButton source="community_landing_hero" size="lg" />
          </div>
        </HeroShell>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-900">Что вы получите</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-corridor-100 p-2 text-corridor-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Правила сообщества</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">Частые вопросы</h2>
          <dl className="mt-4 space-y-5">
            <div>
              <dt className="font-medium text-slate-900">Как попасть в обсуждения?</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                Подпишитесь на @Emigro_news и пишите в комментариях к постам — чат @emigro_chat открывается там же.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Чем это отличается от wizard на сайте?</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                Wizard подбирает маршруты ВНЖ по анкете. Telegram — живой опыт, вопросы по конкретным кейсам и быстрые
                новости от участников.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Это юридическая консультация?</dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                Нет. Для официальных решений используйте{" "}
                <Link href="/ru/partners" className="text-corridor-600 hover:underline">
                  справочник провайдеров
                </Link>{" "}
                или{" "}
                <Link href="/ru/assist" className="text-corridor-600 hover:underline">
                  Emigro Assist
                </Link>
                .
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-900">Гайды для шаринга в Telegram</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Если гайд помог — отправьте ссылку в комментарии @Emigro_news или в чат релокантов. Это основной канал распространения Emigro (без Дзена и агрегаторов).
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
            Все pillar-гайды:{" "}
            <Link href="/ru/guides" className="text-corridor-600 hover:underline">
              /ru/guides
            </Link>
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Как попасть в обсуждения</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Подпишитесь на канал{" "}
            <a href={NEWS_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
              @Emigro_news
            </a>{" "}
            и пишите в комментариях к постам — там открывается чат {DISCUSSION_GROUP_HANDLE}. Новости и дайджесты публикуются в канале.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <CommunityJoinButton source="community_landing_footer" size="lg" />
            <Link
              href="/ru/wizard"
              className="inline-flex items-center gap-2 rounded-lg border border-corridor-300 px-5 py-3 font-medium text-corridor-700 hover:bg-corridor-50"
            >
              Подобрать маршрут
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
            Истории переезда и фидбек по гайдам — в комментариях к постам канала или на{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Фидбек по гайду Emigro")}`} className="text-sky-700 hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

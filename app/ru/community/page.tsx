import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, Shield, Users, Zap } from "lucide-react";
import { CommunityJoinButton } from "@/components/community/CommunityJoinButton";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { DZEN_STORIES_URL, DISCUSSION_GROUP_HANDLE, DISCUSSION_GROUP_LABEL, DISCUSSION_GROUP_URL, NEWS_TELEGRAM_URL } from "@/lib/community";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Дискуссионная группа Emigro — Telegram",
  description:
    "Дискуссионная группа @emigro_chat при канале @Emigro_news: вопросы по переезду, обмен опытом и новости маршрутов без спама.",
  path: "/ru/community",
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
    title: "Истории на Дзене",
    text: "Реальные истории переезда — в формате «как было на самом деле». Можете прислать свою для публикации.",
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
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Дискуссионная группа" },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
            <strong>{DISCUSSION_GROUP_HANDLE}</strong> — дискуссионная группа в Telegram, привязанная к каналу{" "}
            <strong>@Emigro_news</strong>. Здесь можно задать вопрос по переезду, обменяться опытом и следить за
            изменениями маршрутов. Это не сторонний чат релокантов — а площадка Emigro для читателей канала. Бесплатно,
            без спама.
          </p>
          <p className="mt-3 text-sm text-corridor-200">
            Новости и дайджесты — в канале{" "}
            <a href={NEWS_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              @Emigro_news
            </a>
            .
          </p>
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

        <section className="mt-14 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Готовы присоединиться?</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Вступайте в группу <strong>{DISCUSSION_GROUP_HANDLE}</strong> — задайте первый вопрос или читайте обсуждения
            читателей канала. Новости маршрутов — в канале{" "}
            <a href={NEWS_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
              @Emigro_news
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <CommunityJoinButton source="community_landing_footer" size="lg" />
            <a
              href={DZEN_STORIES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
            >
              <BookOpen className="h-4 w-4" />
              Истории на Дзене
            </a>
            <Link
              href="/ru/wizard"
              className="inline-flex items-center gap-2 rounded-lg border border-corridor-300 px-5 py-3 font-medium text-corridor-700 hover:bg-corridor-50"
            >
              Подобрать маршрут
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500">
            Свою историю для Дзена — в{" "}
            <a href={DISCUSSION_GROUP_URL} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
              {DISCUSSION_GROUP_HANDLE}
            </a>{" "}
            или на{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("История для Дзена")}`} className="text-sky-700 hover:underline">
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

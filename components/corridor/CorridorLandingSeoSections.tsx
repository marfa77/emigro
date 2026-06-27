import Link from "next/link";
import { AlertTriangle, BookOpen, Compass, Newspaper, Sparkles } from "lucide-react";
import type { Corridor } from "@/lib/types";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { newsIndexPath } from "@/lib/news/topics";
import { isCorridorFull } from "@/lib/corridor/publish";
import {
  buildCorridorLandingAiDescription,
  buildCorridorLandingFaq,
  buildCorridorLandingLlmFacts,
  buildCorridorLandingQuickAnswer,
  type FaqItem,
} from "@/lib/seo/corridor-page-seo";

function FaqBlock({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">FAQ по коридору</h2>
      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="font-medium text-slate-900">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CorridorLandingSeoSections({
  topic,
  corridor,
  landingPath,
}: {
  topic: NewsTopicConfig;
  corridor: Corridor;
  landingPath: string;
}) {
  const quickAnswer = buildCorridorLandingQuickAnswer(topic, corridor);
  const faq = buildCorridorLandingFaq(topic, corridor);
  const llmFacts = buildCorridorLandingLlmFacts(topic, corridor);
  const aiDescription = buildCorridorLandingAiDescription(topic, corridor);
  const newsHref = newsIndexPath(topic.urlSegment);
  const programsBase = `${landingPath}#programs`;

  return (
    <>
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{aiDescription}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>

      <section className="mt-8 rounded-2xl border border-corridor-200 bg-white p-6 shadow-sm">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-700">
          <Sparkles className="h-4 w-4" />
          Короткий ответ
        </p>
        <p className="mt-3 text-lg leading-relaxed text-slate-800">{quickAnswer}</p>
        <p className="mt-3 text-sm text-slate-500 llm-summary">{topic.focusHintRu}</p>
      </section>

      <FaqBlock items={faq} />

      <section className="mt-10 rounded-2xl border border-corridor-200 bg-corridor-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Куда дальше</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {corridor.programs.length > 0 && (
            <Link
              href={programsBase}
              className="rounded-lg border border-white bg-white p-4 transition hover:border-corridor-300 hover:shadow-sm"
            >
              <BookOpen className="h-5 w-5 text-corridor-600" />
              <p className="mt-2 font-medium text-slate-900">Программы ВНЖ</p>
              <p className="mt-1 text-sm text-slate-600">
                {corridor.programs.map((p) => p.title_ru).join(" · ")}
              </p>
            </Link>
          )}
          <Link
            href={newsHref}
            className="rounded-lg border border-white bg-white p-4 transition hover:border-corridor-300 hover:shadow-sm"
          >
            <Newspaper className="h-5 w-5 text-corridor-600" />
            <p className="mt-2 font-medium text-slate-900">Новости недели</p>
            <p className="mt-1 text-sm text-slate-600">Изменения законов и практика консульств с источниками.</p>
          </Link>
          {isCorridorFull(topic.status) && topic.sitePaths?.wizard && (
            <Link
              href={topic.sitePaths.wizard}
              className="rounded-lg border border-corridor-200 bg-white p-4 transition hover:border-corridor-400 hover:shadow-sm"
            >
              <Compass className="h-5 w-5 text-corridor-700" />
              <p className="mt-2 font-medium text-corridor-900">Подбор маршрута</p>
              <p className="mt-1 text-sm text-corridor-800/80">Wizard сопоставит профиль с программами {topic.countryRu}.</p>
            </Link>
          )}
          {topic.sitePaths?.guide && (
            <Link
              href={topic.sitePaths.guide}
              className="rounded-lg border border-white bg-white p-4 transition hover:border-corridor-300 hover:shadow-sm"
            >
              <BookOpen className="h-5 w-5 text-corridor-600" />
              <p className="mt-2 font-medium text-slate-900">Справочник коридора</p>
              <p className="mt-1 text-sm text-slate-600">Проверенные факты по ВНЖ, гражданству и срокам.</p>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Коротко для проверки маршрута</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
          {llmFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          Коридор — навигатор, не юридическая консультация. Для решений сверяйтесь с{" "}
          <Link href={landingPath} className="font-medium underline">
            программами {topic.countryRu}
          </Link>
          , справочником и еженедельными новостями Emigro.
        </p>
      </section>
    </>
  );
}

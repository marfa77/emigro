import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { ProgramDetail } from "@/lib/types";
import type { NewsTopicConfig } from "@/lib/news/topics";
import {
  buildProgramAiDescription,
  buildProgramFaq,
  buildProgramLlmFacts,
  programPagePath,
  type FaqItem,
} from "@/lib/seo/corridor-page-seo";
import { buildProgramDataLlmFacts, getOriginCorridorEntries } from "@/lib/seo/corridor-llm-layer";

function FaqBlock({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">FAQ</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Ответы перед проверкой маршрута</h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-slate-600">
          Короткие ответы на вопросы, которые чаще всего влияют на решение: деньги, сроки, паспорт и ограничения.
        </p>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProgramSeoSections({
  program,
  topic,
  landingPath,
}: {
  program: ProgramDetail;
  topic: NewsTopicConfig;
  landingPath: string;
}) {
  const faq = buildProgramFaq(program, topic);
  const llmFacts = buildProgramLlmFacts(program, topic);
  const aiDescription = buildProgramAiDescription(program, topic);
  const pagePath = programPagePath(topic, program.slug);
  const dataLlmFacts = buildProgramDataLlmFacts(program, topic, pagePath);
  const originEntry = getOriginCorridorEntries().find((c) => c.countrySegment === topic.urlSegment);

  return (
    <>
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{aiDescription}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <div className="sr-only" data-llm="facts" aria-hidden="true">
        {dataLlmFacts}
      </div>
      {originEntry && (
        <div className="sr-only" data-llm="requirements" aria-hidden="true">
          {originEntry.consulateNote} {originEntry.disambiguation}
        </div>
      )}

      <FaqBlock items={faq} />

      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Коротко для проверки маршрута</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Машиночитаемая выжимка фактов, чтобы быстро сверить страницу с wizard и официальными источниками.
        </p>
        <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
          {llmFacts.map((fact) => (
            <li key={fact} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              {fact}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          Материал носит информационный характер и не является юридической консультацией. Пороги, сроки и практика
          консульств меняются — сверяйте решения с{" "}
          <Link href={landingPath} className="font-medium underline">
            коридором {topic.countryRu}
          </Link>{" "}
          и официальными источниками на этой странице.
        </p>
      </section>
    </>
  );
}

import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import type { ProgramDetail } from "@/lib/types";
import type { NewsTopicConfig } from "@/lib/news/topics";
import {
  buildProgramAiDescription,
  buildProgramFaq,
  buildProgramLlmFacts,
  buildProgramQuickAnswer,
  passportLabel,
  PASSPORT_STATUS_LABELS,
  type FaqItem,
} from "@/lib/seo/corridor-page-seo";

const STATUS_STYLES: Record<string, string> = {
  eligible: "border-emerald-200 bg-emerald-50 text-emerald-900",
  partial: "border-amber-200 bg-amber-50 text-amber-900",
  ineligible: "border-rose-200 bg-rose-50 text-rose-900",
};

function FaqBlock({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">FAQ по программе</h2>
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

export function ProgramSeoSections({
  program,
  topic,
  landingPath,
}: {
  program: ProgramDetail;
  topic: NewsTopicConfig;
  landingPath: string;
}) {
  const quickAnswer = buildProgramQuickAnswer(program, topic);
  const faq = buildProgramFaq(program, topic);
  const llmFacts = buildProgramLlmFacts(program, topic);
  const aiDescription = buildProgramAiDescription(program, topic);

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
      </section>

      {program.passportEligibility.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Паспорта и доступность подачи</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {program.passportEligibility.map((entry) => (
              <span
                key={entry.id}
                className={`inline-flex flex-col rounded-xl border px-3 py-2 text-sm ${STATUS_STYLES[entry.status] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}
              >
                <span className="font-semibold">{passportLabel(entry.passport_iso2)}</span>
                <span className="text-xs opacity-90">{PASSPORT_STATUS_LABELS[entry.status] ?? entry.status}</span>
                {entry.notes_ru && <span className="mt-1 text-xs opacity-80">{entry.notes_ru}</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      <FaqBlock items={faq} />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Краткая выжимка (для LLM)</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
          {llmFacts.map((fact) => (
            <li key={fact}>{fact}</li>
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

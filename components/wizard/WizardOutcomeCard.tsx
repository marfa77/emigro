import Link from "next/link";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";

export const OUTCOME_LABELS: Record<string, string> = {
  likely_eligible: "Подходит по базовым ответам",
  needs_review: "Требует проверки",
  unlikely: "Сейчас не подходит",
};

export const OUTCOME_COLORS: Record<string, string> = {
  likely_eligible: "bg-green-100 text-green-800 border-green-200",
  needs_review: "bg-amber-100 text-amber-800 border-amber-200",
  unlikely: "bg-slate-100 text-slate-600 border-slate-200",
};

const MAX_REASON_LENGTH = 150;

export function readableReason(reason: string): string {
  const compact = reason.replace(/\s+/g, " ").trim();
  if (compact.length <= MAX_REASON_LENGTH) return compact;
  return `${compact.slice(0, MAX_REASON_LENGTH - 1).trimEnd()}…`;
}

export function WizardOutcomeCard({
  title,
  programType,
  outcome,
  reasons,
  href,
  sourceUrl,
  sourceLabel,
}: {
  title: string;
  programType?: string;
  outcome: string;
  reasons?: string[];
  href?: string;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
}) {
  const visibleReasons = reasons?.filter(Boolean) ?? [];
  const missing = missingItems(outcome, visibleReasons);
  const nextSteps = nextStepsForOutcome(outcome);

  return (
    <div className={`rounded-xl border p-5 ${OUTCOME_COLORS[outcome] ?? "border-slate-200 bg-white"}`}>
      {programType && <ProgramTypeBadge type={programType} />}
      <h2 className={`font-semibold ${programType ? "mt-3" : ""}`}>{title}</h2>
      <p className="mt-2 text-sm font-medium">{OUTCOME_LABELS[outcome] ?? outcome}</p>

      <section className="mt-4 space-y-3 text-sm leading-relaxed">
        <div>
          <p className="font-semibold">Почему</p>
          {visibleReasons.length > 0 ? (
            <ul className="mt-1 space-y-1 opacity-90">
              {visibleReasons.slice(0, 3).map((reason) => (
                <li key={reason}>• {readableReason(reason)}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 opacity-90">Сравнили ваши ответы с базовыми требованиями программы.</p>
          )}
        </div>

        <div>
          <p className="font-semibold">Что не хватает</p>
          <p className="mt-1 opacity-90">{missing}</p>
        </div>

        <div>
          <p className="font-semibold">Что сделать дальше</p>
          <ul className="mt-1 space-y-1 opacity-90">
            {nextSteps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-corridor-700 underline">
            Официальный источник{sourceLabel ? `: ${sourceLabel}` : ""}
          </a>
        )}
        {href && (
          <Link href={href} className="text-corridor-700 underline">
            Страница программы →
          </Link>
        )}
      </div>
    </div>
  );
}

function missingItems(outcome: string, reasons: string[]): string {
  if (outcome === "likely_eligible") {
    return "Критичного пробела по вашим ответам не видно. Всё равно нужно проверить свежий список документов и место подачи.";
  }

  if (outcome === "needs_review") {
    return "Нужна ручная проверка: чаще всего это паспорт, консульство подачи, состав семьи или подтверждение денег.";
  }

  const blockers = reasons.filter((reason) => /нужно|указано|не указан|не выбрано|не хватает/i.test(reason));
  if (blockers.length > 0) {
    return blockers.slice(0, 2).map(readableReason).join("; ");
  }

  return "Не хватает одного или нескольких базовых условий программы. Посмотрите причины выше и сравните с официальными требованиями.";
}

function nextStepsForOutcome(outcome: string): string[] {
  if (outcome === "likely_eligible") {
    return [
      "Откройте страницу программы и проверьте официальный список документов.",
      "Соберите доказательства дохода, денег, семьи и жилья.",
      "Перед подачей проверьте консульство или миграционный орган.",
    ];
  }

  if (outcome === "needs_review") {
    return [
      "Сверьте спорные пункты с официальным источником.",
      "Подготовьте документы, которые объясняют доход, семью или место подачи.",
      "Покажите кейс специалисту, если есть отказ, несколько стран или сложная семья.",
    ];
  }

  return [
    "Не паникуйте: это не отказ, а предварительная проверка.",
    "Посмотрите, можно ли поднять доход, накопить средства, получить оффер или выбрать учёбу.",
    "Сравните соседние маршруты и при сложном кейсе обсудите его с провайдером.",
  ];
}

import Link from "next/link";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";

export const OUTCOME_LABELS: Record<string, string> = {
  likely_eligible: "Подходит по базовым ответам",
  needs_review: "Требует проверки",
  unlikely: "Сейчас не подходит",
};

const OUTCOME_LABELS_ES: Record<string, string> = {
  likely_eligible: "Encaja con las respuestas básicas",
  needs_review: "Requiere revisión",
  unlikely: "Por ahora no encaja",
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
  locale = "ru",
}: {
  title: string;
  programType?: string;
  outcome: string;
  reasons?: string[];
  href?: string;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  locale?: "ru" | "es";
}) {
  const isEs = locale === "es";
  const labels = isEs ? OUTCOME_LABELS_ES : OUTCOME_LABELS;
  const visibleReasons = reasons?.filter(Boolean) ?? [];
  const missing = missingItems(outcome, visibleReasons, isEs);
  const nextSteps = nextStepsForOutcome(outcome, isEs);

  return (
    <div className={`w-full rounded-xl border p-5 ${OUTCOME_COLORS[outcome] ?? "border-slate-200 bg-white"}`}>
      {programType && <ProgramTypeBadge type={programType} />}
      <h2 className={`font-semibold ${programType ? "mt-3" : ""}`}>{title}</h2>
      <p className="mt-2 text-sm font-medium">{labels[outcome] ?? outcome}</p>

      <section className="mt-4 space-y-3 text-sm leading-relaxed">
        <div>
          <p className="font-semibold">{isEs ? "Por qué" : "Почему"}</p>
          {visibleReasons.length > 0 ? (
            <ul className="mt-1 space-y-1 opacity-90">
              {visibleReasons.slice(0, 3).map((reason) => (
                <li key={reason}>• {readableReason(reason)}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 opacity-90">
              {isEs
                ? "Comparamos sus respuestas con los requisitos básicos del programa."
                : "Сравнили ваши ответы с базовыми требованиями программы."}
            </p>
          )}
        </div>

        <div>
          <p className="font-semibold">{isEs ? "Qué falta" : "Что не хватает"}</p>
          <p className="mt-1 opacity-90">{missing}</p>
        </div>

        <div>
          <p className="font-semibold">{isEs ? "Qué hacer después" : "Что сделать дальше"}</p>
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
            {isEs ? "Fuente oficial" : "Официальный источник"}
            {sourceLabel ? `: ${sourceLabel}` : ""}
          </a>
        )}
        {href && (
          <Link href={href} className="text-corridor-700 underline">
            {isEs ? "Abrir en Emigro ES →" : "Страница программы →"}
          </Link>
        )}
      </div>
    </div>
  );
}

function missingItems(outcome: string, reasons: string[], isEs = false): string {
  if (outcome === "likely_eligible") {
    return isEs
      ? "No se ve un vacío crítico en sus respuestas. Aun así revise la lista actual de documentos y el lugar de presentación."
      : "Критичного пробела по вашим ответам не видно. Всё равно нужно проверить свежий список документов и место подачи.";
  }

  if (outcome === "needs_review") {
    return isEs
      ? "Hace falta revisión manual: suele ser pasaporte, consulado, familia o prueba de fondos."
      : "Нужна ручная проверка: чаще всего это паспорт, консульство подачи, состав семьи или подтверждение денег.";
  }

  const blockers = reasons.filter((reason) => /нужно|указано|не указан|не выбрано|не хватает/i.test(reason));
  if (blockers.length > 0) {
    return blockers.slice(0, 2).map(readableReason).join("; ");
  }

  return isEs
    ? "Faltan una o varias condiciones básicas del programa. Compare con la fuente oficial."
    : "Не хватает одного или нескольких базовых условий программы. Посмотрите причины выше и сравните с официальными требованиями.";
}

function nextStepsForOutcome(outcome: string, isEs = false): string[] {
  if (outcome === "likely_eligible") {
    return isEs
      ? [
          "Abra el hub o pilar y revise la lista oficial de documentos.",
          "Reúna pruebas de ingresos, fondos, familia y vivienda.",
          "Antes de presentar, confirme el consulado o la oficina de extranjería.",
        ]
      : [
          "Откройте страницу программы и проверьте официальный список документов.",
          "Соберите доказательства дохода, денег, семьи и жилья.",
          "Перед подачей проверьте консульство или миграционный орган.",
        ];
  }

  if (outcome === "needs_review") {
    return isEs
      ? [
          "Contraste los puntos dudosos con la fuente oficial.",
          "Prepare documentos que expliquen ingresos, familia o lugar de presentación.",
          "Si el caso es complejo, escríbanos.",
        ]
      : [
          "Сверьте спорные пункты с официальным источником.",
          "Подготовьте документы, которые объясняют доход, семью или место подачи.",
          "Покажите кейс специалисту, если есть отказ, несколько стран или сложная семья.",
        ];
  }

  return isEs
    ? [
        "No es un rechazo: es una revisión previa.",
        "Vea si puede subir ingresos, ahorros, oferta o la vía de estudios.",
        "Compare rutas vecinas (España ↔ Portugal) y revise los pilares.",
      ]
    : [
        "Не паникуйте: это не отказ, а предварительная проверка.",
        "Посмотрите, можно ли поднять доход, накопить средства, получить оффер или выбрать учёбу.",
        "Сравните соседние маршруты и при сложном кейсе обсудите его с провайдером.",
      ];
}

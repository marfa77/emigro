"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";
import type { WizardModule, WizardQuestion } from "@/lib/types";
import { tapTarget, tapTargetSmReset } from "@/lib/ui/mobile";
import {
  interestIso2ToSegments,
  parseInterestParam,
} from "@/lib/wizard/interest-prefill";

interface WizardProps {
  corridorSlug: string;
  wizardId: string;
  modules: WizardModule[];
  resultsPath: string;
  /** Hub wizard uses /api/v1/hub/wizard/* endpoints. */
  mode?: "corridor" | "hub";
  analyticsScope?: string;
  /** UI locale for chrome strings; question copy still comes from modules. */
  locale?: "ru" | "es";
  /**
   * Extra answers merged on submit (e.g. hub_audience=latam for ES wizard).
   * Not shown in the form.
   */
  hiddenAnswers?: Record<string, string>;
}

type DraftPayload = {
  step: number;
  answers: Record<string, string>;
  savedAt: number;
};

function draftStorageKey(mode: string, corridorSlug: string, wizardId: string) {
  return `emigro-wizard-draft:v1:${mode}:${corridorSlug}:${wizardId}`;
}

function isQuestionVisible(questionKey: string, answers: Record<string, string>): boolean {
  if (questionKey === "annual_salary_eur") return answers.has_job_offer === "yes";
  if (questionKey === "monthly_income_eur") return answers.remote_income === "yes";
  if (
    questionKey === "has_university_admission" ||
    questionKey === "study_budget_eur" ||
    questionKey === "can_show_study_funds" ||
    questionKey === "study_level"
  ) {
    return answers.wants_study_route === "yes";
  }
  return true;
}

function isQuestionRequired(
  questionKey: string,
  questionType: string,
  required: boolean,
  answers: Record<string, string>
): boolean {
  if (!required) return false;
  if (questionType === "multi") return false;
  if (!isQuestionVisible(questionKey, answers)) return false;
  return true;
}

function clearDependentAnswers(
  key: string,
  value: string,
  prev: Record<string, string>
): Record<string, string> {
  const next = { ...prev, [key]: value };
  if (key === "has_job_offer" && value !== "yes") {
    delete next.annual_salary_eur;
  }
  if (key === "remote_income" && value !== "yes") {
    delete next.monthly_income_eur;
  }
  if (key === "wants_study_route" && value !== "yes") {
    delete next.has_university_admission;
    delete next.study_budget_eur;
    delete next.can_show_study_funds;
    delete next.study_level;
  }
  return next;
}

export function WizardForm({
  corridorSlug,
  wizardId,
  modules,
  resultsPath,
  mode = "corridor",
  analyticsScope,
  locale = "ru",
  hiddenAnswers,
}: WizardProps) {
  const router = useRouter();
  const formId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [interestLabels, setInterestLabels] = useState<string[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const startedRef = useRef(false);
  const hydratedRef = useRef(false);
  const isEs = locale === "es";

  const ui = isEs
    ? {
        progressLabel: "Progreso del evaluador",
        stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
        interestPrefix: "Tenemos en cuenta su interés en:",
        interestSuffix:
          "El emparejamiento sigue centrado en España y Portugal; el interés solo ordena un poco.",
        draftRestored:
          "Restauramos sus respuestas anteriores en este dispositivo. Puede continuar o cambiar cualquier paso.",
        tip: "Si no tiene la cifra exacta, indique una aproximación en euros. Si la pregunta no aplica, elija «No» o deje vacío el campo opcional.",
        answerRequired: (label: string) => `Responda: ${label}`,
        loading1: "Comparamos sus respuestas con los programas; puede tardar unos segundos.",
        loading2: "Comparamos ingresos, ahorros, familia y documentos con los requisitos.",
        loading3: "Preparamos resultados claros y próximos pasos.",
        loadingIdle: "Calculando resultados...",
        loadingHint: "Comprobamos las reglas; no cierre ni actualice la página.",
        errorTitle: "Falta un paso",
        back: "Atrás",
        next: "Siguiente",
        showResults: "Ver resultados",
        preparing: "Preparando resultados...",
        numberFallback: "Introduzca un número",
        numberExamples: {
          monthly_income_eur: "Ej.: 3500",
          passive_income_eur: "Ej.: 1200",
          savings_eur: "Ej.: 25000",
          willing_to_invest_eur: "Ej.: 0 o 250000",
          annual_salary_eur: "Ej.: 55678",
          study_budget_eur: "Ej.: 12000",
          relocating_children_count: "0, 1, 2...",
          relocating_parents_count: "0, 1, 2...",
        } as Record<string, string>,
      }
    : {
        progressLabel: "Прогресс wizard",
        stepOf: (n: number, total: number) => `Шаг ${n} из ${total}`,
        interestPrefix: "Учитываем ваш интерес к:",
        interestSuffix:
          "Подбор всё равно по всем коридорам — интерес только слегка поднимает релевантные страны в выдаче.",
        draftRestored:
          "Восстановили ваши прошлые ответы с этого устройства. Можно продолжить или изменить любой шаг.",
        tip: "Если точной цифры нет, укажите примерную сумму в евро. Если вопрос не про вас или ответа нет, выбирайте «Нет» или оставляйте необязательное поле пустым.",
        answerRequired: (label: string) => `Ответьте на вопрос: ${label}`,
        loading1: "Сверяем ответы с программами, это может занять несколько секунд.",
        loading2: "Сравниваем доход, сбережения, семью и документы с требованиями программ.",
        loading3: "Готовим понятные результаты и следующие шаги.",
        loadingIdle: "Считаем результаты...",
        loadingHint:
          "Мы проверяем правила программ и сразу покажем результат. Страницу можно не обновлять и не закрывать.",
        errorTitle: "Нужно ещё одно действие",
        back: "Назад",
        next: "Далее",
        showResults: "Показать результаты",
        preparing: "Готовим результаты...",
        numberFallback: "Введите число",
        numberExamples: {
          monthly_income_eur: "Например: 3500",
          passive_income_eur: "Например: 1200",
          savings_eur: "Например: 25000",
          willing_to_invest_eur: "Например: 0 или 250000",
          annual_salary_eur: "Например: 55678",
          study_budget_eur: "Например: 12000",
          relocating_children_count: "0, 1, 2...",
          relocating_parents_count: "0, 1, 2...",
        } as Record<string, string>,
      };

  const currentModule = modules[step];
  const isLast = step === modules.length - 1;
  const scope = analyticsScope ?? corridorSlug;
  const storageKey = useMemo(
    () => draftStorageKey(mode, corridorSlug, wizardId),
    [mode, corridorSlug, wizardId]
  );

  const visibleQuestions = useMemo(
    () => currentModule.questions.filter((q) => isQuestionVisible(q.question_key, answers)),
    [currentModule, answers]
  );

  function numberPlaceholder(questionKey: string): string {
    return ui.numberExamples[questionKey] ?? ui.numberFallback;
  }

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const search = typeof window !== "undefined" ? window.location.search : "";
    const interest = parseInterestParam(search);
    setInterestLabels(interest.labelsRu);

    let initial: Record<string, string> = {};
    if (interest.iso2.length > 0) {
      initial.interest_countries = interest.iso2.join(",");
      initial.interest_segments = interestIso2ToSegments(interest.iso2).join(",");
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const draft = JSON.parse(raw) as DraftPayload;
        if (
          draft &&
          typeof draft.step === "number" &&
          draft.answers &&
          typeof draft.answers === "object" &&
          Date.now() - (draft.savedAt ?? 0) < 1000 * 60 * 60 * 24 * 7
        ) {
          initial = { ...draft.answers, ...initial };
          setStep(Math.min(Math.max(0, draft.step), modules.length - 1));
          setDraftRestored(true);
        }
      }
    } catch {
      // ignore corrupt draft
    }

    if (Object.keys(initial).length > 0) {
      setAnswers(initial);
    }
  }, [storageKey, modules.length]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const search = typeof window !== "undefined" ? window.location.search : "";
    const interest = new URLSearchParams(search).get("interest");

    trackEvent("wizard_started", {
      corridor_slug: scope,
      wizard_id: wizardId,
      wizard_mode: mode,
      locale: locale,
      page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
      referer: typeof document !== "undefined" ? document.referrer : "",
      ...(interest ? { interest_countries: interest } : {}),
    });
  }, [scope, wizardId, mode, locale]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (Object.keys(answers).length === 0 && step === 0) return;
    try {
      const payload: DraftPayload = { step, answers, savedAt: Date.now() };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // quota / private mode
    }
  }, [answers, step, storageKey]);

  useEffect(() => {
    const heading = document.getElementById(`${formId}-step-title`);
    heading?.focus({ preventScroll: true });
  }, [step, formId]);

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => clearDependentAnswers(key, value, prev));
  }

  function toggleMultiAnswer(key: string, value: string) {
    setAnswers((prev) => {
      const current = prev[key] ? prev[key].split(",").filter(Boolean) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next.join(",") };
    });
  }

  async function handleNext() {
    for (const q of currentModule.questions) {
      if (!isQuestionRequired(q.question_key, q.question_type, q.required, answers)) continue;
      if (!answers[q.question_key]) {
        setError(ui.answerRequired(q.label_ru));
        return;
      }
    }
    setError(null);

    if (!isLast) {
      trackEvent("wizard_step", {
        corridor_slug: scope,
        step: step + 1,
        module_key: currentModule.module_key,
      });
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    setLoadingMessage(ui.loading1);
    const slowHintTimer = window.setTimeout(() => {
      setLoadingMessage(ui.loading1);
    }, 1000);
    try {
      const postUrl =
        mode === "hub"
          ? "/api/v1/hub/wizard/sessions"
          : `/api/v1/corridors/${corridorSlug}/wizard/sessions`;
      const payloadAnswers = { ...answers, ...(hiddenAnswers ?? {}) };
      const sessionRes = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizard_id: wizardId, answers: payloadAnswers }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error ?? "Session failed");

      setLoadingMessage(ui.loading2);
      const evalUrl =
        mode === "hub"
          ? `/api/v1/hub/wizard/sessions/${sessionData.id}/evaluate`
          : `/api/v1/corridors/${corridorSlug}/wizard/sessions/${sessionData.id}/evaluate`;
      const evalRes = await fetch(evalUrl, { method: "POST" });
      const evalData = await evalRes.json();
      if (!evalRes.ok) throw new Error(evalData.error ?? "Evaluation failed");

      setLoadingMessage(ui.loading3);
      trackEvent("wizard_completed", {
        corridor_slug: scope,
        session_id: sessionData.id,
        programs_evaluated: String(evalData.results?.length ?? 0),
      });

      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // ignore
      }

      router.push(`${resultsPath}?session=${sessionData.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : isEs ? "Error" : "Ошибка";
      trackEvent("wizard_error", { corridor_slug: scope, message });
      setError(message);
    } finally {
      window.clearTimeout(slowHintTimer);
      setLoading(false);
      setLoadingMessage("");
    }
  }

  function renderQuestion(q: WizardQuestion) {
    const groupId = `${formId}-${q.question_key}`;
    const labelId = `${groupId}-label`;

    return (
      <div key={q.id}>
        <div id={labelId} className="block font-medium">
          {q.label_ru}
        </div>
        {q.help_ru && <p className="mt-1 text-sm text-slate-500">{q.help_ru}</p>}

        {q.question_type === "single" && q.options && (
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby={labelId}
          >
            {q.options.map((opt) => {
              const selected = answers[q.question_key] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswer(q.question_key, opt.value)}
                  className={`${tapTarget} rounded-lg border px-4 py-2.5 text-sm ${
                    selected
                      ? "border-corridor-500 bg-corridor-50 text-corridor-800"
                      : "border-slate-200 hover:border-corridor-300"
                  }`}
                >
                  {opt.label_ru}
                </button>
              );
            })}
          </div>
        )}

        {q.question_type === "number" && (
          <input
            id={groupId}
            type="number"
            inputMode="decimal"
            min={0}
            aria-labelledby={labelId}
            placeholder={numberPlaceholder(q.question_key)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-base sm:max-w-xs sm:py-2 sm:text-sm"
            value={answers[q.question_key] ?? ""}
            onChange={(e) => setAnswer(q.question_key, e.target.value)}
          />
        )}

        {q.question_type === "multi" && q.options && (
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-labelledby={labelId}
          >
            {q.options.map((opt) => {
              const selected = (answers[q.question_key] ?? "").split(",").filter(Boolean);
              const active = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="checkbox"
                  aria-checked={active}
                  onClick={() => toggleMultiAnswer(q.question_key, opt.value)}
                  className={`${tapTarget} rounded-lg border px-4 py-2.5 text-sm ${
                    active
                      ? "border-corridor-500 bg-corridor-50 text-corridor-800"
                      : "border-slate-200 hover:border-corridor-300"
                  }`}
                >
                  {opt.label_ru}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex gap-2" role="list" aria-label={ui.progressLabel}>
        {modules.map((m, i) => (
          <div
            key={m.id}
            role="listitem"
            aria-current={i === step ? "step" : undefined}
            title={m.title_ru}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-corridor-500" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <h2
        id={`${formId}-step-title`}
        tabIndex={-1}
        className="text-xl font-semibold outline-none"
      >
        {currentModule.title_ru}
      </h2>
      <p className="text-sm text-slate-500">
        {ui.stepOf(step + 1, modules.length)}
      </p>

      {interestLabels.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          {ui.interestPrefix} {interestLabels.join(", ")}. {ui.interestSuffix}
        </div>
      )}

      {draftRestored && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {ui.draftRestored}
        </div>
      )}

      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-950">
        {ui.tip}
      </div>

      <div className="mt-6 space-y-6">{visibleQuestions.map(renderQuestion)}</div>

      {error && (
        <div
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-medium">{ui.errorTitle}</p>
          <p className="mt-1">{error}</p>
        </div>
      )}
      {loading && (
        <div
          className="mt-4 rounded-lg border border-corridor-100 bg-corridor-50 px-4 py-3 text-sm text-corridor-900"
          role="status"
          aria-live="polite"
        >
          <p className="font-medium">{loadingMessage || ui.loadingIdle}</p>
          <p className="mt-1 text-corridor-800">{ui.loadingHint}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          disabled={step === 0 || loading}
          onClick={() => setStep((s) => s - 1)}
          className={`rounded-lg px-4 py-3 text-sm text-slate-600 disabled:opacity-40 ${tapTargetSmReset} sm:py-2`}
        >
          {ui.back}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className={`${tapTarget} rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700 disabled:opacity-60 ${tapTargetSmReset} sm:py-2`}
        >
          {loading ? ui.preparing : isLast ? ui.showResults : ui.next}
        </button>
      </div>
    </div>
  );
}

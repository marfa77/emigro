"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/client";
import type { WizardModule } from "@/lib/types";

interface WizardProps {
  corridorSlug: string;
  wizardId: string;
  modules: WizardModule[];
  resultsPath: string;
  /** Hub wizard uses /api/v1/hub/wizard/* endpoints. */
  mode?: "corridor" | "hub";
  analyticsScope?: string;
}

export function WizardForm({
  corridorSlug,
  wizardId,
  modules,
  resultsPath,
  mode = "corridor",
  analyticsScope,
}: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const currentModule = modules[step];
  const isLast = step === modules.length - 1;

  const scope = analyticsScope ?? corridorSlug;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const search = typeof window !== "undefined" ? window.location.search : "";
    const interest = new URLSearchParams(search).get("interest");

    trackEvent("wizard_started", {
      corridor_slug: scope,
      wizard_id: wizardId,
      wizard_mode: mode,
      locale: "ru",
      page_path: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
      referer: typeof document !== "undefined" ? document.referrer : "",
      ...(interest ? { interest_countries: interest } : {}),
    });
  }, [scope, wizardId, mode]);

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
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

  function isQuestionRequired(questionKey: string, questionType: string, required: boolean): boolean {
    if (!required) return false;
    if (questionType === "multi") return false;
    if (questionType === "number") {
      if (questionKey === "annual_salary_eur" && answers.has_job_offer !== "yes") return false;
      if (questionKey === "monthly_income_eur" && answers.remote_income !== "yes") return false;
      if (questionKey === "passive_income_eur" && answers.passive_income !== "yes") return false;
      if (questionKey === "willing_to_invest_eur" && answers.willing_to_invest !== "yes") return false;
      if (
        (questionKey === "has_university_admission" ||
          questionKey === "study_budget_eur" ||
          questionKey === "can_show_study_funds") &&
        answers.wants_study_route !== "yes"
      ) {
        return false;
      }
    }
    if (
      questionType === "single" &&
      (questionKey === "has_university_admission" || questionKey === "can_show_study_funds") &&
      answers.wants_study_route !== "yes"
    ) {
      return false;
    }
    return true;
  }

  async function handleNext() {
    for (const q of currentModule.questions) {
      if (!isQuestionRequired(q.question_key, q.question_type, q.required)) continue;
      if (!answers[q.question_key]) {
        setError(`Ответьте на вопрос: ${q.label_ru}`);
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
    try {
      const postUrl =
        mode === "hub"
          ? "/api/v1/hub/wizard/sessions"
          : `/api/v1/corridors/${corridorSlug}/wizard/sessions`;
      const sessionRes = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizard_id: wizardId, answers }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error ?? "Session failed");

      const evalUrl =
        mode === "hub"
          ? `/api/v1/hub/wizard/sessions/${sessionData.id}/evaluate`
          : `/api/v1/corridors/${corridorSlug}/wizard/sessions/${sessionData.id}/evaluate`;
      const evalRes = await fetch(evalUrl, { method: "POST" });
      const evalData = await evalRes.json();
      if (!evalRes.ok) throw new Error(evalData.error ?? "Evaluation failed");

      trackEvent("wizard_completed", {
        corridor_slug: scope,
        session_id: sessionData.id,
        programs_evaluated: String(evalData.results?.length ?? 0),
      });

      router.push(`${resultsPath}?session=${sessionData.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка";
      trackEvent("wizard_error", { corridor_slug: scope, message });
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex gap-2">
        {modules.map((m, i) => (
          <div
            key={m.id}
            className={`h-2 flex-1 rounded-full ${i <= step ? "bg-corridor-500" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold">{currentModule.title_ru}</h2>
      <p className="text-sm text-slate-500">
        Шаг {step + 1} из {modules.length}
      </p>

      <div className="mt-6 space-y-6">
        {currentModule.questions.map((q) => (
          <div key={q.id}>
            <label className="block font-medium">{q.label_ru}</label>
            {q.help_ru && <p className="mt-1 text-sm text-slate-500">{q.help_ru}</p>}

            {q.question_type === "single" && q.options && (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswer(q.question_key, opt.value)}
                    className={`rounded-lg border px-4 py-2 text-sm ${
                      answers[q.question_key] === opt.value
                        ? "border-corridor-500 bg-corridor-50 text-corridor-800"
                        : "border-slate-200 hover:border-corridor-300"
                    }`}
                  >
                    {opt.label_ru}
                  </button>
                ))}
              </div>
            )}

            {q.question_type === "number" && (
              <input
                type="number"
                className="mt-2 w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2"
                value={answers[q.question_key] ?? ""}
                onChange={(e) => setAnswer(q.question_key, e.target.value)}
              />
            )}

            {q.question_type === "multi" && q.options && (
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const selected = (answers[q.question_key] ?? "").split(",").filter(Boolean);
                  const active = selected.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleMultiAnswer(q.question_key, opt.value)}
                      className={`rounded-lg border px-4 py-2 text-sm ${
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
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="rounded-lg px-4 py-2 text-sm text-slate-600 disabled:opacity-40"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={loading}
          className="rounded-lg bg-corridor-600 px-5 py-2 text-sm font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
        >
          {loading ? "Считаем..." : isLast ? "Показать результаты" : "Далее"}
        </button>
      </div>
    </div>
  );
}

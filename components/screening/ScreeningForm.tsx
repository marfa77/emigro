"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";
import { SCREENING_SECTIONS, type ScreeningField } from "@/lib/screening/questions";

const field =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-corridor-500 focus:outline-none focus:ring-2 focus:ring-corridor-200";

export function ScreeningForm({ refTag }: { refTag?: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (id: string, value: string) => setAnswers((prev) => ({ ...prev, [id]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/v1/screening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, consent, ref: refTag ?? "", website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Не удалось отправить анкету");
      trackEvent("screening_submitted", { ref: refTag ?? "" });
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить анкету");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900" role="status">
        <p className="text-lg font-semibold">Спасибо, анкета получена.</p>
        <p className="mt-2 text-sm">Изучим ответы и напишем вам: {answers.contact}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {SCREENING_SECTIONS.map((section, index) => (
        <fieldset key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-corridor-700">
            {index + 1}. {section.title}
          </legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {section.fields.map((f) => (
              <Field key={f.id} f={f} value={answers[f.id] ?? ""} onChange={(v) => set(f.id, v)} />
            ))}
          </div>
        </fieldset>
      ))}

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Не заполняйте это поле
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <label className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
        <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4" />
        <span>
          Согласен(на) с{" "}
          <Link href="/ru/privacy" className="text-corridor-700 underline">
            политикой конфиденциальности
          </Link>{" "}
          и обработкой ответов для разбора моего случая. С моего согласия Emigro может передать ответы подходящему
          специалисту. Emigro не юридическая фирма.
        </span>
      </label>

      {status === "error" ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-corridor-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-corridor-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Отправляем…" : "Отправить анкету"}
      </button>
    </form>
  );
}

function Field({ f, value, onChange }: { f: ScreeningField; value: string; onChange: (value: string) => void }) {
  const label = (
    <>
      {f.label}
      {f.required ? <span className="text-red-600"> *</span> : <span className="font-normal text-slate-500"> (необязательно)</span>}
    </>
  );
  const wide = f.type === "textarea" ? "sm:col-span-2" : "";
  return (
    <label className={`block text-sm font-medium text-slate-800 ${wide}`}>
      {label}
      {f.type === "select" ? (
        <select required={f.required} value={value} onChange={(e) => onChange(e.target.value)} className={field}>
          <option value="">Выберите</option>
          {f.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : f.type === "textarea" ? (
        <textarea
          required={f.required}
          rows={3}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        />
      ) : (
        <input
          required={f.required}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        />
      )}
    </label>
  );
}

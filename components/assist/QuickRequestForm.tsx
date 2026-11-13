"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";
import type { AssistCountryOption } from "@/components/assist/AssistLeadForm";

type Props = {
  /** Lead source tag stored with the request (e.g. "wizard_hub_results", "emigro_assist"). */
  source: string;
  /** Fixed destination from context (wizard pick). When set, no country picker is shown. */
  countryLabel?: string;
  countrySegment?: string;
  corridorSlug?: string;
  /** Countries for the picker when the destination is not known from context. */
  countries?: AssistCountryOption[];
  initialCountry?: string;
  programRoute?: string;
  sessionId?: string;
  /** Prefilled context that goes into the request message (wizard top pick, match count). */
  contextNote?: string;
  submitLabel?: string;
};

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm focus:border-corridor-500 focus:outline-none focus:ring-2 focus:ring-corridor-200";

/**
 * The one way to reach Emigro from a results page or an Assist CTA: name + contact, the rest
 * comes from context. Owner gets the request in Telegram through /api/v1/assist/leads.
 */
export function QuickRequestForm({
  source,
  countryLabel,
  countrySegment,
  corridorSlug,
  countries,
  initialCountry,
  programRoute,
  sessionId,
  contextNote,
  submitLabel = "Отправить заявку",
}: Props) {
  const pickerOptions = countryLabel ? [] : countries ?? [];
  const initialOption =
    pickerOptions.find((option) => option.value === initialCountry) ?? undefined;
  const [country, setCountry] = useState(initialOption?.value ?? "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    // Arriving from another page with #assist…: re-align once layout settles (content above can shift).
    let timer: number | undefined;
    if (/^#assist/.test(window.location.hash)) {
      timer = window.setTimeout(() => document.getElementById("assist-form")?.scrollIntoView({ block: "start" }), 400);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const selected = pickerOptions.find((option) => option.value === country);
  const [started, setStarted] = useState(false);

  function markStarted() {
    // First interaction with the form: tells a drop-off before typing from one after it.
    if (started) return;
    setStarted(true);
    trackEvent("assist_form_start", { source });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const destination = countryLabel ?? selected?.label ?? "не указано";
    const note = [contextNote, message.trim()].filter(Boolean).join("\n\n");
    try {
      const res = await fetch("/api/v1/assist/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: countrySegment ?? selected?.value ?? "",
          country_label: destination,
          corridor_slug: corridorSlug ?? selected?.corridorSlug ?? undefined,
          destination_iso2: selected?.destinationIso2,
          program_route: programRoute || "",
          plan_tier: "partner-match",
          name,
          contact,
          message: note,
          consent,
          session_id: sessionId || undefined,
          preferred_language: "ru",
          audience: "ru",
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Не удалось отправить заявку");
      trackEvent("assist_lead_submitted", {
        source,
        country: countrySegment ?? selected?.value ?? "",
        plan_tier: "partner-match",
        session_id: sessionId ?? "",
        locale: "ru",
      });
      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Не удалось отправить заявку";
      trackEvent("lead_error", { source, message: msg });
      setError(`${msg}. Напишите нам в Telegram — ответим там.`);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
        <p className="font-semibold">Заявка отправлена.</p>
        <p className="mt-1">Свяжемся с вами: {contact}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} onFocus={markStarted} className="space-y-3">
      {!countryLabel && pickerOptions.length > 0 ? (
        <label className="block text-sm font-medium text-slate-800">
          Страна <span className="font-normal text-slate-500">(если уже знаете)</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={`mt-1 ${field}`}>
            <option value="">Пока не знаю или другое</option>
            {pickerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-800">
          Имя
          <input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`mt-1 ${field}`} />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Email или Telegram
          <input
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="name@mail.com или @username"
            autoComplete="email"
            className={`mt-1 ${field}`}
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-800">
        Коротко о задаче <span className="font-normal text-slate-500">(необязательно)</span>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Например: семья 4 человека, хотим переехать весной"
          className={`mt-1 ${field}`}
        />
      </label>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
        <input required type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4" />
        <span>
          Согласен(на) с{" "}
          <Link href="/ru/privacy" className="text-corridor-700 underline">
            политикой конфиденциальности
          </Link>{" "}
          и передачей запроса подходящему специалисту. Emigro не юридическая фирма.
        </span>
      </label>
      {status === "error" ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-corridor-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-corridor-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Отправляем…" : submitLabel}
      </button>
      <p className="text-sm text-slate-600">
        Удобнее в Telegram?{" "}
        <a href={assistBotDeepLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-corridor-700 underline">
          Напишите @emigro_chat_bot
        </a>
      </p>
    </form>
  );
}

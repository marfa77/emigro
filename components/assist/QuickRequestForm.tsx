"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";
import type { AssistCountryOption } from "@/components/assist/AssistLeadForm";
import { ROUTE_CHECK_PAY_URL } from "@/lib/assist/route-check-payment";

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
  const [routeCheck, setRouteCheck] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    // Paid CTAs link to #assist-form-route-check: keep the single form, just tag the request.
    // Same-page anchor clicks only change the hash, so listen for that too.
    const applyHash = () => {
      if (/route-check/.test(window.location.hash)) setRouteCheck(true);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    // Arriving from another page with #assist…: re-align once layout settles (content above can shift).
    let timer: number | undefined;
    if (/^#assist/.test(window.location.hash)) {
      timer = window.setTimeout(() => document.getElementById("assist-form")?.scrollIntoView({ block: "start" }), 400);
    }
    return () => {
      window.removeEventListener("hashchange", applyHash);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const selected = pickerOptions.find((option) => option.value === country);

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
          plan_tier: routeCheck ? "route-check" : "partner-match",
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
        plan_tier: routeCheck ? "route-check" : "partner-match",
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
        {routeCheck ? (
          <>
            <p className="mt-1">Остался один шаг — оплата Route Check. После оплаты пришлём анкету и согласуем время созвона: {contact}.</p>
            <a
              href={ROUTE_CHECK_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("route_check_pay_click", { source, session_id: sessionId ?? "" })}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-corridor-600 px-5 py-3 text-base font-semibold text-white hover:bg-corridor-700 sm:w-auto"
            >
              Оплатить Route Check — €129
            </a>
          </>
        ) : (
          <p className="mt-1">Свяжемся с вами: {contact}.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {routeCheck ? (
        <p className="rounded-lg bg-corridor-100 px-3 py-2 text-sm text-corridor-900">
          Route Check — €129: созвон и PDF с маршрутом, сроками и рисками. Оставьте контакт — на следующем шаге
          оплата, время созвона согласуем после неё.
        </p>
      ) : null}
      {!countryLabel && pickerOptions.length > 0 ? (
        <label className="block text-sm font-medium text-slate-800">
          Куда переезжаете
          <select required value={country} onChange={(e) => setCountry(e.target.value)} className={`mt-1 ${field}`}>
            <option value="" disabled>
              Выберите страну
            </option>
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
        {status === "loading" ? "Отправляем…" : routeCheck ? "Дальше — к оплате" : submitLabel}
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

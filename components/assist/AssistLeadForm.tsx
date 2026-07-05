"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics/client";

export type AssistCountryOption = {
  label: string;
  value: string;
  corridorSlug: string;
};

export type AssistProviderOption = {
  id: string;
  name: string;
  category: string;
};

export type AssistPlanTier = "route-check" | "full-assist";
export type AssistPaymentMethod = "wise" | "telegram_stars" | "crypto";

const PAYMENT_OPTIONS: { value: AssistPaymentMethod; label: string }[] = [
  { value: "wise", label: "Wise (банковский перевод)" },
  { value: "telegram_stars", label: "Telegram Stars" },
  { value: "crypto", label: "Crypto (USDT / USDC)" },
];

const PAYMENT_LABELS: Record<AssistPaymentMethod, string> = Object.fromEntries(
  PAYMENT_OPTIONS.map(({ value, label }) => [value, label])
) as Record<AssistPaymentMethod, string>;

type Props = {
  countries: AssistCountryOption[];
  providers: AssistProviderOption[];
  defaultPlanTier?: AssistPlanTier;
};

export function AssistLeadForm({ countries, providers, defaultPlanTier = "route-check" }: Props) {
  const [country, setCountry] = useState(countries[0]?.value ?? "");
  const [programRoute, setProgramRoute] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [planTier] = useState<AssistPlanTier>(defaultPlanTier);
  const [paymentMethod, setPaymentMethod] = useState<AssistPaymentMethod>("wise");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [notice, setNotice] = useState("");

  const countryOption = countries.find((option) => option.value === country) ?? countries[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setNotice("");

    try {
      const res = await fetch("/api/v1/assist/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          country_label: countryOption?.label ?? country,
          corridor_slug: countryOption?.corridorSlug,
          program_route: programRoute,
          selected_provider_ids: selectedProviders,
          plan_tier: planTier,
          payment_method: paymentMethod,
          name,
          contact,
          message,
          consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Не удалось отправить заявку");

      trackEvent("assist_lead_submitted", {
        country,
        corridor_slug: countryOption?.corridorSlug,
        providers: selectedProviders.join(","),
        plan_tier: planTier,
        payment_method: paymentMethod,
      });
      setStatus("done");
      setNotice(
        "Заявка отправлена. Emigro согласует время созвона и подберёт партнёра. После этого вышлем реквизиты (€129). Партнёр свяжется с вами — после созвона пришлёт PDF."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка отправки";
      trackEvent("lead_error", { source: "emigro_assist", country, message: msg });
      setStatus("error");
      setNotice(msg);
    }
  }

  if (status === "done") {
    return <p className="rounded-xl bg-green-50 p-5 text-green-800">{notice}</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="plan_tier" value={planTier} />

      <div className="rounded-xl border border-corridor-100 bg-corridor-50/60 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Route Check — €129</p>
        <p className="mt-1 text-slate-600">
          Оставьте заявку и опишите цель — Emigro согласует время созвона и подберёт партнёра. Оплата €129 — после
          согласования слота. Созвон и PDF после встречи — от партнёра.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-payment">
          Предпочитаемый способ оплаты
        </label>
        <select
          id="assist-payment"
          required
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as AssistPaymentMethod)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          {PAYMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-500">
          Реквизиты или ссылку ({PAYMENT_LABELS[paymentMethod]}) вышлем после согласования времени созвона.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-country">
          Страна / коридор
        </label>
        <select
          id="assist-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-route">
          Что вам нужно
        </label>
        <input
          id="assist-route"
          required
          value={programRoute}
          onChange={(e) => setProgramRoute(e.target.value)}
          placeholder="Например: D7, digital nomad, смена статуса в Испании, переезд с семьёй"
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-800">Какие сервисы уже рассматриваете (необязательно)</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {providers.map((provider) => (
            <label key={provider.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={selectedProviders.includes(provider.id)}
                onChange={(e) =>
                  setSelectedProviders((prev) =>
                    e.target.checked ? [...prev, provider.id] : prev.filter((id) => id !== provider.id)
                  )
                }
              />
              <span>
                <span className="font-medium text-slate-900">{provider.name}</span>
                <span className="block text-xs text-slate-500">{provider.category}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="assist-name">
            Имя
          </label>
          <input
            id="assist-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="assist-contact">
            Email или Telegram
          </label>
          <input
            id="assist-contact"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="name@email.com или @username"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-message">
          Расскажите подробнее
        </label>
        <textarea
          id="assist-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Ситуация, доход, семья, сроки — что хотите прояснить."
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>
          Я согласен(на) с{" "}
          <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
            политикой конфиденциальности
          </Link>{" "}
          и понимаю, что Emigro только подбирает партнёра — созвон и PDF делает он.
        </span>
      </label>

      {status === "error" && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{notice}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : "Запросить Route Check — €129"}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics/client";
import { GUMROAD_ROUTE_CHECK_URL } from "@/lib/site-contact";

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
export type AssistPaymentMethod = "gumroad" | "wise" | "telegram_stars" | "crypto";

const PAYMENT_OPTIONS: { value: AssistPaymentMethod; label: string }[] = [
  { value: "gumroad", label: "Gumroad (карта, EUR)" },
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
  const [paymentMethod, setPaymentMethod] = useState<AssistPaymentMethod>("gumroad");
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
        "Заявка отправлена. Emigro подберёт партнёра — он свяжется с вами. После созвона партнёр пришлёт PDF."
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
          Оплатите на Gumroad картой или оставьте заявку — опишите цель, подберём партнёра. Созвон и PDF после
          встречи — от партнёра.
        </p>
        <a
          href={GUMROAD_ROUTE_CHECK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-corridor-600 px-4 py-2.5 font-medium text-white hover:bg-corridor-700 sm:w-auto"
        >
          Оплатить €129 на Gumroad
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
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
        {paymentMethod === "gumroad" ? (
          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-900">
              Оплатите €129 картой на Gumroad — после оплаты напишите, чего хотите, по инструкции на email.
            </p>
            <a
              href={GUMROAD_ROUTE_CHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-corridor-700 hover:text-corridor-900 hover:underline"
            >
              Перейти на Gumroad
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">
            Реквизиты ({PAYMENT_LABELS[paymentMethod]}) вышлем после подтверждения заявки.
          </p>
        )}
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

      <div className="space-y-3 border-t border-slate-100 pt-5">
        <p className="text-center text-sm text-slate-600">
          Уже оплатили на Gumroad? Заполните форму — мы подберём партнёра. Или оплатите сейчас:
        </p>
        <a
          href={GUMROAD_ROUTE_CHECK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-corridor-300 bg-white px-5 py-3 font-medium text-corridor-700 hover:bg-corridor-50"
        >
          Оплатить €129 на Gumroad
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
        >
          {status === "loading" ? "Отправка..." : "Отправить заявку"}
        </button>
      </div>
    </form>
  );
}

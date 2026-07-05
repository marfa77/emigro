"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export type AssistPlanTier = "route-check" | "accompaniment";

export type AssistPaymentMethod = "wise" | "telegram_stars" | "crypto";

const PAYMENT_OPTIONS: { value: AssistPaymentMethod; label: string }[] = [
  { value: "wise", label: "Wise (банковский перевод)" },
  { value: "telegram_stars", label: "Telegram Stars" },
  { value: "crypto", label: "Crypto (USDT / USDC)" },
];

const PAYMENT_LABELS: Record<AssistPaymentMethod, string> = Object.fromEntries(
  PAYMENT_OPTIONS.map(({ value, label }) => [value, label])
) as Record<AssistPaymentMethod, string>;

const PLAN_TIER_OPTIONS: { value: AssistPlanTier; label: string; summary: string }[] = [
  {
    value: "route-check",
    label: "Route Check — €129",
    summary:
      "Первичный разбор ситуации: Emigro подбирает партнёра, созвон на русском, PDF после встречи. Оплата — после согласования слота.",
  },
  {
    value: "accompaniment",
    label: "Сопровождение — €100/час",
    summary:
      "Коммуникационная поддержка: переписка с консульством, юристом или агентством, письма, формы, разбор отказов. Оплата — после согласования формата работы.",
  },
];

const SUCCESS_MESSAGES: Record<AssistPlanTier, string> = {
  "route-check":
    "Заявка отправлена. Emigro подберёт партнёра под ваш коридор и согласует время созвона. После согласования слота вышлем реквизиты (€129). Партнёр проведёт встречу и пришлёт PDF.",
  accompaniment:
    "Заявка отправлена. Emigro свяжется с вами, уточнит задачу и согласует формат работы. Оплата €100/час — после согласования.",
};

const SUBMIT_LABELS: Record<AssistPlanTier, string> = {
  "route-check": "Запросить Route Check — €129",
  accompaniment: "Запросить сопровождение",
};

function tierFromHash(hash: string): AssistPlanTier | null {
  if (hash === "#assist-form-accompaniment" || hash === "#assist-accompaniment") {
    return "accompaniment";
  }
  return null;
}

type Props = {
  countries: AssistCountryOption[];
  providers: AssistProviderOption[];
  defaultPlanTier?: AssistPlanTier;
};

export function AssistLeadForm({ countries, providers, defaultPlanTier = "route-check" }: Props) {
  const [country, setCountry] = useState(countries[0]?.value ?? "");
  const [programRoute, setProgramRoute] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [planTier, setPlanTier] = useState<AssistPlanTier>(defaultPlanTier);
  const [paymentMethod, setPaymentMethod] = useState<AssistPaymentMethod>("wise");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [notice, setNotice] = useState("");

  const countryOption = countries.find((option) => option.value === country) ?? countries[0];
  const selectedTier = PLAN_TIER_OPTIONS.find((option) => option.value === planTier) ?? PLAN_TIER_OPTIONS[0];

  useEffect(() => {
    const applyHash = () => {
      const tier = tierFromHash(window.location.hash);
      if (tier) setPlanTier(tier);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

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
      setNotice(SUCCESS_MESSAGES[planTier]);
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
      <fieldset>
        <legend className="text-sm font-medium text-slate-800">Что вас интересует</legend>
        <div className="mt-3 space-y-2">
          {PLAN_TIER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                planTier === option.value
                  ? "border-corridor-600 bg-corridor-50/60"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="plan_tier"
                value={option.value}
                checked={planTier === option.value}
                onChange={() => setPlanTier(option.value)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-slate-900">{option.label}</span>
                <span className="mt-1 block leading-relaxed text-slate-600">{option.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-xl border border-corridor-100 bg-corridor-50/60 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{selectedTier.label}</p>
        <p className="mt-1 text-slate-600">{selectedTier.summary}</p>
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
          Реквизиты или ссылку ({PAYMENT_LABELS[paymentMethod]}) вышлем после согласования времени или формата работы.
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
          {planTier === "accompaniment" ? "Ваш маршрут и задача" : "Что вам нужно"}
        </label>
        <input
          id="assist-route"
          required
          value={programRoute}
          onChange={(e) => setProgramRoute(e.target.value)}
          placeholder={
            planTier === "accompaniment"
              ? "Например: отказ AIMA, нужно написать в консульство, проверить форму D7"
              : "Например: D7, digital nomad, смена статуса в Испании, переезд с семьёй"
          }
          className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      {planTier === "route-check" && (
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            Какие сервисы уже рассматриваете (необязательно)
          </legend>
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
      )}

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
          placeholder={
            planTier === "accompaniment"
              ? "Что уже сделано, где застряли, какие письма или формы нужны, дедлайны."
              : "Ситуация, доход, семья, сроки — что хотите прояснить."
          }
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
          и понимаю, что Emigro не юридическая фирма: Route Check — навигация и подбор партнёра, сопровождение —
          коммуникационная поддержка. Юридические услуги оказывает партнёр напрямую.
        </span>
      </label>

      {status === "error" && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{notice}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : SUBMIT_LABELS[planTier]}
      </button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { captureAttribution, getSessionId } from "@/lib/analytics/attribution";
import type { InvestmentAsset, InvestmentOutcome } from "@/lib/investment/registry";
import {
  INVESTMENT_ROUTES,
  investmentAssetLabel,
  normalizeInvestmentPassport,
  outcomeLabel,
  qualifyInvestmentRoutes,
} from "@/lib/investment/registry";
import { formField, formFieldWhite } from "@/lib/ui/mobile";

type QualifierAsset = InvestmentAsset;
type QualifierOutcome = InvestmentOutcome;

const assetOptions: QualifierAsset[] = [
  "property",
  "fund",
  "business",
  "bonds",
  "donation",
  "membership",
];

const outcomeOptions: QualifierOutcome[] = ["residence", "permanent_residence", "citizenship_path"];

export function InvestmentQualifier({ id = "qualifier" }: { id?: string }) {
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [notice, setNotice] = useState("");

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent("investment_qualifier_started", { source: "investment_qualifier" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setNotice("");

    const form = new FormData(event.currentTarget);
    const budgetEur = Number(form.get("budget_eur"));
    const asset = form.get("asset") as QualifierAsset;
    const outcome = form.get("outcome") as QualifierOutcome;
    const preferredCountry = String(form.get("preferred_country") ?? "any");
    const passportCitizenship = String(form.get("passport_citizenship") ?? "").trim();
    const passportIso2 = normalizeInvestmentPassport(passportCitizenship);
    const evaluatedRoutes = qualifyInvestmentRoutes({ budgetEur, asset, outcome, passportIso2 });
    const rankedRoutes =
      preferredCountry === "any"
        ? evaluatedRoutes
        : [...evaluatedRoutes].sort((a, b) =>
            a.country === preferredCountry ? -1 : b.country === preferredCountry ? 1 : 0
          );
    const qualifierProfile = {
      schema_version: 1,
      budget_eur: budgetEur,
      passport_citizenship: passportCitizenship,
      asset,
      outcome,
      timeline: String(form.get("timeline") ?? ""),
      family_size: Number(form.get("family_size")),
      funding_readiness: String(form.get("funding_readiness") ?? ""),
      preferred_country: preferredCountry,
    };

    const attr = captureAttribution();

    try {
      const response = await fetch("/api/v1/investment/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") ?? "").trim(),
          contact: String(form.get("contact") ?? "").trim(),
          budget_eur: budgetEur,
          passport_citizenship: passportCitizenship,
          asset,
          outcome,
          preferred_country: preferredCountry,
          timeline: qualifierProfile.timeline,
          family_size: qualifierProfile.family_size,
          funding_readiness: qualifierProfile.funding_readiness,
          property_stage: String(form.get("property_stage") ?? ""),
          source_of_funds: String(form.get("source_of_funds") ?? ""),
          session_id: getSessionId(),
          referrer: attr.referrer,
          utm_source: attr.utm_source,
          utm_medium: attr.utm_medium,
          utm_campaign: attr.utm_campaign,
          utm_content: attr.utm_content,
          consent: form.get("consent") === "on",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; id?: string; token?: string };
      if (!response.ok) throw new Error(data.error || "Не удалось отправить заявку");

      trackEvent("investment_qualifier_completed", {
        source: "investment_qualifier",
        budget_eur: budgetEur,
        asset,
        outcome,
        likely_matches: rankedRoutes.filter((route) => route.match === "likely").length,
      });
      trackEvent("investment_lead_submitted", {
        source: "investment_qualifier",
        lead_id: data.id ?? "",
        top_country: rankedRoutes.find((route) => route.match === "likely" || route.match === "review")?.country ?? "",
      });

      const query = new URLSearchParams({
        budget: String(budgetEur),
        asset,
        outcome,
        country: preferredCountry,
      });
      if (passportIso2) query.set("passport", passportIso2);
      if (data.token) query.set("token", data.token);
      window.location.assign(`/ru/invest/results?${query.toString()}`);
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Не удалось отправить заявку");
    }
  }

  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-corridor-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-corridor-600">Предварительный qualifier</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Сопоставьте капитал, цель и маршрут</h2>
        <p className="mt-3 text-slate-600">
          Результат — ориентир для первичной проверки. Он не подтверждает право на визу, ВНЖ, ПМЖ или гражданство.
        </p>
      </div>

      <form onSubmit={submit} onFocus={markStarted} className="mt-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Инвестиционный бюджет, €
            <input
              name="budget_eur"
              type="number"
              min="10000"
              step="1000"
              required
              inputMode="numeric"
              placeholder="Например, 300000"
              className={`mt-2 ${formField}`}
            />
          </label>
          <label className="text-sm font-medium text-slate-800">
            Паспорт / гражданство
            <input
              name="passport_citizenship"
              required
              list="investment-passports"
              placeholder="Например, Россия"
              className={`mt-2 ${formField}`}
            />
            <datalist id="investment-passports">
              <option value="Россия" />
              <option value="Беларусь" />
              <option value="Украина" />
              <option value="Казахстан" />
              <option value="Армения" />
              <option value="Грузия" />
            </datalist>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Приоритетная страна
            <select name="preferred_country" defaultValue="any" required className={`mt-2 ${formFieldWhite}`}>
              <option value="any">Сначала сравнить все</option>
              {INVESTMENT_ROUTES.map((route) => (
                <option key={route.country} value={route.country}>
                  {route.flag} {route.countryRu}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Предпочтительный актив
            <select name="asset" defaultValue="property" required className={`mt-2 ${formFieldWhite}`}>
              {assetOptions.map((asset) => (
                <option key={asset} value={asset}>
                  {investmentAssetLabel(asset)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Желаемый результат
            <select name="outcome" defaultValue="residence" required className={`mt-2 ${formFieldWhite}`}>
              {outcomeOptions.map((outcome) => (
                <option key={outcome} value={outcome}>
                  {outcomeLabel(outcome)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Горизонт решения
            <select name="timeline" defaultValue="" required className={`mt-2 ${formFieldWhite}`}>
              <option value="" disabled>Выберите срок</option>
              <option value="0_3_months">0–3 месяца</option>
              <option value="3_6_months">3–6 месяцев</option>
              <option value="6_12_months">6–12 месяцев</option>
              <option value="12_plus_months">Более года</option>
              <option value="researching">Пока изучаю рынок</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Человек в семье
            <input
              name="family_size"
              type="number"
              min="1"
              max="20"
              defaultValue="1"
              required
              className={`mt-2 ${formField}`}
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">Готовность средств</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              ["ready", "Средства доступны"],
              ["partial", "Часть средств доступна"],
              ["planning", "Нужна подготовка"],
            ].map(([value, label]) => (
              <label key={value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-corridor-300">
                <input type="radio" name="funding_readiness" value={value} required />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Стадия недвижимости
            <select name="property_stage" defaultValue="researching" className={`mt-2 ${formFieldWhite}`}>
              <option value="researching">Пока изучаю рынок</option>
              <option value="selected">Объект выбран</option>
              <option value="reserved">Есть бронь</option>
              <option value="owned">Объект уже куплен</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Происхождение капитала
            <select name="source_of_funds" defaultValue="savings" required className={`mt-2 ${formFieldWhite}`}>
              <option value="salary">Доход от работы</option>
              <option value="business">Бизнес</option>
              <option value="asset_sale">Продажа актива</option>
              <option value="savings">Накопления</option>
              <option value="other">Другое, нужна проверка</option>
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Имя
            <input name="name" required autoComplete="name" className={`mt-2 ${formField}`} />
          </label>
          <label className="text-sm font-medium text-slate-800">
            Email или Telegram
            <input
              name="contact"
              required
              autoComplete="email"
              placeholder="name@email.com или @username"
              className={`mt-2 ${formField}`}
            />
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <input name="consent" type="checkbox" required className="mt-1" />
          <span>
            Я принимаю{" "}
            <Link href="/ru/privacy" className="font-medium text-corridor-700 underline">
              политику конфиденциальности
            </Link>
            , разрешаю Emigro связаться со мной и передать структурированный запрос подходящему профильному
            партнёру. Я понимаю, что подбор предварительный и не является юридической гарантией.
          </span>
        </label>

        {status === "error" ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{notice}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-corridor-700 px-6 py-3 font-semibold text-white transition hover:bg-corridor-800 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          {status === "loading" ? "Отправляем профиль…" : "Получить предварительный рейтинг"}
          {status !== "loading" ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>
    </section>
  );
}

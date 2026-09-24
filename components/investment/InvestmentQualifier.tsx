"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { captureAttribution, getSessionId } from "@/lib/analytics/attribution";
import type { InvestmentAsset, InvestmentOutcome } from "@/lib/investment/registry";
import {
  uniqueInvestmentCountries,
  investmentAssetLabel,
  normalizeInvestmentPassport,
  outcomeLabel,
  qualifyInvestmentRoutes,
} from "@/lib/investment/registry";
import { dubaiOfferVerdictUrl } from "@/lib/investment/uae-offer-verdict";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
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

export function InvestmentQualifier({
  id = "qualifier",
  defaultPreferredCountry = "any",
}: {
  id?: string;
  defaultPreferredCountry?: string;
}) {
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [asset, setAsset] = useState<QualifierAsset>("property");
  const [preferredCountry, setPreferredCountry] = useState(defaultPreferredCountry);
  const [offerReceived, setOfferReceived] = useState("no");
  const isUae = preferredCountry === "uae";

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
    const preferred = String(form.get("preferred_country") ?? "any");
    const passportCitizenship = String(form.get("passport_citizenship") ?? "").trim();
    const passportIso2 = normalizeInvestmentPassport(passportCitizenship);
    const evaluatedRoutes = qualifyInvestmentRoutes({ budgetEur, asset, outcome, passportIso2 });
    const rankedRoutes =
      preferred === "any"
        ? evaluatedRoutes
        : [...evaluatedRoutes].sort((a, b) =>
            a.country === preferred ? -1 : b.country === preferred ? 1 : 0
          );

    const attr = captureAttribution();
    const payload: Record<string, unknown> = {
      name: String(form.get("name") ?? "").trim(),
      contact: String(form.get("contact") ?? "").trim(),
      budget_eur: budgetEur,
      passport_citizenship: passportCitizenship,
      asset,
      outcome,
      preferred_country: preferred,
      timeline: String(form.get("timeline") ?? ""),
      family_size: Number(form.get("family_size")),
      funding_readiness: String(form.get("funding_readiness") ?? ""),
      property_stage: asset === "property" ? String(form.get("property_stage") ?? "") : "",
      source_of_funds: String(form.get("source_of_funds") ?? ""),
      capital_goal: String(form.get("capital_goal") ?? ""),
      lockup_tolerance: String(form.get("lockup_tolerance") ?? ""),
      donation_tolerance: String(form.get("donation_tolerance") ?? ""),
      sof_complexity: String(form.get("sof_complexity") ?? ""),
      tax_residence: String(form.get("tax_residence") ?? ""),
      session_id: getSessionId(),
      referrer: attr.referrer,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      consent: form.get("consent") === "on",
    };

    if (preferred === "uae") {
      payload.uae_property_type = String(form.get("uae_property_type") ?? "");
      payload.uae_goal = String(form.get("uae_goal") ?? "");
      payload.uae_budget_band = String(form.get("uae_budget_band") ?? "");
      payload.uae_financing = String(form.get("uae_financing") ?? "");
      payload.uae_offer_received = String(form.get("uae_offer_received") ?? "");
    }

    try {
      const response = await fetch("/api/v1/investment/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        country: preferred,
      });
      if (passportIso2) query.set("passport", passportIso2);
      if (data.token) query.set("token", data.token);
      if (preferred === "uae" && form.get("uae_offer_received") === "yes") {
        query.set("offer", "1");
      }
      window.location.assign(`/ru/invest/results?${query.toString()}`);
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Не удалось отправить заявку");
    }
  }

  const offerCheckHref = dubaiOfferVerdictUrl({
    medium: "investment_qualifier",
    campaign: "uae_property_lead",
    content: "qualifier_offer_yes",
  });

  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-corridor-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-corridor-600">
          {isUae ? "Дубай · qualifier" : "Investment qualifier"}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
          {isUae ? "Бюджет, срок и цель — чтобы связать с брокером" : "Проверьте инвестиционный профиль"}
        </h2>
        <p className="mt-3 text-slate-600">
          {isUae
            ? "Укажите бюджет, цель статуса и стадию. После отправки Emigro свяжется и передаст профиль брокеру вручную. Это не каталог объектов и не обещание визы."
            : "Результат — предварительный shortlist для проверки: matching, не рейтинг «лучших» программ и не подтверждение eligibility."}
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
              placeholder={isUae ? "Например, 545000 (~AED 2M)" : "Например, 300000"}
              className={`mt-2 ${formField}`}
            />
            {isUae ? (
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Golden через RE — от AED 2M (~€545k). Ниже — чаще Taskeen 2y или покупка без визовой цели.
              </span>
            ) : null}
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
            <select
              name="preferred_country"
              value={preferredCountry}
              onChange={(event) => setPreferredCountry(event.target.value)}
              required
              className={`mt-2 ${formFieldWhite}`}
            >
              <option value="any">Сначала сравнить все</option>
              {uniqueInvestmentCountries().map((route) => (
                <option key={route.country} value={route.country}>
                  {route.flag} {route.countryRu}
                  {route.status === "closed" ? " — закрыта" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Предпочтительный актив
            <select
              name="asset"
              value={asset}
              onChange={(event) => setAsset(event.target.value as QualifierAsset)}
              required
              className={`mt-2 ${formFieldWhite}`}
            >
              {assetOptions.map((option) => (
                <option key={option} value={option}>
                  {investmentAssetLabel(option)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Желаемый статус
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
              <option value="" disabled>
                Выберите срок
              </option>
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
          <label className="text-sm font-medium text-slate-800">
            Что нужно от капитала
            <select name="capital_goal" defaultValue="status" required className={`mt-2 ${formFieldWhite}`}>
              <option value="preserve">Сохранить капитал</option>
              <option value="income">Получать доход</option>
              <option value="status">Получить статус</option>
              <option value="mix">Сочетание</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Допустимая блокировка капитала
            <select name="lockup_tolerance" defaultValue="1_3y" required className={`mt-2 ${formFieldWhite}`}>
              <option value="0_1y">До 1 года</option>
              <option value="1_3y">1–3 года</option>
              <option value="3_5y">3–5 лет</option>
              <option value="5_plus">5+ лет</option>
              <option value="none">Не хочу блокировать</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Donation / невозвратный взнос
            <select name="donation_tolerance" defaultValue="unsure" required className={`mt-2 ${formFieldWhite}`}>
              <option value="no">Не подходит</option>
              <option value="yes">Допускаю</option>
              <option value="unsure">Пока не знаю</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            Налоговое резидентство сейчас
            <select name="tax_residence" defaultValue="RU" required className={`mt-2 ${formFieldWhite}`}>
              <option value="RU">РФ</option>
              <option value="UAE">ОАЭ</option>
              <option value="EU">ЕС / ЕЭЗ</option>
              <option value="other">Другое</option>
              <option value="unsure">Не уверен(а)</option>
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">
              Passport ≠ tax residence. Нужно для KYC и CRS-контекста, не для «выбора страны мечты».
            </span>
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
              <label
                key={value}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm hover:border-corridor-300"
              >
                <input type="radio" name="funding_readiness" value={value} required />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {isUae ? (
          <div className="grid gap-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-sm font-semibold text-amber-950">Ветка ОАЭ / Дубай</p>
            <label className="text-sm font-medium text-slate-800">
              Тип объекта
              <select name="uae_property_type" defaultValue="unsure" required className={`mt-2 ${formFieldWhite}`}>
                <option value="ready">Ready (title deed)</option>
                <option value="off_plan">Off-plan</option>
                <option value="unsure">Не знаю</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              Цель в ОАЭ
              <select name="uae_goal" defaultValue="golden" required className={`mt-2 ${formFieldWhite}`}>
                <option value="golden">Golden Residence</option>
                <option value="property_2y">2-летняя property residence</option>
                <option value="invest_only">Инвестиция без статуса</option>
                <option value="living">Жить в ОАЭ</option>
                <option value="mix">Комбинация</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              Бюджет, ориентир AED
              <select name="uae_budget_band" defaultValue="2m_plus" required className={`mt-2 ${formFieldWhite}`}>
                <option value="under_1m">&lt; AED 1M</option>
                <option value="1_2m">AED 1–2M</option>
                <option value="2m_plus">AED 2M+</option>
                <option value="5m_plus">AED 5M+</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              Финансирование
              <select name="uae_financing" defaultValue="cash" required className={`mt-2 ${formFieldWhite}`}>
                <option value="cash">Cash</option>
                <option value="mortgage">Mortgage</option>
                <option value="mixed">Mixed</option>
                <option value="unsure">Пока не определено</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800 sm:col-span-2">
              Уже есть ask / оффер брокера?
              <select
                name="uae_offer_received"
                value={offerReceived}
                onChange={(event) => setOfferReceived(event.target.value)}
                required
                className={`mt-2 ${formFieldWhite}`}
              >
                <option value="no">Нет</option>
                <option value="yes">Да</option>
              </select>
            </label>
            {offerReceived === "yes" ? (
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">Сначала сверка ask с DLD — до перевода денег.</p>
                <a
                  href={offerCheckHref}
                  target="_blank"
                  rel={PARTNER_LINK_REL}
                  onClick={() =>
                    trackEvent("provider_click", {
                      provider_id: "dubai-offer-verdict",
                      placement: "investment_qualifier",
                      topic_key: "uae",
                      product: "dld_offer_check",
                    })
                  }
                  className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-corridor-700"
                >
                  Проверить оффер на uaeproperty.vip <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        {asset === "property" ? (
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
                <option value="salary">Зарплата / накопления от работы</option>
                <option value="business">Бизнес / дивиденды</option>
                <option value="asset_sale">Продажа недвижимости / актива</option>
                <option value="investments">Инвестиционный портфель</option>
                <option value="inheritance">Наследство</option>
                <option value="mixed">Смешанный источник</option>
                <option value="other">Другое / нужна проверка</option>
              </select>
            </label>
          </div>
        ) : (
          <label className="block text-sm font-medium text-slate-800">
            Происхождение капитала
            <select name="source_of_funds" defaultValue="savings" required className={`mt-2 ${formFieldWhite}`}>
              <option value="salary">Зарплата / накопления от работы</option>
              <option value="business">Бизнес / дивиденды</option>
              <option value="asset_sale">Продажа недвижимости / актива</option>
              <option value="investments">Инвестиционный портфель</option>
              <option value="inheritance">Наследство</option>
              <option value="mixed">Смешанный источник</option>
              <option value="other">Другое / нужна проверка</option>
            </select>
          </label>
        )}

        <label className="block text-sm font-medium text-slate-800">
          Насколько сложен source of funds
          <select name="sof_complexity" defaultValue="standard" required className={`mt-2 ${formFieldWhite}`}>
            <option value="simple">Простой (зарплата / накопления, понятные выписки)</option>
            <option value="standard">Стандартный (бизнес / продажа актива)</option>
            <option value="complex">Сложный / смешанный — нужен review</option>
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-500">
            Зачем спрашиваем: банки и часть программ требуют документально подтвердить происхождение капитала до
            перевода средств.
          </span>
        </label>

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
            , разрешаю Emigro сохранить профиль капитала, SoF и (если указано) стадию недвижимости / UAE-поля
            (согласие investment-v3), связаться со мной и передать структурированный запрос партнёру только отдельным
            ручным решением. Контакт не уходит партнёру автоматически. Matching предварительный и не является
            юридической или инвестиционной гарантией.
          </span>
        </label>

        {status === "error" ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          onClick={() => trackEvent("investment_cta_click", { source: "investment_qualifier", placement: "submit" })}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-corridor-700 px-6 py-3 font-semibold text-white transition hover:bg-corridor-800 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          {status === "loading"
            ? "Отправляем профиль…"
            : isUae
              ? "Отправить — свяжемся и передадим брокеру"
              : "Получить shortlist маршрутов"}
          {status !== "loading" ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>
    </section>
  );
}

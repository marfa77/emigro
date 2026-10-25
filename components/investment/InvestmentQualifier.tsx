"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { goldenVisaRow, type InvestLocale } from "@/lib/investment/golden-visa-2026";
import {
  INVEST_PREFILL_EVENT,
  INVEST_PREFILL_KEY,
  type InvestPrefill,
} from "@/lib/investment/quick-lead";
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

const EN_ASSET: Record<QualifierAsset, string> = {
  property: "Real estate",
  fund: "Fund",
  business: "Business / startup",
  bonds: "Government bonds",
  donation: "Donation",
  membership: "Long-stay membership",
};

const EN_OUTCOME: Record<QualifierOutcome, string> = {
  residence: "Residence permit / long-term status",
  permanent_residence: "Permanent residence",
  citizenship_path: "Residence with a passport horizon",
};

const SOF_OPTIONS = {
  ru: [
    ["salary", "Зарплата / накопления от работы"],
    ["business", "Бизнес / дивиденды"],
    ["asset_sale", "Продажа недвижимости / актива"],
    ["investments", "Инвестиционный портфель"],
    ["inheritance", "Наследство"],
    ["mixed", "Смешанный источник"],
    ["other", "Другое / нужна проверка"],
  ],
  en: [
    ["salary", "Salary / savings from work"],
    ["business", "Business / dividends"],
    ["asset_sale", "Sale of property / an asset"],
    ["investments", "Investment portfolio"],
    ["inheritance", "Inheritance"],
    ["mixed", "Mixed source"],
    ["other", "Other / needs review"],
  ],
} as const;

const T = {
  ru: {
    eyebrowUae: "Дубай · qualifier",
    eyebrow: "Investment qualifier",
    titleUae: "Бюджет, срок и цель — чтобы связать с брокером",
    title: "Проверьте инвестиционный профиль",
    leadUae:
      "Укажите бюджет, цель статуса и стадию. После отправки Emigro свяжется и передаст профиль брокеру вручную. Это не каталог объектов и не обещание визы.",
    lead: "Результат — предварительный shortlist для проверки: matching, не рейтинг «лучших» программ и не подтверждение eligibility.",
    prefilled: "Данные из быстрой заявки уже подставлены — допишите остальное, профиль сохранится к той же заявке.",
    budget: "Инвестиционный бюджет, €",
    budgetPlaceholderUae: "Например, 545000 (~AED 2M)",
    budgetPlaceholder: "Например, 300000",
    budgetHintUae: "Golden через RE — от AED 2M (~€545k). Ниже — чаще Taskeen 2y или покупка без визовой цели.",
    passport: "Паспорт / гражданство",
    passportPlaceholder: "Например, Россия",
    passportList: ["Россия", "Беларусь", "Украина", "Казахстан", "Армения", "Грузия"],
    country: "Приоритетная страна",
    countryAny: "Сначала сравнить все",
    closed: " — закрыта",
    asset: "Предпочтительный актив",
    outcome: "Желаемый статус",
    timeline: "Горизонт решения",
    timelinePlaceholder: "Выберите срок",
    timelines: [
      ["0_3_months", "0–3 месяца"],
      ["3_6_months", "3–6 месяцев"],
      ["6_12_months", "6–12 месяцев"],
      ["12_plus_months", "Более года"],
      ["researching", "Пока изучаю рынок"],
    ],
    family: "Человек в семье",
    capitalGoal: "Что нужно от капитала",
    capitalGoals: [
      ["preserve", "Сохранить капитал"],
      ["income", "Получать доход"],
      ["status", "Получить статус"],
      ["mix", "Сочетание"],
    ],
    lockup: "Допустимая блокировка капитала",
    lockups: [
      ["0_1y", "До 1 года"],
      ["1_3y", "1–3 года"],
      ["3_5y", "3–5 лет"],
      ["5_plus", "5+ лет"],
      ["none", "Не хочу блокировать"],
    ],
    donation: "Donation / невозвратный взнос",
    donations: [
      ["no", "Не подходит"],
      ["yes", "Допускаю"],
      ["unsure", "Пока не знаю"],
    ],
    tax: "Налоговое резидентство сейчас",
    taxes: [
      ["RU", "РФ"],
      ["UAE", "ОАЭ"],
      ["EU", "ЕС / ЕЭЗ"],
      ["other", "Другое"],
      ["unsure", "Не уверен(а)"],
    ],
    taxHint: "Passport ≠ tax residence. Нужно для KYC и CRS-контекста, не для «выбора страны мечты».",
    funding: "Готовность средств",
    fundings: [
      ["ready", "Средства доступны"],
      ["partial", "Часть средств доступна"],
      ["planning", "Нужна подготовка"],
    ],
    uaeBranch: "Ветка ОАЭ / Дубай",
    uaeType: "Тип объекта",
    uaeTypeUnsure: "Не знаю",
    uaeGoal: "Цель в ОАЭ",
    uaeGoals: [
      ["golden", "Golden Residence"],
      ["property_2y", "2-летняя property residence"],
      ["invest_only", "Инвестиция без статуса"],
      ["living", "Жить в ОАЭ"],
      ["mix", "Комбинация"],
    ],
    uaeBudget: "Бюджет, ориентир AED",
    uaeFinancing: "Финансирование",
    uaeFinancingUnsure: "Пока не определено",
    uaeOffer: "Уже есть ask / оффер брокера?",
    no: "Нет",
    yes: "Да",
    uaeOfferFirst: "Сначала сверка ask с DLD — до перевода денег.",
    uaeOfferLink: "Проверить оффер на uaeproperty.vip",
    propertyStage: "Стадия недвижимости",
    propertyStages: [
      ["researching", "Пока изучаю рынок"],
      ["selected", "Объект выбран"],
      ["reserved", "Есть бронь"],
      ["owned", "Объект уже куплен"],
    ],
    sof: "Происхождение капитала",
    sofComplexity: "Насколько сложен source of funds",
    sofComplexities: [
      ["simple", "Простой (зарплата / накопления, понятные выписки)"],
      ["standard", "Стандартный (бизнес / продажа актива)"],
      ["complex", "Сложный / смешанный — нужен review"],
    ],
    sofHint:
      "Зачем спрашиваем: банки и часть программ требуют документально подтвердить происхождение капитала до перевода средств.",
    name: "Имя",
    contact: "Email или Telegram",
    contactPlaceholder: "name@email.com или @username",
    consentA: "Я принимаю ",
    consentLink: "политику конфиденциальности",
    consentB:
      ", разрешаю Emigro сохранить профиль капитала, SoF и (если указано) стадию недвижимости / UAE-поля (согласие investment-v3), связаться со мной и передать структурированный запрос партнёру только отдельным ручным решением. Контакт не уходит партнёру автоматически. Matching предварительный и не является юридической или инвестиционной гарантией.",
    sending: "Отправляем профиль…",
    submitUae: "Отправить — свяжемся и передадим брокеру",
    submit: "Получить shortlist маршрутов",
    error: "Не удалось отправить заявку",
    doneTitle: "Профиль сохранён ✅",
    doneText: "Пришлём разбор маршрутов в течение 1 рабочего дня.",
  },
  en: {
    eyebrowUae: "Dubai · qualifier",
    eyebrow: "Investment qualifier · step 2",
    titleUae: "Budget, timeline and goal — so we can connect you with a broker",
    title: "Complete your investment profile",
    leadUae:
      "Share your budget, status goal and stage. Emigro will reach out and pass the profile to a broker manually. This is not a property catalogue and not a visa promise.",
    lead: "The result is a preliminary shortlist to review: matching, not a ranking of the “best” programmes and not an eligibility confirmation.",
    prefilled: "Your quick-request answers are prefilled — finish the rest and the profile is saved to the same request.",
    budget: "Investment budget, €",
    budgetPlaceholderUae: "e.g. 545000 (~AED 2M)",
    budgetPlaceholder: "e.g. 300000",
    budgetHintUae: "Golden via real estate starts at AED 2M (~€545K). Below that it is usually the 2-year property visa or a purchase without a visa goal.",
    passport: "Passport / citizenship",
    passportPlaceholder: "e.g. Russia",
    passportList: ["Russia", "Belarus", "Ukraine", "Kazakhstan", "Armenia", "Georgia"],
    country: "Preferred country",
    countryAny: "Compare all first",
    closed: " — closed",
    asset: "Preferred asset",
    outcome: "Target status",
    timeline: "Decision horizon",
    timelinePlaceholder: "Choose a timeline",
    timelines: [
      ["0_3_months", "0–3 months"],
      ["3_6_months", "3–6 months"],
      ["6_12_months", "6–12 months"],
      ["12_plus_months", "More than a year"],
      ["researching", "Still researching"],
    ],
    family: "Family members",
    capitalGoal: "What the capital should do",
    capitalGoals: [
      ["preserve", "Preserve capital"],
      ["income", "Generate income"],
      ["status", "Obtain status"],
      ["mix", "A mix"],
    ],
    lockup: "Acceptable capital lock-up",
    lockups: [
      ["0_1y", "Up to 1 year"],
      ["1_3y", "1–3 years"],
      ["3_5y", "3–5 years"],
      ["5_plus", "5+ years"],
      ["none", "No lock-up"],
    ],
    donation: "Donation / non-refundable contribution",
    donations: [
      ["no", "Not acceptable"],
      ["yes", "Acceptable"],
      ["unsure", "Not sure yet"],
    ],
    tax: "Current tax residence",
    taxes: [
      ["RU", "Russia"],
      ["UAE", "UAE"],
      ["EU", "EU / EEA"],
      ["other", "Other"],
      ["unsure", "Not sure"],
    ],
    taxHint: "Passport ≠ tax residence. Needed for KYC and CRS context.",
    funding: "Funds readiness",
    fundings: [
      ["ready", "Funds available"],
      ["partial", "Part of the funds available"],
      ["planning", "Needs preparation"],
    ],
    uaeBranch: "UAE / Dubai branch",
    uaeType: "Property type",
    uaeTypeUnsure: "Not sure",
    uaeGoal: "Goal in the UAE",
    uaeGoals: [
      ["golden", "Golden Residence"],
      ["property_2y", "2-year property residence"],
      ["invest_only", "Investment without status"],
      ["living", "Live in the UAE"],
      ["mix", "Combination"],
    ],
    uaeBudget: "Budget, AED guide",
    uaeFinancing: "Financing",
    uaeFinancingUnsure: "Not decided yet",
    uaeOffer: "Already have a broker ask / offer?",
    no: "No",
    yes: "Yes",
    uaeOfferFirst: "Check the ask against DLD first — before transferring money.",
    uaeOfferLink: "Check the offer on uaeproperty.vip",
    propertyStage: "Property stage",
    propertyStages: [
      ["researching", "Still researching"],
      ["selected", "Property selected"],
      ["reserved", "Reservation made"],
      ["owned", "Already purchased"],
    ],
    sof: "Source of funds",
    sofComplexity: "How complex is your source of funds",
    sofComplexities: [
      ["simple", "Simple (salary / savings, clear statements)"],
      ["standard", "Standard (business / asset sale)"],
      ["complex", "Complex / mixed — needs review"],
    ],
    sofHint: "Why we ask: banks and several programmes require documented source of funds before the transfer.",
    name: "Name",
    contact: "Email or Telegram",
    contactPlaceholder: "name@email.com or @username",
    consentA: "I accept the ",
    consentLink: "privacy policy",
    consentB:
      " and allow Emigro to store my capital profile, source of funds and (if given) property stage / UAE fields (consent investment-v3), contact me, and pass a structured request to a partner only by a separate manual decision. My contact is never sent to partners automatically. Matching is preliminary and is not a legal or investment guarantee.",
    sending: "Sending profile…",
    submitUae: "Send — we'll reach out and brief a broker",
    submit: "Save my full profile",
    error: "Couldn't send the profile",
    doneTitle: "Profile saved ✅",
    doneText: "We'll send your route analysis within 1 business day via Telegram or email.",
  },
} as const;

function readStoredPrefill(): InvestPrefill | null {
  try {
    const raw = window.sessionStorage.getItem(INVEST_PREFILL_KEY);
    return raw ? (JSON.parse(raw) as InvestPrefill) : null;
  } catch {
    return null;
  }
}

export function InvestmentQualifier({
  id = "qualifier",
  defaultPreferredCountry = "any",
  locale = "ru",
}: {
  id?: string;
  defaultPreferredCountry?: string;
  locale?: InvestLocale;
}) {
  const t = T[locale];
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [notice, setNotice] = useState("");
  const [asset, setAsset] = useState<QualifierAsset>("property");
  const [preferredCountry, setPreferredCountry] = useState(defaultPreferredCountry);
  const [offerReceived, setOfferReceived] = useState("no");
  const [prefill, setPrefill] = useState<InvestPrefill | null>(null);
  const [formKey, setFormKey] = useState(0);
  const isUae = preferredCountry === "uae";

  useEffect(() => {
    function apply(next: InvestPrefill | null) {
      if (!next?.leadId) return;
      setPrefill(next);
      if (next.preferredCountry && next.preferredCountry !== "any") setPreferredCountry(next.preferredCountry);
      setFormKey((key) => key + 1);
    }
    apply(readStoredPrefill());
    const onPrefill = (event: Event) => apply((event as CustomEvent<InvestPrefill>).detail);
    window.addEventListener(INVEST_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(INVEST_PREFILL_EVENT, onPrefill);
  }, []);

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackEvent("investment_qualifier_started", { source: "investment_qualifier" });
  }

  function countryLabel(route: { country: string; countryRu: string }) {
    if (locale === "ru") return route.countryRu;
    return goldenVisaRow(route.country)?.country.en ?? route.country.charAt(0).toUpperCase() + route.country.slice(1);
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
      locale,
      page_url: window.location.href.slice(0, 500),
      website: String(form.get("website") ?? ""),
    };
    const linkedLeadId = prefill?.leadId && prefill.token ? prefill.leadId : null;
    if (linkedLeadId && prefill?.token) {
      payload.lead_id = linkedLeadId;
      payload.lead_token = prefill.token;
    }

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
      if (!response.ok) throw new Error(data.error || t.error);

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
      if (linkedLeadId) trackEvent("invest_profile_step2_submit", { country: preferred, locale });
      if (prefill) {
        try {
          window.sessionStorage.removeItem(INVEST_PREFILL_KEY);
        } catch {
          /* storage optional */
        }
      }

      if (locale === "en") {
        setStatus("done");
        return;
      }

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
      setNotice(error instanceof Error ? error.message : t.error);
    }
  }

  const offerCheckHref = dubaiOfferVerdictUrl({
    medium: "investment_qualifier",
    campaign: "uae_property_lead",
    content: "qualifier_offer_yes",
  });

  const sofSelect = (
    <select name="source_of_funds" defaultValue="savings" required className={`mt-2 ${formFieldWhite}`}>
      {SOF_OPTIONS[locale].map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  if (status === "done") {
    return (
      <section id={id} className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-corridor-500" />
        <div role="status" aria-live="polite">
          <h2 className="text-2xl font-bold text-slate-950">{t.doneTitle}</h2>
          <p className="mt-3 text-slate-600">{t.doneText}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={locale === "en" ? "/en/invest/compare" : "/ru/invest/compare"}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800"
          >
            {locale === "en" ? "Compare programmes" : "Сравнить программы"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={locale === "en" ? "/en/invest" : "/ru/invest"}
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            {locale === "en" ? "Back to investment routes" : "К инвестиционным маршрутам"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-corridor-900/5 sm:p-8">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-corridor-500" />
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-corridor-600">
          <span className="h-px w-6 bg-gradient-to-r from-amber-400 to-transparent" />
          {isUae ? t.eyebrowUae : t.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">{isUae ? t.titleUae : t.title}</h2>
        <p className="mt-3 text-slate-600">{isUae ? t.leadUae : t.lead}</p>
        {prefill ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {t.prefilled}
          </p>
        ) : null}
      </div>

      <form key={formKey} onSubmit={submit} onFocus={markStarted} className="mt-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            {t.budget}
            <input
              name="budget_eur"
              type="number"
              min="10000"
              step="1000"
              required
              inputMode="numeric"
              defaultValue={prefill?.budgetEur ?? undefined}
              placeholder={isUae ? t.budgetPlaceholderUae : t.budgetPlaceholder}
              className={`mt-2 ${formField}`}
            />
            {isUae ? (
              <span className="mt-1 block text-xs font-normal text-slate-500">{t.budgetHintUae}</span>
            ) : null}
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.passport}
            <input
              name="passport_citizenship"
              required
              list={`investment-passports-${locale}`}
              defaultValue={prefill?.passport ?? undefined}
              placeholder={t.passportPlaceholder}
              className={`mt-2 ${formField}`}
            />
            <datalist id={`investment-passports-${locale}`}>
              {t.passportList.map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.country}
            <select
              name="preferred_country"
              value={preferredCountry}
              onChange={(event) => setPreferredCountry(event.target.value)}
              required
              className={`mt-2 ${formFieldWhite}`}
            >
              <option value="any">{t.countryAny}</option>
              {uniqueInvestmentCountries().map((route) => (
                <option key={route.country} value={route.country}>
                  {route.flag} {countryLabel(route)}
                  {route.status === "closed" ? t.closed : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.asset}
            <select
              name="asset"
              value={asset}
              onChange={(event) => setAsset(event.target.value as QualifierAsset)}
              required
              className={`mt-2 ${formFieldWhite}`}
            >
              {assetOptions.map((option) => (
                <option key={option} value={option}>
                  {locale === "ru" ? investmentAssetLabel(option) : EN_ASSET[option]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.outcome}
            <select
              name="outcome"
              defaultValue={prefill?.outcome ?? "residence"}
              required
              className={`mt-2 ${formFieldWhite}`}
            >
              {outcomeOptions.map((outcome) => (
                <option key={outcome} value={outcome}>
                  {locale === "ru" ? outcomeLabel(outcome) : EN_OUTCOME[outcome]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.timeline}
            <select name="timeline" defaultValue="" required className={`mt-2 ${formFieldWhite}`}>
              <option value="" disabled>
                {t.timelinePlaceholder}
              </option>
              {t.timelines.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.family}
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
            {t.capitalGoal}
            <select name="capital_goal" defaultValue="status" required className={`mt-2 ${formFieldWhite}`}>
              {t.capitalGoals.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.lockup}
            <select name="lockup_tolerance" defaultValue="1_3y" required className={`mt-2 ${formFieldWhite}`}>
              {t.lockups.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.donation}
            <select name="donation_tolerance" defaultValue="unsure" required className={`mt-2 ${formFieldWhite}`}>
              {t.donations.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.tax}
            <select name="tax_residence" defaultValue="RU" required className={`mt-2 ${formFieldWhite}`}>
              {t.taxes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">{t.taxHint}</span>
          </label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">{t.funding}</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {t.fundings.map(([value, label]) => (
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
            <p className="sm:col-span-2 text-sm font-semibold text-amber-950">{t.uaeBranch}</p>
            <label className="text-sm font-medium text-slate-800">
              {t.uaeType}
              <select name="uae_property_type" defaultValue="unsure" required className={`mt-2 ${formFieldWhite}`}>
                <option value="ready">Ready (title deed)</option>
                <option value="off_plan">Off-plan</option>
                <option value="unsure">{t.uaeTypeUnsure}</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              {t.uaeGoal}
              <select name="uae_goal" defaultValue="golden" required className={`mt-2 ${formFieldWhite}`}>
                {t.uaeGoals.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              {t.uaeBudget}
              <select name="uae_budget_band" defaultValue="2m_plus" required className={`mt-2 ${formFieldWhite}`}>
                <option value="under_1m">&lt; AED 1M</option>
                <option value="1_2m">AED 1–2M</option>
                <option value="2m_plus">AED 2M+</option>
                <option value="5m_plus">AED 5M+</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              {t.uaeFinancing}
              <select name="uae_financing" defaultValue="cash" required className={`mt-2 ${formFieldWhite}`}>
                <option value="cash">Cash</option>
                <option value="mortgage">Mortgage</option>
                <option value="mixed">Mixed</option>
                <option value="unsure">{t.uaeFinancingUnsure}</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800 sm:col-span-2">
              {t.uaeOffer}
              <select
                name="uae_offer_received"
                value={offerReceived}
                onChange={(event) => setOfferReceived(event.target.value)}
                required
                className={`mt-2 ${formFieldWhite}`}
              >
                <option value="no">{t.no}</option>
                <option value="yes">{t.yes}</option>
              </select>
            </label>
            {offerReceived === "yes" ? (
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-900">{t.uaeOfferFirst}</p>
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
                  {t.uaeOfferLink} <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>
        ) : null}

        {asset === "property" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-800">
              {t.propertyStage}
              <select name="property_stage" defaultValue="researching" className={`mt-2 ${formFieldWhite}`}>
                {t.propertyStages.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-800">
              {t.sof}
              {sofSelect}
            </label>
          </div>
        ) : (
          <label className="block text-sm font-medium text-slate-800">
            {t.sof}
            {sofSelect}
          </label>
        )}

        <label className="block text-sm font-medium text-slate-800">
          {t.sofComplexity}
          <select name="sof_complexity" defaultValue="standard" required className={`mt-2 ${formFieldWhite}`}>
            {t.sofComplexities.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-500">{t.sofHint}</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            {t.name}
            <input name="name" required autoComplete="name" className={`mt-2 ${formField}`} />
          </label>
          <label className="text-sm font-medium text-slate-800">
            {t.contact}
            <input
              name="contact"
              required
              autoComplete="email"
              defaultValue={prefill?.contact ?? undefined}
              placeholder={t.contactPlaceholder}
              className={`mt-2 ${formField}`}
            />
          </label>
        </div>

        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          <input name="consent" type="checkbox" required className="mt-1" />
          <span>
            {t.consentA}
            <Link href="/ru/privacy" className="font-medium text-corridor-700 underline">
              {t.consentLink}
            </Link>
            {t.consentB}
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
          className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-corridor-600 to-corridor-800 px-6 py-3 font-semibold text-white shadow-lg shadow-corridor-900/20 transition hover:from-corridor-500 hover:to-corridor-700 hover:shadow-corridor-900/30 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          {status === "loading" ? t.sending : isUae ? t.submitUae : t.submit}
          {status !== "loading" ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
        </button>
      </form>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { captureAttribution, getSessionId } from "@/lib/analytics/attribution";
import {
  type InvestLocale,
  type InvestPageKey,
} from "@/lib/investment/golden-visa-2026";
import {
  INVEST_PREFILL_EVENT,
  INVEST_PREFILL_KEY,
  INVEST_QUICK_ANCHOR,
  quickBudgetFloorEur,
  quickContactType,
  quickOutcomeToProfiler,
  quickPassportGroup,
  quickPassportLabel,
  type InvestPrefill,
  type QuickBudgetBand,
  type QuickOutcome,
  type QuickPassport,
} from "@/lib/investment/quick-lead";
import { investBotDeepLink } from "@/lib/telegram/deep-link";
import { formField, formFieldWhite } from "@/lib/ui/mobile";

const COPY = {
  ru: {
    heading: "Бесплатный подбор инвест-маршрута за 1 минуту",
    headingCompare: "Получите PDF-сравнение на e-mail или в Telegram",
    sub: "4 коротких вопроса · около минуты. Ответ с доступными программами пришлём в течение 1 рабочего дня. €0, без обязательств.",
    subCompare:
      "PDF с 8 программами и официальными источниками доступен сразу после отправки; подбор под ваш паспорт — в течение 1 рабочего дня. €0.",
    budget: "Бюджет на инвестицию",
    budgetPlaceholder: "Выберите бюджет",
    budgets: {
      lt250: "до €250 000",
      "250_500": "€250–500 тыс.",
      "500_1000": "€500 тыс.–1 млн",
      "1000_2000": "€1–2 млн",
      gt2000: "от €2 млн",
      unsure: "Пока не знаю",
    } satisfies Record<QuickBudgetBand, string>,
    passport: "Гражданство (паспорт)",
    passportPlaceholder: "Выберите паспорт",
    passports: { RU: "Россия", BY: "Беларусь", UA: "Украина", KZ: "Казахстан", Other: "Другое" } satisfies Record<
      QuickPassport,
      string
    >,
    passportOther: "Какой паспорт?",
    passportHint: "Для RU/BY часть программ закрыта — учтём это.",
    outcome: "Главная цель",
    outcomes: {
      residence: "ВНЖ",
      citizenship: "Гражданство",
      tax: "Налоговая оптимизация",
      business: "Бизнес / компания",
    } satisfies Record<QuickOutcome, string>,
    contact: "Telegram или e-mail",
    contactPlaceholder: "@username или name@email.com",
    contactError: "Укажите @username в Telegram или e-mail",
    consentBefore: "Согласен(на) на обработку данных по ",
    consentLink: "Политике конфиденциальности",
    consentError: "Отметьте согласие на обработку данных",
    missing: "Заполните бюджет, паспорт и цель",
    submit: "Получить подбор бесплатно",
    submitCompare: "Получить PDF и подбор",
    sending: "Отправляем…",
    tg: "или напишите в Telegram →",
    successTitle: "Заявка принята ✅",
    successText:
      "Пришлём бесплатный подбор маршрута в течение 1 рабочего дня в Telegram или на e-mail. Хотите точнее? Заполните полный профиль — 2 минуты.",
    successTextCompare:
      "PDF можно скачать прямо сейчас. Бесплатный подбор маршрута пришлём в течение 1 рабочего дня в Telegram или на e-mail. Хотите точнее? Заполните полный профиль — 2 минуты.",
    step2: "Заполнить полный профиль (шаг 2)",
    pdf: "Скачать сравнение Golden Visa 2026 (PDF)",
    pdfTg: "Получить PDF в Telegram",
    routeCheck: "Нужна проверка документов? Route Check — €129",
    error: "Не удалось отправить. Напишите нам в Telegram — ответим быстрее.",
    honeypot: "Не заполняйте это поле",
  },
  en: {
    heading: "Free investment-route match in 1 minute",
    headingCompare: "Get the PDF comparison by email or Telegram",
    sub: "4 short questions · about a minute. We'll send your available-programme shortlist within 1 business day. €0, no obligation.",
    subCompare:
      "The PDF with 8 programmes and official sources is ready after you submit; your passport-specific shortlist follows within 1 business day. €0.",
    budget: "Investment budget",
    budgetPlaceholder: "Choose a budget",
    budgets: {
      lt250: "under €250,000",
      "250_500": "€250–500K",
      "500_1000": "€500K–1M",
      "1000_2000": "€1–2M",
      gt2000: "€2M+",
      unsure: "Not sure yet",
    } satisfies Record<QuickBudgetBand, string>,
    passport: "Citizenship (passport)",
    passportPlaceholder: "Choose a passport",
    passports: { RU: "Russia", BY: "Belarus", UA: "Ukraine", KZ: "Kazakhstan", Other: "Other" } satisfies Record<
      QuickPassport,
      string
    >,
    passportOther: "Which passport?",
    passportHint: "Some programmes are closed to RU/BY passports — we factor this in.",
    outcome: "Main goal",
    outcomes: {
      residence: "Residence permit",
      citizenship: "Citizenship",
      tax: "Tax residency",
      business: "Business / company",
    } satisfies Record<QuickOutcome, string>,
    contact: "Telegram or email",
    contactPlaceholder: "@username or name@email.com",
    contactError: "Enter a Telegram @username or an email",
    consentBefore: "I agree to data processing under the ",
    consentLink: "Privacy Policy",
    consentError: "Please accept the data-processing consent",
    missing: "Choose a budget, passport and goal",
    submit: "Get my free match",
    submitCompare: "Get the PDF and my match",
    sending: "Sending…",
    tg: "or message us on Telegram →",
    successTitle: "Request received ✅",
    successText:
      "We'll send your free route match within 1 business day via Telegram or email. Want it more precise? Complete the full profile — 2 minutes.",
    successTextCompare:
      "You can download the PDF right now. We'll send your free route match within 1 business day via Telegram or email. Want it more precise? Complete the full profile — 2 minutes.",
    step2: "Complete full profile (step 2)",
    pdf: "Download Golden Visa 2026 comparison (PDF)",
    pdfTg: "Get the PDF in Telegram",
    routeCheck: "Need a document check? Route Check — €129",
    error: "Couldn't send. Message us on Telegram — we'll reply faster.",
    honeypot: "Leave this field empty",
  },
} as const;

const PRIVACY_PATH: Record<InvestLocale, string> = { ru: "/ru/privacy", en: "/ru/privacy" };
const ROUTE_CHECK_PATH = "/ru/route-check";

export function InvestQuickLead({
  locale,
  pageKey,
  variant = "quick",
  defaultOutcome,
  className = "",
}: {
  locale: InvestLocale;
  pageKey: InvestPageKey;
  variant?: "quick" | "compare";
  defaultOutcome?: QuickOutcome;
  className?: string;
}) {
  const t = COPY[locale];
  const source = variant === "compare" ? "invest_compare" : "invest_quick";
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const [budget, setBudget] = useState<QuickBudgetBand | "">("");
  const [passport, setPassport] = useState<QuickPassport | "">("");
  const [passportOther, setPassportOther] = useState("");
  const [outcome, setOutcome] = useState<QuickOutcome | "">(defaultOutcome ?? "");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<InvestPrefill | null>(null);
  const tgHref = investBotDeepLink(pageKey, locale);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent("invest_lead_view", { country: pageKey, locale, source });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [locale, pageKey, source]);

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("invest_lead_start", { country: pageKey, locale, source });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!budget || !passport || !outcome || (passport === "Other" && !passportOther.trim())) {
      setFieldError(t.missing);
      return;
    }
    const contactType = quickContactType(contact);
    if (!contactType) {
      setFieldError(t.contactError);
      return;
    }
    if (!consent) {
      setFieldError(t.consentError);
      return;
    }
    setFieldError(null);
    setStatus("loading");

    const sessionAttr = captureAttribution();
    const urlParams = new URLSearchParams(window.location.search);
    const attr = sessionAttr.utm_source
      ? sessionAttr
      : {
          ...sessionAttr,
          utm_source: urlParams.get("utm_source"),
          utm_medium: urlParams.get("utm_medium"),
          utm_campaign: urlParams.get("utm_campaign"),
          utm_content: urlParams.get("utm_content"),
        };
    const payload = {
      source,
      country: pageKey,
      locale,
      budget_eur: budget,
      passport_citizenship: passport,
      ...(passport === "Other" ? { passport_other: passportOther.trim() } : {}),
      outcome,
      contact: contact.trim(),
      consent: true,
      preferred_country: pageKey === "hub" || pageKey === "compare" ? "any" : pageKey,
      session_id: getSessionId(),
      referrer: attr.referrer,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      page_url: window.location.href.slice(0, 500),
      website,
    };

    try {
      const response = await fetch("/api/v1/investment/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as {
        id?: string | null;
        token?: string | null;
        pdf_url?: string | null;
      };
      if (!response.ok || !data.id) throw new Error(`status ${response.status}`);

      trackEvent("invest_lead_submit", {
        country: pageKey,
        locale,
        source,
        budget_eur: budget,
        outcome,
        passport_group: quickPassportGroup(passport),
        contact_type: contactType,
      });

      const next: InvestPrefill = {
        leadId: data.id,
        token: data.token ?? null,
        budgetEur: quickBudgetFloorEur(budget),
        passport: quickPassportLabel(passport, passportOther, locale),
        outcome: quickOutcomeToProfiler(outcome),
        contact: contact.trim(),
        preferredCountry: pageKey === "hub" || pageKey === "compare" ? "any" : pageKey,
      };
      try {
        window.sessionStorage.setItem(INVEST_PREFILL_KEY, JSON.stringify(next));
      } catch {
        /* storage optional */
      }
      setPdfUrl(data.pdf_url ?? null);
      setPrefill(next);
      setStatus("done");
    } catch (error) {
      trackEvent("invest_lead_error", {
        country: pageKey,
        locale,
        source,
        reason: error instanceof Error ? error.message.slice(0, 60) : "unknown",
      });
      setStatus("error");
    }
  }

  function openStep2() {
    if (!prefill) return;
    const target = document.getElementById("qualifier");
    if (target) {
      window.dispatchEvent(new CustomEvent(INVEST_PREFILL_EVENT, { detail: prefill }));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.assign(`/${locale}/invest#qualifier`);
  }

  function trackTg(placement: string) {
    trackEvent("invest_tg_click", { country: pageKey, locale, source, placement });
  }

  const radioName = `${INVEST_QUICK_ANCHOR}-outcome`;

  return (
    <section
      ref={sectionRef}
      id={INVEST_QUICK_ANCHOR}
      className={`relative scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl shadow-slate-900/10 sm:p-6 ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-400 to-corridor-500" />
      {status === "done" && prefill ? (
        <div role="status" aria-live="polite">
          <h2 className="text-xl font-bold text-slate-950">{t.successTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {variant === "compare" ? t.successTextCompare : t.successText}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {variant === "compare" && pdfUrl ? (
              <a
                href={pdfUrl}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800"
              >
                <Download className="h-4 w-4" /> {t.pdf}
              </a>
            ) : null}
            <button
              type="button"
              onClick={openStep2}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold ${
                variant === "compare"
                  ? "border border-slate-300 text-slate-800 hover:bg-slate-50"
                  : "bg-corridor-700 text-white hover:bg-corridor-800"
              }`}
            >
              {t.step2} <ArrowRight className="h-4 w-4" />
            </button>
            {variant === "compare" ? (
              <a
                href={investBotDeepLink("compare", locale)}
                onClick={() => trackTg("success_pdf")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
              >
                <Send className="h-4 w-4" /> {t.pdfTg}
              </a>
            ) : pdfUrl ? (
              <a
                href={pdfUrl}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-800 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> {t.pdf}
              </a>
            ) : null}
          </div>
          <Link href={ROUTE_CHECK_PATH} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-corridor-700 hover:underline">
            {t.routeCheck}
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold leading-snug text-slate-950 sm:text-xl">
            {variant === "compare" ? t.headingCompare : t.heading}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{variant === "compare" ? t.subCompare : t.sub}</p>

          <form onSubmit={submit} onFocus={markStarted} noValidate className="mt-4 space-y-3.5">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-800">
                {t.budget}
                <select
                  name="budget_eur"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as QuickBudgetBand)}
                  className={`mt-1.5 ${formFieldWhite}`}
                >
                  <option value="" disabled>
                    {t.budgetPlaceholder}
                  </option>
                  {(Object.keys(t.budgets) as QuickBudgetBand[]).map((band) => (
                    <option key={band} value={band}>
                      {t.budgets[band]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-800">
                {t.passport}
                <select
                  name="passport_citizenship"
                  required
                  value={passport}
                  onChange={(e) => setPassport(e.target.value as QuickPassport)}
                  aria-describedby={`${INVEST_QUICK_ANCHOR}-passport-hint`}
                  className={`mt-1.5 ${formFieldWhite}`}
                >
                  <option value="" disabled>
                    {t.passportPlaceholder}
                  </option>
                  {(Object.keys(t.passports) as QuickPassport[]).map((value) => (
                    <option key={value} value={value}>
                      {t.passports[value]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {passport === "Other" ? (
              <label className="block text-sm font-medium text-slate-800">
                {t.passportOther}
                <input
                  name="passport_other"
                  value={passportOther}
                  onChange={(e) => setPassportOther(e.target.value)}
                  maxLength={80}
                  className={`mt-1.5 ${formField}`}
                />
              </label>
            ) : null}
            <p id={`${INVEST_QUICK_ANCHOR}-passport-hint`} className="-mt-1 text-xs text-slate-500">
              {t.passportHint}
            </p>

            <fieldset>
              <legend className="text-sm font-medium text-slate-800">{t.outcome}</legend>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(Object.keys(t.outcomes) as QuickOutcome[]).map((value) => (
                  <label
                    key={value}
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      outcome === value ? "border-corridor-500 bg-corridor-50 text-corridor-900" : "border-slate-200 hover:border-corridor-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={radioName}
                      value={value}
                      checked={outcome === value}
                      onChange={() => setOutcome(value)}
                      required
                    />
                    <span>{t.outcomes[value]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-medium text-slate-800">
              {t.contact}
              <input
                name="contact"
                required
                autoComplete="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.contactPlaceholder}
                className={`mt-1.5 ${formField}`}
              />
            </label>

            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                {t.honeypot}
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <label className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
              <input
                name="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                {t.consentBefore}
                <Link href={PRIVACY_PATH[locale]} className="font-medium text-corridor-700 underline">
                  {t.consentLink}
                </Link>
              </span>
            </label>

            {fieldError ? (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {fieldError}
              </p>
            ) : null}
            {status === "error" ? (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {t.error}{" "}
                <a href={tgHref} onClick={() => trackTg("error")} className="font-semibold underline">
                  Telegram →
                </a>
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-3 font-semibold text-slate-950 shadow-md shadow-amber-500/20 transition hover:from-amber-200 hover:to-amber-300 disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              {status === "loading" ? t.sending : variant === "compare" ? t.submitCompare : t.submit}
            </button>
            <a
              href={tgHref}
              onClick={() => trackTg("under_button")}
              className="flex min-h-11 items-center justify-center text-sm font-medium text-corridor-700 hover:underline"
            >
              {t.tg}
            </a>
          </form>
        </>
      )}
    </section>
  );
}

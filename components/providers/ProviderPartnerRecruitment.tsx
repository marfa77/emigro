"use client";

import Link from "next/link";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics/client";
import type { ProviderPlacement } from "@/components/providers/ServiceProviderCard";

type Props = {
  placement: ProviderPlacement;
  corridorSlug?: string;
  topicKey?: string;
  countryRu?: string;
};

export function ProviderPartnerRecruitment({ placement, corridorSlug, topicKey, countryRu }: Props) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");
  const [countries, setCountries] = useState(countryRu ?? "");
  const [services, setServices] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const res = await fetch("/api/v1/partners/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: company,
        contact_name: contactName,
        email,
        telegram: telegram || undefined,
        website: website || undefined,
        countries,
        services,
        message: message || undefined,
        corridor_slug: corridorSlug,
        topic_key: topicKey,
        placement,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setStatus("error");
      setErrorMessage(data.error ?? "Не удалось отправить заявку");
      trackEvent("lead_error", { placement, message: data.error ?? "partner_inquiry" });
      return;
    }

    trackEvent("partner_inquiry_submitted", {
      placement,
      corridor_slug: corridorSlug ?? "",
      topic_key: topicKey ?? "",
    });
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-dashed border-corridor-300 bg-corridor-50/60 p-5 sm:p-6">
        <p className="font-medium text-corridor-900">Заявка отправлена</p>
        <p className="mt-2 text-sm text-corridor-900/80">
          Спасибо! Мы свяжемся с вами, если профиль компании подходит для справочника. Подробнее о программе — на{" "}
          <Link href="/ru/partners" className="font-medium text-corridor-700 underline">
            странице для партнёров
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-corridor-600 shadow-sm">
            <Building2 className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Хотите видеть свою компанию в списке провайдеров?</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Юристы, релокационные агентства, бухгалтеры и другие сервисы на маршрутах Emigro. Оставьте заявку — мы
              рассмотрим профиль для справочника.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-corridor-300 bg-white px-4 py-2.5 text-sm font-medium text-corridor-800 hover:bg-corridor-50"
          aria-expanded={open}
        >
          {open ? "Свернуть" : "Оставить заявку"}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-3 border-t border-slate-200 pt-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Название компании"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Контактное лицо"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Telegram (необязательно)"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              placeholder="Сайт"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Страны присутствия"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <input
            required
            placeholder="Тип услуг (ВНЖ, релокация, бухгалтерия, язык…)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Кратко о компании и лицензиях"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />

          {status === "error" && errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-corridor-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
            >
              {status === "loading" ? "Отправка…" : "Отправить заявку"}
            </button>
            <Link href="/ru/partners" className="text-sm text-corridor-700 hover:underline">
              Условия партнёрства →
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Отправляя форму, вы соглашаетесь с{" "}
            <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
              политикой конфиденциальности
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
}

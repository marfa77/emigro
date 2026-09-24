"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { dubaiOfferVerdictUrl } from "@/lib/investment/uae-offer-verdict";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import { tapTarget } from "@/lib/ui/mobile";

type Placement = "uae_hub" | "invest_country" | "guide_article" | "guide_sidebar";

type Props = {
  placement: Placement;
  content?: string;
  /** Compact sidebar variant (single primary CTA). */
  compact?: boolean;
};

const QUALIFIER_HREF = "/ru/invest/uae#qualifier";

export function UaePropertyLeadCta({
  placement,
  content = "uae",
  compact = false,
}: Props) {
  const offerHref = dubaiOfferVerdictUrl({
    medium: placement,
    campaign: "uae_property_lead",
    content,
  });

  function trackPrimary() {
    trackEvent("investment_cta_click", {
      source: "uae_property_lead",
      placement,
      product: "broker_qualify",
    });
  }

  function trackOffer() {
    trackEvent("provider_click", {
      provider_id: "dubai-offer-verdict",
      placement,
      topic_key: "uae",
      product: "dld_offer_check",
    });
  }

  if (compact) {
    return (
      <div className="mt-3">
        <Link
          href={QUALIFIER_HREF}
          onClick={trackPrimary}
          className="block rounded-lg bg-corridor-600 px-5 py-3 text-center font-medium text-white hover:bg-corridor-700"
        >
          Купить / подобрать в Дубае
        </Link>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Qualifier → свяжемся и передадим брокеру вручную. Не каталог объектов.
        </p>
      </div>
    );
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm"
      aria-labelledby={`uae-property-lead-${placement}`}
      data-llm="commercial"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
        Дубай · недвижимость
      </p>
      <h2
        id={`uae-property-lead-${placement}`}
        className="mt-2 text-xl font-bold text-slate-950 sm:text-2xl"
      >
        Квалифицировать бюджет → свяжем с брокером
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
        Golden от AED 2M, 2-летняя property-виза или покупка без визовой цели — сначала короткий
        профиль (бюджет, срок, primary/secondary). Emigro свяжется в Telegram/WhatsApp и передаст
        заявку брокеру вручную. Это не каталог объектов и не обещание визы «за покупку». Подробный
        маршрут виза → KYC → DLD:{" "}
        <Link
          href="/ru/guides/kupit-nedvizhimost-dubaj-rossiyane-2026-visa-banki-dld"
          className="font-medium text-corridor-800 underline hover:text-corridor-950"
        >
          гайд для паспорта РФ
        </Link>
        .
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={QUALIFIER_HREF}
          onClick={trackPrimary}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800 ${tapTarget}`}
        >
          Заполнить qualifier <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={offerHref}
          target="_blank"
          rel={PARTNER_LINK_REL}
          onClick={trackOffer}
          className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 hover:bg-slate-50 ${tapTarget}`}
        >
          Уже есть оффер — сверка с DLD
        </a>
      </div>
    </section>
  );
}

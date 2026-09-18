"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import { dubaiOfferVerdictUrl } from "@/lib/investment/uae-offer-verdict";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  placement: "invest_country" | "invest_results" | "guide";
  content?: string;
};

export function DubaiOfferVerdictPromo({ placement, content = "uae" }: Props) {
  const href = dubaiOfferVerdictUrl({
    medium: placement,
    campaign: "uae_property_documents",
    content,
  });

  function handleClick() {
    trackEvent("provider_click", {
      provider_id: "dubai-offer-verdict",
      placement,
      topic_key: "uae",
      product: "dld_offer_check",
    });
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"
      aria-labelledby="dubai-offer-verdict-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Сестринский инструмент · uaeproperty.vip
      </p>
      <h2 id="dubai-offer-verdict-heading" className="mt-2 text-xl font-bold text-slate-950">
        Перед переводом денег — сверка оффера с DLD
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Dubai Offer Verdict сравнивает ask брокера с зарегистрированными продажами DLD: цена/м², объём сделок,
        контекст для переговоров. Это due diligence по объекту, не партнёр по сделке и не решение ICP/DLD по визе.
        Первый успешный verdict бесплатный.
      </p>
      <a
        href={href}
        target="_blank"
        rel={PARTNER_LINK_REL}
        onClick={handleClick}
        className={`mt-5 inline-flex ${tapTarget} items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800`}
      >
        Проверить оффер на uaeproperty.vip
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-xs text-slate-500">
        Emigro не передаёт ваш контакт на uaeproperty.vip. Golden Residence решает ICP / DLD по оценке объекта, не
        по цене в брошюре.
      </p>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { DEFAULT_EXTERNAL_AD_REL } from "@/lib/partners/link";
import {
  defaultRevolutLiveMap,
  formatRevolutEndsOnLabel,
  REVOLUT_OFFERS,
  REVOLUT_REFERRAL_PROVIDER_ID,
  visibleRevolutOffers,
  type RevolutLiveMap,
  type RevolutReferralKind,
  type RevolutReferralPlacement,
} from "@/lib/partners/revolut-referral";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  placement: RevolutReferralPlacement;
  contentId: string;
  offers: RevolutReferralKind[];
  live?: RevolutLiveMap;
  compact?: boolean;
  className?: string;
};

function trackClick(placement: RevolutReferralPlacement, contentId: string, kind: RevolutReferralKind) {
  const offer = REVOLUT_OFFERS[kind];
  trackEvent("provider_click", {
    provider_id: REVOLUT_REFERRAL_PROVIDER_ID,
    campaign: offer.campaign,
    product: offer.product,
    placement,
    content_id: contentId,
  });
}

const COPY: Record<
  RevolutReferralKind,
  { compactTitle: string; title: string; body: string; cta: string; compactCta: string }
> = {
  personal: {
    compactTitle: "Revolut: LT IBAN и часто местный (PT и др.)",
    title: "Revolut: литовский IBAN и часто местный",
    body: "К LT IBAN Revolut может добавить местный — например PT. Это не обещание каждому паспорту и статусу: после 19-го пакета карта часто требует гражданство или ВНЖ EEA/CH, KYC может не пройти.",
    cta: "Открыть Revolut (физлицо)",
    compactCta: "Физлицо",
  },
  business: {
    compactTitle: "Revolut Business для ИП / юрлица",
    title: "Revolut Business для ИП и юрлица",
    body: "Отдельный KYC. После 19-го пакета для RU/BY жёсткий; оффер не обещает открытие и не обещает местный IBAN.",
    cta: "Открыть Revolut Business",
    compactCta: "Юрлицо / ИП",
  },
};

export function RevolutReferralPromo({
  placement,
  contentId,
  offers,
  live: liveProp,
  compact = false,
  className = "",
}: Props) {
  const [live, setLive] = useState<RevolutLiveMap>(liveProp ?? defaultRevolutLiveMap());

  useEffect(() => {
    if (liveProp) setLive(liveProp);
  }, [liveProp]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/referrals/revolut")
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { personal?: RevolutLiveMap["personal"]; business?: RevolutLiveMap["business"] } | null) => {
        if (cancelled || !body?.personal || !body?.business) return;
        setLive({ personal: body.personal, business: body.business });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = visibleRevolutOffers(offers, live);
  if (visible.length === 0) return null;

  const latestEnd = visible
    .map((kind) => live[kind].endsOn)
    .sort()
    .at(-1);

  if (compact) {
    return (
      <aside
        className={`rounded-xl border border-indigo-200/80 bg-indigo-50/70 px-4 py-3 text-sm text-slate-700 ${className}`}
        data-sponsor="revolut-referral"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-800">
          Реклама{latestEnd ? ` · до ${formatRevolutEndsOnLabel(latestEnd)}` : ""}
        </p>
        <p className="mt-1 font-medium text-slate-900">
          {visible.length === 1 ? COPY[visible[0]].compactTitle : "Revolut: физлицо и юрлицо"}
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {visible.map((kind) => (
            <a
              key={kind}
              href={live[kind].url}
              target="_blank"
              rel={DEFAULT_EXTERNAL_AD_REL}
              onClick={() => trackClick(placement, contentId, kind)}
              className={`inline-flex ${tapTarget} items-center gap-1.5 font-semibold text-indigo-800 underline-offset-2 hover:underline`}
            >
              {COPY[kind].compactCta}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <section
      className={`rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5 sm:p-6 ${className}`}
      aria-labelledby="revolut-referral-heading"
      data-sponsor="revolut-referral"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-800">
        Реклама · реферальная ссылка{latestEnd ? ` до ${latestEnd}` : ""}
      </p>
      <h2 id="revolut-referral-heading" className="mt-2 text-lg font-semibold text-slate-900">
        {visible.length === 1 ? COPY[visible[0]].title : "Revolut: физлицо и счёт для юрлица"}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
        {visible.map((kind) => (
          <p key={kind}>{COPY[kind].body}</p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {visible.map((kind) => (
          <a
            key={kind}
            href={live[kind].url}
            target="_blank"
            rel={DEFAULT_EXTERNAL_AD_REL}
            onClick={() => trackClick(placement, contentId, kind)}
            className={`inline-flex ${tapTarget} items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
              kind === "business" ? "bg-slate-900 hover:bg-slate-800" : "bg-indigo-700 hover:bg-indigo-800"
            }`}
          >
            {COPY[kind].cta}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        revolut.com · не банк Emigro · местный IBAN зависит от KYC
      </p>
    </section>
  );
}

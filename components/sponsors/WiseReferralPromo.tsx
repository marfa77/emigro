"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { DEFAULT_EXTERNAL_AD_REL } from "@/lib/partners/link";
import {
  defaultWiseLiveOffer,
  formatWiseEndsOnLabel,
  isWiseLiveOfferVisible,
  WISE_REFERRAL_CAMPAIGN,
  WISE_REFERRAL_PRODUCT,
  WISE_REFERRAL_PROVIDER_ID,
  type WiseLiveOffer,
  type WiseReferralPlacement,
} from "@/lib/partners/wise-referral";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  placement: WiseReferralPlacement;
  contentId: string;
  live?: WiseLiveOffer;
  compact?: boolean;
  className?: string;
};

function trackClick(placement: WiseReferralPlacement, contentId: string) {
  trackEvent("provider_click", {
    provider_id: WISE_REFERRAL_PROVIDER_ID,
    campaign: WISE_REFERRAL_CAMPAIGN,
    product: WISE_REFERRAL_PRODUCT,
    placement,
    content_id: contentId,
  });
}

export function WiseReferralPromo({
  placement,
  contentId,
  live: liveProp,
  compact = false,
  className = "",
}: Props) {
  const [live, setLive] = useState<WiseLiveOffer>(liveProp ?? defaultWiseLiveOffer());

  useEffect(() => {
    if (liveProp) setLive(liveProp);
  }, [liveProp]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/referrals/wise")
      .then((res) => (res.ok ? res.json() : null))
      .then((body: WiseLiveOffer | null) => {
        if (cancelled || !body?.url) return;
        setLive({
          url: body.url,
          endsOn: body.endsOn ?? "",
          enabled: body.enabled !== false,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isWiseLiveOfferVisible(live)) return null;

  const until = live.endsOn ? ` · до ${formatWiseEndsOnLabel(live.endsOn)}` : "";

  if (compact) {
    return (
      <aside
        className={`rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-sm text-slate-700 ${className}`}
        data-sponsor="wise-referral"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
          Реклама{until}
        </p>
        <p className="mt-1 font-medium text-slate-900">Wise для переводов, пока нет местного IBAN</p>
        <a
          href={live.url}
          target="_blank"
          rel={DEFAULT_EXTERNAL_AD_REL}
          onClick={() => trackClick(placement, contentId)}
          className={`mt-2 inline-flex ${tapTarget} items-center gap-1.5 font-semibold text-emerald-800 underline-offset-2 hover:underline`}
        >
          Открыть Wise
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </aside>
    );
  }

  return (
    <section
      className={`rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 sm:p-6 ${className}`}
      aria-labelledby="wise-referral-heading"
      data-sponsor="wise-referral"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
        Реклама · реферальная ссылка{live.endsOn ? ` до ${live.endsOn}` : ""}
      </p>
      <h2 id="wise-referral-heading" className="mt-2 text-lg font-semibold text-slate-900">
        Wise для переводов, пока нет местного IBAN
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        После 19-го пакета KYC для RU/BY жёсткий. Wise не заменяет PT/ES/IT счёт для аренды и зарплаты и не
        обещает, что верификация пройдёт.
      </p>
      <a
        href={live.url}
        target="_blank"
        rel={DEFAULT_EXTERNAL_AD_REL}
        onClick={() => trackClick(placement, contentId)}
        className={`mt-4 inline-flex ${tapTarget} items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800`}
      >
        Открыть Wise
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>
      <p className="mt-3 text-xs text-slate-500">wise.com · не банк Emigro · не замена локального IBAN</p>
    </section>
  );
}

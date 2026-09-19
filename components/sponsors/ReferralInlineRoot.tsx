"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/client";
import {
  type ReferralInlineLiveUrls,
  type ReferralInlineProvider,
} from "@/lib/partners/referral-inline";

type Props = {
  contentId: string;
  placement: string;
  live?: ReferralInlineLiveUrls;
  children: ReactNode;
  className?: string;
};

function productKey(provider: string, product: string): keyof ReferralInlineLiveUrls | null {
  if (provider === "wise") return "wise";
  if (provider === "revolut" && product === "personal") return "revolutPersonal";
  if (provider === "revolut" && product === "business") return "revolutBusiness";
  return null;
}

function patchReferralHrefs(root: ParentNode, urls: ReferralInlineLiveUrls) {
  Array.from(root.querySelectorAll<HTMLAnchorElement>("a[data-partner-referral]")).forEach((anchor) => {
    const key = productKey(anchor.dataset.partnerReferral ?? "", anchor.dataset.partnerProduct ?? "");
    const next = key ? urls[key] : undefined;
    if (next) anchor.href = next;
  });
}

export function ReferralInlineRoot({ contentId, placement, live, children, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!live?.revolutPersonal && !live?.revolutBusiness && !live?.wise) return;
    const root = rootRef.current;
    if (!root) return;
    patchReferralHrefs(root, live);
  }, [live]);

  useEffect(() => {
    if (!live?.revolutPersonal && !live?.revolutBusiness && !live?.wise) return;
    let cancelled = false;
    const root = rootRef.current;
    if (!root) return;

    Promise.all([
      fetch("/api/v1/referrals/revolut")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      fetch("/api/v1/referrals/wise")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ]).then(([revolut, wise]) => {
      if (cancelled || !root) return;
      patchReferralHrefs(root, {
        revolutPersonal: revolut?.personal?.url,
        revolutBusiness: revolut?.business?.url,
        wise: wise?.url,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [live?.revolutPersonal, live?.revolutBusiness, live?.wise]);

  return (
    <div
      ref={rootRef}
      className={className}
      data-partner-content={contentId}
      data-partner-placement={placement}
      onClick={(event) => {
        const anchor = (event.target as HTMLElement | null)?.closest?.("a[data-partner-referral]");
        if (!(anchor instanceof HTMLAnchorElement) || !rootRef.current?.contains(anchor)) return;
        const provider = (anchor.dataset.partnerReferral ?? "") as ReferralInlineProvider;
        if (provider !== "revolut" && provider !== "wise") return;
        trackEvent("provider_click", {
          provider_id: provider,
          campaign: anchor.dataset.partnerCampaign ?? "",
          product: anchor.dataset.partnerProduct ?? "",
          placement,
          content_id: contentId,
        });
      }}
    >
      {children}
    </div>
  );
}

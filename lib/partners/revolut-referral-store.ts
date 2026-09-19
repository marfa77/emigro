import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/admin/supabase";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import {
  defaultRevolutLiveMap,
  isAllowedRevolutReferralUrl,
  mergeRevolutLiveOffer,
  revolutOffersForGuide,
  revolutOffersForNote,
  visibleRevolutOffers,
  type RevolutLiveMap,
  type RevolutReferralKind,
} from "@/lib/partners/revolut-referral";

const ROW_IDS: Record<RevolutReferralKind, string> = {
  personal: "revolut_personal",
  business: "revolut_business",
};

type OfferRow = {
  id: string;
  product: string;
  url: string;
  ends_on: string;
  enabled: boolean;
};

async function loadRevolutReferralLiveUncached(): Promise<RevolutLiveMap> {
  const live = defaultRevolutLiveMap();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("partner_referral_offers")
      .select("id, product, url, ends_on, enabled")
      .eq("provider", "revolut");
    if (error || !data) return live;

    for (const row of data as OfferRow[]) {
      const kind = row.product === "business" ? "business" : row.id === ROW_IDS.business ? "business" : "personal";
      live[kind] = mergeRevolutLiveOffer(kind, {
        url: row.url,
        endsOn: row.ends_on,
        enabled: row.enabled,
      });
    }
    return live;
  } catch {
    return live;
  }
}

export async function loadRevolutReferralLive(): Promise<RevolutLiveMap> {
  try {
    return await unstable_cache(loadRevolutReferralLiveUncached, ["revolut-referral-live"], {
      tags: [CACHE_TAGS.partnerReferrals],
      revalidate: CACHE_REVALIDATE.partnerReferrals,
    })();
  } catch {
    return defaultRevolutLiveMap();
  }
}

export async function revolutPromoProps(
  slug: string,
  surface: "guide" | "note"
): Promise<{ offers: RevolutReferralKind[]; live: RevolutLiveMap } | null> {
  const kinds = surface === "guide" ? revolutOffersForGuide(slug) : revolutOffersForNote(slug);
  if (!kinds.length) return null;
  const live = await loadRevolutReferralLive();
  const offers = visibleRevolutOffers(kinds, live);
  if (!offers.length) return null;
  return { offers, live };
}

export async function saveRevolutReferralOffer(input: {
  kind: RevolutReferralKind;
  url: string;
  endsOn: string;
  enabled: boolean;
}): Promise<RevolutLiveMap> {
  const url = input.url.trim();
  if (!isAllowedRevolutReferralUrl(url)) {
    throw new Error("URL должен быть https://revolut.com или https://business.revolut.com");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.endsOn)) {
    throw new Error("Дата ends_on в формате YYYY-MM-DD");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("partner_referral_offers").upsert({
    id: ROW_IDS[input.kind],
    provider: "revolut",
    product: input.kind,
    url,
    ends_on: input.endsOn,
    enabled: input.enabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return loadRevolutReferralLiveUncached();
}

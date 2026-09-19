import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/admin/supabase";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import {
  defaultWiseLiveOffer,
  isAllowedWiseReferralUrl,
  isWiseLiveOfferVisible,
  mergeWiseLiveOffer,
  wiseOfferForGuide,
  wiseOfferForNote,
  type WiseLiveOffer,
} from "@/lib/partners/wise-referral";

const ROW_ID = "wise_personal";

type OfferRow = {
  id: string;
  url: string;
  ends_on: string | null;
  enabled: boolean;
};

async function loadWiseReferralLiveUncached(): Promise<WiseLiveOffer> {
  const fallback = defaultWiseLiveOffer();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("partner_referral_offers")
      .select("id, url, ends_on, enabled")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error || !data) return fallback;
    const row = data as OfferRow;
    return mergeWiseLiveOffer({
      url: row.url,
      endsOn: row.ends_on,
      enabled: row.enabled,
    });
  } catch {
    return fallback;
  }
}

export async function loadWiseReferralLive(): Promise<WiseLiveOffer> {
  try {
    return await unstable_cache(loadWiseReferralLiveUncached, ["wise-referral-live"], {
      tags: [CACHE_TAGS.partnerReferrals],
      revalidate: CACHE_REVALIDATE.partnerReferrals,
    })();
  } catch {
    return defaultWiseLiveOffer();
  }
}

export async function wisePromoProps(
  slug: string,
  surface: "guide" | "note"
): Promise<{ live: WiseLiveOffer } | null> {
  if (surface === "guide" ? !wiseOfferForGuide(slug) : !wiseOfferForNote(slug)) return null;
  const live = await loadWiseReferralLive();
  if (!isWiseLiveOfferVisible(live)) return null;
  return { live };
}

export async function saveWiseReferralOffer(input: {
  url: string;
  endsOn: string;
  enabled: boolean;
}): Promise<WiseLiveOffer> {
  const url = input.url.trim();
  if (!isAllowedWiseReferralUrl(url)) {
    throw new Error("URL должен быть https://wise.com/invite/…");
  }
  const endsOn = input.endsOn.trim();
  if (endsOn && !/^\d{4}-\d{2}-\d{2}$/.test(endsOn)) {
    throw new Error("Дата ends_on в формате YYYY-MM-DD или пусто");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("partner_referral_offers").upsert({
    id: ROW_ID,
    provider: "wise",
    product: "personal",
    url,
    ends_on: endsOn || "2099-12-31",
    enabled: input.enabled,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return loadWiseReferralLiveUncached();
}

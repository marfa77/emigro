import { NextResponse } from "next/server";
import { visibleRevolutOffers } from "@/lib/partners/revolut-referral";
import { loadRevolutReferralLive } from "@/lib/partners/revolut-referral-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const live = await loadRevolutReferralLive();
  const visible = visibleRevolutOffers(["personal", "business"], live);
  const body = {
    personal: live.personal,
    business: live.business,
    visible,
  };
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=30, s-maxage=30",
    },
  });
}

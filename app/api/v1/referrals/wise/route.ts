import { NextResponse } from "next/server";
import { loadWiseReferralLive } from "@/lib/partners/wise-referral-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const live = await loadWiseReferralLive();
  return NextResponse.json(live, {
    headers: {
      "Cache-Control": "public, max-age=30, s-maxage=30",
    },
  });
}

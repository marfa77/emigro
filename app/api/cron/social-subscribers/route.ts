import { NextResponse } from "next/server";
import { sendDailySubscriberDm } from "@/lib/social-stats/send-daily-dm";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendDailySubscriberDm();
    if (!result.sent) {
      return NextResponse.json(result, { status: result.skipped ? 200 : 500 });
    }
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message, sent: false }, { status: 500 });
  }
}

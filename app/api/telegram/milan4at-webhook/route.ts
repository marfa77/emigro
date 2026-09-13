import { NextResponse } from "next/server";
import {
  milan4atBotToken,
  processMilan4atUpdate,
  type Milan4atUpdate,
} from "@/lib/milan-4at/bot-handler";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyWebhookSecret(req: Request): boolean {
  const expected = process.env.MILAN4AT_WEBHOOK_SECRET?.trim();
  if (!expected) return true;
  return req.headers.get("x-telegram-bot-api-secret-token") === expected;
}

export async function POST(req: Request) {
  if (!milan4atBotToken()) {
    return NextResponse.json({ ok: false, error: "MILAN4AT_BOT_TOKEN missing" }, { status: 503 });
  }
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }

  let payload: Milan4atUpdate;
  try {
    payload = (await req.json()) as Milan4atUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await processMilan4atUpdate(payload);
  } catch (e) {
    console.error("[milan4at-webhook]", e instanceof Error ? e.message : e);
  }
  return NextResponse.json({ ok: true });
}


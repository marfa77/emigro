import { NextResponse } from "next/server";
import { ingestCommunitySignals } from "@/lib/community-notes/queries";
import type { CommunitySignalIngest } from "@/lib/community-notes/types";

function verifyIngestKey(request: Request): boolean {
  const expected =
    process.env.COMMUNITY_INGEST_API_KEY?.trim() ||
    process.env.EMIGRO_ADMIN_SECRET?.trim();
  if (!expected) return false;
  const header = request.headers.get("x-api-key")?.trim();
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  return header === expected || bearer === expected;
}

export async function POST(request: Request) {
  if (!verifyIngestKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { signals?: CommunitySignalIngest[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const signals = body.signals ?? [];
  if (!Array.isArray(signals) || signals.length === 0) {
    return NextResponse.json({ error: "signals[] required" }, { status: 400 });
  }

  for (const s of signals) {
    if (!s.message_id || !s.channel_username || !s.text?.trim() || !s.posted_at) {
      return NextResponse.json(
        { error: "Each signal needs message_id, channel_username, text, posted_at" },
        { status: 400 }
      );
    }
    if (s.text.trim().length < 40) {
      return NextResponse.json({ error: "Signal text too short (min 40 chars)" }, { status: 400 });
    }
  }

  try {
    const result = await ingestCommunitySignals(signals);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

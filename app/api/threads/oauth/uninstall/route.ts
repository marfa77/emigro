import { NextResponse } from "next/server";

/**
 * Threads / Meta "Uninstall Callback URL" — ping when user deauthorizes the app.
 * Must return 200; body is not critical for setup.
 */
export async function POST() {
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}

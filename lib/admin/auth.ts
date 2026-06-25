import { NextResponse } from "next/server";

/** Ops API auth — Bearer EMIGRO_ADMIN_SECRET (same pattern as CRON_SECRET). */
export function verifyAdminRequest(request: Request): boolean {
  const secret = process.env.EMIGRO_ADMIN_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function adminMisconfigured() {
  return NextResponse.json(
    { error: "EMIGRO_ADMIN_SECRET not configured on server" },
    { status: 503 }
  );
}

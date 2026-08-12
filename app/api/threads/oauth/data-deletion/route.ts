import { NextRequest, NextResponse } from "next/server";
import { publicSiteUrl } from "@/lib/site-url";

/**
 * Meta "Delete Callback URL" (data deletion request).
 * https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */
export async function POST(req: NextRequest) {
  let confirmationCode = `emigro-${Date.now()}`;
  try {
    const form = await req.formData();
    const signed = form.get("signed_request");
    if (typeof signed === "string" && signed.includes(".")) {
      // Don't verify here for stub — production should verify HMAC with app secret.
      confirmationCode = `emigro-${signed.slice(-12)}`;
    }
  } catch {
    /* empty body ok for health checks */
  }

  const url = `${publicSiteUrl()}/api/threads/oauth/data-deletion?id=${encodeURIComponent(confirmationCode)}`;
  return NextResponse.json({
    url,
    confirmation_code: confirmationCode,
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "unknown";
  const html = `<!doctype html><meta charset="utf-8"><title>Data deletion</title>
<body style="font:16px system-ui;max-width:36rem;margin:2rem auto;padding:0 1rem">
<h1>Data deletion request</h1>
<p>Confirmation: <code>${id.replace(/[<>&]/g, "")}</code></p>
<p>Emigro Threads OAuth stubs — no user content stored beyond tokens you set locally.</p>
</body>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

import { NextRequest, NextResponse } from "next/server";

/**
 * OAuth redirect target for Threads Authorization Window.
 * Meta redirects here with ?code=... — we show it so you can exchange for a long-lived token.
 * Does NOT store the code server-side.
 *
 * Register the same URL in Meta App → Threads → Redirect URIs:
 *   https://www.emigro.online/api/threads/oauth/callback
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const errorReason = req.nextUrl.searchParams.get("error_reason");
  const errorDescription = req.nextUrl.searchParams.get("error_description");

  if (error) {
    const html = `<!doctype html><meta charset="utf-8"><title>Threads OAuth error</title>
<body style="font:16px/1.4 system-ui;max-width:40rem;margin:2rem auto;padding:0 1rem">
<h1>Threads OAuth error</h1>
<pre>${escapeHtml([error, errorReason, errorDescription].filter(Boolean).join("\n"))}</pre>
</body>`;
    return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  if (!code) {
    const html = `<!doctype html><meta charset="utf-8"><title>Threads OAuth</title>
<body style="font:16px/1.4 system-ui;max-width:40rem;margin:2rem auto;padding:0 1rem">
<h1>Нет code</h1>
<p>Открой auth URL через <code>npm run threads:exchange-token -- --auth-url</code>.</p>
</body>`;
    return new NextResponse(html, { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const cmd = `npm run threads:exchange-token -- --code=${code}`;
  const html = `<!doctype html><meta charset="utf-8"><title>Threads OAuth code</title>
<body style="font:16px/1.4 system-ui;max-width:42rem;margin:2rem auto;padding:0 1rem">
<h1>Threads: code получен</h1>
<p>Скопируй и выполни <b>в течение ~1 часа</b> на машине с <code>.env.local</code>:</p>
<pre style="white-space:pre-wrap;word-break:break-all;background:#111;color:#eee;padding:1rem;border-radius:8px">${escapeHtml(cmd)}</pre>
<p>Или только code:</p>
<pre style="white-space:pre-wrap;word-break:break-all;background:#f4f4f4;padding:1rem;border-radius:8px">${escapeHtml(code)}</pre>
<p>После обмена сохрани long-lived token в <code>THREADS_ACCESS_TOKEN</code> и <code>THREADS_USER_ID</code>.</p>
</body>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.emigro.online";

function isLocalHost(host: string): boolean {
  return !host || host.includes("localhost") || host.includes("127.0.0.1");
}

function isPreviewHost(host: string): boolean {
  return host.endsWith(".vercel.app");
}

function shouldRedirectToCanonical(request: NextRequest): URL | null {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (isLocalHost(host) || isPreviewHost(host)) return null;

  const proto = request.headers.get("x-forwarded-proto");
  const needsHttps = proto === "http";
  const needsWww = host === "emigro.online";

  if (!needsHttps && !needsWww) return null;

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  return url;
}

export function middleware(request: NextRequest) {
  const canonicalUrl = shouldRedirectToCanonical(request);
  if (canonicalUrl) {
    return NextResponse.redirect(canonicalUrl, 301);
  }

  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.EMIGRO_ADMIN_SECRET?.trim();
  if (!secret) return NextResponse.next();

  const token = request.cookies.get("emigro_admin")?.value;
  if (token === secret) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|txt|xml)).*)",
  ],
};

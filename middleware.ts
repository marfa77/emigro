import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { portugalSatelliteSubdomainEnabled } from "@/lib/site-url";

const CANONICAL_HOST = "www.emigro.online";
const PORTUGAL_SATELLITE_ORIGIN = `https://${PORTUGAL_SATELLITE_HOST}`;

function hostName(request: NextRequest): string {
  return request.headers.get("host")?.split(":")[0] ?? "";
}

function isLocalHost(host: string): boolean {
  return !host || host.includes("localhost") || host.includes("127.0.0.1");
}

function isPreviewHost(host: string): boolean {
  return host.endsWith(".vercel.app");
}

function isPortugalSatelliteHost(host: string): boolean {
  return host === PORTUGAL_SATELLITE_HOST;
}

/** /satellite/portugal on www → canonical subdomain (301). */
function redirectWwwSatelliteToSubdomain(request: NextRequest): NextResponse | null {
  if (!portugalSatelliteSubdomainEnabled()) return null;

  const host = hostName(request);
  if (host !== CANONICAL_HOST && host !== "emigro.online") return null;

  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/satellite/portugal")) return null;

  const subpath = pathname.slice("/satellite/portugal".length) || "/";
  const destination = `${PORTUGAL_SATELLITE_ORIGIN}${subpath === "/" ? "" : subpath}${search}`;
  return NextResponse.redirect(destination, 301);
}

/** /notes/* and /tag/* on apex/www → satellite (subdomain when enabled). */
function redirectMisplacedSatellitePaths(request: NextRequest): NextResponse | null {
  const host = hostName(request);
  if (host !== CANONICAL_HOST && host !== "emigro.online") return null;

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/notes/")) {
    const subpath = pathname;
    const destination = portugalSatelliteSubdomainEnabled()
      ? `${PORTUGAL_SATELLITE_ORIGIN}${subpath}${search}`
      : `https://${CANONICAL_HOST}/satellite/portugal${subpath}${search}`;
    return NextResponse.redirect(destination, 301);
  }
  if (pathname.startsWith("/tag/")) {
    const subpath = pathname;
    const destination = portugalSatelliteSubdomainEnabled()
      ? `${PORTUGAL_SATELLITE_ORIGIN}${subpath}${search}`
      : `https://${CANONICAL_HOST}/satellite/portugal${subpath}${search}`;
    return NextResponse.redirect(destination, 301);
  }
  return null;
}

function rewritePortugalSatellite(request: NextRequest): NextResponse | null {
  const host = hostName(request);
  if (!isPortugalSatelliteHost(host)) return null;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/satellite/portugal")) {
    return NextResponse.next();
  }

  if (pathname === "/llms.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/satellite/portugal/llms";
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/satellite/portugal${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function shouldRedirectToCanonical(request: NextRequest): URL | null {
  const host = hostName(request);
  if (isLocalHost(host) || isPreviewHost(host) || isPortugalSatelliteHost(host)) return null;

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
  const wwwSatellite = redirectWwwSatelliteToSubdomain(request);
  if (wwwSatellite) return wwwSatellite;

  const misplaced = redirectMisplacedSatellitePaths(request);
  if (misplaced) return misplaced;

  const satellite = rewritePortugalSatellite(request);
  if (satellite) return satellite;

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

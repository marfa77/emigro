import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE_HOST } from "@/lib/satellite/spain";
import { portugalSatelliteSubdomainEnabled, spainSatelliteSubdomainEnabled } from "@/lib/site-url";

const CANONICAL_HOST = "www.emigro.online";
const PORTUGAL_SATELLITE_ORIGIN = `https://${PORTUGAL_SATELLITE_HOST}`;
const SPAIN_SATELLITE_ORIGIN = `https://${SPAIN_SATELLITE_HOST}`;

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

function isSpainSatelliteHost(host: string): boolean {
  return host === SPAIN_SATELLITE_HOST;
}

function isSatelliteHost(host: string): boolean {
  return isPortugalSatelliteHost(host) || isSpainSatelliteHost(host);
}

/** /satellite/{country} on www → canonical subdomain (301). */
function redirectWwwSatelliteToSubdomain(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  const host = hostName(request);
  if (host !== CANONICAL_HOST && host !== "emigro.online") return null;

  if (pathname.startsWith("/satellite/portugal") && portugalSatelliteSubdomainEnabled()) {
    const subpath = pathname.slice("/satellite/portugal".length) || "/";
    const destination = `${PORTUGAL_SATELLITE_ORIGIN}${subpath === "/" ? "" : subpath}${search}`;
    return NextResponse.redirect(destination, 301);
  }

  if (pathname.startsWith("/satellite/spain") && spainSatelliteSubdomainEnabled()) {
    const subpath = pathname.slice("/satellite/spain".length) || "/";
    const destination = `${SPAIN_SATELLITE_ORIGIN}${subpath === "/" ? "" : subpath}${search}`;
    return NextResponse.redirect(destination, 301);
  }

  return null;
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

/** Mirrors programPathLegacy in lib/corridor/paths.ts (kept inline for Edge middleware). */
function legacyProgramPath(programSlug: string): string {
  if (programSlug.startsWith("portugal-")) return `/ru/portugal/programs/${programSlug}`;
  if (programSlug.startsWith("spain-")) return `/ru/spain/programs/${programSlug}`;
  if (programSlug.startsWith("france-")) return `/ru/france/programs/${programSlug}`;
  if (programSlug.startsWith("italy-")) return `/ru/italy/programs/${programSlug}`;
  if (programSlug.startsWith("germany-")) return `/ru/germany/programs/${programSlug}`;
  if (programSlug.startsWith("netherlands-")) return `/ru/netherlands/programs/${programSlug}`;
  if (programSlug.startsWith("poland-")) return `/ru/poland/programs/${programSlug}`;
  if (programSlug.startsWith("czechia-")) return `/ru/czechia/programs/${programSlug}`;
  if (programSlug.startsWith("austria-")) return `/ru/austria/programs/${programSlug}`;
  if (programSlug.startsWith("sweden-") || programSlug.startsWith("denmark-") || programSlug.startsWith("nordic-")) {
    return `/ru/scandinavia/programs/${programSlug}`;
  }
  return `/ru/programs/${programSlug}`;
}

/** Legacy flat /ru/programs/:slug → corridor-scoped program URL (301). */
function redirectLegacyProgramPaths(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  const match = pathname.match(/^\/ru\/programs\/([^/]+)$/);
  if (!match) return null;

  const slug = decodeURIComponent(match[1]);
  const destination = legacyProgramPath(slug);
  if (destination === pathname) return null;

  return NextResponse.redirect(new URL(`${destination}${search}`, request.url), 301);
}

/** /ru/* and other main-site sections on satellite host → www (corridor lives on main domain). */
function redirectSatelliteCorridorPaths(request: NextRequest): NextResponse | null {
  const host = hostName(request);
  if (!isSatelliteHost(host)) return null;

  const { pathname, search } = request.nextUrl;
  const mainSitePrefixes = ["/ru", "/admin", "/api/v1", "/llms-full.txt"];
  if (mainSitePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    if (pathname === "/llms.txt") return null;
    return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 301);
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

function rewriteSpainSatellite(request: NextRequest): NextResponse | null {
  const host = hostName(request);
  if (!isSpainSatelliteHost(host)) return null;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/satellite/spain")) {
    return NextResponse.next();
  }

  if (pathname === "/llms.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/satellite/spain/llms";
    return NextResponse.rewrite(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/satellite/spain${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

function shouldRedirectToCanonical(request: NextRequest): URL | null {
  const host = hostName(request);
  if (isLocalHost(host) || isPreviewHost(host) || isSatelliteHost(host)) return null;

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

  const legacyProgram = redirectLegacyProgramPaths(request);
  if (legacyProgram) return legacyProgram;

  const satelliteCorridor = redirectSatelliteCorridorPaths(request);
  if (satelliteCorridor) return satelliteCorridor;

  const satellite = rewritePortugalSatellite(request);
  if (satellite) return satellite;

  const spainSatellite = rewriteSpainSatellite(request);
  if (spainSatellite) return spainSatellite;

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

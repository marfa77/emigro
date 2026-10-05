import { NextResponse } from "next/server";
import { faviconUrlForHostname, isSafePublicHttpUrl } from "@/lib/link-preview";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 5000;
const MAX_IMAGE_BYTES = 3_000_000;
const CACHE_CONTROL = "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const FALLBACK_CACHE_CONTROL = "public, max-age=3600, s-maxage=86400";

const FAVICON_FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0f766e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

const IMAGE_FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset=".5" stop-color="#f0fdfa"/><stop offset="1" stop-color="#e2e8f0"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`;

function svgResponse(svg: string): NextResponse {
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": FALLBACK_CACHE_CONTROL },
  });
}

async function fetchImage(raw: string): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const parsed = isSafePublicHttpUrl(raw);
  if (!parsed) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(parsed.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; EmigroBot/1.0; +https://www.emigro.online/; link-preview)",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!contentType.startsWith("image/") || contentType === "image/svg+xml") return null;
    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > MAX_IMAGE_BYTES) return null;
    const body = await res.arrayBuffer();
    if (body.byteLength === 0 || body.byteLength > MAX_IMAGE_BYTES) return null;
    return { body, contentType };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Same-origin OG image / favicon for link preview cards. Always 200 — falls back to a neutral SVG. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url")?.trim();
  const domain = searchParams.get("domain")?.trim().toLowerCase();

  if (url) {
    const image = await fetchImage(url);
    if (image) {
      return new NextResponse(new Uint8Array(image.body), {
        headers: { "Content-Type": image.contentType, "Cache-Control": CACHE_CONTROL },
      });
    }
    return svgResponse(IMAGE_FALLBACK_SVG);
  }

  if (domain && /^[a-z0-9.-]{1,253}$/.test(domain)) {
    const icon = await fetchImage(faviconUrlForHostname(domain));
    if (icon) {
      return new NextResponse(new Uint8Array(icon.body), {
        headers: { "Content-Type": icon.contentType, "Cache-Control": CACHE_CONTROL },
      });
    }
  }

  return svgResponse(FAVICON_FALLBACK_SVG);
}

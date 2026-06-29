const INVALID = new Set(["", "XX", "T1"]);

const GEO_HEADER_KEYS = ["x-vercel-ip-country", "cf-ipcountry", "x-country-code"] as const;

function normalizeCountry(code: string | null | undefined): string | null {
  const raw = (code || "").trim().toUpperCase();
  if (!raw || INVALID.has(raw) || raw.length !== 2 || !/^[A-Z]{2}$/.test(raw)) {
    return null;
  }
  return raw;
}

export function countryFromHeaders(request: Request): string | null {
  for (const key of GEO_HEADER_KEYS) {
    const found = normalizeCountry(request.headers.get(key));
    if (found) return found;
  }
  return null;
}

export function clientIp(request: Request): string | null {
  for (const key of ["x-forwarded-for", "x-vercel-forwarded-for", "x-real-ip"]) {
    const raw = (request.headers.get(key) || "").trim();
    if (!raw) continue;
    const ip = raw.split(",")[0]?.trim();
    if (ip) return ip;
  }
  return null;
}

export function anonymizeIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const clean = ip.trim().slice(0, 64);
  if (clean.includes(":")) {
    const parts = clean.split(":");
    if (parts.length > 1) {
      parts[parts.length - 1] = "0";
      return parts.join(":").slice(0, 64);
    }
    return clean;
  }
  const octets = clean.split(".");
  if (octets.length === 4) {
    octets[3] = "0";
    return octets.join(".");
  }
  return clean;
}

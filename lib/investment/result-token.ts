import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string | undefined {
  return process.env.EMIGRO_ADMIN_SECRET?.trim() || process.env.CRON_SECRET?.trim();
}

export function signInvestmentResultToken(leadId: string): string | null {
  const key = secret();
  if (!key) return null;
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${leadId}.${expires}`;
  const signature = createHmac("sha256", key).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyInvestmentResultToken(token: string | undefined): string | null {
  const key = secret();
  if (!key || !token) return null;
  const [leadId, expiresRaw, signature] = token.split(".");
  const expires = Number(expiresRaw);
  if (!leadId || !signature || !Number.isFinite(expires) || expires < Date.now()) return null;
  const expected = createHmac("sha256", key).update(`${leadId}.${expiresRaw}`).digest("base64url");
  const actual = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length || !timingSafeEqual(actual, wanted)) return null;
  return leadId;
}

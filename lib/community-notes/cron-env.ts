/** Canonical URLs in DB/spotlight when cron runs outside Vercel (VPS, local scripts). */
export function ensurePortugalCronEnv(): void {
  if (!process.env.PORTUGAL_SATELLITE_USE_SUBDOMAIN?.trim()) {
    process.env.PORTUGAL_SATELLITE_USE_SUBDOMAIN = "true";
  }
  const publicUrl = process.env.EMIGRO_PUBLIC_SITE_URL?.trim();
  if (!publicUrl || /localhost|127\.0\.0\.1/.test(publicUrl)) {
    process.env.EMIGRO_PUBLIC_SITE_URL = "https://www.emigro.online";
  }
}

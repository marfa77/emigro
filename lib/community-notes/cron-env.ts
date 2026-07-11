function ensureSatelliteCronEnv(subdomainKey: string): void {
  const siteKey = "EMIGRO_PUBLIC_SITE_URL";

  if (!process.env[subdomainKey]?.trim()) {
    process.env[subdomainKey] = "true";
  }

  const publicUrl = process.env[siteKey]?.trim();
  if (!publicUrl || /localhost|127\.0\.0\.1/.test(publicUrl)) {
    process.env[siteKey] = "https://www.emigro.online";
  }
}

/** Canonical URLs in DB/spotlight when cron runs outside Vercel (VPS, local scripts). */
export function ensurePortugalCronEnv(): void {
  ensureSatelliteCronEnv("PORTUGAL_SATELLITE_USE_SUBDOMAIN");
}

export function ensureSpainCronEnv(): void {
  ensureSatelliteCronEnv("SPAIN_SATELLITE_USE_SUBDOMAIN");
}

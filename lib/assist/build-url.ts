export type AssistUrlParams = {
  sessionId?: string;
  country?: string;
  program?: string;
  providerId?: string;
  source?: string;
  hash?: string;
  locale?: "ru" | "es" | "fr";
};

/** Build Assist URL with wizard handoff query params. */
export function buildAssistUrl(params: AssistUrlParams = {}): string {
  const search = new URLSearchParams();
  if (params.sessionId) search.set("session", params.sessionId);
  if (params.country) search.set("country", params.country);
  if (params.program) search.set("program", params.program);
  if (params.providerId) search.set("provider", params.providerId);
  if (params.source) search.set("source", params.source);
  const qs = search.toString();
  // Emigro is free for users (2026-11-19): every Assist link, including old paid hashes
  // (route-check / accompaniment), lands on the free request form.
  const hash = params.hash && !/route-check|accompaniment/.test(params.hash) ? params.hash : "assist-form";
  const base =
    params.locale === "es" ? "/es/assist" : params.locale === "fr" ? "/fr/assist" : "/ru/assist";
  return `${base}${qs ? `?${qs}` : ""}#${hash}`;
}

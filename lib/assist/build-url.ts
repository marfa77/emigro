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
  const hash = params.hash ?? "assist-form";
  // RU paid Route Check lives on its own page (Gumroad checkout), apart from the free partner
  // request form, so payment never sits in the path of leads that go to partners (2026-11-10).
  if (hash === "assist-form-route-check" && params.locale !== "es" && params.locale !== "fr") {
    return `/ru/route-check${qs ? `?${qs}` : ""}`;
  }
  const base =
    params.locale === "es" ? "/es/assist" : params.locale === "fr" ? "/fr/assist" : "/ru/assist";
  return `${base}${qs ? `?${qs}` : ""}#${hash}`;
}

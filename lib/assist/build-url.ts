export type AssistUrlParams = {
  sessionId?: string;
  country?: string;
  program?: string;
  hash?: string;
};

/** Build `/ru/assist` URL with wizard handoff query params. */
export function buildAssistUrl(params: AssistUrlParams = {}): string {
  const search = new URLSearchParams();
  if (params.sessionId) search.set("session", params.sessionId);
  if (params.country) search.set("country", params.country);
  if (params.program) search.set("program", params.program);
  const qs = search.toString();
  const hash = params.hash ?? "assist-form";
  return `/ru/assist${qs ? `?${qs}` : ""}#${hash}`;
}

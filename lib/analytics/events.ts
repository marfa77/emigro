/** Typed product events — client + server. */
export type EmigroEventName =
  | "page_view"
  | "wizard_started"
  | "wizard_step"
  | "wizard_completed"
  | "wizard_error"
  | "wizard_cta_click"
  | "wizard_results_view"
  | "wizard_results_click"
  | "hub_wizard_completed"
  | "lead_submitted"
  | "assist_lead_submitted"
  | "lead_error"
  | "news_article_view"
  | "news_source_click"
  | "corridor_link_click"
  | "provider_click"
  | "community_join_click"
  | "cron_weekly_news"
  | "cron_weekly_news_error"
  | "cron_prep2go_news"
  | "cron_prep2go_news_error";

export type EmigroEventProps = Record<string, string | number | boolean | null | undefined>;

export function sanitizeEventProps(props: EmigroEventProps): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      out[k] = v;
    } else {
      out[k] = String(v);
    }
  }
  return out;
}

import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { corridorResultsPath } from "@/lib/corridor/paths";
import type { WizardModule } from "@/lib/types";
import { SITE_URL } from "@/lib/site-url";

export type WizardFunnelContext = {
  ip?: string;
  userAgent?: string;
  referer?: string;
  pagePath?: string;
  interestCountriesRu?: string[];
  entrySource?: string;
  entryType?: "guide" | "corridor" | "news" | "hub" | "unknown";
  geoCountryRu?: string;
};

const OUTCOME_RU: Record<string, string> = {
  likely_eligible: "вероятно подходит",
  needs_review: "требует проверки",
  unlikely: "маловероятно",
};

function contextBlock(ctx?: WizardFunnelContext): string {
  if (!ctx) return "";
  const lines = [
    ctx.interestCountriesRu?.length
      ? `Страна интереса: ${ctx.interestCountriesRu.join(", ")}`
      : null,
    ctx.entrySource ? `Откуда пришёл: ${ctx.entrySource}` : null,
    ctx.geoCountryRu ? `Гео (IP): ${ctx.geoCountryRu}` : null,
    ctx.pagePath ? `Страница: ${ctx.pagePath}` : null,
    ctx.referer ? `Откуда: ${ctx.referer}` : null,
    ctx.ip ? `IP: ${ctx.ip}` : null,
    ctx.userAgent ? `UA: ${ctx.userAgent.slice(0, 120)}` : null,
  ].filter(Boolean);
  return lines.length ? `\n\nКонтекст:\n${lines.join("\n")}` : "";
}

export function formatWizardCtaClickTelegram(props: Record<string, string>, ctx?: WizardFunnelContext): string {
  return [
    "🧭 Emigro — клик «Подбор маршрута»",
    "",
    `Куда: ${props.target_path ?? "—"}`,
    props.link_text ? `Текст ссылки: ${props.link_text}` : null,
    props.locale ? `Язык: ${props.locale}` : "Язык: ru",
    contextBlock(ctx),
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

export function formatWizardStartedTelegram(props: Record<string, string>, ctx?: WizardFunnelContext): string {
  const interest = props.interest_countries || props.interest;
  return [
    "▶️ Emigro — wizard начат",
    "",
    `Тип: ${props.wizard_mode === "hub" ? "глобальный hub" : `коридор ${props.corridor_slug ?? "—"}`}`,
    props.wizard_id ? `Wizard ID: ${props.wizard_id}` : null,
    props.locale ? `Язык: ${props.locale}` : "Язык: ru",
    interest ? `Interest (URL): ${interest}` : null,
    contextBlock(ctx),
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

/** Short owner DM (3–5 lines). Full answers live on the results page. */
export function formatWizardCompletedTelegram(input: {
  mode: "hub" | "corridor";
  sessionId: string;
  corridorSlug?: string;
  corridorTitleRu?: string;
  answers: Record<string, unknown>;
  payload?: GlobalEvalPayload;
  modules?: WizardModule[];
  corridorResults?: Array<{ slug: string; outcome: string; title?: string }>;
  ctx?: WizardFunnelContext;
  headline?: string;
}): string {
  const { mode, sessionId, payload, ctx, corridorResults } = input;
  const resultsUrl =
    mode === "hub"
      ? `${SITE_URL}/ru/wizard/results?session=${sessionId}`
      : input.corridorSlug
        ? `${SITE_URL}${corridorResultsPath(input.corridorSlug)}?session=${sessionId}`
        : `session ${sessionId}`;

  const typeLabel =
    mode === "hub" ? "hub" : `коридор ${input.corridorTitleRu ?? input.corridorSlug ?? "—"}`;

  let pickLine = "Топ: —";
  if (payload?.pick) {
    const matchCount = payload.results.filter((r) => r.outcome !== "unlikely").length;
    pickLine = `Топ: ${payload.pick.countryRu} — ${payload.pick.programTitleRu} (${OUTCOME_RU[payload.pick.outcome] ?? payload.pick.outcome}) · ${matchCount}/${payload.results.length}`;
  } else if (corridorResults?.length) {
    const top = corridorResults[0];
    pickLine = `Топ: ${top.title ?? top.slug} (${OUTCOME_RU[top.outcome] ?? top.outcome})`;
  }

  const meta = [
    ctx?.interestCountriesRu?.length ? `интерес: ${ctx.interestCountriesRu.join(", ")}` : null,
    ctx?.geoCountryRu ? `гео: ${ctx.geoCountryRu}` : null,
    ctx?.entrySource ? `вход: ${ctx.entrySource}` : null,
  ].filter(Boolean);

  return [
    input.headline ?? "✅ Emigro — wizard завершён",
    `${typeLabel} · ${pickLine}`,
    meta.length ? meta.join(" · ") : null,
    resultsUrl,
  ]
    .filter((l): l is string => Boolean(l))
    .join("\n");
}

export function formatWizardResultsClickTelegram(props: Record<string, string>, ctx?: WizardFunnelContext): string {
  return [
    "🔗 Emigro — клик после wizard",
    "",
    props.session_id ? `Session: ${props.session_id}` : null,
    `Перешёл на: ${props.target_path ?? "—"}`,
    props.link_label ? `Действие: ${props.link_label}` : null,
    contextBlock(ctx),
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

export function formatWizardResultsViewTelegram(props: Record<string, string>, ctx?: WizardFunnelContext): string {
  return [
    "📊 Emigro — просмотр результатов wizard",
    "",
    props.session_id ? `Session: ${props.session_id}` : null,
    props.pick_country ? `Топ-страна: ${props.pick_country}` : null,
    props.pick_program ? `Топ-программа: ${props.pick_program}` : null,
    props.matches ? `Совпадений: ${props.matches}` : null,
    contextBlock(ctx),
  ]
    .filter((l): l is string => l !== null)
    .join("\n");
}

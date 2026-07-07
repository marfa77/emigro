import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { corridorResultsPath } from "@/lib/corridor/paths";
import { HUB_WIZARD_MODULES } from "@/lib/wizard/hub-definition";
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

function labelForValue(modules: WizardModule[], key: string, raw: string): string {
  for (const mod of modules) {
    const question = mod.questions.find((q) => q.question_key === key);
    if (!question) continue;
    if (question.options?.length) {
      if (question.question_type === "multi") {
        return raw
          .split(",")
          .filter(Boolean)
          .map((v) => question.options!.find((o) => o.value === v)?.label_ru ?? v)
          .join(", ");
      }
      return question.options.find((o) => o.value === raw)?.label_ru ?? raw;
    }
    return raw;
  }
  return raw;
}

function formatAnswersBlock(
  answers: Record<string, unknown>,
  modules: WizardModule[] = HUB_WIZARD_MODULES
): string {
  const lines: string[] = [];
  for (const mod of modules) {
    for (const q of mod.questions) {
      const raw = answers[q.question_key];
      if (raw === undefined || raw === null || raw === "") continue;
      const value = labelForValue(modules, q.question_key, String(raw));
      lines.push(`• ${q.label_ru}: ${value}`);
    }
  }
  if (lines.length === 0) {
    for (const [k, v] of Object.entries(answers)) {
      if (v !== undefined && v !== null && v !== "") lines.push(`• ${k}: ${v}`);
    }
  }
  return lines.length ? lines.join("\n") : "—";
}

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
  const { mode, sessionId, answers, payload, ctx, corridorResults } = input;
  const resultsUrl =
    mode === "hub"
      ? `${SITE_URL}/ru/wizard/results?session=${sessionId}`
      : input.corridorSlug
        ? `${SITE_URL}${corridorResultsPath(input.corridorSlug)}?session=${sessionId}`
        : `session ${sessionId}`;

  const lines = [
    input.headline ?? "✅ Emigro — wizard завершён",
    "",
    `Тип: ${mode === "hub" ? "глобальный hub" : `коридор ${input.corridorTitleRu ?? input.corridorSlug}`}`,
    `Session: ${sessionId}`,
    `Результаты: ${resultsUrl}`,
    "",
    "Ответы:",
    formatAnswersBlock(answers, input.modules),
  ];

  if (payload) {
    const matchCount = payload.results.filter((r) => r.outcome !== "unlikely").length;
    lines.push("", `Совпадений: ${matchCount} из ${payload.results.length}`);
    if (payload.pick) {
      lines.push(
        "",
        "Топ-выбор:",
        `• ${payload.pick.countryRu} — ${payload.pick.programTitleRu}`,
        `• Исход: ${OUTCOME_RU[payload.pick.outcome] ?? payload.pick.outcome}`,
        `• Программа: ${SITE_URL}${payload.pick.programPath}`
      );
    }
    const top = payload.results
      .filter((r) => r.outcome !== "unlikely")
      .slice(0, 5)
      .map((r) => `• ${r.countryRu}: ${r.programTitleRu} (${OUTCOME_RU[r.outcome] ?? r.outcome})`);
    if (top.length) {
      lines.push("", "Топ маршруты:", ...top);
    }
  } else if (corridorResults?.length) {
    lines.push(
      "",
      "Топ программы:",
      ...corridorResults.map(
        (r) => `• ${r.title ?? r.slug} (${OUTCOME_RU[r.outcome] ?? r.outcome})`
      )
    );
  }

  lines.push(contextBlock(ctx));
  return lines.filter(Boolean).join("\n");
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

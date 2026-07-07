import { corridorResultsPath, HUB_WIZARD_RESULTS_PATH } from "@/lib/corridor/paths";
import { HUB_WIZARD_MODULES } from "@/lib/wizard/hub-definition";
import type { LoadedWizardSessionReport } from "@/lib/wizard/session-report";
import { publicSiteUrl } from "@/lib/site-url";
import type { WizardModule } from "@/lib/types";

const OUTCOME_RU: Record<string, string> = {
  likely_eligible: "вероятно подходит",
  needs_review: "требует проверки",
  unlikely: "маловероятно",
};

const PASSPORT_RU: Record<string, string> = {
  RU: "Россия",
  BY: "Беларусь",
  UA: "Украина",
  KZ: "Казахстан",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function resultsUrl(session: LoadedWizardSessionReport): string {
  const origin = publicSiteUrl();
  if (session.mode === "hub") {
    return `${origin}${HUB_WIZARD_RESULTS_PATH}?session=${encodeURIComponent(session.sessionId)}`;
  }
  if (session.corridorSlug) {
    return `${origin}${corridorResultsPath(session.corridorSlug)}?session=${encodeURIComponent(session.sessionId)}`;
  }
  return `${origin}/ru/wizard`;
}

function formatAnswersBlock(
  answers: Record<string, unknown>,
  modules: WizardModule[] = HUB_WIZARD_MODULES
): string[] {
  const lines: string[] = [];
  for (const mod of modules) {
    for (const q of mod.questions) {
      const raw = answers[q.question_key];
      if (raw === undefined || raw === null || raw === "") continue;
      lines.push(`• <b>${escapeHtml(q.label_ru)}</b>: ${escapeHtml(labelForValue(modules, q.question_key, String(raw)))}`);
    }
  }
  return lines.length ? lines : ["• Профиль сохранён в сессии Emigro"];
}

export function formatUserWizardReportHtml(session: LoadedWizardSessionReport): string[] {
  const url = resultsUrl(session);
  const passport = PASSPORT_RU[String(session.answers.passport_iso2 ?? "")] ?? null;
  const modeLabel =
    session.mode === "hub"
      ? "глобальный подбор по Европе"
      : `коридор ${escapeHtml(session.corridorTitleRu ?? session.corridorSlug ?? "")}`;

  const header = [
    "<b>🧭 Emigro — ваш отчёт по маршрутам</b>",
    "",
    `Тип: ${modeLabel}`,
    passport ? `Паспорт: ${escapeHtml(passport)}` : null,
    "",
    `<a href="${escapeHtml(url)}">Открыть полный результат на сайте</a>`,
    "",
    "<i>Предварительная навигация, не юридическая гарантия. Сверяйте требования с официальными источниками.</i>",
  ].filter((line): line is string => line !== null);

  const chunks: string[] = [];
  let current = header.join("\n");

  const appendSection = (title: string, lines: string[]) => {
    const block = ["", `<b>${title}</b>`, ...lines].join("\n");
    if ((current + block).length > 3800) {
      chunks.push(current);
      current = block.trim();
    } else {
      current += block;
    }
  };

  if (session.payload?.pick) {
    const pick = session.payload.pick;
    appendSection("⭐ Топ-выбор", [
      `<b>${escapeHtml(pick.countryRu)}</b> — ${escapeHtml(pick.programTitleRu)}`,
      `Исход: ${OUTCOME_RU[pick.outcome] ?? pick.outcome}`,
      `<a href="${escapeHtml(publicSiteUrl() + pick.programPath)}">Страница программы</a>`,
    ]);
  }

  const hubMatches = session.payload?.results.filter((r) => r.outcome !== "unlikely").slice(0, 6) ?? [];
  if (hubMatches.length) {
    appendSection("Маршруты", hubMatches.map((r) => `• ${escapeHtml(r.countryRu)}: ${escapeHtml(r.programTitleRu)} (${OUTCOME_RU[r.outcome] ?? r.outcome})`));
  }

  if (session.corridorResults?.length) {
    appendSection(
      "Программы коридора",
      session.corridorResults.map(
        (r) => `• ${escapeHtml(r.title ?? r.slug)} (${OUTCOME_RU[r.outcome] ?? r.outcome})`
      )
    );
  }

  const answerLines = formatAnswersBlock(session.answers, session.modules);
  appendSection("Ваш профиль", answerLines.slice(0, 8));

  current += `\n\n—\n<a href="${escapeHtml(url)}">Продолжить на Emigro</a>`;
  chunks.push(current);

  return chunks;
}

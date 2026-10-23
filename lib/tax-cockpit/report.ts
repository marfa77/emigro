import { publicSiteUrl } from "../site-url";
import { DEFAULT_DAY_RULE } from "./day-math";
import { getPack } from "./packs";
import type { CountryResidency, ResidencyEvaluation } from "./residency";

const ASSIST_BOT_URL = "https://telegram.me/emigro_chat_bot?start=assist";

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escAttr(url: string): string {
  return esc(url).replace(/"/g, "&quot;");
}

function flagEmoji(iso2: string): string {
  if (!/^[A-Z]{2}$/.test(iso2)) return "";
  return [...iso2].map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)).join("");
}

function assistPageUrl(): string {
  const url = new URL(`${publicSiteUrl()}/ru/assist`);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", "telegram");
  url.searchParams.set("utm_campaign", "tax-cockpit");
  url.searchParams.set("utm_content", "residency-report");
  return url.toString();
}

function thresholdLabel(row: CountryResidency): string {
  if (row.threshold == null) return "порог дней в pack не задан";
  if (!row.complete) return `ориентир ${row.threshold} дн. · pack incomplete`;
  if (row.thresholdCompare === "gt") return `ориентир: больше ${row.threshold} дн.`;
  return `ориентир: от ${row.threshold} дн.`;
}

function lightLabel(row: CountryResidency): string {
  switch (row.reason) {
    case "stub":
      return "🟡 pack incomplete — не зелёный и не красный";
    case "no-threshold":
      return "🟡 порог не задан — проверить";
    case "abbreviated":
      return "🟡 формула сокращена — проверить, не уверенный красный";
    case "over-threshold":
      return "🔴 порог дней достигнут — риск, не статус резидента";
    case "close":
      return "🟡 близко к порогу — проверить";
    case "under-threshold":
      return "🟢 ниже порога-ориентира — не заключение о нерезидентстве";
    default:
      return "⚪️ нет правила";
  }
}

function dayCountLabel(iso2: string): string {
  const rule = getPack(iso2).dayRule ?? DEFAULT_DAY_RULE;
  if (rule.arriveInclusive && rule.departInclusive) return "Дни: входят и приезд, и выезд.";
  if (rule.arriveInclusive && !rule.departInclusive) return "Дни: приезд входит, выезд нет.";
  return "Дни: правило pack отличается от ночи в стране.";
}

function countryBlock(row: CountryResidency): string[] {
  const pack = getPack(row.iso2);
  const flag = flagEmoji(row.iso2);
  const lines = [
    `${flag} <b>${esc(row.nameRu)}</b> (${esc(row.iso2)}) — ${row.days} дн.`,
    lightLabel(row),
    `${esc(thresholdLabel(row))}. ${dayCountLabel(row.iso2)}`,
  ];
  if (row.openQuestions.length) {
    lines.push(row.openQuestions.map((question) => `? ${esc(question)}`).join("\n"));
  }
  if (pack.officialSource) {
    lines.push(
      `<a href="${escAttr(pack.officialSource.url)}">${esc(pack.officialSource.labelRu)}</a>`
    );
  }
  return lines;
}

export function formatResidencyReportHtml(result: ResidencyEvaluation): string {
  const lines: string[] = [
    `<b>${result.year} · светофор присутствия</b>`,
    "Ориентир по дням календарного года. Не статус резидентства.",
    "",
  ];

  if (result.byCountry.length === 0) {
    lines.push("Нет интервалов с кодом страны ISO за этот год.");
  } else {
    if (result.topCountries.length > 0) {
      const top = result.topCountries.map((row) => `${row.iso2} ${row.days}`).join(" · ");
      lines.push(`Больше всего дней: ${esc(top)}`);
      lines.push("");
    }
    for (const row of result.byCountry) {
      lines.push(...countryBlock(row), "");
    }
  }

  const iso = new Set(result.byCountry.map((row) => row.iso2));
  if (iso.has("PT") && iso.has("AE")) {
    lines.push(
      "В pack Португалии и ОАЭ есть чеклист «Аренда в ОАЭ при возможном резидентстве Португалии». В отчёт он целиком не входит — его разбирают с консультантом."
    );
    lines.push("");
  }

  lines.push(`<i>${esc(result.disclaimerRu)}</i>`);
  lines.push("");
  lines.push(
    `Сложный случай — GV, аренда в ОАЭ вместе с Португалией, декларация — можно разобрать с человеком: <a href="${escAttr(assistPageUrl())}">Emigro Assist</a> или в боте <a href="${escAttr(ASSIST_BOT_URL)}">@emigro_chat_bot</a>. В этом отчёте оплаты нет.`
  );

  return lines.join("\n");
}

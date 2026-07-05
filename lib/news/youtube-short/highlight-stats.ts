import type { ScriptSegmentKind } from "./types";

export type HighlightStat = {
  value: string;
  label: string;
};

/** Pick the most clickable number/fact for on-screen display. */
export function extractHighlightStats(text: string): HighlightStat[] {
  const stats: HighlightStat[] = [];
  const seen = new Set<string>();

  const add = (value: string, label: string) => {
    const v = value.trim();
    const key = v.toLowerCase();
    if (!v || seen.has(key) || stats.length >= 2) return;
    seen.add(key);
    stats.push({ value: v.slice(0, 14), label: label.trim().slice(0, 22) });
  };

  const euroRanges = text.match(/€\s?\d[\d\s]*(?:–|-\s?\d[\d\s]*)?/g);
  if (euroRanges) {
    for (const m of euroRanges) add(m.replace(/\s+/g, " "), "в месяц");
  }

  const countErrors = text.match(/\b(\d+)\s+(?:ошиб|шаг|музе|дн|дней|месяц)/gi);
  if (countErrors) {
    for (const m of countErrors) {
      const n = m.match(/\d+/)?.[0];
      const word = m.replace(/^\d+\s+/i, "");
      if (n) add(n, word.slice(0, 22));
    }
  }

  const days = text.match(/\b(\d+)\s+(?:дней|дня|день|months?|месяц(?:а|ев)?)\b/gi);
  if (days) {
    for (const m of days) {
      const n = m.match(/\d+/)?.[0];
      if (n) add(n, m.replace(/^\d+\s+/i, "").slice(0, 22));
    }
  }

  const plainNum = text.match(/\b([3-9]|1[0-5])\b/);
  if (stats.length === 0 && plainNum) {
    add(plainNum[1], "факт");
  }

  return stats.slice(0, 2);
}

export function normalizeHighlightStats(raw: unknown, fallbackText: string): HighlightStat[] {
  const fromGemini: HighlightStat[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item && typeof item === "object" && "value" in item) {
        const value = String((item as HighlightStat).value ?? "").trim();
        const label = String((item as HighlightStat).label ?? "").trim();
        if (value) fromGemini.push({ value: value.slice(0, 14), label: label.slice(0, 22) });
      }
    }
  }
  if (fromGemini.length > 0) return fromGemini.slice(0, 2);
  return extractHighlightStats(fallbackText);
}

export function statForSegment(
  stats: HighlightStat[],
  kind: ScriptSegmentKind
): HighlightStat | null {
  if (stats.length === 0) return null;
  if (kind === "hook") return stats[0];
  if (kind === "tip") return stats[1] ?? stats[0];
  return null;
}

export function bigStatBadgeSvg(
  stat: HighlightStat,
  accent: string,
  kind: ScriptSegmentKind
): string {
  const valueLen = stat.value.length;
  const valueSize = valueLen > 10 ? 72 : valueLen > 7 ? 88 : kind === "hook" ? 118 : 96;
  const yCenter = kind === "hook" ? 520 : 560;
  const boxW = 420;
  const boxH = kind === "hook" ? 210 : 180;
  const x = SHORT_WIDTH - boxW - 48;
  const y = yCenter - boxH / 2;

  return `
  <g filter="url(#shortShadow)">
    <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="28" fill="#020617" fill-opacity="0.78" stroke="${accent}" stroke-width="4"/>
    <text x="${x + boxW / 2}" y="${y + boxH / 2 + (kind === "hook" ? 8 : 4)}" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="${valueSize}" font-weight="950" fill="${accent}">${escapeXml(stat.value)}</text>
    <text x="${x + boxW / 2}" y="${y + boxH - 28}" text-anchor="middle"
      font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#ffffff">${escapeXml(stat.label)}</text>
  </g>`;
}

const SHORT_WIDTH = 1080;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

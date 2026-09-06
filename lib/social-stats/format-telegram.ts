import type { SubscriberSnapshot } from "@/lib/social-stats/subscribers";

function formatCount(count: number): string {
  return count.toLocaleString("ru-RU");
}

function formatDateLabel(date = new Date()): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: process.env.EMIGRO_ANALYTICS_TIMEZONE?.trim() || "Europe/Lisbon",
  });
}

const PLATFORM_ORDER = ["threads", "telegram", "youtube", "facebook_group"] as const;

const PLATFORM_TITLE: Record<(typeof PLATFORM_ORDER)[number], string> = {
  threads: "Threads",
  telegram: "Telegram",
  youtube: "YouTube",
  facebook_group: "Facebook",
};

export function formatSubscriberReportTelegram(
  snapshots: SubscriberSnapshot[],
  date = new Date()
): string {
  const lines = [`📊 Подписчики · ${formatDateLabel(date)}`, ""];

  for (const platform of PLATFORM_ORDER) {
    const rows = snapshots.filter((s) => s.platform === platform);
    if (rows.length === 0) continue;
    lines.push(`<b>${PLATFORM_TITLE[platform]}</b>`);
    for (const row of rows) {
      if (row.count != null) {
        lines.push(`${row.label} — ${formatCount(row.count)}`);
      } else {
        lines.push(`${row.label} — недоступно`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

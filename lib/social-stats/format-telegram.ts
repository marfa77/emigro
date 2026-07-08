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

export function formatSubscriberReportTelegram(snapshots: SubscriberSnapshot[], date = new Date()): string {
  const lines = [`📊 Подписчики · ${formatDateLabel(date)}`, ""];

  for (const row of snapshots) {
    if (row.count != null) {
      lines.push(`${row.label} — ${formatCount(row.count)}`);
    } else {
      lines.push(`${row.label} — недоступно`);
    }
  }

  return lines.join("\n");
}

import { sendTelegramPlainToChat } from "@/lib/telegram";
import { publicSiteUrl } from "@/lib/site-url";
import { guidePath } from "@/lib/guides/load";
import type { VolatileFactcheckIssue } from "@/lib/guides/volatile-factcheck";
import { volatileGuideTitle } from "@/lib/guides/volatile-factcheck";

const MAX_ISSUES_PER_MESSAGE = 5;

/** Chat id for volatile fact-check DMs (private message to admin). */
export function factcheckNotifyTelegramChatId(): string | undefined {
  const dedicated = process.env.FACTCHECK_NOTIFY_TELEGRAM_CHAT_ID?.trim();
  if (dedicated) return dedicated;

  const admin = process.env.TELEGRAM_ADMIN_CHAT_ID?.split(",")[0]?.trim();
  if (admin) return admin;

  return process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim();
}

function severityLabel(severity: VolatileFactcheckIssue["severity"]): string {
  switch (severity) {
    case "critical":
      return "критично";
    case "warning":
      return "внимание";
    case "info":
      return "инфо";
  }
}

export function formatVolatileFactcheckTelegramDigest(
  issues: VolatileFactcheckIssue[],
  scannedCount: number
): string {
  const date = new Date().toISOString().slice(0, 10);
  const origin = publicSiteUrl();
  const top = issues.slice(0, MAX_ISSUES_PER_MESSAGE);

  const lines = [
    "⚠️ Volatile guides — fact-check",
    "",
    `Дата: ${date}`,
    `Проверено volatile: ${scannedCount}`,
    `Найдено: ${issues.length}`,
    "",
  ];

  if (top.length === 0) {
    lines.push("✅ Проблем не найдено (stale / backlog / contradictions).");
    return lines.join("\n");
  }

  top.forEach((issue, index) => {
    const url = `${origin}${guidePath(issue.slug)}`;
    lines.push(`${index + 1}. [${severityLabel(issue.severity)}] ${volatileGuideTitle(issue.slug)}`);
    lines.push(`   ${issue.issue}`);
    lines.push(`   «${issue.excerpt}»`);
    lines.push(`   → ${issue.suggestedAction}`);
    lines.push(`   ${url}`);
    lines.push("");
  });

  if (issues.length > MAX_ISSUES_PER_MESSAGE) {
    lines.push(`… и ещё ${issues.length - MAX_ISSUES_PER_MESSAGE} (npm run guides:volatile-factcheck)`);
  }

  return lines.join("\n").trim();
}

export async function notifyVolatileFactcheckIssues(
  issues: VolatileFactcheckIssue[],
  scannedCount: number
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const chatId = factcheckNotifyTelegramChatId();
  if (!chatId) {
    return { success: false, skipped: true, error: "FACTCHECK_NOTIFY_TELEGRAM_CHAT_ID missing" };
  }

  const text = formatVolatileFactcheckTelegramDigest(issues, scannedCount);
  return sendTelegramPlainToChat(chatId, text);
}

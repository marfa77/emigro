import { sendOwnerTelegramDm } from "@/lib/telegram";
import { publicSiteUrl } from "@/lib/site-url";
import { guidePath } from "@/lib/guides/load";
import type { VolatileFactcheckIssue } from "@/lib/guides/volatile-factcheck";
import { volatileGuideTitle } from "@/lib/guides/volatile-factcheck";

const MAX_ISSUES_PER_MESSAGE = 5;
const NOTIFY_NOISE_THRESHOLD = 20;

/** Chat id for volatile fact-check DMs — same as sendOwnerTelegramDm (news bot DM). */
export function factcheckNotifyTelegramChatId(): string | undefined {
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

/** Issues worth a Telegram ping — excludes noisy community_signals and low-confidence contradictions. */
export function filterNotifyableFactcheckIssues(issues: VolatileFactcheckIssue[]): VolatileFactcheckIssue[] {
  return issues.filter((issue) => {
    if (issue.severity === "critical") return true;
    if (issue.notifyPriority) return true;
    if (issue.issue.startsWith("community_signals")) return false;
    return false;
  });
}

export function shouldSendFactcheckTelegram(issues: VolatileFactcheckIssue[]): {
  send: boolean;
  notifyIssues: VolatileFactcheckIssue[];
  reason?: string;
} {
  const actionable = filterNotifyableFactcheckIssues(issues);
  if (actionable.length === 0) {
    return { send: false, notifyIssues: [], reason: "no actionable issues" };
  }

  const critical = actionable.filter((i) => i.severity === "critical");
  if (issues.length > NOTIFY_NOISE_THRESHOLD && critical.length === 0) {
    const highPriority = actionable.filter((i) => i.notifyPriority);
    if (highPriority.length === 0) {
      return {
        send: false,
        notifyIssues: [],
        reason: `>${NOTIFY_NOISE_THRESHOLD} issues, mostly noise — skipped DM`,
      };
    }
    return { send: true, notifyIssues: highPriority };
  }

  return { send: true, notifyIssues: actionable };
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
): Promise<{ success: boolean; error?: string; skipped?: boolean; reason?: string }> {
  const { send, notifyIssues, reason } = shouldSendFactcheckTelegram(issues);
  if (!send) {
    return { success: true, skipped: true, reason };
  }

  const text = formatVolatileFactcheckTelegramDigest(notifyIssues, scannedCount);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success && result.error?.includes("TELEGRAM_PRIVATE_CHAT_ID")) {
    return { success: false, skipped: true, error: result.error };
  }
  return result;
}

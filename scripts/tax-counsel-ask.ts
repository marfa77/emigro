/**
 * Local counsel dry-run. Requires Supabase + GEMINI_API_KEY unless you only run test:tax-counsel-empty.
 *
 * Usage:
 *   npx tsx scripts/tax-counsel-ask.ts -- "у меня 200 дней PT и 100 AE — что проверить?"
 *
 * Env:
 *   TAX_COUNSEL_TELEGRAM_USER_ID — real user with ledger rows (default: unset → error)
 */

import { answerCounsel, formatCounselReplyHtml } from "../lib/tax-cockpit/counsel";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dash = args.indexOf("--");
  const question =
    dash >= 0 ? args.slice(dash + 1).join(" ").trim() : args.join(" ").trim();

  if (!question) {
    console.error('Usage: npx tsx scripts/tax-counsel-ask.ts -- "ваш вопрос"');
    process.exit(1);
  }

  const userIdRaw = process.env.TAX_COUNSEL_TELEGRAM_USER_ID?.trim();
  if (!userIdRaw) {
    console.error("Set TAX_COUNSEL_TELEGRAM_USER_ID to a Telegram user id with ledger data.");
    process.exit(1);
  }

  const telegramUserId = Number(userIdRaw);
  const year = Number(process.env.TAX_COUNSEL_YEAR?.trim() || new Date().getUTCFullYear());

  const answer = await answerCounsel({ telegramUserId, year, userText: question });

  console.log(JSON.stringify({ refused: answer.refused, countryFocus: answer.countryFocus }, null, 2));
  console.log("\n--- HTML preview ---\n");
  console.log(formatCounselReplyHtml(answer.text, answer.sources ?? []));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

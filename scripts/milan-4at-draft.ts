#!/usr/bin/env npx tsx
/**
 * Soft expert drafts for @milan_4at.
 *
 * Usage:
 *   npm run milan4at:draft -- "как получить codice fiscale в Милане?"
 *   echo "вопрос..." | npm run milan4at:draft
 *   npm run milan4at:draft -- --tg "вопрос..."   # also DM admin Telegram
 *   npm run milan4at:draft -- --json "вопрос..."
 */
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { draftMilan4atReply, formatMilan4atDraftForHuman } from "@/lib/milan-4at/draft";
import { sendStatsBotMessage, telegramAdminChatIds } from "@/lib/telegram/admin-bot";

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return "";
  const chunks: Buffer[] = [];
  for await (const c of process.stdin) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8").trim();
}

async function main() {
  const argv = process.argv.slice(2);
  const asJson = argv.includes("--json");
  const toTg = argv.includes("--tg");
  const positional = argv.filter((a) => !a.startsWith("--")).join(" ").trim();
  const question = positional || (await readStdin());

  if (!question) {
    console.error(
      'Usage: npm run milan4at:draft -- "вопрос из @milan_4at"\n' +
        "       echo \"вопрос\" | npm run milan4at:draft\n" +
        "       npm run milan4at:draft -- --tg \"вопрос\""
    );
    process.exit(1);
  }

  const draft = draftMilan4atReply(question);
  const text = formatMilan4atDraftForHuman(draft, question);

  if (asJson) {
    console.log(JSON.stringify({ question, ...draft }, null, 2));
  } else {
    console.log(text);
  }

  if (toTg) {
    const admins = [...telegramAdminChatIds()];
    if (!admins.length) {
      console.error("\n[tg] TELEGRAM_ADMIN_CHAT_ID / TELEGRAM_PRIVATE_CHAT_ID not set");
      process.exit(2);
    }
    for (const chatId of admins) {
      const res = await sendStatsBotMessage(chatId, text, { disableWebPagePreview: true });
      if (!res.success) {
        console.error(`[tg] fail ${chatId}: ${res.error}`);
        process.exit(2);
      }
      console.error(`[tg] sent → ${chatId}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * setMyCommands for @emigro_chat_bot — persistent menu labels as slash commands.
 *
 *   npx tsx scripts/set-telegram-commands.ts
 *   npx tsx scripts/set-telegram-commands.ts --delete
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

function botToken(): string {
  return (
    process.env.EMIGRO_CHAT_BOT_TOKEN ||
    process.env.EMIGRO_NEWS_BOT_TOKEN ||
    process.env.EMIGRO_BOT_TOKEN ||
    ""
  ).trim();
}

const COMMANDS = [
  { command: "start", description: "Меню" },
  { command: "news", description: "Новости" },
  { command: "assist", description: "Помощь" },
  { command: "property", description: "Недвижка" },
  { command: "chat", description: "Чат города" },
];

async function main(): Promise<number> {
  const token = botToken();
  if (!token) {
    console.error("EMIGRO_CHAT_BOT_TOKEN is not set");
    return 1;
  }
  const base = `https://api.telegram.org/bot${token}`;
  const deleteCommands = process.argv.includes("--delete");
  const res = await fetch(`${base}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commands: deleteCommands ? [] : COMMANDS }),
  });
  const data = (await res.json()) as { ok?: boolean; description?: string };
  if (!data.ok) {
    console.error("setMyCommands failed:", data);
    return 1;
  }
  console.log(deleteCommands ? "Commands cleared" : "Commands set:", COMMANDS.map((c) => `/${c.command}`).join(" "));
  return 0;
}

main().then((code) => process.exit(code));

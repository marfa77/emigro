#!/usr/bin/env npx tsx
/**
 * Preview (default) or publish a Threads reply-chain.
 *
 * Default = dry-run only (prints posts, no API write).
 * Live publish requires BOTH:
 *   THREADS_AUTO_PUBLISH=1 in .env
 *   --force-publish on CLI
 *
 *   npm run threads:preview -- --country=Португалия --flag=🇵🇹 \
 *     --headline="ARI 2021–22: 5 лет ждали паспорт" \
 *     --slide="Clock с cartão…" --slide="AIMA backlog…" \
 *     --page=https://www.emigro.online/ru/news/...
 *
 *   npm run threads:preview -- --from-repost   # sample grey-zone shape
 */
import { config } from "dotenv";
import { resolve } from "path";
import {
  composeThreadsChain,
  formatThreadsChainPreview,
  publishThreadsChain,
} from "../lib/threads";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

function argsMulti(name: string): string[] {
  return process.argv
    .filter((a) => a.startsWith(`--${name}=`))
    .map((a) => a.slice(name.length + 3).trim())
    .filter(Boolean);
}

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const fromSample = process.argv.includes("--from-repost");

  const country = arg("country") || (fromSample ? "Португалия" : "");
  const flag = arg("flag") || (fromSample ? "🇵🇹" : "");
  const headline =
    arg("headline") ||
    (fromSample
      ? "ARI / Golden Visa 2021–22: ждали 5 лет до паспорта — теперь серая зона"
      : "");
  const slides = argsMulti("slide").length
    ? argsMulti("slide")
    : fromSample
      ? [
          "Lei da Nacionalidade подняла срок до 10 лет; отсчёт — с выдачи residence card, не с подачи.",
          "Кто подал nationality в IRN до 18.05.2026 — под старыми правилами; без файла и без cartão — зависли в backlog AIMA.",
          "Consortium юристов: жалоба Provedoria + угроза иска осенью 2026 — следите за первоисточниками ECO / Portugal News.",
        ]
      : [];
  const page = arg("page");
  const telegram = arg("telegram");
  const ctaMode = (arg("cta") as "page" | "telegram" | "both" | undefined) || undefined;

  if (!country || !headline) {
    console.error(`Usage:
  npm run threads:preview -- --from-repost
  npm run threads:preview -- --country=Португалия --flag=🇵🇹 --headline="…" --slide="…" [--page=URL]

Live (disabled by default):
  THREADS_AUTO_PUBLISH=1 npm run threads:preview -- --from-repost --force-publish`);
    process.exit(1);
  }

  const items = composeThreadsChain({
    countryRu: country,
    flag,
    headline,
    slides,
    pageUrl: page,
    telegramUrl: telegram,
    ctaMode,
  });

  console.log(formatThreadsChainPreview(items));
  console.log("\n———\n");

  const result = await publishThreadsChain({
    items,
    forcePublish,
  });

  if (result.dryRun) {
    console.log("DRY-RUN: nothing posted (omit --force-publish and keep THREADS_AUTO_PUBLISH≠1).");
    return;
  }

  console.log("PUBLISHED ids:", result.publishedIds.join(", "));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

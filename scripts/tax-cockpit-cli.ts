/**
 * Offline Tax Cockpit for Pavel — same core as @emigro_chat_bot «Налоги».
 *
 * Usage:
 *   npx tsx scripts/tax-cockpit-cli.ts ledger --user <telegramId> --year 2026
 *   npx tsx scripts/tax-cockpit-cli.ts report --user <telegramId> --year 2026
 *   npx tsx scripts/tax-cockpit-cli.ts ask --user <telegramId> --year 2026 -- "вопрос"
 */

import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

type CliOpts = { user: number; year: number; question?: string };

function usage(): never {
  console.error(`Usage:
  npx tsx scripts/tax-cockpit-cli.ts ledger --user <telegramId> --year <yyyy>
  npx tsx scripts/tax-cockpit-cli.ts report --user <telegramId> --year <yyyy>
  npx tsx scripts/tax-cockpit-cli.ts ask --user <telegramId> --year <yyyy> -- "question"

npm run tax:report -- --user <id> --year <yyyy>
npm run tax:ask -- --user <id> --year <yyyy> -- "question"`);
  process.exit(1);
}

function parseCommonArgs(argv: string[]): CliOpts {
  let user: number | undefined;
  let year: number | undefined;
  let question: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--user" && argv[i + 1]) {
      user = Number(argv[++i]);
    } else if (a === "--year" && argv[i + 1]) {
      year = Number(argv[++i]);
    } else if (a === "--") {
      question = argv.slice(i + 1).join(" ").trim();
      break;
    }
  }

  if (!user || !Number.isFinite(user) || user <= 0) usage();
  if (!year || !Number.isFinite(year) || year < 2020 || year > 2100) {
    year = new Date().getUTCFullYear();
  }

  return { user, year, question };
}

async function cmdLedger(opts: CliOpts): Promise<void> {
  const { ensureLedger, listPresence, daysByCountry } = await import("../lib/tax-cockpit/ledger");
  const ledger = await ensureLedger(opts.user, opts.year);
  const intervals = await listPresence(ledger.id);
  const totals = await daysByCountry(opts.user, opts.year);
  console.log(
    JSON.stringify(
      {
        ledger: {
          id: ledger.id,
          telegramUserId: ledger.telegramUserId,
          taxYear: ledger.taxYear,
          updatedAt: ledger.updatedAt,
        },
        intervals,
        daysByCountry: totals,
      },
      null,
      2
    )
  );
}

async function cmdReport(opts: CliOpts): Promise<void> {
  const { ensureLedger, listPresence } = await import("../lib/tax-cockpit/ledger");
  const { evaluateResidency } = await import("../lib/tax-cockpit/residency");
  const { formatResidencyReportHtml } = await import("../lib/tax-cockpit/report");

  const ledger = await ensureLedger(opts.user, opts.year);
  const intervals = await listPresence(ledger.id);
  const evaluation = evaluateResidency(opts.year, intervals);
  console.log(formatResidencyReportHtml(evaluation));
}

async function cmdAsk(opts: CliOpts): Promise<void> {
  if (!opts.question) usage();
  const { answerCounsel, formatCounselReplyHtml } = await import("../lib/tax-cockpit/counsel");
  const started = Date.now();
  const answer = await answerCounsel({
    telegramUserId: opts.user,
    year: opts.year,
    userText: opts.question,
  });
  const html = formatCounselReplyHtml(answer.text, answer.sources ?? []);
  const plain = html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  console.log(plain);
  if (answer.refused) console.error("\n[refused: empty ledger or invalid question]");
  if (answer.countryFocus?.length) {
    console.error(`\n[country_focus: ${answer.countryFocus.join(", ")}]`);
  }
  console.error(`\n[${Math.round((Date.now() - started) / 1000)}s]`);
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  if (!command) usage();

  const opts = parseCommonArgs(rest);

  switch (command) {
    case "ledger":
      await cmdLedger(opts);
      break;
    case "report":
      await cmdReport(opts);
      break;
    case "ask":
      await cmdAsk(opts);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      usage();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import assert from "node:assert/strict";
import {
  EMPTY_LEDGER_REFUSE_RU,
  answerCounsel,
} from "../lib/tax-cockpit/counsel";
import type { TaxLedger } from "../lib/tax-cockpit/ledger";
import type { PresenceInterval } from "../lib/tax-cockpit/types";

async function main(): Promise<void> {
  const fakeLedger: TaxLedger = {
    id: "00000000-0000-4000-8000-000000000001",
    telegramUserId: 1,
    taxYear: 2026,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let geminiCalled = false;

  const result = await answerCounsel(
    { telegramUserId: 1, year: 2026, userText: "где я резидент?" },
    {
      ensureLedger: async () => fakeLedger,
      listPresence: async () => [] as PresenceInterval[],
      runAgent: async () => {
        geminiCalled = true;
        return { text: "should not run", model: "mock", sources: [] };
      },
    }
  );

  assert.equal(geminiCalled, false);
  assert.equal(result.refused, true);
  assert.equal(result.text, EMPTY_LEDGER_REFUSE_RU);
  console.log("ok tax-counsel-empty");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

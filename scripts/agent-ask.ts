/** Dry-run the owner marketing agent locally: npm run agent:ask -- "вопрос" */
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

async function main() {
  const question = process.argv.slice(2).join(" ").trim();
  if (!question) throw new Error('Usage: npm run agent:ask -- "вопрос"');
  const { runAgentWithFallback } = await import("../lib/telegram/bot/agent/gemini");
  const { agentSystemPrompt } = await import("../lib/telegram/bot/agent/prompt");
  const { AGENT_FUNCTIONS, callAgentTool } = await import("../lib/telegram/bot/agent/tools");

  const started = Date.now();
  const result = await runAgentWithFallback({
    system: agentSystemPrompt({ now: new Date().toISOString(), ownerName: "Павел" }),
    history: [],
    userParts: [{ text: question }],
    functions: AGENT_FUNCTIONS,
    onCall: async (name, args) => {
      console.error(`→ ${name} ${JSON.stringify(args)}`);
      return callAgentTool(name, args);
    },
  });
  console.log(result.text);
  if (result.sources.length) console.log(`\nИсточники: ${result.sources.map((s) => s.title).join(" · ")}`);
  console.error(`\n[${result.model}, ${Math.round((Date.now() - started) / 1000)}s]`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

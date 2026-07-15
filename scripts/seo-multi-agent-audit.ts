#!/usr/bin/env tsx
/**
 * Multi-agent SEO / GEO / AEO / Funnel audit via OpenRouter (Grok 4.5 by default).
 *
 * Three specialist agents + synthesizer:
 *   1. SEO + GEO — metadata, schema, geo targeting, duplicates
 *   2. AEO + LLM Design — llms.txt, citation prompts, AI discoverability
 *   3. Funnel — wizard CTAs, conversion paths, attribution
 *
 * Usage:
 *   npm run seo:multi-agent-audit
 *   npm run seo:multi-agent-audit -- --url https://www.emigro.online
 *   npm run seo:multi-agent-audit -- --dry-run
 *   npm run seo:multi-agent-audit -- --model x-ai/grok-4.5 --out reports/seo-audit.md
 *   npm run seo:multi-agent-audit -- --agent seo-geo
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runMultiAgentSeoAudit } from "../lib/seo/audit/run";
import type { AgentRole } from "../lib/seo/audit/types";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const has = (flag: string) => args.includes(flag);

  const agentArg = get("--agent");
  const validAgents: AgentRole[] = ["seo-geo", "aeo-llm", "funnel"];
  const agents = agentArg && validAgents.includes(agentArg as AgentRole)
    ? [agentArg as AgentRole]
    : undefined;

  const date = new Date().toISOString().slice(0, 10);
  const defaultOut = `reports/seo-multi-agent-audit-${date}.md`;

  return {
    baseUrl: get("--url") || process.env.EMIGRO_SEO_AUDIT_SITE_URL,
    model: get("--model") || process.env.EMIGRO_SEO_AUDIT_MODEL,
    outPath: has("--out") ? get("--out") : defaultOut,
    dryRun: has("--dry-run"),
    agents,
    noWrite: has("--no-write"),
  };
}

async function main() {
  const opts = parseArgs();

  console.log("=== Emigro Multi-Agent SEO Audit ===\n");
  if (opts.dryRun) console.log("(dry-run: context only, no LLM calls)\n");

  const result = await runMultiAgentSeoAudit({
    baseUrl: opts.baseUrl,
    model: opts.model,
    agents: opts.agents,
    outPath: opts.noWrite || opts.dryRun ? undefined : opts.outPath,
    dryRun: opts.dryRun,
    onProgress: (msg) => console.log(msg),
  });

  if (opts.dryRun) {
    console.log("\n--- Context summary ---");
    console.log(`Base: ${result.context.baseUrl}`);
    console.log(`Probes OK: ${result.context.probes.filter((p) => p.ok).length}/${result.context.probes.length}`);
    console.log(`Citation: ${result.context.citationChecks.filter((c) => c.ok).length}/${result.context.citationChecks.length}`);
    console.log(`Funnel issues: ${result.context.funnelIssues.length}`);
    console.log(`Duplicate titles: ${result.context.duplicateTitles.length} groups`);
    return;
  }

  if (result.synthesis) {
    console.log("\n--- Executive Summary ---\n");
    console.log(result.synthesis.executiveSummary);
    console.log(`\nOverall: ${result.synthesis.overallScore}/100`);
    console.log("\nTop backlog items:");
    for (const item of result.synthesis.prioritizedBacklog.slice(0, 5)) {
      console.log(`  [${item.priority}] ${item.item} (${item.owner})`);
    }
  }

  if (!opts.noWrite && opts.outPath) {
    console.log(`\nFull report: ${resolve(opts.outPath)}`);
  } else if (result.markdown) {
    console.log("\n--- Report preview (first 80 lines) ---\n");
    console.log(result.markdown.split("\n").slice(0, 80).join("\n"));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

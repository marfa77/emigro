import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { DEFAULT_AUDIT_MODEL } from "@/lib/llm/openrouter";
import { collectAuditContext } from "./collect-context";
import { formatReportMarkdown, runAgent, runSynthesizer } from "./agents";
import type { AgentReport, AgentRole, AuditContext, SynthesisReport } from "./types";

export type AuditRunOptions = {
  baseUrl?: string;
  model?: string;
  agents?: AgentRole[];
  outPath?: string;
  dryRun?: boolean;
  onProgress?: (msg: string) => void;
};

export type AuditRunResult = {
  context: AuditContext;
  agents: AgentReport[];
  synthesis?: SynthesisReport;
  markdown?: string;
  model: string;
};

const ALL_AGENTS: AgentRole[] = ["seo-geo", "aeo-llm", "funnel"];

export async function runMultiAgentSeoAudit(options: AuditRunOptions = {}): Promise<AuditRunResult> {
  const log = options.onProgress ?? (() => {});
  const model = options.model || DEFAULT_AUDIT_MODEL();
  const roles = options.agents?.length ? options.agents : ALL_AGENTS;

  log("Collecting audit context (live probes + deterministic checks)...");
  const context = await collectAuditContext(options.baseUrl);
  log(`Context collected: ${context.probes.filter((p) => p.ok).length}/${context.probes.length} endpoints OK`);

  if (options.dryRun) {
    return { context, agents: [], model };
  }

  log(`Running ${roles.length} agents in parallel (${model})...`);
  const agents = await Promise.all(roles.map((role) => runAgent(role, context, model)));

  for (const agent of agents) {
    log(`  ✓ ${agent.roleLabel}: ${agent.score}/100 (${agent.criteria.length} criteria)`);
  }

  log("Synthesizing executive report...");
  const synthesis = await runSynthesizer(context, agents, model);
  log(`  ✓ Overall score: ${synthesis.overallScore}/100`);

  const markdown = formatReportMarkdown(context, agents, synthesis, model);

  if (options.outPath) {
    const abs = resolve(options.outPath);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, markdown, "utf8");
    log(`Report written: ${abs}`);
  }

  return { context, agents, synthesis, markdown, model };
}

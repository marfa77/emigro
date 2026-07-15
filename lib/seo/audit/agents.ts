import { openrouterJson, DEFAULT_AUDIT_MODEL } from "@/lib/llm/openrouter";
import type { AgentReport, AgentRole, AuditContext, SynthesisReport } from "./types";
import { formatContextForAgent } from "./collect-context";

const AGENT_SCHEMA = `{
  "role": "seo-geo | aeo-llm | funnel",
  "roleLabel": "string",
  "score": 0-100,
  "criteria": [
    {
      "id": "string",
      "criterion": "string",
      "status": "pass | warn | fail",
      "priority": "P0 | P1 | P2 | P3",
      "evidence": "string with concrete URLs or data points",
      "recommendation": "optional actionable fix"
    }
  ],
  "summary": "2-4 sentences",
  "strengths": ["string"],
  "gaps": ["string"]
}`;

const SYNTHESIS_SCHEMA = `{
  "date": "ISO date",
  "scope": "string",
  "executiveSummary": "3-5 sentences for leadership",
  "overallScore": 0-100,
  "scoreTable": [
    { "dimension": "string", "score": 0-100, "status": "pass|warn|fail", "notes": "string" }
  ],
  "prioritizedBacklog": [
    { "priority": "P0|P1|P2|P3", "item": "string", "owner": "frontend|ops|content|design|product", "sourceAgent": "seo-geo|aeo-llm|funnel" }
  ],
  "quickWins": ["string"],
  "strategicRecommendations": ["string"],
  "portugalVsSpain": "optional comparison paragraph"
}`;

const AGENT_PROMPTS: Record<AgentRole, { label: string; system: string }> = {
  "seo-geo": {
    label: "SEO + GEO Specialist",
    system: `You are a senior SEO and GEO (geographic targeting) auditor for Emigro — a Russian-language B2C relocation navigator (VNЖ/citizenship in EU).

Audit scope:
- Technical SEO: title, meta description, canonical, OG/Twitter, robots, sitemaps
- Schema.org: CollectionPage, Article, FAQPage, Place, GeoCoordinates, BreadcrumbList
- GEO targeting: Portugal satellite = Porto/Norte (NOT Lisbon as primary); Spain = Valencia/Comunitat Valenciana
- Internal linking: corridor ↔ satellite, cross-country links, main /ru hub
- Duplicate titles/descriptions across indexable pages
- hreflang (single-locale ru-RU is OK if consistent)
- Content index depth: PT vs ES satellite note volume

Use ONLY evidence from the provided JSON context. Do not invent URLs or metrics.
Score 0-100 for your dimension. Be strict but fair — Emigro already has mature SEO infrastructure.

Return valid JSON matching this schema:
${AGENT_SCHEMA}`,
  },
  "aeo-llm": {
    label: "AEO + LLM Design Specialist",
    system: `You are a senior AEO/AUO (Answer Engine Optimization) and LLM discoverability auditor for Emigro.

Audit scope:
- llms.txt, llms-full.txt, llm-sitemap.xml completeness
- Citation prompts (PixID pattern): unbranded Q&A blocks with UTM links
- AI Answer Card, LLM High-Intent section, program index for AI
- sr-only ai:description blocks on hub/notes/tags
- FAQPage + SpeakableSpecification schema for voice/AI answers
- robots.ts AI crawler allowlist (GPTBot, PerplexityBot, ClaudeBot, etc.)
- LLM design: structured data for AI citation, origin hub /ru/rossiyane, wizard deep links
- UTM attribution (utm_source=llm) for LLM traffic measurement

Use ONLY evidence from the provided JSON context. Do not invent data.
Score 0-100. Emigro targets LLM citation as a growth channel — evaluate citation-readiness.

Return valid JSON matching this schema:
${AGENT_SCHEMA}`,
  },
  funnel: {
    label: "Conversion Funnel Specialist",
    system: `You are a conversion funnel auditor for Emigro's wizard-led acquisition model.

Audit scope:
- Wizard funnel: every primary CTA should resolve to /ru/wizard or corridor wizard
- Guide cta_primary → resolveGuideWizardHref correctness
- Landing page CTAs ("Подобрать", wizard links) on /ru, corridor pages, satellites
- Funnel paths: homepage → wizard, guides → wizard, corridor → wizard, satellite → corridor/wizard
- LLM → site attribution path (utm_source=llm → wizard)
- Missing satellite links on main /ru hub (PT vs ES parity)
- Telegram deep links and discussion group CTAs (if visible in page probes)
- Drop-off risks: broken links, CTAs pointing to non-wizard destinations

Use ONLY evidence from the provided JSON context.
Score 0-100 for funnel health and conversion path clarity.

Return valid JSON matching this schema:
${AGENT_SCHEMA}`,
  },
};

export async function runAgent(
  role: AgentRole,
  context: AuditContext,
  model = DEFAULT_AUDIT_MODEL()
): Promise<AgentReport> {
  const { label, system } = AGENT_PROMPTS[role];
  const user = `Audit Emigro (${context.baseUrl}) as the ${label}.

Context (live probes + deterministic checks):
${formatContextForAgent(context)}

Return JSON with role="${role}" and roleLabel="${label}". Include at least 8 criteria with concrete evidence.`;

  const { data } = await openrouterJson<AgentReport>(model, system, user, 12288);
  return { ...data, role, roleLabel: data.roleLabel || label };
}

export async function runSynthesizer(
  context: AuditContext,
  agentReports: AgentReport[],
  model = DEFAULT_AUDIT_MODEL()
): Promise<SynthesisReport> {
  const system = `You are the lead SEO/GEO/AEO strategist synthesizing three specialist audit reports for Emigro leadership.

Merge findings into one executive report. Deduplicate overlapping items. Prioritize by business impact for a B2C relocation SaaS.

Dimensions to score in scoreTable:
- SEO metadata
- GEO targeting
- AEO / LLM discoverability
- Internal linking
- Content index depth
- Conversion funnel

overallScore = weighted average (funnel and AEO matter as much as classic SEO).

Return valid JSON matching:
${SYNTHESIS_SCHEMA}`;

  const user = `Synthesize these agent reports for ${context.baseUrl} (collected ${context.collectedAt}).

Agent reports:
${JSON.stringify(agentReports, null, 2)}

Context summary:
- Citation prompts: ${context.citationChecks.filter((c) => c.ok).length}/${context.citationChecks.length} passed
- Funnel issues: ${context.funnelIssues.length}
- Duplicate title groups: ${context.duplicateTitles.length}
- Portugal: ${context.portugalUrl}, Spain: ${context.spainUrl}`;

  const { data } = await openrouterJson<SynthesisReport>(model, system, user, 12288);
  return {
    ...data,
    date: data.date || new Date().toISOString().slice(0, 10),
    scope: data.scope || `${context.baseUrl} + PT/ES satellites`,
  };
}

export function formatReportMarkdown(
  context: AuditContext,
  agents: AgentReport[],
  synthesis: SynthesisReport,
  model: string
): string {
  const lines: string[] = [
    `# Multi-Agent SEO / GEO / AEO / Funnel Audit`,
    ``,
    `**Date:** ${synthesis.date}`,
    `**Scope:** ${synthesis.scope}`,
    `**Model:** ${model}`,
    `**Collected:** ${context.collectedAt}`,
    ``,
    `## Executive Summary`,
    ``,
    synthesis.executiveSummary,
    ``,
    `**Overall score: ${synthesis.overallScore}/100**`,
    ``,
    `## Score Table`,
    ``,
    `| Dimension | Score | Status | Notes |`,
    `|-----------|:-----:|:------:|-------|`,
  ];

  for (const row of synthesis.scoreTable) {
    lines.push(`| ${row.dimension} | ${row.score}% | ${row.status} | ${row.notes} |`);
  }

  if (synthesis.portugalVsSpain) {
    lines.push("", "## Portugal vs Spain", "", synthesis.portugalVsSpain);
  }

  lines.push("", "## Prioritized Backlog", "", "| P | Item | Owner | Agent |", "|---|------|-------|-------|");
  for (const item of synthesis.prioritizedBacklog) {
    lines.push(`| ${item.priority} | ${item.item} | ${item.owner} | ${item.sourceAgent} |`);
  }

  lines.push("", "## Quick Wins", "");
  for (const win of synthesis.quickWins) lines.push(`- ${win}`);

  lines.push("", "## Strategic Recommendations", "");
  for (const rec of synthesis.strategicRecommendations) lines.push(`- ${rec}`);

  for (const agent of agents) {
    lines.push("", `---`, "", `## Agent: ${agent.roleLabel} (${agent.score}/100)`, "", agent.summary, "");
    lines.push("### Strengths", "");
    for (const s of agent.strengths) lines.push(`- ${s}`);
    lines.push("", "### Gaps", "");
    for (const g of agent.gaps) lines.push(`- ${g}`);
    lines.push("", "### Criteria", "", "| ID | Criterion | Status | P | Evidence |", "|----|-----------|:------:|:-:|----------|");
    for (const c of agent.criteria) {
      const ev = c.evidence.replace(/\|/g, "\\|").slice(0, 120);
      lines.push(`| ${c.id} | ${c.criterion} | ${c.status} | ${c.priority} | ${ev} |`);
    }
  }

  lines.push("", "---", "", "## Raw Context Summary", "");
  lines.push(`- Endpoints probed: ${context.probes.length} (${context.probes.filter((p) => p.ok).length} OK)`);
  lines.push(`- Pages analyzed (metadata): ${context.pagesAnalyzed}`);
  lines.push(`- Citation prompts: ${context.citationChecks.filter((c) => c.ok).length}/${context.citationChecks.length}`);
  lines.push(`- Funnel issues: ${context.funnelIssues.length}`);
  lines.push(`- llms-full lines: ${context.llmsFullLineCount}, llm-sitemap URLs: ${context.llmSitemapUrlCount}`);

  return lines.join("\n");
}

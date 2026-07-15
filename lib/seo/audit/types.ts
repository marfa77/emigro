export type AuditPriority = "P0" | "P1" | "P2" | "P3";
export type AuditStatus = "pass" | "warn" | "fail";

export type AuditCriterion = {
  id: string;
  criterion: string;
  status: AuditStatus;
  priority: AuditPriority;
  evidence: string;
  recommendation?: string;
};

export type AgentRole = "seo-geo" | "aeo-llm" | "funnel";

export type AgentReport = {
  role: AgentRole;
  roleLabel: string;
  score: number;
  criteria: AuditCriterion[];
  summary: string;
  strengths: string[];
  gaps: string[];
};

export type SynthesisReport = {
  date: string;
  scope: string;
  executiveSummary: string;
  overallScore: number;
  scoreTable: Array<{
    dimension: string;
    score: number;
    status: AuditStatus;
    notes: string;
  }>;
  prioritizedBacklog: Array<{
    priority: AuditPriority;
    item: string;
    owner: string;
    sourceAgent: AgentRole;
  }>;
  quickWins: string[];
  strategicRecommendations: string[];
  portugalVsSpain?: string;
};

export type FetchProbe = {
  url: string;
  status: number;
  ok: boolean;
  contentType?: string;
  bytes: number;
  error?: string;
};

export type PageProbe = {
  url: string;
  status: number;
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  robots?: string;
  hreflang: string[];
  jsonLdTypes: string[];
  aiDescription?: string;
  hasFaqSchema: boolean;
  hasSpeakable: boolean;
  geoSignals: string[];
  wizardCtaCount: number;
  internalLinksSample: string[];
  error?: string;
};

export type CitationCheck = {
  question: string;
  path: string;
  hasQuery: boolean;
  hasPath: boolean;
  ok: boolean;
};

export type FunnelIssue = {
  source: string;
  href: string;
  resolved: string;
};

export type DuplicateGroup = {
  value: string;
  count: number;
  samples: Array<{ url: string; source: string }>;
};

export type AuditContext = {
  collectedAt: string;
  baseUrl: string;
  portugalUrl: string;
  spainUrl: string;
  probes: FetchProbe[];
  pages: PageProbe[];
  citationChecks: CitationCheck[];
  citationMeta: {
    hasAiCard: boolean;
    hasUtm: boolean;
    hasHighIntent: boolean;
    hasOriginHub: boolean;
    hasProgramIndex: boolean;
  };
  funnelIssues: FunnelIssue[];
  guidesChecked: number;
  duplicateTitles: DuplicateGroup[];
  duplicateDescriptions: DuplicateGroup[];
  pagesAnalyzed: number;
  llmsFullLineCount: number;
  llmSitemapUrlCount: number;
  sitemapUrlCount: number;
  rubricRef: string;
};

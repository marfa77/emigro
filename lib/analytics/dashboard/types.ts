export type DashboardSurfaceKey = "core" | "portugal" | "spain" | "italy" | "thailand";

export type DailyMetricPoint = {
  dayLabel: string;
  visitors: number;
  pageViews: number;
  wizardStarted: number;
  wizardCompleted: number;
  assistClicks: number;
  communityClicks: number;
  investmentLeads: number;
};

export type SurfaceStats = {
  key: DashboardSurfaceKey;
  label: string;
  trend: DailyMetricPoint[];
  current7d: DailyMetricPoint;
  previous7d: DailyMetricPoint;
};

export type CommunityCountryStats = {
  countryKey: Exclude<DashboardSurfaceKey, "core">;
  label: string;
  signals7d: number;
  backlog: number;
  publishedNotes: number;
  published7d: number;
  activeChannels: number;
  totalChannels: number;
  spotlightDays30: number;
  latestSignalAt: string | null;
};

export type InvestmentStats = {
  pageViews7d: number;
  pageViewsPrevious7d: number;
  hubViews7d: number;
  countryViews7d: number;
  resultsViews7d: number;
  qualifierStarted7d: number;
  qualifierCompleted7d: number;
  leads7d: number;
  leadsTotal: number;
  assigned: number;
  won: number;
  lost: number;
  budgetTotalEur: number;
  topDestinations: Array<[string, number]>;
  topAssets: Array<[string, number]>;
  topOutcomes: Array<[string, number]>;
  topReadiness: Array<[string, number]>;
  topPages7d: Array<[string, number]>;
};

export type ThreadsAccountStats = {
  handle: "emigro_assist" | "emigro_invest";
  followers: number | null;
  followerTrend: Array<{ dayLabel: string; value: number }>;
  sessions7d: number;
  sessionsPrevious7d: number;
  sessions30d: number;
  trend: Array<{ dayLabel: string; sessions: number }>;
  wizardStarts: number;
  assistClicks: number;
  qualifierStarts: number;
  leads: number;
  topLandings: Array<[string, number]>;
};

export type OwnedChatStats = {
  countryKey: Exclude<DashboardSurfaceKey, "core">;
  label: string;
  members: number | null;
  previous7d: number | null;
  trend: Array<{ dayLabel: string; value: number }>;
};

export type SearchConsoleRow = {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type SearchConsoleStats = {
  available: boolean;
  error?: string;
  startDate?: string;
  endDate?: string;
  clicks: number;
  previousClicks: number;
  impressions: number;
  previousImpressions: number;
  ctr: number;
  position: number;
  trend: Array<{ dayLabel: string; clicks: number; impressions: number }>;
  topPages: SearchConsoleRow[];
  topQueries: SearchConsoleRow[];
  surfaces: Array<{ key: DashboardSurfaceKey; clicks: number; impressions: number }>;
};

export type DashboardPortfolioStats = {
  surfaces: SurfaceStats[];
  community: CommunityCountryStats[];
  ownedChats: OwnedChatStats[];
  investment: InvestmentStats;
  threadsAccounts: ThreadsAccountStats[];
  searchConsole: SearchConsoleStats;
  snapshotCapturedAt: string | null;
};

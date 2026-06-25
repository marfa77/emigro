import type { NewsTopicConfig, NewsTopicStatus } from "@/lib/news/topics/types";

export type CorridorPublishStatus = "draft" | "in_development" | "active";

export function isCorridorOnSite(status: NewsTopicStatus): boolean {
  return status === "active" || status === "in_development";
}

export function isCorridorFull(status: NewsTopicStatus): boolean {
  return status === "active";
}

export function corridorStatusLabelRu(status: NewsTopicStatus): string {
  if (status === "active") return "Полный коридор";
  if (status === "in_development") return "Коридор в разработке";
  return "Новости";
}

export function corridorStatusBadgeClass(status: NewsTopicStatus): string {
  if (status === "active") return "bg-emerald-100 text-emerald-800";
  if (status === "in_development") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-700";
}

export function topicHasLanding(topic: NewsTopicConfig): boolean {
  return Boolean(topic.sitePaths?.landing && isCorridorOnSite(topic.status));
}

export function topicHasWizard(topic: NewsTopicConfig): boolean {
  return Boolean(topic.sitePaths?.wizard && isCorridorFull(topic.status));
}

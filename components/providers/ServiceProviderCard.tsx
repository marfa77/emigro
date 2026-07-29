"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { getExamLabelForTopic, PROVIDER_CATEGORY_LABELS_RU, type ServiceProvider } from "@/lib/providers/registry";
import { getUniPrepOfferForTopic, withPrep2GoUtm, withUniPrepUtm } from "@/lib/uniprep2go/catalog";

export type ProviderPlacement =
  | "corridor_landing"
  | "digest"
  | "guide_article"
  | "guide_sidebar"
  | "satellite_ciple_note"
  | "transit_hub_landing"
  | "wizard_hub_results"
  | "wizard_corridor_results";

type Props = {
  provider: ServiceProvider;
  placement: ProviderPlacement;
  corridorSlug?: string;
  topicKey?: string;
  variant?: "default" | "compact";
};

function resolveProviderHref(provider: ServiceProvider, topicKey?: string, placement?: ProviderPlacement): string {
  const medium = placement ?? "provider_card";
  if (provider.id === "prep2go") {
    const offer = getUniPrepOfferForTopic(topicKey);
    const path = offer?.prep2goMock?.path ?? "/";
    return withPrep2GoUtm(path, {
      medium,
      campaign: topicKey ? `prep2go_${topicKey}` : "prep2go",
      content: "provider_card",
    });
  }
  if (provider.id === "uniprep2go") {
    const offer = getUniPrepOfferForTopic(topicKey);
    const path = offer?.mock?.path ?? offer?.deck?.path ?? "/mock-exams/v/citizenship";
    return withUniPrepUtm(path, {
      medium,
      campaign: topicKey ? `uniprep_${topicKey}` : "uniprep_hub",
      content: "provider_card",
    });
  }
  return provider.url;
}

export function ServiceProviderCard({
  provider,
  placement,
  corridorSlug,
  topicKey,
  variant = "default",
}: Props) {
  const examLabel = topicKey ? getExamLabelForTopic(provider, topicKey) : undefined;
  const allExams = provider.examsRu ?? [];
  const serviceLabel = provider.isFirstParty
    ? "Сервис Emigro"
    : PROVIDER_CATEGORY_LABELS_RU[provider.category];
  const href = resolveProviderHref(provider, topicKey, placement);
  const linkTarget = provider.isFirstParty ? undefined : "_blank";
  const linkRel = provider.isFirstParty ? undefined : "noopener noreferrer sponsored";
  const otherExamLabels = topicKey
    ? allExams.filter((exam) => exam.topicKey !== topicKey).map((exam) => exam.label)
    : [];

  function handleClick() {
    trackEvent("provider_click", {
      provider_id: provider.id,
      placement,
      corridor_slug: corridorSlug,
      topic_key: topicKey,
    });
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{serviceLabel}</p>
          <p className="mt-0.5 font-semibold text-slate-900">{provider.name}</p>
          {examLabel ? (
            <p className="text-sm font-medium text-corridor-700">Экзамен: {examLabel}</p>
          ) : (
            <p className="text-sm text-slate-600">{provider.taglineRu}</p>
          )}
          {otherExamLabels.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">Также: {otherExamLabels.join(", ")}</p>
          )}
        </div>
        <a
          href={href}
          target={linkTarget}
          rel={linkRel}
          onClick={handleClick}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
        >
          {provider.ctaLabelRu}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{serviceLabel}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{provider.name}</h3>
      <p className="mt-1 text-sm font-medium text-corridor-700">{provider.taglineRu}</p>
      {examLabel && (
        <p className="mt-2 inline-flex rounded-full bg-corridor-50 px-2.5 py-1 text-xs font-medium text-corridor-800">
          Экзамен: {examLabel}
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{provider.descriptionRu}</p>
      {allExams.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {allExams.map((exam) => (
            <span
              key={exam.topicKey}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            >
              {exam.label}
            </span>
          ))}
        </div>
      )}
      <a
        href={href}
        target={linkTarget}
        rel={linkRel}
        onClick={handleClick}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-700"
      >
        {provider.ctaLabelRu}
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}

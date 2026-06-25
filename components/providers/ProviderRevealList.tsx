"use client";

import { useState } from "react";
import { ServiceProviderCard, type ProviderPlacement } from "@/components/providers/ServiceProviderCard";
import {
  groupProvidersByCategory,
  PROVIDER_CATEGORY_LABELS_RU,
  type ServiceProvider,
} from "@/lib/providers/registry";

type Props = {
  visibleProviders: ServiceProvider[];
  hiddenProviders: ServiceProvider[];
  placement: ProviderPlacement;
  corridorSlug?: string;
  topicKey?: string;
  variant: "default" | "compact";
  showCategoryHeadings: boolean;
};

export function ProviderRevealList({
  visibleProviders,
  hiddenProviders,
  placement,
  corridorSlug,
  topicKey,
  variant,
  showCategoryHeadings,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const providers = expanded ? [...visibleProviders, ...hiddenProviders] : visibleProviders;
  const groups = groupProvidersByCategory(providers);
  const hiddenCount = hiddenProviders.length;

  return (
    <>
      <div className={variant === "compact" ? "space-y-3" : "mt-6 space-y-8"}>
        {groups.map((group) => (
          <div key={group.category}>
            {showCategoryHeadings && (
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {PROVIDER_CATEGORY_LABELS_RU[group.category]}
              </h3>
            )}
            <div className={variant === "compact" ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
              {group.providers.map((provider) => (
                <ServiceProviderCard
                  key={provider.id}
                  provider={provider}
                  placement={placement}
                  corridorSlug={corridorSlug}
                  topicKey={topicKey}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={
            variant === "compact"
              ? "mt-3 text-sm font-medium text-corridor-700 hover:text-corridor-800"
              : "mt-5 inline-flex rounded-lg border border-corridor-200 bg-white px-4 py-2 text-sm font-medium text-corridor-700 hover:border-corridor-400"
          }
          aria-expanded={expanded}
        >
          {expanded ? "Скрыть" : variant === "compact" ? `ещё ${hiddenCount} сервисов` : `Показать ещё (${hiddenCount})`}
        </button>
      )}
    </>
  );
}

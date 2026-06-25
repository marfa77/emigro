import { ServiceProviderCard, type ProviderPlacement } from "@/components/providers/ServiceProviderCard";
import {
  getProvidersForContext,
  groupProvidersByCategory,
  PROVIDER_CATEGORY_LABELS_RU,
} from "@/lib/providers/registry";

type Props = {
  corridorSlug?: string;
  topicKey?: string;
  placement: ProviderPlacement;
  variant?: "default" | "compact";
  title?: string;
  className?: string;
};

export function ServiceProvidersSection({
  corridorSlug,
  topicKey,
  placement,
  variant = "default",
  title = "Сервисы на маршруте",
  className,
}: Props) {
  const providers = getProvidersForContext({
    corridorSlug,
    topicKey,
    compact: variant === "compact",
  });
  if (providers.length === 0) return null;

  const groups = groupProvidersByCategory(providers);
  const showCategoryHeadings = variant === "default" && groups.length > 1;

  return (
    <section className={className}>
      {variant === "default" && <h2 className="text-2xl font-semibold">{title}</h2>}
      {variant === "default" && (
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Партнёрские сервисы для шагов на маршруте. Emigro не рекомендует и не гарантирует результат — размещение
          платное.
        </p>
      )}
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
    </section>
  );
}

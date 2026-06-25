import type { ProviderPlacement } from "@/components/providers/ServiceProviderCard";
import { ProviderRevealList } from "@/components/providers/ProviderRevealList";
import {
  getProvidersForContext,
  splitDefaultProviders,
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
  });
  if (providers.length === 0) return null;

  const { visible, hidden } = splitDefaultProviders(providers);
  const showCategoryHeadings = variant === "default" && providers.length > 1;

  return (
    <section className={className}>
      {variant === "default" && <h2 className="text-2xl font-semibold">{title}</h2>}
      {variant === "default" && (
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Помощь Emigro и партнёрские сервисы для шагов на маршруте. Emigro не оказывает юридические услуги, не
          рекомендует провайдеров и не гарантирует результат.
        </p>
      )}
      <ProviderRevealList
        visibleProviders={visible}
        hiddenProviders={hidden}
        placement={placement}
        corridorSlug={corridorSlug}
        topicKey={topicKey}
        variant={variant}
        showCategoryHeadings={showCategoryHeadings}
      />
    </section>
  );
}

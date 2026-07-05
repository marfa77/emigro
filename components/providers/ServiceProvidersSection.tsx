import type { ProviderPlacement } from "@/components/providers/ServiceProviderCard";
import { ProviderRevealList } from "@/components/providers/ProviderRevealList";
import { COUNTRY_ACCENTS } from "@/lib/brand/country-accents";
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

function defaultSectionTitle(topicKey?: string): string {
  const countryRu = topicKey ? COUNTRY_ACCENTS[topicKey]?.label : undefined;
  return countryRu ? `Сервисы в ${countryRu}` : "Справочник сервисов";
}

export function ServiceProvidersSection({
  corridorSlug,
  topicKey,
  placement,
  variant = "default",
  title,
  className,
}: Props) {
  const providers = getProvidersForContext({
    corridorSlug,
    topicKey,
  });
  if (providers.length === 0) return null;

  const { visible, hidden } = splitDefaultProviders(providers);
  const showCategoryHeadings = variant === "default" && providers.length > 1;
  const sectionTitle = title ?? defaultSectionTitle(topicKey);
  const countryRu = topicKey ? COUNTRY_ACCENTS[topicKey]?.label : undefined;

  return (
    <section className={className}>
      {variant === "default" && <h2 className="text-2xl font-semibold">{sectionTitle}</h2>}
      {variant === "default" && (
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          {countryRu
            ? `Справочник местных фирм и сервисов в ${countryRu}.`
            : "Справочник местных фирм и сервисов на маршруте."}
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

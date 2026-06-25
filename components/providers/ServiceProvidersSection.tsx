import { ServiceProviderCard, type ProviderPlacement } from "@/components/providers/ServiceProviderCard";
import { getProvidersForContext } from "@/lib/providers/registry";

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
  const providers = getProvidersForContext({ corridorSlug, topicKey });
  if (providers.length === 0) return null;

  return (
    <section className={className}>
      {variant === "default" && <h2 className="text-2xl font-semibold">{title}</h2>}
      {variant === "default" && (
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Партнёрские сервисы для шагов на маршруте. Emigro не рекомендует и не гарантирует результат — размещение
          платное.
        </p>
      )}
      <div className={variant === "compact" ? "space-y-3" : "mt-6 grid gap-4 sm:grid-cols-2"}>
        {providers.map((provider) => (
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
    </section>
  );
}

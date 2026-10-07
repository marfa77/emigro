import type { WizardFunnelContext } from "@/lib/wizard/format-telegram";

function contextLines(ctx?: WizardFunnelContext): string[] {
  if (!ctx) return [];
  return [
    ctx.geoCountryRu ? `Гео (IP): ${ctx.geoCountryRu}` : null,
    ctx.pagePath ? `Страница: ${ctx.pagePath}` : null,
    ctx.referer ? `Откуда: ${ctx.referer}` : null,
  ].filter((line): line is string => Boolean(line));
}

/** Owner DM when someone clicks a ComoStay / Tulipani link on the Italy satellite. */
export function formatComoStayClickTelegram(
  props: Record<string, string>,
  ctx?: WizardFunnelContext,
): string {
  const destination =
    props.destination === "tulipani"
      ? "Tulipani 11"
      : props.destination === "inventory"
        ? "весь каталог ComoStay"
        : props.destination || "—";
  const context = contextLines(ctx);
  return [
    "🏡 ComoStay — клик",
    "",
    `Куда: ${destination}`,
    props.guide_slug ? `Гайд: ${props.guide_slug}` : null,
    props.placement ? `Где на странице: ${props.placement}` : null,
    "Офер: 5% · код EMIGRO5",
    context.length ? `\nКонтекст:\n${context.join("\n")}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

import type { WizardFunnelContext } from "@/lib/wizard/format-telegram";

function contextLines(ctx?: WizardFunnelContext): string[] {
  if (!ctx) return [];
  return [
    ctx.geoCountryRu ? `Гео (IP): ${ctx.geoCountryRu}` : null,
    ctx.pagePath ? `Страница: ${ctx.pagePath}` : null,
    ctx.referer ? `Откуда: ${ctx.referer}` : null,
  ].filter((line): line is string => Boolean(line));
}

/** Owner DM when user clicks Assist / Route Check CTA (wizard results, hubs, etc.). */
export function formatAssistCtaClickTelegram(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): string {
  const context = contextLines(ctx);
  return [
    "🧭 Emigro Assist — клик CTA",
    "",
    `Куда: ${props.target_path ?? "—"}`,
    props.link_label ? `Текст: ${props.link_label}` : null,
    props.placement ? `Где: ${props.placement}` : null,
    props.country ? `Страна: ${props.country}` : null,
    props.program ? `Маршрут: ${props.program}` : null,
    props.locale ? `Язык: ${props.locale}` : "Язык: ru",
    props.session_id ? `Wizard session: ${props.session_id}` : null,
    context.length ? `\nКонтекст:\n${context.join("\n")}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

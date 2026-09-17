import {
  clipThreadsText,
  type ThreadsChainItem,
} from "@/lib/threads/compose";

export const THREADS_PARTNER_PIN_ID = "partner-network-2026-09";

export function threadsPartnerPageUrl(site?: string): string {
  const base = (
    site ||
    process.env.EMIGRO_PUBLIC_SITE_URL ||
    "https://www.emigro.online"
  ).replace(/\/$/, "");
  const url = new URL("/ru/partners", `${base}/`);
  url.searchParams.set("utm_source", "threads");
  url.searchParams.set("utm_medium", "pinned_post");
  url.searchParams.set("utm_campaign", "partner_network");
  url.searchParams.set("utm_content", THREADS_PARTNER_PIN_ID);
  return url.toString();
}

/**
 * Isolated B2B acquisition asset.
 *
 * The daily reach inventory must not import this module. Preview or publish it
 * only through scripts/threads-partner-pin.ts, then pin manually in Threads.
 */
export function composeThreadsPartnerPin(): ThreadsChainItem[] {
  const topicTag = "Релокация";
  const root = [
    "Emigro ищет локальных партнёров по релокации: иммиграционных юристов, релокационные агентства, специалистов по недвижимости, налогам, банкам и страховкам.",
    "Мы передаём не списки контактов, а квалифицированный запрос — только с согласия человека.",
    "Работаете по конкретной стране? Напишите географию и услуги.",
  ].join("\n\n");
  const cta = [
    "Первые передачи — бесплатный пилот. Нужны публичный профиль, лицензия или регистрация там, где она обязательна, понятный срок ответа и прозрачная CPL/revshare-модель.",
    threadsPartnerPageUrl(),
  ].join("\n");

  return [
    { text: clipThreadsText(root), role: "root", topicTag },
    { text: clipThreadsText(cta), role: "cta", topicTag },
  ];
}

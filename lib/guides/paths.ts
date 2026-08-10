import type { GuideLocale } from "@/lib/locale";

export function guidePath(slug: string, locale: GuideLocale = "ru"): string {
  return `/${locale}/guides/${slug}`;
}

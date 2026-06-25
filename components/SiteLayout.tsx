import Link from "next/link";
import { EmigroLogo } from "@/components/brand/EmigroLogo";
import { Disclaimer } from "./Disclaimer";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";

export function SiteHeader({ locale = "ru" }: { locale?: "ru" | "en" }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <EmigroLogo />
        <nav className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm text-slate-600">
          <Link href="/ru#destinations" className="hover:text-corridor-600">
            {locale === "ru" ? "Направления" : "Destinations"}
          </Link>
          <Link href="/ru/wizard" className="hover:text-corridor-600">
            {locale === "ru" ? "Подбор маршрута" : "Route finder"}
          </Link>
          <Link href="/ru/guides" className="hover:text-corridor-600">
            {locale === "ru" ? "Гайды" : "Guides"}
          </Link>
          <Link href="/ru/news" className="hover:text-corridor-600">
            {locale === "ru" ? "Новости" : "News"}
          </Link>
          <Link href="/ru/partners" className="hover:text-corridor-600">
            {locale === "ru" ? "Партнёрам" : "Partners"}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = "ru" }: { locale?: "ru" | "en" }) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600" aria-label="Подвал">
          <Link href="/ru" className="hover:text-corridor-600">
            {locale === "ru" ? "Все направления" : "All destinations"}
          </Link>
          <Link href="/ru/news" className="hover:text-corridor-600">
            {locale === "ru" ? "Новости" : "News"}
          </Link>
          <Link href="/ru/portugal" className="hover:text-corridor-600">
            {locale === "ru" ? "🇵🇹 Португалия" : "🇵🇹 Portugal"}
          </Link>
          <Link href="/ru/spain" className="hover:text-corridor-600">
            {locale === "ru" ? "🇪🇸 Испания" : "🇪🇸 Spain"}
          </Link>
          <Link href="/ru/france" className="hover:text-corridor-600">
            {locale === "ru" ? "🇫🇷 Франция" : "🇫🇷 France"}
          </Link>
          <Link href="/ru/italy" className="hover:text-corridor-600">
            {locale === "ru" ? "🇮🇹 Италия" : "🇮🇹 Italy"}
          </Link>
          <Link href="/ru/germany" className="hover:text-corridor-600">
            {locale === "ru" ? "🇩🇪 Германия" : "🇩🇪 Germany"}
          </Link>
          <Link href="/ru/netherlands" className="hover:text-corridor-600">
            {locale === "ru" ? "🇳🇱 Нидерланды" : "🇳🇱 Netherlands"}
          </Link>
          <Link href="/ru/scandinavia" className="hover:text-corridor-600">
            {locale === "ru" ? "Скандинавия" : "Scandinavia"}
          </Link>
          <Link href="/ru/guides" className="hover:text-corridor-600">
            {locale === "ru" ? "Гайды" : "Guides"}
          </Link>
          <Link href="/ru/partners" className="hover:text-corridor-600">
            {locale === "ru" ? "Партнёрам" : "Partners"}
          </Link>
          <Link href="/ru/contact" className="hover:text-corridor-600">
            {locale === "ru" ? "Контакты" : "Contact"}
          </Link>
          <Link href="/ru/privacy" className="hover:text-corridor-600">
            {locale === "ru" ? "Конфиденциальность" : "Privacy"}
          </Link>
          <Link href="/ru/terms" className="hover:text-corridor-600">
            {locale === "ru" ? "Условия" : "Terms"}
          </Link>
          <Link href="/ru/cookies" className="hover:text-corridor-600">
            Cookies
          </Link>
        </nav>
        <Disclaimer locale={locale} />
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Emigro ·{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}

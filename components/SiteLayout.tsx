import Link from "next/link";
import { EmigroLogo } from "@/components/brand/EmigroLogo";
import { MobileBottomBar, MobileNav } from "@/components/layout/MobileNav";
import { Disclaimer } from "./Disclaimer";
import { COMMUNITY_PATH } from "@/lib/community";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { getHeaderNavLinks } from "@/lib/site-nav";

export function SiteHeader({ locale = "ru" }: { locale?: "ru" | "en" }) {
  const navLinks = getHeaderNavLinks(locale);

  return (
    <>
      <header className="relative z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <EmigroLogo />
          <nav
            className="hidden gap-x-4 text-sm text-slate-600 md:flex"
            aria-label={locale === "ru" ? "Основное меню" : "Main navigation"}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-corridor-600">
                {link.label}
              </Link>
            ))}
          </nav>
          <MobileNav links={navLinks} />
        </div>
      </header>
      <MobileBottomBar locale={locale} />
    </>
  );
}

export function SiteFooter({ locale = "ru" }: { locale?: "ru" | "en" }) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 pb-20 md:pb-8">
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
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600" aria-label="Транзитные хабы">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {locale === "ru" ? "Транзитные хабы:" : "Transit hubs:"}
          </span>
          <Link href="/ru/serbia" className="hover:text-corridor-600">🇷🇸 Сербия</Link>
          <Link href="/ru/georgia" className="hover:text-corridor-600">🇬🇪 Грузия</Link>
          <Link href="/ru/montenegro" className="hover:text-corridor-600">🇲🇪 Черногория</Link>
          <Link href="/ru/armenia" className="hover:text-corridor-600">🇦🇲 Армения</Link>
          <Link href="/ru/uae" className="hover:text-corridor-600">🇦🇪 ОАЭ</Link>
          <Link href="/ru/thailand" className="hover:text-corridor-600">🇹🇭 Таиланд</Link>
        </nav>
        <Disclaimer locale={locale} />
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Emigro ·{" "}
          <a href={MAILTO_CONTACT} className="text-corridor-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          {" · "}
          <Link href={COMMUNITY_PATH} className="text-corridor-600 hover:underline">
            {locale === "ru" ? "Чат релокантов" : "Community chat"}
          </Link>
        </p>
      </div>
    </footer>
  );
}

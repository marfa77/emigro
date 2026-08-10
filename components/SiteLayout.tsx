import Link from "next/link";
import { EmigroLogo } from "@/components/brand/EmigroLogo";
import { MobileBottomBar, MobileNav } from "@/components/layout/MobileNav";
import { Disclaimer } from "./Disclaimer";
import { COMMUNITY_PATH, DISCUSSION_GROUP_LABEL } from "@/lib/community";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { ES_PATHS } from "@/lib/es/corridor";
import type { UiLocale } from "@/lib/locale";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";
import { getHeaderNavLinks } from "@/lib/site-nav";
import { safeAreaTopStyle } from "@/lib/ui/mobile";

function navAriaLabel(locale: UiLocale): string {
  if (locale === "es") return "Menú principal";
  if (locale === "en") return "Main navigation";
  return "Основное меню";
}

export function SiteHeader({ locale = "ru" }: { locale?: UiLocale }) {
  const navLinks = getHeaderNavLinks(locale);
  const homeHref = locale === "es" ? ES_PATHS.home : "/ru";

  return (
    <>
      <header
        className="relative z-50 border-b border-slate-200 bg-white"
        style={safeAreaTopStyle}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <EmigroLogo href={homeHref} />
          <nav
            className="hidden gap-x-4 text-sm text-slate-600 md:flex"
            aria-label={navAriaLabel(locale)}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-corridor-600">
                {link.label}
              </Link>
            ))}
          </nav>
          <MobileNav links={navLinks} locale={locale} />
        </div>
      </header>
      <MobileBottomBar locale={locale} />
    </>
  );
}

function EsSiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 pb-20 md:pb-8">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600" aria-label="Pie de página">
          <Link href={ES_PATHS.home} className="font-medium text-corridor-700 hover:text-corridor-600">
            Emigro ES
          </Link>
          <Link href={ES_PATHS.uruguay} className="hover:text-corridor-600">
            🇺🇾 Uruguay
          </Link>
          <Link href={ES_PATHS.ecuador} className="hover:text-corridor-600">
            🇪🇨 Ecuador
          </Link>
          <Link href={ES_PATHS.peru} className="hover:text-corridor-600">
            🇵🇪 Perú
          </Link>
          <Link href={ES_PATHS.paraguay} className="hover:text-corridor-600">
            🇵🇾 Paraguay
          </Link>
          <Link href={ES_PATHS.colombia} className="hover:text-corridor-600">
            🇨🇴 Colombia
          </Link>
          <Link href={ES_PATHS.wizard} className="hover:text-corridor-600">
            Evaluador
          </Link>
          <Link href={ES_PATHS.spain} className="hover:text-corridor-600">
            🇪🇸 España
          </Link>
          <Link href={ES_PATHS.portugal} className="hover:text-corridor-600">
            🇵🇹 Portugal
          </Link>
          <Link href={ES_PATHS.guides} className="hover:text-corridor-600">
            Guías
          </Link>
          <Link href={ES_PATHS.contact} className="hover:text-corridor-600">
            Contacto
          </Link>
          <Link href={ES_PATHS.privacy} className="hover:text-corridor-600">
            Privacidad
          </Link>
          <Link href={ES_PATHS.terms} className="hover:text-corridor-600">
            Términos
          </Link>
          <Link href="/ru" className="hover:text-corridor-600">
            Versión en ruso
          </Link>
        </nav>
        <Disclaimer locale="es" />
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

export function SiteFooter({ locale = "ru" }: { locale?: UiLocale }) {
  if (locale === "es") return <EsSiteFooter />;

  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-50 pb-20 md:pb-8">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600" aria-label="Подвал">
          <Link href={HUB_WIZARD_PATH} className="font-medium text-corridor-700 hover:text-corridor-600">
            {locale === "ru" ? "Подбор маршрута" : "Route finder"}
          </Link>
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
          <Link href="/ru/sweden" className="hover:text-corridor-600">
            {locale === "ru" ? "🇸🇪 Швеция" : "🇸🇪 Sweden"}
          </Link>
          <Link href="/ru/norway" className="hover:text-corridor-600">
            {locale === "ru" ? "🇳🇴 Норвегия" : "🇳🇴 Norway"}
          </Link>
          <Link href="/ru/finland" className="hover:text-corridor-600">
            {locale === "ru" ? "🇫🇮 Финляндия" : "🇫🇮 Finland"}
          </Link>
          <Link href="/ru/denmark" className="hover:text-corridor-600">
            {locale === "ru" ? "🇩🇰 Дания" : "🇩🇰 Denmark"}
          </Link>
          <Link href="/ru/guides" className="hover:text-corridor-600">
            {locale === "ru" ? "Гайды" : "Guides"}
          </Link>
          <Link href="/ru/role-radar" className="hover:text-corridor-600">
            Role Radar
          </Link>
          <Link href="/ru/stories" className="hover:text-corridor-600">
            {locale === "ru" ? "Истории" : "Stories"}
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
          <Link href={ES_PATHS.home} className="hover:text-corridor-600">
            {locale === "ru" ? "Español (LATAM → Europa)" : "Spanish (LATAM → Europe)"}
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
            {locale === "ru" ? DISCUSSION_GROUP_LABEL : "Discussion group"}
          </Link>
        </p>
      </div>
    </footer>
  );
}

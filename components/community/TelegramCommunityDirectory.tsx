import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { TelegramIcon } from "@/components/news/ShareIcons";
import {
  publicTelegramCountryLabel,
  publicTelegramLinksForCountry,
  PUBLIC_TELEGRAM_COMMUNITY_COUNTRIES,
} from "@/lib/telegram/public-communities";

export function TelegramCommunityDirectory() {
  return (
    <div className="space-y-8">
      {PUBLIC_TELEGRAM_COMMUNITY_COUNTRIES.map((countryKey) => {
        const countryLinks = publicTelegramLinksForCountry(countryKey);

        return (
          <section key={countryKey} aria-labelledby={`community-${countryKey}`}>
            <h2 id={`community-${countryKey}`} className="text-xl font-semibold text-slate-900">
              {publicTelegramCountryLabel(countryKey)}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {countryLinks.map((link) => (
                <li key={link.url}>
                  <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <span className="rounded-lg bg-sky-100 p-2 text-sky-700">
                        {link.kind === "channel" ? (
                          <TelegramIcon className="h-5 w-5" aria-hidden />
                        ) : (
                          <MessageCircle className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {link.kind === "channel" ? "Канал" : "Чат"}
                        </p>
                        <h3 className="mt-1 font-semibold text-slate-900">{link.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{link.description}</p>
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900"
                    >
                      Открыть в Telegram
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="text-sm text-slate-600">
        Общая лента Emigro и комментарии к постам —{" "}
        <Link href="/ru/news" className="text-corridor-600 hover:underline">
          новости на сайте
        </Link>{" "}
        и канал @Emigro_news. Это не юридическая консультация.
      </p>
    </div>
  );
}

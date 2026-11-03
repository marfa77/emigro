import { Send } from "lucide-react";
import { investBotDeepLink } from "@/lib/telegram/deep-link";
import type { InvestPageKey } from "@/lib/investment/golden-visa-2026";

/** Server-rendered Telegram entry. The sidebar form is a client component and easy to miss on first screen. */
export function InvestTelegramMatch({ pageKey }: { pageKey: InvestPageKey }) {
  const href = investBotDeepLink(pageKey, "ru");
  return (
    <section className="mt-8 rounded-2xl border border-corridor-200 bg-corridor-50 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-950">Бесплатный подбор</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
        Напишите в Telegram: бюджет, паспорт и цель. Подбор открытых программ пришлём в течение 1 рабочего дня. €0, без обязательств.
      </p>
      <a
        href={href}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 text-sm font-semibold text-white hover:bg-corridor-800"
      >
        <Send className="h-4 w-4" />
        Написать в Telegram
      </a>
    </section>
  );
}

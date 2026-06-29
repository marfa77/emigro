import type { LucideIcon } from "lucide-react";
import { Bitcoin, Building2, ExternalLink, MessageCircle } from "lucide-react";
import { GUMROAD_ROUTE_CHECK_URL } from "@/lib/site-contact";

type PaymentMethod = {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
  href?: string;
};

const METHODS: PaymentMethod[] = [
  {
    icon: ExternalLink,
    title: "Gumroad (EUR)",
    description: "€129 картой — дальше опишите цель, Emigro подберёт партнёра.",
    note: "Автоматическая оплата",
    href: GUMROAD_ROUTE_CHECK_URL,
  },
  {
    icon: Building2,
    title: "Wise (банковский перевод)",
    description: "Реквизиты EUR-счёта Wise — после согласования слота созвона.",
    note: "Вручную",
  },
  {
    icon: MessageCircle,
    title: "Telegram Stars",
    description: "Оплата через Telegram — удобно, если вы уже на связи в мессенджере.",
    note: "Вручную",
  },
  {
    icon: Bitcoin,
    title: "Криpto (USDT / USDC)",
    description: "Stablecoins в сети TRC-20 или ERC-20 — реквизиты после заявки.",
    note: "Вручную",
  },
];

export function AssistPaymentMethods() {
  return (
    <section aria-labelledby="assist-payment-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 id="assist-payment-heading" className="text-xl font-bold text-slate-950">
        Способы оплаты
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Gumroad — €129 картой сразу. Wise, Telegram Stars и crypto — реквизиты после заявки.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {METHODS.map(({ icon: Icon, title, description, note, href }) => (
          <li key={title} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 text-corridor-600 shadow-sm">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-corridor-700 hover:underline"
                      >
                        {title}
                      </a>
                    ) : (
                      title
                    )}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      note === "Автоматическая оплата"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {note}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

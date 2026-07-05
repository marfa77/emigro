import type { LucideIcon } from "lucide-react";
import { Bitcoin, Building2, MessageCircle } from "lucide-react";

type PaymentMethod = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const METHODS: PaymentMethod[] = [
  {
    icon: Building2,
    title: "Wise (банковский перевод)",
    description: "Реквизиты EUR-счёта Wise — после согласования слота созвона.",
  },
  {
    icon: MessageCircle,
    title: "Telegram Stars",
    description: "Оплата через Telegram — удобно, если вы уже на связи в мессенджере.",
  },
  {
    icon: Bitcoin,
    title: "Crypto (USDT / USDC)",
    description: "Stablecoins в сети TRC-20 или ERC-20 — реквизиты после заявки.",
  },
];

export function AssistPaymentMethods() {
  return (
    <section aria-labelledby="assist-payment-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 id="assist-payment-heading" className="text-xl font-bold text-slate-950">
        Способы оплаты
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        €129 — оплата после согласования времени созвона. Вышлем реквизиты или ссылку на выбранный способ.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {METHODS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 text-corridor-600 shadow-sm">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

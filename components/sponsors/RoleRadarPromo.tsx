import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { withRoleRadarLandingUtm } from "@/lib/role-radar";

type RoleRadarPromoProps = {
  medium: string;
  content?: string;
  compact?: boolean;
  className?: string;
};

/**
 * Sister promo for Role Radar (Telegram senior digests).
 * Links to Emigro landing — not straight to the bot.
 */
export function RoleRadarPromo({
  medium,
  content,
  compact = false,
  className = "",
}: RoleRadarPromoProps) {
  const href = withRoleRadarLandingUtm(medium, { content });

  if (compact) {
    return (
      <aside
        className={`rounded-xl border border-sky-200/80 bg-sky-50/60 px-4 py-3 text-sm text-slate-700 ${className}`}
        data-sponsor="role-radar"
      >
        <p className="font-medium text-slate-900">
          <Link href={href} className="underline decoration-sky-400/60 underline-offset-2 hover:text-sky-900">
            Role Radar
          </Link>
          {" — "}
          senior-роли под CV в Telegram (EU, UK, remote).
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`overflow-hidden rounded-2xl border border-sky-200/90 bg-gradient-to-br from-sky-50 via-white to-slate-50 shadow-sm ${className}`}
      data-sponsor="role-radar"
    >
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700/90">Сестринский продукт</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Role Radar</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
          Подборка senior-ролей под ваше резюме — в Telegram. Фильтры: EU, UK, remote и уровень.
          Бесплатный старт; Scout / Operator — по желанию (Build CV на Operator).
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-800 hover:text-sky-950"
        >
          Смотреть Role Radar
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </aside>
  );
}

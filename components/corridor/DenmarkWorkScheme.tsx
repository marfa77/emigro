import Link from "next/link";
import { isDenmarkEmploymentSlug } from "@/lib/corridor/denmark-siri";

const LINKS = [
  { href: "/ru/denmark/programs/denmark-work-permit", title: "Pay Limit Scheme", detail: "DKK 552 000 в год · обычно 1 месяц" },
  {
    href: "/ru/denmark/programs/denmark-supplementary-pay-limit",
    title: "Supplementary Pay Limit",
    detail: "DKK 446 000 в год · обычно 2 месяца",
  },
  {
    href: "/ru/denmark/programs/denmark-positive-list",
    title: "Positive List",
    detail: "должность в списке · 1 или 3 месяца",
  },
  {
    href: "/ru/denmark/programs/denmark-fast-track",
    title: "Fast-track",
    detail: "работодатель сертифицирован SIRI",
  },
] as const;

export function DenmarkWorkScheme({ slug }: { slug: string }) {
  if (!isDenmarkEmploymentSlug(slug)) return null;
  const others = LINKS.filter((item) => !item.href.endsWith(slug));

  return (
    <section className="mt-12 space-y-8">
      {slug === "denmark-work-permit" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Зарплата</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">Что именно засчитывается в зарплату DKK 552 000</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
            Порога на странице SIRI недостаточно. Pay Limit Scheme — это оффер датского работодателя, минимум 2026 года,
            рабочее время и состав зарплаты. Цифры ниже — с страницы схемы и страницы минимума, обновление порога с 1 января.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-3 font-semibold">Требование</th>
                  <th className="py-2 font-semibold">Правило SIRI, 2026</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Минимальная зарплата</td>
                  <td className="py-2">DKK 552 000 в год (DKK 46 000 в месяц на странице минимума)</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Рабочее время</td>
                  <td className="py-2">Не менее 30 часов в неделю. Годовой минимум нужен независимо от часов</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Что входит в порог</td>
                  <td className="py-2">
                    Гарантированная денежная зарплата и фиксированные надбавки, взносы в трудовую пенсию работодателя и
                    работника, оплачиваемые отпускные. При оплате в месяц учитывается отпускная надбавка 1%. При почасовой
                    оплате 12,5% сверху базовой ставки в порог не добавляют
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Что не входит</td>
                  <td className="py-2">Бесплатное жильё, автомобиль, столовая, телефон, интернет и похожие льготы</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3">Датский счёт</td>
                  <td className="py-2">
                    Зарплата на счёт в датском банке на имя заявителя. Счёт открывают в течение 180 дней после разрешения
                    или, если въезд позже, в течение 180 дней после въезда
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Условия труда</td>
                  <td className="py-2">Отпуск, срок уведомления и прочие условия не ниже датских стандартов для этой области</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {slug === "denmark-work-permit" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Срок разрешения и потеря работы</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            <li>Разрешение привязано к конкретной работе в Дании. Это не свободный ВНЖ.</li>
            <li>Контракт на четыре года или дольше: разрешение обычно на четыре года.</li>
            <li>
              Более короткий контракт: срок обычно равен сроку работы. Дополнительно дают шесть месяцев на поиск работы,
              и в эти шесть месяцев работать нельзя.
            </li>
            <li>Новый работодатель — новое разрешение. Смена роли внутри той же компании нового разрешения не требует, если зарплата остаётся не ниже Pay Limit и датских стандартов.</li>
            <li>
              О потере работы сообщают SIRI. Если увольнение произошло не по вине работника, в течение двух дней можно
              просить ещё шесть месяцев на поиск. Работать в этот период нельзя.
            </li>
            <li>
              Продление уже выданного Pay Limit — отдельная процедура SIRI. Её срок не равен сроку первого заявления.
            </li>
          </ul>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Другие рабочие схемы SIRI</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
          Зарплата ниже DKK 552 000 не означает, что рабочий ВНЖ Дании закрыт. Ниже отдельные карточки, у каждой свои
          условия и свой срок рассмотрения.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {others.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 p-4 hover:border-corridor-500"
            >
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

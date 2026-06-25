import { BookOpen, Compass, Newspaper } from "lucide-react";

const LEVELS = [
  {
    Icon: Newspaper,
    title: "Новости",
    desc: "RSS → проверка → еженедельный дайджест на русском по всем направлениям.",
    className: "border-sky-200 bg-sky-50/80",
    iconClass: "text-sky-700 bg-sky-100",
  },
  {
    Icon: Compass,
    title: "Полный коридор",
    desc: "Wizard, программы ВНЖ, справочник с источниками и интеграция с новостями.",
    className: "border-corridor-200 bg-corridor-50/80",
    iconClass: "text-corridor-800 bg-corridor-100",
  },
  {
    Icon: BookOpen,
    title: "Справочник",
    desc: "Пороги 2026, сроки гражданства, экзамены — без LLM-воды, с официальными ссылками.",
    className: "border-emerald-200 bg-emerald-50/80",
    iconClass: "text-emerald-800 bg-emerald-100",
  },
];

export function ProductLevelCards() {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      {LEVELS.map(({ Icon, title, desc, className, iconClass }) => (
        <div key={title} className={`rounded-xl border p-4 ${className}`}>
          <div className={`inline-flex rounded-lg p-2 ${iconClass}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
          <p className="mt-1.5 text-sm text-slate-600">{desc}</p>
        </div>
      ))}
    </div>
  );
}

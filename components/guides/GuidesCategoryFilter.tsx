"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GUIDE_CATEGORIES, GUIDE_AUDIENCES, type GuideCategoryId, type GuideAudienceId } from "@/lib/guides/categories";
import { tapTarget } from "@/lib/ui/mobile";

export function GuidesCategoryFilter() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("cat") ?? undefined;
  const activeAudience = searchParams.get("aud") ?? undefined;

  function hrefForCat(category?: GuideCategoryId) {
    if (!category) return activeAudience ? `/ru/guides?aud=${activeAudience}` : "/ru/guides";
    return activeAudience ? `/ru/guides?cat=${category}&aud=${activeAudience}` : `/ru/guides?cat=${category}`;
  }

  function hrefForAud(audience?: GuideAudienceId) {
    if (!audience) return activeCategory ? `/ru/guides?cat=${activeCategory}` : "/ru/guides";
    return activeCategory ? `/ru/guides?cat=${activeCategory}&aud=${audience}` : `/ru/guides?aud=${audience}`;
  }

  const chipBase = `inline-flex ${tapTarget} items-center rounded-full px-4 py-2 text-sm font-medium transition`;
  const chipActive = "bg-corridor-600 text-white shadow-sm shadow-corridor-600/25";
  const chipInactive = "border border-slate-200 bg-white text-slate-700 hover:border-corridor-300 hover:text-corridor-700";

  return (
    <div className="mt-8 space-y-3">
      <nav className="flex flex-wrap gap-2" aria-label="Категории гайдов">
        <Link href={hrefForCat()} className={`${chipBase} ${!activeCategory ? chipActive : chipInactive}`}>
          Все темы
        </Link>
        {GUIDE_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <Link
              key={category.id}
              href={hrefForCat(category.id)}
              className={`inline-flex items-center gap-2 ${chipBase} ${isActive ? chipActive : chipInactive}`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
            </Link>
          );
        })}
      </nav>

      <nav className="flex flex-wrap gap-2" aria-label="Фильтр по гражданству">
        <Link href={hrefForAud()} className={`${chipBase} ${!activeAudience ? chipActive : chipInactive}`}>
          Все паспорта
        </Link>
        {GUIDE_AUDIENCES.map((audience) => {
          const isActive = activeAudience === audience.id;
          return (
            <Link
              key={audience.id}
              href={hrefForAud(audience.id)}
              className={`inline-flex items-center gap-1.5 ${chipBase} ${isActive ? chipActive : chipInactive}`}
            >
              <span aria-hidden>{audience.flag}</span>
              {audience.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

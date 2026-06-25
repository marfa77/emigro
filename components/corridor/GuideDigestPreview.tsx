import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { DigestItem } from "@/lib/types";

type Props = {
  items: DigestItem[];
  guideHref: string;
  countryRu: string;
  limit?: number;
};

export function GuideDigestPreview({ items, guideHref, countryRu, limit = 3 }: Props) {
  const preview = items.slice(0, limit);
  if (preview.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-corridor-700">
          <BookOpen className="h-4 w-4" />
          Справочник: {countryRu}
        </p>
        <Link href={guideHref} className="text-xs text-corridor-600 hover:underline">
          Весь справочник →
        </Link>
      </div>
      <ul className="mt-4 space-y-4">
        {preview.map((item) => (
          <li key={item.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
            <p className="text-xs font-medium uppercase text-slate-500">{item.category}</p>
            <p className="mt-1 font-medium text-slate-900">{item.title_ru}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.body_ru}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

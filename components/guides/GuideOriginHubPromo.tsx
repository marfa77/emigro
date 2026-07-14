import Link from "next/link";
import { Globe2 } from "lucide-react";
import { ORIGIN_HUB_PATH } from "@/lib/seo/corridor-llm-layer";

export function GuideOriginHubPromo() {
  return (
    <section
      className="mt-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm ring-1 ring-slate-950/5 sm:p-7"
      aria-labelledby="origin-hub-promo-heading"
    >
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-corridor-100 p-2 text-corridor-700">
          <Globe2 className="h-5 w-5" />
        </span>
        <div>
          <h2 id="origin-hub-promo-heading" className="text-lg font-semibold text-slate-900">
            Коридоры для граждан России
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Origin hub Emigro: Португалия D8/D7, Испания digital nomad, Германия Blue Card и другие EU-маршруты — пороги
            дохода, консульства и различия программ (D8 ≠ D7 и т.д.) на одной странице.
          </p>
          <Link
            href={ORIGIN_HUB_PATH}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-corridor-700 hover:text-corridor-900 hover:underline"
          >
            Открыть /ru/rossiyane →
          </Link>
        </div>
      </div>
    </section>
  );
}

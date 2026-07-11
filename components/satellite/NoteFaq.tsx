import type { CommunityNoteFaq } from "@/lib/community-notes/types";
import { parseInlineMarkdown } from "@/lib/community-notes/note-body-render";

type NoteFaqProps = {
  items: CommunityNoteFaq[];
};

export function NoteFaq({ items }: NoteFaqProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10" id="faq">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">FAQ</h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {items.map((item, index) => (
          <details key={item.q} className="group px-4 py-1 sm:px-5" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3 py-3.5 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="font-medium leading-snug text-slate-900">{item.q}</span>
              <span
                className="mt-0.5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ▾
              </span>
            </summary>
            <div className="pb-4 pr-6 text-[15px] leading-relaxed text-slate-700 sm:text-base [&_a]:break-words">
              {parseInlineMarkdown(item.a)}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

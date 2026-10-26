import type { CommunityNoteLink } from "@/lib/community-notes/types";

type OfficialLinksPreviewProps = {
  links: CommunityNoteLink[];
  accentClassName?: string;
};

export function OfficialLinksPreview({
  links,
  accentClassName = "text-teal-700 underline hover:text-teal-900",
}: OfficialLinksPreviewProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Официальные источники</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {links.map((link) => (
          <li key={link.url} className="pl-1">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium leading-relaxed ${accentClassName}`}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

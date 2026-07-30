import type { CommunityNoteLink } from "@/lib/community-notes/types";
import { getLinkPreviews } from "@/lib/link-preview";
import { LinkPreviewThumb } from "@/components/satellite/LinkPreviewThumb";

type OfficialLinksPreviewProps = {
  links: CommunityNoteLink[];
  accentClassName?: string;
};

export async function OfficialLinksPreview({
  links,
  accentClassName = "text-teal-700 underline hover:text-teal-900",
}: OfficialLinksPreviewProps) {
  if (links.length === 0) return null;

  const previews = await getLinkPreviews(links.map((l) => l.url));

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Официальные источники</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const preview = previews.get(link.url) ?? {
            url: link.url,
            hostname: safeHost(link.url),
            imageUrl: null,
            siteName: null,
          };
          return (
            <li key={link.url}>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <LinkPreviewThumb
                  href={link.url}
                  hostname={preview.hostname}
                  imageUrl={preview.imageUrl}
                  label={link.title}
                  size="md"
                />
                <div className="space-y-1 p-3">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium leading-snug ${accentClassName}`}
                  >
                    {link.title}
                  </a>
                  <p className="truncate text-xs text-slate-500">{preview.hostname}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "site";
  }
}

import Image from "next/image";
import type { ComoPhoto } from "@/lib/italy/como-media";

export function ComoGuidePhoto({
  photo,
  priority = false,
}: {
  photo: ComoPhoto;
  priority?: boolean;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 768px) 736px, calc(100vw - 32px)"
        className="aspect-[3/2] h-auto w-full object-cover"
        priority={priority}
      />
      <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-600">
        {photo.caption} Photo:{" "}
        <a href={photo.creditUrl} rel="noopener noreferrer" target="_blank" className="underline">
          {photo.credit}
        </a>{" "}
        ·{" "}
        <a href={photo.licenseUrl} rel="noopener noreferrer" target="_blank" className="underline">
          {photo.license}
        </a>
      </figcaption>
    </figure>
  );
}

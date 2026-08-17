"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import type { NoteBodyImage } from "@/lib/community-notes/types";
import { NOTE_CONTENT_IMAGE_SIZES } from "@/lib/ui/mobile";

type NoteImageGalleryProps = {
  images: NoteBodyImage[];
};

/** Tall product shots / plans must not be cropped by the default 16:10 cover frame. */
function usesContainFit(image: NoteBodyImage): boolean {
  if (image.fit === "contain") return true;
  if (image.fit === "cover") return false;
  if (image.src.includes("/bottles/")) return true;
  if (image.src.includes("-symbol.webp")) return true;
  if (/still-life/i.test(image.credit ?? "")) return true;
  if (/планировк/i.test(`${image.alt} ${image.caption ?? ""}`)) return true;
  return false;
}

export function NoteImageGallery({ images }: NoteImageGalleryProps) {
  const labelId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex != null ? images[openIndex] : null;
  const anyPortrait = images.some(usesContainFit);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i == null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const showNext = useCallback(() => {
    setOpenIndex((i) => (i == null ? i : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`mt-5 grid gap-4 ${
          images.length === 1
            ? "grid-cols-1"
            : anyPortrait
              ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
              : images.length === 2
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {images.map((image, index) => {
          const contain = usesContainFit(image);
          return (
            <figure
              key={image.src}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className={`group relative block w-full cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
                  contain ? "aspect-[3/4] bg-stone-50" : "aspect-[16/10] bg-slate-100"
                }`}
                aria-label={`Увеличить: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={NOTE_CONTENT_IMAGE_SIZES}
                  className={
                    contain
                      ? "object-contain p-3 sm:p-4 transition duration-200 group-hover:scale-[1.02]"
                      : "object-cover transition duration-200 group-hover:scale-[1.02]"
                  }
                />
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-slate-900/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100 sm:opacity-100">
                  Увеличить
                </span>
              </button>
              {(image.caption || image.credit) && (
                <figcaption className="space-y-0.5 px-3 py-2.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  {image.caption && <p className="text-slate-600">{image.caption}</p>}
                  {image.credit && (
                    <p>
                      Фото:{" "}
                      {image.creditUrl ? (
                        <a
                          href={image.creditUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 underline hover:text-teal-900"
                        >
                          {image.credit}
                        </a>
                      ) : (
                        image.credit
                      )}
                    </p>
                  )}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {open && openIndex != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-3 sm:p-6"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25 sm:right-5 sm:top-5"
            aria-label="Закрыть"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 px-3 py-3 text-lg text-white hover:bg-white/25 sm:left-4"
                aria-label="Предыдущее фото"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 px-3 py-3 text-lg text-white hover:bg-white/25 sm:right-4"
                aria-label="Следующее фото"
              >
                ›
              </button>
            </>
          )}
          <div
            className="flex max-h-full w-full max-w-5xl flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto h-[min(72vh,720px)] w-full overflow-hidden rounded-lg bg-slate-900">
              <Image
                src={open.src}
                alt={open.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center text-sm text-slate-200">
              <p id={labelId} className="font-medium">
                {open.caption || open.alt}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {openIndex + 1} / {images.length}
                {open.credit ? ` · ${open.credit}` : ""}
                {images.length > 1 ? " · ← → · Esc" : " · Esc"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

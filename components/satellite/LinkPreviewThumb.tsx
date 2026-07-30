"use client";

import { useState } from "react";
import { faviconUrlForHostname } from "@/lib/link-preview";

type LinkPreviewThumbProps = {
  href: string;
  hostname: string;
  imageUrl: string | null;
  label: string;
  size?: "sm" | "md";
};

export function LinkPreviewThumb({
  href,
  hostname,
  imageUrl,
  label,
  size = "md",
}: LinkPreviewThumbProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;
  const aspect = size === "sm" ? "aspect-[16/10] w-28 sm:w-32" : "aspect-[1.91/1] w-full";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${aspect}`}
      aria-label={`Открыть сайт: ${label}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary OG hosts; onError fallback
        <img
          src={imageUrl!}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-teal-50 to-slate-200 px-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrlForHostname(hostname)}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md bg-white/80 p-1 shadow-sm"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <span className="line-clamp-2 text-[11px] font-medium leading-snug text-slate-600">
            {hostname}
          </span>
        </span>
      )}
    </a>
  );
}

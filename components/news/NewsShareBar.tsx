"use client";

import { useCallback, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { buildShareUrl, type ShareNetwork } from "@/lib/share/urls";
import {
  FacebookIcon,
  LinkedInIcon,
  TelegramIcon,
  ThreadsIcon,
  VkIcon,
  XIcon,
} from "@/components/news/ShareIcons";

type Props = {
  url: string;
  title: string;
  className?: string;
};

const NETWORKS: { id: ShareNetwork; label: string; icon: typeof XIcon; className: string }[] = [
  { id: "x", label: "X", icon: XIcon, className: "hover:border-slate-400 hover:text-slate-900" },
  { id: "threads", label: "Threads", icon: ThreadsIcon, className: "hover:border-slate-400 hover:text-slate-900" },
  { id: "telegram", label: "Telegram", icon: TelegramIcon, className: "hover:border-sky-300 hover:text-sky-600" },
  { id: "vk", label: "VK", icon: VkIcon, className: "hover:border-blue-300 hover:text-blue-600" },
  { id: "facebook", label: "Facebook", icon: FacebookIcon, className: "hover:border-blue-300 hover:text-blue-700" },
  { id: "linkedin", label: "LinkedIn", icon: LinkedInIcon, className: "hover:border-sky-300 hover:text-sky-700" },
];

export function NewsShareBar({ url, title, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 ${className}`}
      aria-label="Поделиться статьёй"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <Share2 className="h-4 w-4 text-corridor-600" aria-hidden />
          Поделиться
        </span>
        <div className="flex flex-wrap gap-2">
          {NETWORKS.map(({ id, label, icon: Icon, className: hoverClass }) => (
            <a
              key={id}
              href={buildShareUrl(id, { url, title })}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition ${hoverClass}`}
              aria-label={`Поделиться в ${label}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              copied
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-corridor-300 hover:text-corridor-700"
            }`}
            aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Скопировано</span>
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">Ссылка</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { telegramShareUrl } from "@/lib/telegram/public-url";

type ShareButtonsProps = {
  url: string;
  title: string;
  /** Optional short text appended to share payloads (Telegram, X, etc.). */
  text?: string;
  className?: string;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

function shareLinks(url: string, title: string, text?: string) {
  const message = text ? `${title} — ${text}` : title;
  return {
    x: `https://twitter.com/intent/tweet?url=${encode(url)}&text=${encode(message)}`,
    threads: `https://www.threads.net/intent/post?text=${encode(`${message}\n${url}`)}`,
    telegram: telegramShareUrl({ url, text: message }),
    vk: `https://vk.com/share.php?url=${encode(url)}&title=${encode(title)}${text ? `&comment=${encode(text)}` : ""}`,
  };
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.11.636a9.77 9.77 0 0 0-2.563-3.987C18.18 1.726 15.476 1.02 12.194 1.002h-.006c-3.028.022-5.41.894-7.077 2.597C3.323 5.347 2.481 7.762 2.457 11.997v.006c.024 4.235.866 6.65 2.654 8.398 1.667 1.703 4.049 2.575 7.077 2.597h.006c3.2-.023 5.71-.978 7.479-2.837 1.768-1.86 2.605-4.497 2.605-7.856 0-.76-.053-1.467-.158-2.113a5.66 5.66 0 0 0-.489-1.495 7.59 7.59 0 0 0-1.046-1.442 5.76 5.76 0 0 0-1.638-1.063A30.02 30.02 0 0 0 15.5.502a.36.36 0 0 0-.163.055.347.347 0 0 0-.093.366c1.073 3.599 4.325 6.324 8.246 6.316 4.115-.009 7.461-3.352 7.468-7.468.006-3.932-2.734-7.209-6.352-8.228a.352.352 0 0 0-.368.082.348.348 0 0 0-.078.354 5.76 5.76 0 0 1 1.063 1.638 7.59 7.59 0 0 1 1.046 1.442 5.66 5.66 0 0 1 .489 1.495c.105.646.158 1.353.158 2.113 0 3.359-.837 5.996-2.605 7.856z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.225 10.857 3.5 8.657 3.5 8.253c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .373.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  );
}

export function ShareButtons({ url, title, text, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const links = shareLinks(url, title, text);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  const buttonClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-corridor-300 hover:bg-corridor-50 hover:text-corridor-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corridor-600";

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-950/5 ${className}`}
      aria-label="Поделиться"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Share2 className="h-4 w-4 text-corridor-600" aria-hidden />
          Поделиться
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a href={links.x} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label="Поделиться в X">
            <XIcon className="h-4 w-4" />
          </a>
          <a href={links.threads} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label="Поделиться в Threads">
            <ThreadsIcon className="h-4 w-4" />
          </a>
          <a href={links.telegram} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label="Поделиться в Telegram">
            <TelegramIcon className="h-4 w-4" />
          </a>
          <a href={links.vk} target="_blank" rel="noopener noreferrer" className={buttonClass} aria-label="Поделиться во ВКонтакте">
            <VkIcon className="h-4 w-4" />
          </a>
          <button type="button" onClick={handleCopy} className={buttonClass} aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}>
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />}
          </button>
        </div>
        {copied ? <span className="text-sm text-emerald-700">Ссылка скопирована</span> : null}
      </div>
    </section>
  );
}

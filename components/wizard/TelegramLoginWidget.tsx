"use client";

import { useEffect, useRef } from "react";

export type TelegramLoginPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim() ?? "";

type Props = {
  onAuth: (user: TelegramLoginPayload) => void | Promise<void>;
  onError?: (message: string) => void;
  buttonSize?: "large" | "medium" | "small";
};

declare global {
  interface Window {
    onEmigroTelegramAuth?: (user: TelegramLoginPayload) => void;
  }
}

export function TelegramLoginWidget({ onAuth, onError, buttonSize = "large" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!BOT_USERNAME || !containerRef.current) return;

    window.onEmigroTelegramAuth = async (user) => {
      try {
        await onAuth(user);
      } catch {
        onError?.("Не удалось отправить отчёт в Telegram");
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME.replace(/^@/, ""));
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-onauth", "onEmigroTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      delete window.onEmigroTelegramAuth;
    };
  }, [onAuth, onError, buttonSize]);

  if (!BOT_USERNAME) {
    return (
      <p className="text-sm text-amber-800">
        Виджет Telegram не настроен: задайте <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code> (тот же бот, что{" "}
        <code>EMIGRO_CHAT_BOT_TOKEN</code>).
      </p>
    );
  }

  return <div ref={containerRef} className="min-h-[44px]" />;
}

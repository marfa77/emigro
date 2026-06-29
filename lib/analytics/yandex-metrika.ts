const DEFAULT_COUNTER_ID = 110252231;

/** Numeric counter ID from metrika.yandex.ru → Настройки → Счётчик. */
export function yandexMetrikaCounterId(): number | null {
  const raw = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim() ?? String(DEFAULT_COUNTER_ID);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export function yandexMetrikaPageUrl(pathname: string, search: string): string {
  if (typeof window === "undefined") return pathname;
  const path = search ? `${pathname}?${search}` : pathname;
  return `${window.location.origin}${path}`;
}

declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
  }
}

export function yandexMetrikaHit(counterId: number, url: string, title?: string): void {
  if (typeof window === "undefined" || !window.ym) return;
  window.ym(counterId, "hit", url, {
    title: title ?? document.title,
    referer: document.referrer,
  });
}

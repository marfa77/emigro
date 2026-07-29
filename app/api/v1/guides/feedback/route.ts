import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { listGuides } from "@/lib/guides/load";
import { sendOwnerTelegramDm } from "@/lib/telegram";

export const runtime = "nodejs";

type FeedbackKind = "liked" | "outdated";

type FeedbackBody = {
  slug?: string;
  kind?: string;
  title?: string;
  path?: string;
  note?: string;
};

const VALID_KINDS = new Set<FeedbackKind>(["liked", "outdated"]);

/** Soft per-instance throttle: slug+kind+ip → last timestamp */
const recent = new Map<string, number>();
const THROTTLE_MS = 60_000;

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function knownGuideSlug(slug: string): boolean {
  return listGuides().some((g) => g.slug === slug);
}

function formatDm(input: {
  kind: FeedbackKind;
  slug: string;
  title: string;
  path: string;
  note: string;
  ip: string;
}): string {
  const label = input.kind === "liked" ? "Понравилось" : "Информация устарела";
  const emoji = input.kind === "liked" ? "👍" : "⚠️";
  const url =
    input.path.startsWith("http")
      ? input.path
      : `https://emigro.online${input.path.startsWith("/") ? input.path : `/ru/guides/${input.slug}`}`;

  const lines = [
    `${emoji} Гайд: ${label}`,
    `Slug: ${input.slug}`,
    input.title ? `Title: ${input.title}` : null,
    `URL: ${url}`,
    input.note ? `Комментарий: ${input.note}` : null,
    `IP: ${input.ip}`,
    `UTC: ${new Date().toISOString()}`,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function POST(request: Request) {
  let body: FeedbackBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = clean(body.slug, 120);
  const kindRaw = clean(body.kind, 32) as FeedbackKind;
  const title = clean(body.title, 200);
  const path = clean(body.path, 300);
  const note = clean(body.note, 800);

  if (!slug || !VALID_KINDS.has(kindRaw)) {
    return NextResponse.json({ error: "slug and kind (liked|outdated) required" }, { status: 400 });
  }
  if (!knownGuideSlug(slug)) {
    return NextResponse.json({ error: "Unknown guide" }, { status: 404 });
  }

  const ip = clientIp(request);
  const throttleKey = `${slug}:${kindRaw}:${ip}`;
  const now = Date.now();
  const last = recent.get(throttleKey) ?? 0;
  if (now - last < THROTTLE_MS) {
    return NextResponse.json({ ok: true, throttled: true });
  }
  recent.set(throttleKey, now);
  if (recent.size > 5000) {
    for (const [k, t] of Array.from(recent.entries())) {
      if (now - t > THROTTLE_MS * 5) recent.delete(k);
    }
  }

  const text = formatDm({ kind: kindRaw, slug, title, path, note, ip });
  const tg = await sendOwnerTelegramDm(text);

  void trackServerEvent("guide_feedback", {
    slug,
    kind: kindRaw,
    telegram_ok: tg.success,
  });

  if (!tg.success) {
    console.error("[guide-feedback] telegram DM failed:", tg.error);
    return NextResponse.json(
      { error: "Не удалось отправить. Попробуйте позже." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

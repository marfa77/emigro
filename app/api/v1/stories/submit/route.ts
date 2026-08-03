import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { listGuides } from "@/lib/guides/load";
import { isStoryGenre, isStoryRole, STORY_GENRE_LABELS, STORY_ROLE_LABELS } from "@/lib/stories/genres";
import { sendOwnerTelegramDm } from "@/lib/telegram";

export const runtime = "nodejs";

type Body = {
  title?: string;
  role?: string;
  country?: string;
  genre?: string;
  body?: string;
  would_do_differently?: string;
  contact?: string;
  backlink_url?: string;
  related_guide_slug?: string;
  disagree?: boolean;
  consent?: boolean;
};

const recent = new Map<string, number>();
const THROTTLE_MS = 120_000;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function knownGuideSlug(slug: string): boolean {
  if (!slug) return true;
  return listGuides().some((g) => g.slug === slug);
}

function formatDm(input: {
  title: string;
  role: string;
  country: string;
  genre: string;
  body: string;
  wouldDoDifferently: string;
  contact: string;
  backlinkUrl: string;
  relatedGuideSlug: string;
  disagree: boolean;
  ip: string;
}): string {
  const genreLabel = isStoryGenre(input.genre) ? STORY_GENRE_LABELS[input.genre] : input.genre;
  const roleLabel = isStoryRole(input.role) ? STORY_ROLE_LABELS[input.role] : input.role;
  const bodyPreview = input.body.length > 3500 ? `${input.body.slice(0, 3500)}…` : input.body;

  return [
    input.disagree ? "✍️ Контрапункт к гайду (история)" : "✍️ Новая история читателя",
    `Заголовок: ${input.title}`,
    `Жанр: ${genreLabel}`,
    `Роль: ${roleLabel}`,
    `Страна: ${input.country}`,
    input.relatedGuideSlug ? `Гайд: ${input.relatedGuideSlug}` : null,
    `Контакт: ${input.contact}`,
    input.backlinkUrl ? `Backlink: ${input.backlinkUrl}` : null,
    "",
    "— Что бы сделал иначе —",
    input.wouldDoDifferently,
    "",
    "— Текст —",
    bodyPreview,
    "",
    `IP: ${input.ip}`,
    `UTC: ${new Date().toISOString()}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = clean(body.title, 160);
  const role = clean(body.role, 32);
  const country = clean(body.country, 80);
  const genre = clean(body.genre, 32);
  const storyBody = clean(body.body, 12000);
  const wouldDoDifferently = clean(body.would_do_differently, 2000);
  const contact = clean(body.contact, 120);
  const backlinkUrl = clean(body.backlink_url, 300);
  const relatedGuideSlug = clean(body.related_guide_slug, 120);
  const disagree = Boolean(body.disagree);

  if (!title || !country || !storyBody || !wouldDoDifferently || !contact) {
    return NextResponse.json(
      { error: "title, country, body, would_do_differently, contact required" },
      { status: 400 }
    );
  }
  if (!isStoryGenre(genre) || !isStoryRole(role)) {
    return NextResponse.json({ error: "Invalid genre or role" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }
  if (!knownGuideSlug(relatedGuideSlug)) {
    return NextResponse.json({ error: "Unknown guide slug" }, { status: 400 });
  }
  if (backlinkUrl && !/^https?:\/\//i.test(backlinkUrl)) {
    return NextResponse.json({ error: "backlink_url must start with http(s)" }, { status: 400 });
  }

  const ip = clientIp(request);
  const throttleKey = `${ip}:${contact.toLowerCase()}`;
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

  const text = formatDm({
    title,
    role,
    country,
    genre,
    body: storyBody,
    wouldDoDifferently,
    contact,
    backlinkUrl,
    relatedGuideSlug,
    disagree,
    ip,
  });

  const tg = await sendOwnerTelegramDm(text);

  void trackServerEvent("story_submitted", {
    genre,
    role,
    country,
    disagree,
    has_guide: Boolean(relatedGuideSlug),
    telegram_ok: tg.success,
  });

  if (!tg.success) {
    console.error("[stories-submit] telegram DM failed:", tg.error);
    return NextResponse.json({ error: "Не удалось отправить. Попробуйте позже." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

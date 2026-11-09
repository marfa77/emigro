/**
 * Friday morning: a short weekend list. Each line links to the detailed post
 * already in the feed. Does not publish new cards.
 */
import { eventDay, isFriday, weekendDates } from "@/lib/news/outdoor/due";
import { loadPosted, markDigest, type PostedEvent } from "@/lib/news/outdoor/posted";

export type DigestResult = {
  published: boolean;
  reason?: string;
  count?: number;
};

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ruDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1)));
}

function placeShort(location: string): string {
  return location.split(",")[0]?.trim() || "";
}

export function weekendPosts(
  posts: PostedEvent[],
  timeZone: string,
  now = new Date()
): PostedEvent[] {
  const { saturday, sunday } = weekendDates(timeZone, now);
  return posts
    .filter((post) => {
      if (!post.messageId) return false;
      const day = eventDay(post.startIso, timeZone);
      return day === saturday || day === sunday;
    })
    .sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
}

export function digestMessages(
  posts: PostedEvent[],
  timeZone: string,
  username: string,
  now = new Date()
): string[] {
  const rows = weekendPosts(posts, timeZone, now);
  if (rows.length === 0) return [];
  const { saturday, sunday } = weekendDates(timeZone, now);
  const user = username.replace(/^@/, "");
  const header = `<b>Выходные ${esc(ruDay(saturday))} – ${esc(ruDay(sunday))}</b>`;
  const blocks = rows.map((post) => {
    const day = eventDay(post.startIso, timeZone);
    const when = day === saturday ? `сб ${ruDay(day)}` : `вс ${ruDay(day)}`;
    const place = placeShort(post.location);
    const bits = [esc(when), esc(post.title)];
    if (place) bits.push(esc(place));
    if (post.priceLabel) bits.push(esc(post.priceLabel));
    const link = `https://t.me/${user}/${post.messageId}`;
    return `${bits.join(" · ")}\n<a href="${link}">подробно</a>`;
  });
  const messages: string[] = [];
  let buf = header;
  for (const block of blocks) {
    const next = `${buf}\n\n${block}`;
    if (next.length > 3500) {
      messages.push(buf);
      buf = block;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) messages.push(buf);
  return messages;
}

async function sendHtml(chatId: string, html: string): Promise<number> {
  const token = (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string; result?: { message_id?: number } };
  if (!json.ok || !json.result?.message_id) {
    throw new Error(json.description || `telegram sendMessage ${res.status}`);
  }
  return json.result.message_id;
}

export async function sendWeekendDigest(input: {
  storePath: string;
  timeZone: string;
  username: string;
  chatId: string;
  label: string;
  dryRun?: boolean;
  now?: Date;
}): Promise<DigestResult> {
  const now = input.now ?? new Date();
  const today = eventDay(now.toISOString(), input.timeZone);
  if (!input.dryRun && !isFriday(now, input.timeZone)) {
    console.log(`[digest] ${input.label} skip, not Friday`);
    return { published: false, reason: "not-friday" };
  }
  const store = loadPosted(input.storePath);
  if (!input.dryRun && store.digestOn === today) {
    console.log(`[digest] ${input.label} already sent ${today}`);
    return { published: false, reason: "already" };
  }
  const messages = digestMessages(store.posts, input.timeZone, input.username, now);
  if (messages.length === 0) {
    console.log(`[digest] ${input.label} no weekend posts with links`);
    return { published: false, reason: "no-weekend" };
  }
  if (input.dryRun) {
    console.log(`[digest] ${input.label} dry-run\n${messages.join("\n---\n")}`);
    return { published: false, reason: "dry-run", count: weekendPosts(store.posts, input.timeZone, now).length };
  }
  for (let i = 0; i < messages.length; i++) {
    const id = await sendHtml(input.chatId, messages[i]!);
    console.log(`[digest] ${input.label} sent ${id}`);
    if (i < messages.length - 1) await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  markDigest(input.storePath, today);
  return { published: true, count: weekendPosts(store.posts, input.timeZone, now).length };
}

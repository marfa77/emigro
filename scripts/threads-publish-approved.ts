#!/usr/bin/env npx tsx
/**
 * Publish or release one post the owner already saw in the ops DM.
 * Stdin is the approval record. Does not plan a new post.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

type Item = {
  resume?: {
    stream?: string;
    slug?: string;
    kind?: string;
    today?: string;
    cursor?: number | null;
    day?: number;
    rowId?: string;
    guideShort?: boolean;
    items?: Array<{ text: string; topicTag?: string; imageUrl?: string }>;
  };
};

function readItem(): Item {
  const raw = readFileSync(0, "utf8");
  return JSON.parse(raw) as Item;
}

async function publishItems(
  items: Array<{ text: string; topicTag?: string; imageUrl?: string }>
): Promise<string[]> {
  const { publishThreadsChain } = await import("../lib/threads/client");
  const result = await publishThreadsChain({ items, forcePublish: true });
  return result.publishedIds;
}

async function main() {
  const reject = process.argv.includes("--reject");
  const item = readItem();
  const resume = item.resume || {};
  const stream = String(resume.stream || "");
  const today = String(resume.today || new Date().toISOString().slice(0, 10));

  if (reject) {
    if (stream === "daily" || stream === "satellite") {
      const { releaseThreadsRootSlot } = await import("../lib/threads/day-budget");
      releaseThreadsRootSlot({ stream: stream === "daily" ? "guide" : "satellite", today });
    }
    console.log(JSON.stringify({ ok: true, rejected: true, stream }));
    return;
  }

  const items = resume.items || [];
  if (!items.length) throw new Error(`approval resume has no items (${stream})`);

  if (stream === "investment") {
    const token = (process.env.THREADS_INVESTMENT_ACCESS_TOKEN || "").trim();
    const userId = (process.env.THREADS_INVESTMENT_USER_ID || "").trim();
    const username = (process.env.THREADS_INVESTMENT_USERNAME || "emigro_invest").trim();
    if (!token || !userId) throw new Error("investment token missing");
    process.env.THREADS_ACCESS_TOKEN = token;
    process.env.THREADS_USER_ID = userId;
    process.env.THREADS_USERNAME = username;
  } else if (stream === "pt-sat") {
    const token = (process.env.THREADS_PT_SAT_ACCESS_TOKEN || "").trim();
    const userId = (process.env.THREADS_PT_SAT_USER_ID || "").trim();
    if (!token || !userId) throw new Error("pt-sat token missing");
    const { expectedPortugalSatelliteUsername } = await import("../lib/threads/portugal-satellite");
    process.env.THREADS_ACCESS_TOKEN = token;
    process.env.THREADS_USER_ID = userId;
    process.env.THREADS_USERNAME = expectedPortugalSatelliteUsername();
  } else if (stream === "it-sat") {
    const token = (process.env.THREADS_IT_SAT_ACCESS_TOKEN || "").trim();
    const userId = (process.env.THREADS_IT_SAT_USER_ID || "").trim();
    if (!token || !userId) throw new Error("it-sat token missing");
    const { expectedItalySatelliteUsername } = await import("../lib/threads/italy-satellite");
    process.env.THREADS_ACCESS_TOKEN = token;
    process.env.THREADS_USER_ID = userId;
    process.env.THREADS_USERNAME = expectedItalySatelliteUsername();
  }
  process.env.THREADS_AUTO_PUBLISH = "1";

  const ids = await publishItems(items);

  if (stream === "daily") {
    const { commitThreadsDailyPublished } = await import("../lib/threads/daily-pipeline");
    commitThreadsDailyPublished(
      {
        slug: String(resume.slug || ""),
        kind: String(resume.kind || "city"),
        cursor: resume.cursor ?? undefined,
      },
      today,
      ids
    );
  } else if (stream === "satellite") {
    const { commitThreadsSatellitePublished } = await import("../lib/threads/satellite-pipeline");
    commitThreadsSatellitePublished(String(resume.slug || ""), resume.cursor ?? undefined, today, ids);
  } else if (stream === "pt-sat") {
    const { loadPortugalSatelliteState, savePortugalSatelliteState } = await import(
      "../lib/threads/portugal-satellite"
    );
    const state = loadPortugalSatelliteState() as ReturnType<typeof loadPortugalSatelliteState> & {
      guides_used?: string[];
    };
    const day = Number(resume.day);
    const slug = String(resume.slug || "").trim();
    state.last_day = day;
    state.last_posted_on = today;
    const postKey = slug ? `guide:${slug}` : `day-${day}`;
    state.posts[postKey] = {
      at: new Date().toISOString(),
      ids,
      format: items[0]?.imageUrl ? "IMAGE" : "TEXT",
    };
    if (slug) {
      state.guides_used = Array.isArray(state.guides_used) ? state.guides_used : [];
      if (!state.guides_used.includes(slug)) state.guides_used.push(slug);
    }
    savePortugalSatelliteState(state);
  } else if (stream === "it-sat") {
    const { loadItalySatelliteState, saveItalySatelliteState } = await import(
      "../lib/threads/italy-satellite"
    );
    const state = loadItalySatelliteState() as ReturnType<typeof loadItalySatelliteState> & {
      guides_used?: string[];
    };
    const day = Number(resume.day);
    const slug = String(resume.slug || "").trim();
    state.last_day = day;
    state.last_posted_on = today;
    const postKey = slug ? `guide:${slug}` : `day-${day}`;
    state.posts[postKey] = { at: new Date().toISOString(), ids, format: "TEXT" };
    if (slug) {
      state.guides_used = Array.isArray(state.guides_used) ? state.guides_used : [];
      if (!state.guides_used.includes(slug)) state.guides_used.push(slug);
    }
    saveItalySatelliteState(state);
  } else if (stream === "investment") {
    const { loadInvestmentPostState, saveInvestmentPostState } = await import(
      "../lib/threads/investment-calendar"
    );
    const state = loadInvestmentPostState() as ReturnType<typeof loadInvestmentPostState> & {
      guides_used?: string[];
    };
    state.posts[String(resume.rowId || "")] = { ids, at: new Date().toISOString() };
    const slug = String(resume.slug || "").trim();
    if (slug) {
      state.guides_used = Array.isArray(state.guides_used) ? state.guides_used : [];
      if (!state.guides_used.includes(slug)) state.guides_used.push(slug);
    }
    saveInvestmentPostState(state);
  } else if (stream === "sos") {
    const { loadThreadsSosState, saveThreadsSosState } = await import("../lib/threads/sos");
    const state = loadThreadsSosState();
    const rowId = Number(resume.rowId);
    state.last_id = rowId;
    state.last_posted_on = today;
    state.posts[`sos-${rowId}`] = { at: new Date().toISOString(), ids };
    saveThreadsSosState(state);
  } else {
    throw new Error(`unknown approval stream ${stream}`);
  }

  console.log(JSON.stringify({ ok: true, ids, stream }));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

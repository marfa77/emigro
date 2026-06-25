import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { runWeeklyNewsForAllTopics, runWeeklyNewsForTopic } from "@/lib/news/generate-weekly";
import { getNewsTopicKeys } from "@/lib/news/topics";

export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const topicParam = searchParams.get("topic")?.trim().toLowerCase();

  try {
    if (topicParam) {
      const validKeys = await getNewsTopicKeys();
      if (!validKeys.includes(topicParam)) {
        return NextResponse.json(
          { error: `Invalid topic. Valid: ${validKeys.join(", ")}` },
          { status: 400 }
        );
      }
      const result = await runWeeklyNewsForTopic(topicParam);
      await trackServerEvent("cron_weekly_news", { topic: topicParam, outcome: result.outcome }, "cron");
      return NextResponse.json(result);
    }

    const results = await runWeeklyNewsForAllTopics();
    await trackServerEvent(
      "cron_weekly_news",
      {
        topics: results.length,
        published: results.filter((r) => r.outcome === "published").length,
        skipped: results.filter((r) => r.outcome === "skipped").length,
      },
      "cron"
    );
    return NextResponse.json({ results });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    await trackServerEvent("cron_weekly_news_error", { message }, "cron");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

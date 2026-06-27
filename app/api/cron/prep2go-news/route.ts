import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { importLatestPrep2GoNews } from "@/lib/news/import-prep2go";

export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await importLatestPrep2GoNews();

    await trackServerEvent(
      "cron_prep2go_news",
      {
        imported: result.imported,
        skipped: result.skipped,
        slug: result.slug ?? null,
        message: result.message ?? null,
        error: result.error ?? null,
      },
      "cron"
    );

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    await trackServerEvent("cron_prep2go_news_error", { message }, "cron");
    return NextResponse.json({ error: message, imported: 0 }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { adminMisconfigured, adminUnauthorized, verifyAdminRequest } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/admin/supabase";
import { mapNewsTopicRow } from "@/lib/news/topics";

type Props = { params: { key: string } };

export async function PATCH(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const key = params.key.trim().toLowerCase();
  const body = await request.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };

  const fields = [
    "url_segment",
    "country_ru",
    "country_en",
    "flag",
    "audience_ru",
    "focus_hint_ru",
    "corridor_slug",
    "status",
    "seo_tags",
    "rss_queries",
    "site_paths",
    "sort_order",
    "is_published",
  ] as const;

  for (const field of fields) {
    if (body[field] !== undefined) patch[field] = body[field];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_news_topics")
    .update(patch)
    .eq("key", key)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "topic not found" }, { status: 404 });
  return NextResponse.json({ topic: mapNewsTopicRow(data) });
}

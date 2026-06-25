import { NextResponse } from "next/server";
import { adminMisconfigured, adminUnauthorized, verifyAdminRequest } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/admin/supabase";
import { mapNewsTopicRow } from "@/lib/news/topics";

export async function GET(request: Request) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_news_topics")
    .select("*")
    .order("sort_order")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ topics: (data ?? []).map(mapNewsTopicRow) });
}

export async function POST(request: Request) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const body = await request.json();
  const key = String(body.key ?? "").trim().toLowerCase();
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const row = {
    key,
    url_segment: String(body.url_segment ?? key).trim().toLowerCase(),
    country_ru: String(body.country_ru ?? ""),
    country_en: String(body.country_en ?? ""),
    flag: String(body.flag ?? "🌍"),
    audience_ru: String(body.audience_ru ?? ""),
    focus_hint_ru: String(body.focus_hint_ru ?? ""),
    corridor_slug: body.corridor_slug ?? null,
    status: ["active", "in_development", "news_only"].includes(body.status) ? body.status : "news_only",
    seo_tags: Array.isArray(body.seo_tags) ? body.seo_tags : [],
    rss_queries: Array.isArray(body.rss_queries) ? body.rss_queries : [],
    site_paths: body.site_paths ?? null,
    sort_order: Number(body.sort_order ?? 99),
    is_published: body.is_published !== false,
    updated_at: new Date().toISOString(),
  };

  if (!row.country_ru || !row.audience_ru) {
    return NextResponse.json({ error: "country_ru and audience_ru required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("emigro_news_topics").upsert(row).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ topic: mapNewsTopicRow(data) }, { status: 201 });
}

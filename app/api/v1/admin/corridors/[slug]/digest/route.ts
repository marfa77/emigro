import { NextResponse } from "next/server";
import { adminMisconfigured, adminUnauthorized, verifyAdminRequest } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/admin/supabase";
import { getCorridorBySlug } from "@/lib/corridor/queries";

type Props = { params: { slug: string } };

export async function GET(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) return NextResponse.json({ error: "corridor not found" }, { status: 404 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_corridor_digest_items")
    .select("*")
    .eq("corridor_id", corridor.id)
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ corridor_slug: params.slug, items: data ?? [] });
}

export async function POST(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) return NextResponse.json({ error: "corridor not found" }, { status: 404 });

  const body = await request.json();
  const row = {
    corridor_id: corridor.id,
    category: String(body.category ?? "general"),
    title_en: String(body.title_en ?? body.title_ru ?? ""),
    title_ru: String(body.title_ru ?? ""),
    body_en: String(body.body_en ?? body.body_ru ?? ""),
    body_ru: String(body.body_ru ?? ""),
    source_url: body.source_url ?? null,
    last_verified: body.last_verified ?? null,
    sort_order: Number(body.sort_order ?? 99),
    is_published: body.is_published !== false,
  };

  if (!row.title_ru || !row.body_ru) {
    return NextResponse.json({ error: "title_ru and body_ru required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_corridor_digest_items")
    .insert(row)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}

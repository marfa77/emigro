import { NextResponse } from "next/server";
import { adminMisconfigured, adminUnauthorized, verifyAdminRequest } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/admin/supabase";

type Props = { params: { slug: string; id: string } };

export async function PATCH(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const body = await request.json();
  const patch: Record<string, unknown> = {};

  const fields = [
    "category",
    "title_en",
    "title_ru",
    "body_en",
    "body_ru",
    "source_url",
    "last_verified",
    "sort_order",
    "is_published",
  ] as const;

  for (const field of fields) {
    if (body[field] !== undefined) patch[field] = body[field];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_corridor_digest_items")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "digest item not found" }, { status: 404 });
  return NextResponse.json({ item: data });
}

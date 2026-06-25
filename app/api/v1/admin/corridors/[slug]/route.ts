import { NextResponse } from "next/server";
import { adminMisconfigured, adminUnauthorized, verifyAdminRequest } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/admin/supabase";

type Props = { params: { slug: string } };

const PUBLISH_STATUSES = ["draft", "in_development", "active"] as const;

export async function GET(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_corridors")
    .select("id, slug, title_ru, url_segment, publish_status, is_published, created_at")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "corridor not found" }, { status: 404 });
  return NextResponse.json({ corridor: data });
}

/** Set publish_status — trigger syncs emigro_news_topics for site visibility. */
export async function PATCH(request: Request, { params }: Props) {
  if (!process.env.EMIGRO_ADMIN_SECRET?.trim()) return adminMisconfigured();
  if (!verifyAdminRequest(request)) return adminUnauthorized();

  const body = await request.json();
  const patch: Record<string, unknown> = {};

  if (body.publish_status !== undefined) {
    if (!PUBLISH_STATUSES.includes(body.publish_status)) {
      return NextResponse.json(
        { error: `publish_status must be one of: ${PUBLISH_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    patch.publish_status = body.publish_status;
  }

  if (body.url_segment !== undefined) {
    patch.url_segment = String(body.url_segment).trim().toLowerCase() || null;
  }

  if (body.is_published !== undefined) {
    patch.is_published = Boolean(body.is_published);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_corridors")
    .update(patch)
    .eq("slug", params.slug)
    .select("id, slug, title_ru, url_segment, publish_status, is_published")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "corridor not found" }, { status: 404 });
  return NextResponse.json({ corridor: data });
}

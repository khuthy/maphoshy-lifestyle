import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("portfolio_videos")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tiktok_url, title, display_order } = body;

  if (!tiktok_url?.trim()) {
    return NextResponse.json({ error: "TikTok URL is required" }, { status: 400 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("portfolio_videos")
    .insert({
      tiktok_url: tiktok_url.trim(),
      title: (title ?? "").trim(),
      display_order: display_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

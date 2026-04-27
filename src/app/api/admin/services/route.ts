import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  let { data, error } = await db
    .from("service_content")
    .select("*")
    .order("display_order", { ascending: true });

  // Migration 006 pending — display_order column doesn't exist yet
  if (error?.message?.includes("display_order")) {
    ({ data, error } = await db
      .from("service_content")
      .select("*")
      .order("service_key"));
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { service_key, title, description, includes, price_from, booking_key, icon_name, display_order, price_video_call, price_in_person } = body;

  if (!service_key?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "Service key and title are required" }, { status: 400 });
  }

  const db = createServerClient();
  const baseKey = service_key.trim().toLowerCase().replace(/\s+/g, "_");
  let { data, error } = await db
    .from("service_content")
    .insert({
      service_key: baseKey,
      title: title.trim(),
      description: (description ?? "").trim(),
      includes: includes ?? [],
      price_from: (price_from ?? "").trim(),
      booking_key: (booking_key ?? service_key).trim().toLowerCase().replace(/\s+/g, "_"),
      icon_name: (icon_name ?? "Sparkles").trim(),
      display_order: display_order ?? 0,
      price_video_call: (price_video_call ?? "").trim() || null,
      price_in_person: (price_in_person ?? "").trim() || null,
    })
    .select()
    .single();

  // Retry without optional columns added by later migrations
  if (error?.message?.includes("display_order") || error?.message?.includes("active") ||
      error?.message?.includes("price_video_call") || error?.message?.includes("price_in_person")) {
    ({ data, error } = await db
      .from("service_content")
      .insert({
        service_key: baseKey,
        title: title.trim(),
        description: (description ?? "").trim(),
        includes: includes ?? [],
        price_from: (price_from ?? "").trim(),
        booking_key: (booking_key ?? service_key).trim().toLowerCase().replace(/\s+/g, "_"),
        icon_name: (icon_name ?? "Sparkles").trim(),
      })
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

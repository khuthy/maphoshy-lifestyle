import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("service_content")
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
  const { service_key, title, description, includes, price_from, booking_key, icon_name, display_order } = body;

  if (!service_key?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "Service key and title are required" }, { status: 400 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("service_content")
    .insert({
      service_key: service_key.trim().toLowerCase().replace(/\s+/g, "_"),
      title: title.trim(),
      description: (description ?? "").trim(),
      includes: includes ?? [],
      price_from: (price_from ?? "").trim(),
      booking_key: (booking_key ?? service_key).trim().toLowerCase().replace(/\s+/g, "_"),
      icon_name: (icon_name ?? "Sparkles").trim(),
      display_order: display_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

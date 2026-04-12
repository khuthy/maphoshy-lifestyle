import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("pricing_entries")
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
  const { name, description, price, note, highlight, booking_key, display_order } = body;

  if (!name || !description || !price || !booking_key) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("pricing_entries")
    .insert({ name, description, price, note, highlight: highlight ?? false, booking_key, display_order: display_order ?? 0 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ── Sync price to service_content ──────────────────────────────────────
  const priceFrom = price.replace(/^From\s+/i, "").trim();
  await db
    .from("service_content")
    .update({ price_from: priceFrom })
    .eq("booking_key", booking_key);

  return NextResponse.json(data, { status: 201 });
}

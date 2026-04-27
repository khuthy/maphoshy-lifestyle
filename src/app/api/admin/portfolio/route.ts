import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("portfolio_items")
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
  const { src, alt, category, label, display_order } = body;

  if (!src || !alt || !category || !label) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = createServerClient();
  const { price_range, show_in_catalog, show_in_hero } = body;

  // Attempt insert with all optional fields (available after migrations)
  let { data, error } = await db
    .from("portfolio_items")
    .insert({ src, alt, category, label, display_order: display_order ?? 0, price_range: price_range ?? null, show_in_catalog: show_in_catalog ?? false, show_in_hero: show_in_hero ?? false })
    .select()
    .single();

  // Only strip the specific column(s) missing from the schema — preserve others
  const optionalCols = ["price_range", "show_in_catalog", "show_in_hero"];
  if (optionalCols.some(col => error?.message?.includes(col))) {
    const missing = optionalCols.filter(col => error?.message?.includes(col));
    const full = { src, alt, category, label, display_order: display_order ?? 0, price_range: price_range ?? null, show_in_catalog: show_in_catalog ?? false, show_in_hero: show_in_hero ?? false };
    const safeInsert = Object.fromEntries(Object.entries(full).filter(([k]) => !missing.includes(k)));
    ({ data, error } = await db.from("portfolio_items").insert(safeInsert).select().single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

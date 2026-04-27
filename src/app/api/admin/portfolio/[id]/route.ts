import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const db = createServerClient();

  // Attempt update with full body (includes catalog fields after migration)
  let { data, error } = await db
    .from("portfolio_items")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  // If a column doesn't exist yet (migration pending), retry without ONLY that column
  const optionalCols = ["price_range", "show_in_catalog", "show_in_hero"];
  if (optionalCols.some(col => error?.message?.includes(col))) {
    const missing = optionalCols.filter(col => error?.message?.includes(col));
    const safeBody = Object.fromEntries(
      Object.entries(body).filter(([k]) => !missing.includes(k))
    );
    ({ data, error } = await db
      .from("portfolio_items")
      .update(safeBody)
      .eq("id", params.id)
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { error } = await db
    .from("portfolio_items")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

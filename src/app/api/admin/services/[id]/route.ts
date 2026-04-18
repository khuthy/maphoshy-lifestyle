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

  const body = await req.json() as Record<string, unknown>;
  const updates = { ...body };
  delete updates.id;
  delete updates.service_key; // service_key is immutable after creation

  const db = createServerClient();
  let { data, error } = await db
    .from("service_content")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();

  // Migration 006 pending — retry stripping new columns
  if (error?.message?.includes("display_order") || error?.message?.includes("active")) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { display_order, active, ...safeUpdates } = updates as Record<string, unknown>;
    ({ data, error } = await db
      .from("service_content")
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
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
    .from("service_content")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

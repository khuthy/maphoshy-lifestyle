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
  // Strip immutable / externally-managed fields from update payload.
  // price_from is managed by the Pricing page and synced automatically —
  // the Services form must never overwrite it.
  const updates = { ...body };
  delete updates.id;
  delete updates.service_key;
  delete updates.price_from;

  const db = createServerClient();
  const { data, error } = await db
    .from("service_content")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

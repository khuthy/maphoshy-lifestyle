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

  // Update the pricing entry
  const { data: updated, error } = await db
    .from("pricing_entries")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // ── Sync price to service_content ──────────────────────────────────────
  // When the price field is being updated, mirror it to the matching
  // service_content row (matched by booking_key) so both pages stay in sync.
  if (body.price !== undefined || body.booking_key !== undefined) {
    const entry = updated as { price: string; booking_key: string };

    // Strip "From " prefix — service_content.price_from stores the base price
    // e.g. "From R 800" → "R 800", "R 500" → "R 500"
    const priceFrom = entry.price.replace(/^From\s+/i, "").trim();

    await db
      .from("service_content")
      .update({ price_from: priceFrom })
      .eq("booking_key", entry.booking_key);
    // Intentionally ignore errors here — not all pricing entries have a
    // corresponding service_content row (e.g. style_discovery, alteration)
  }

  return NextResponse.json(updated);
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
    .from("pricing_entries")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data } = await db
    .from("portfolio_items")
    .select("id, src, alt, label, display_order")
    .eq("show_in_hero", true)
    .order("display_order", { ascending: true })
    .limit(4);

  return NextResponse.json({ images: data ?? [] });
}

export async function POST(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slots } = await req.json() as {
    slots: Array<{ id?: string; src: string; alt: string; label?: string }>;
  };

  if (!Array.isArray(slots) || slots.length !== 4) {
    return NextResponse.json({ error: "Expected exactly 4 slots" }, { status: 400 });
  }

  const db = createServerClient();

  // Unflag all existing hero items first
  await db.from("portfolio_items").update({ show_in_hero: false }).eq("show_in_hero", true);

  // Upsert each non-empty slot
  for (let i = 0; i < 4; i++) {
    const slot = slots[i];
    if (!slot.src) continue;

    const payload = {
      src:           slot.src,
      alt:           slot.alt || "Maphoshy Lifestyle",
      label:         slot.label || "",
      show_in_hero:  true,
      display_order: i + 1,
      active:        true,
    };

    if (slot.id) {
      await db.from("portfolio_items").update(payload).eq("id", slot.id);
    } else {
      await db.from("portfolio_items").insert({
        ...payload,
        category:        "styling",
        show_in_catalog: false,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

type Section = "about" | "portfolio_preview";
const MAX_SLOTS: Record<Section, number> = { about: 3, portfolio_preview: 5 };

// GET /api/admin/home-sections?section=about|portfolio_preview
export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const section = req.nextUrl.searchParams.get("section") as Section | null;
  if (!section || !MAX_SLOTS[section]) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const db = createServerClient();
  const { data } = await db
    .from("home_page_images")
    .select("id, slot_number, src, alt, label")
    .eq("section", section)
    .order("slot_number", { ascending: true });

  return NextResponse.json({ images: data ?? [] });
}

// POST /api/admin/home-sections
// Body: { section: "about"|"portfolio_preview", slots: Array<{src, alt, label}> }
export async function POST(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { section, slots } = await req.json() as {
    section: Section;
    slots: Array<{ src: string; alt: string; label?: string }>;
  };

  if (!section || !MAX_SLOTS[section]) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }
  if (!Array.isArray(slots) || slots.length !== MAX_SLOTS[section]) {
    return NextResponse.json({ error: `Expected ${MAX_SLOTS[section]} slots for section "${section}"` }, { status: 400 });
  }

  const db = createServerClient();

  // Upsert each slot by (section, slot_number)
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (!slot.src) {
      // Remove this slot if src is cleared
      await db.from("home_page_images").delete().eq("section", section).eq("slot_number", i + 1);
      continue;
    }
    await db.from("home_page_images").upsert({
      section,
      slot_number: i + 1,
      src:  slot.src,
      alt:  slot.alt || "Maphoshy Lifestyle",
      label: slot.label ?? "",
      updated_at: new Date().toISOString(),
    }, { onConflict: "section,slot_number" });
  }

  return NextResponse.json({ ok: true });
}

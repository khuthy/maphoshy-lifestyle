import { NextRequest, NextResponse } from "next/server";
import { createPublicServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { quote, author, service } = body;

  if (!quote?.trim() || !author?.trim()) {
    return NextResponse.json({ error: "Your name and review are required" }, { status: 400 });
  }
  if (quote.trim().length < 20) {
    return NextResponse.json({ error: "Please write at least a sentence about your experience" }, { status: 400 });
  }

  const db = createPublicServerClient();
  const initials = author.trim().split(/\s+/).map((w: string) => w[0].toUpperCase()).slice(0, 2).join("");

  const { error } = await db
    .from("testimonials")
    .insert({
      quote: quote.trim(),
      author: author.trim(),
      service: (service ?? "").trim(),
      initials,
      display_order: 999,
      active: false,
      submitted_by_customer: true,
      pending_approval: true,
    });

  // Graceful fallback if migration 009 hasn't run yet
  if (error?.message?.includes("submitted_by_customer") || error?.message?.includes("pending_approval")) {
    return NextResponse.json(
      { error: "Submissions are not yet enabled. Please contact us directly." },
      { status: 503 }
    );
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

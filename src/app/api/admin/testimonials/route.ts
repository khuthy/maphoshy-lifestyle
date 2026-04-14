import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("testimonials")
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
  const { quote, author, service, initials, display_order } = body;

  if (!quote?.trim() || !author?.trim()) {
    return NextResponse.json({ error: "Quote and author are required" }, { status: 400 });
  }

  const db = createServerClient();
  const { data, error } = await db
    .from("testimonials")
    .insert({
      quote: quote.trim(),
      author: author.trim(),
      service: (service ?? "").trim(),
      initials: (initials ?? "").trim(),
      display_order: display_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendClientConfirmation, sendPortiaNotification } from "@/lib/resend";
import type { Booking } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Booking not found:", error);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Send both emails in parallel
    await Promise.all([
      sendClientConfirmation(booking as Booking),
      sendPortiaNotification(booking as Booking),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-confirmation error:", err);
    return NextResponse.json(
      { error: "Failed to send confirmation emails" },
      { status: 500 }
    );
  }
}

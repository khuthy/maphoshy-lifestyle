import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { validatePayFastSignature } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  try {
    // PayFast sends ITN as URL-encoded form data
    const body = await req.text();
    const params = new URLSearchParams(body);
    const itnData: Record<string, string> = {};
    params.forEach((value, key) => {
      itnData[key] = value;
    });

    // Validate signature
    const isValid = validatePayFastSignature(itnData);
    if (!isValid) {
      console.error("PayFast ITN: invalid signature", itnData);
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const paymentStatus = itnData.payment_status;
    const bookingReference = itnData.m_payment_id;
    const payfastPaymentId = itnData.pf_payment_id;

    if (!bookingReference) {
      return new NextResponse("Missing m_payment_id", { status: 400 });
    }

    const supabase = createServerClient();

    if (paymentStatus === "COMPLETE") {
      // Update booking to "paid"
      const { data: booking, error } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payfast_payment_id: payfastPaymentId,
        })
        .eq("reference", bookingReference)
        .eq("payment_status", "pending")
        .select()
        .single();

      if (error || !booking) {
        console.error("Failed to update booking:", error);
        return new NextResponse("Booking update failed", { status: 500 });
      }

      // Trigger confirmation emails
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        `https://${req.headers.get("host")}`;

      await fetch(`${siteUrl}/api/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
    } else if (
      paymentStatus === "FAILED" ||
      paymentStatus === "CANCELLED"
    ) {
      // Update booking status accordingly
      await supabase
        .from("bookings")
        .update({
          payment_status:
            paymentStatus === "CANCELLED" ? "cancelled" : "failed",
        })
        .eq("reference", bookingReference)
        .eq("payment_status", "pending");
    }

    // PayFast expects a 200 OK response
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("payfast-notify error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

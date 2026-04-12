import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { buildPayFastUrl } from "@/lib/payfast";
import { generateBookingReference, getServiceLabel } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const clientName = formData.get("clientName") as string;
    const clientEmail = formData.get("clientEmail") as string;
    const clientPhone = formData.get("clientPhone") as string;
    const serviceType = formData.get("serviceType") as string;
    const preferredDate = formData.get("preferredDate") as string | null;
    const amount = parseFloat(formData.get("amount") as string);
    const notes = formData.get("notes") as string | null;
    const sessionFormat = formData.get("sessionFormat") as string | null;
    const serviceDetailsRaw = formData.get("serviceDetails") as string | null;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !serviceType || !amount) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const serviceDetails = serviceDetailsRaw
      ? JSON.parse(serviceDetailsRaw)
      : null;

    const reference = generateBookingReference();

    // Determine site URL for PayFast return URLs
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `https://${req.headers.get("host")}`;

    // Save booking to Supabase with status "pending"
    const supabase = createServerClient();
    const { error: dbError } = await supabase.from("bookings").insert({
      reference,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      service_type: serviceType,
      service_details: serviceDetails,
      preferred_date: preferredDate || null,
      amount,
      payment_status: "pending",
      notes: notes || null,
      session_format: sessionFormat || null,
    });

    if (dbError) {
      console.error("Supabase insert error:", JSON.stringify(dbError));
      const detail = process.env.NODE_ENV !== "production" ? dbError.message : undefined;
      return NextResponse.json(
        { error: "Failed to create booking. Please try again.", detail },
        { status: 500 }
      );
    }

    // Build signed PayFast URL
    const paymentUrl = buildPayFastUrl({
      bookingReference: reference,
      clientName,
      clientEmail,
      serviceName: getServiceLabel(serviceType),
      amount,
      siteUrl,
    });

    return NextResponse.json({ paymentUrl, reference });
  } catch (err) {
    console.error("create-payment error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { buildPayFastUrl } from "@/lib/payfast";
import { generateBookingReference, getServiceLabel } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const clientName      = formData.get("clientName")      as string;
    const clientEmail     = formData.get("clientEmail")     as string;
    const clientPhone     = formData.get("clientPhone")     as string;
    const serviceType     = formData.get("serviceType")     as string;
    const preferredDate   = formData.get("preferredDate")   as string | null;
    const preferredTime   = formData.get("preferredTime")   as string | null;
    const sessionDuration = formData.get("sessionDuration") as string | null;
    const amount          = parseFloat(formData.get("amount") as string);
    const notes           = formData.get("notes")           as string | null;
    const sessionFormat   = formData.get("sessionFormat")   as string | null;
    const serviceDetailsRaw = formData.get("serviceDetails") as string | null;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !serviceType || !amount) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const serviceDetails = serviceDetailsRaw ? JSON.parse(serviceDetailsRaw) : null;
    const durationHours = sessionDuration ? parseFloat(sessionDuration) : null;

    // ── Conflict check: block overlapping time slots ──────────────────────────
    if (preferredDate && preferredTime && durationHours) {
      const supabaseCheck = createServerClient();
      const { data: existing } = await supabaseCheck
        .from("bookings")
        .select("preferred_time, session_duration_hours")
        .eq("preferred_date", preferredDate)
        .in("payment_status", ["paid", "pending"])
        .not("preferred_time", "is", null);

      const toMin = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const reqStart = toMin(preferredTime);
      const reqEnd   = reqStart + durationHours * 60;

      const conflict = (existing ?? []).some(b => {
        if (!b.preferred_time) return false;
        const bs = toMin(b.preferred_time as string);
        const be = bs + (Number(b.session_duration_hours ?? 1)) * 60;
        return reqStart < be && reqEnd > bs;
      });

      if (conflict) {
        return NextResponse.json(
          { error: "That time slot has just been taken. Please choose a different time." },
          { status: 409 }
        );
      }
    }

    const reference = generateBookingReference();

    // Determine site URL for PayFast return URLs
    // In development, always use the actual request host so PayFast redirects back to localhost
    const siteUrl =
      process.env.NODE_ENV === "production"
        ? (process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.get("host")}`)
        : `http://${req.headers.get("host")}`;

    // Save booking to Supabase with status "pending"
    const supabase = createServerClient();

    const baseInsert = {
      reference,
      client_name:    clientName,
      client_email:   clientEmail,
      client_phone:   clientPhone,
      service_type:   serviceType,
      service_details: serviceDetails,
      preferred_date: preferredDate || null,
      amount,
      payment_status: "pending",
      notes:          notes || null,
      session_format: sessionFormat || null,
    };

    // Try inserting with the new time columns (migration 010).
    // If the columns don't exist yet, fall back to the base insert.
    let { error: dbError } = await supabase.from("bookings").insert({
      ...baseInsert,
      preferred_time:         preferredTime || null,
      session_duration_hours: durationHours || null,
    });

    if (dbError?.message?.includes("preferred_time") || dbError?.message?.includes("session_duration_hours")) {
      ({ error: dbError } = await supabase.from("bookings").insert(baseInsert));
    }

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

import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = await req.json();
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  // Fetch the booking to get client details
  const db = createServerClient();
  const { data: booking, error: dbError } = await db
    .from("bookings")
    .select("client_name, client_email, reference")
    .eq("id", params.id)
    .single();

  if (dbError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Send the reply email via Resend
  const { error: sendError } = await getResend().emails.send({
    from: `Portia — Maphoshy Lifestyle <${FROM_EMAIL}>`,
    to: booking.client_email,
    replyTo: FROM_EMAIL,
    subject: subject.trim(),
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="font-family: system-ui, sans-serif; background: #FDFBF7; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <div style="background: linear-gradient(135deg, #3d1160, #5C1A8C); padding: 36px 32px; text-align: center;">
            <h1 style="color: #C9964A; font-family: Georgia, serif; font-size: 26px; margin: 0 0 6px;">Maphoshy Lifestyle</h1>
            <p style="color: rgba(243,234,249,0.7); margin: 0; font-size: 13px; letter-spacing: 0.05em;">Quality is our priority.</p>
          </div>

          <div style="padding: 40px 32px;">
            <p style="color: #4a4a4a; font-size: 15px; margin: 0 0 20px;">Hi ${booking.client_name},</p>

            <div style="color: #333; font-size: 15px; line-height: 1.7; white-space: pre-wrap; margin-bottom: 32px;">${message.trim()}</div>

            <div style="border-top: 1px solid #eee; padding-top: 24px;">
              <p style="color: #999; font-size: 13px; margin: 0 0 4px;">With warmth,</p>
              <p style="color: #5C1A8C; font-size: 14px; font-weight: 600; margin: 0;">Portia Maluleke</p>
              <p style="color: #999; font-size: 13px; margin: 4px 0 0;">Maphoshy Lifestyle · maphoshylifestyle.co.za</p>
            </div>
          </div>

          <div style="background: #f7f4fb; padding: 16px 32px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #bbb; font-size: 12px; margin: 0;">Re: Booking ${booking.reference}</p>
          </div>

        </div>
      </body>
      </html>
    `,
  });

  if (sendError) {
    return NextResponse.json({ error: sendError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

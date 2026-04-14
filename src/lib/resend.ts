import { Resend } from "resend";
import type { Booking } from "@/lib/supabase";
import { getServiceLabel, formatRand } from "@/lib/utils";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;
const PORTIA_EMAIL = process.env.PORTIA_EMAIL!;

/**
 * Sends a booking confirmation email to the client
 */
export async function sendClientConfirmation(booking: Booking): Promise<void> {
  const serviceLabel = getServiceLabel(booking.service_type);
  const amount = formatRand(booking.amount);

  await getResend().emails.send({
    from: `Maphoshy Lifestyle <${FROM_EMAIL}>`,
    to: booking.client_email,
    subject: `Booking Confirmed — ${booking.reference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: system-ui, sans-serif; background: #FDFBF7; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <div style="background: #5C1A8C; padding: 40px 32px; text-align: center;">
            <h1 style="color: #C9964A; font-family: Georgia, serif; font-size: 28px; margin: 0 0 8px;">Maphoshy Lifestyle</h1>
            <p style="color: #F3EAF9; margin: 0; font-size: 14px;">Quality is our priority.</p>
          </div>

          <div style="padding: 40px 32px;">
            <h2 style="color: #5C1A8C; font-family: Georgia, serif; margin: 0 0 16px;">Your booking is confirmed!</h2>
            <p style="color: #333; margin: 0 0 24px;">Hi ${booking.client_name}, thank you for booking with Maphoshy Lifestyle. We're excited to work with you!</p>

            <div style="background: #F3EAF9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; color: #5C1A8C; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Booking Reference</p>
              <p style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px; font-weight: 700; font-family: monospace;">${booking.reference}</p>

              <div style="border-top: 1px solid #D4B0E8; padding-top: 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 14px;">Service</td>
                    <td style="padding: 6px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${serviceLabel}</td>
                  </tr>
                  ${booking.preferred_date ? `
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 14px;">Preferred Date</td>
                    <td style="padding: 6px 0; color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">${new Date(booking.preferred_date).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding: 6px 0; color: #666; font-size: 14px;">Amount Paid</td>
                    <td style="padding: 6px 0; color: #5C1A8C; font-size: 14px; font-weight: 700; text-align: right;">${amount}</td>
                  </tr>
                </table>
              </div>
            </div>

            <h3 style="color: #5C1A8C; font-family: Georgia, serif; margin: 0 0 12px; font-size: 18px;">What happens next?</h3>
            <ol style="color: #333; padding-left: 20px; margin: 0 0 24px; line-height: 1.8;">
              <li>We will review your booking and reach out within <strong>24 hours</strong>.</li>
              <li>We'll confirm your session date and time via WhatsApp or email.</li>
              <li>You'll receive a brief questionnaire to help us prepare for your session.</li>
              <li>Show up ready to transform your style!</li>
            </ol>

            <p style="color: #666; font-size: 14px; margin: 0;">Have questions? Reply to this email or reach us directly on WhatsApp.</p>
          </div>

          <div style="background: #1a1a1a; padding: 24px 32px; text-align: center;">
            <p style="color: #999; font-size: 13px; margin: 0;">© ${new Date().getFullYear()} Maphoshy Lifestyle · maphoshylifestyle.co.za</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

/**
 * Sends a new booking notification to Portia
 */
export async function sendPortiaNotification(booking: Booking): Promise<void> {
  const serviceLabel = getServiceLabel(booking.service_type);
  const amount = formatRand(booking.amount);

  await getResend().emails.send({
    from: `Maphoshy Booking System <${FROM_EMAIL}>`,
    to: PORTIA_EMAIL,
    subject: `New Booking: ${booking.reference} — ${serviceLabel}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <div style="background: #5C1A8C; padding: 32px; text-align: center;">
            <h1 style="color: #C9964A; font-family: Georgia, serif; font-size: 24px; margin: 0 0 4px;">New Booking Received!</h1>
            <p style="color: #F3EAF9; margin: 0; font-size: 13px;">${booking.reference}</p>
          </div>

          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px; width: 160px;">Client Name</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${booking.client_name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Email</td>
                <td style="padding: 12px 0; color: #5C1A8C; font-size: 14px;"><a href="mailto:${booking.client_email}" style="color: #5C1A8C;">${booking.client_email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Phone</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${booking.client_phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Service</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${serviceLabel}</td>
              </tr>
              ${booking.preferred_date ? `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Preferred Date</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${new Date(booking.preferred_date).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>` : ""}
              ${booking.session_format ? `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Session Format</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${booking.session_format === "video_call" ? "Video Call" : "In-Person"}</td>
              </tr>` : ""}
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px 0; color: #666; font-size: 14px;">Amount Paid</td>
                <td style="padding: 12px 0; color: #5C1A8C; font-size: 14px; font-weight: 700;">${amount}</td>
              </tr>
              ${booking.notes ? `
              <tr>
                <td style="padding: 12px 0; color: #666; font-size: 14px; vertical-align: top;">Notes</td>
                <td style="padding: 12px 0; color: #1a1a1a; font-size: 14px;">${booking.notes}</td>
              </tr>` : ""}
            </table>

            ${booking.service_details ? `
            <div style="background: #F3EAF9; border-radius: 8px; padding: 20px; margin-top: 24px;">
              <p style="margin: 0 0 8px; color: #5C1A8C; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Service Details</p>
              <pre style="margin: 0; color: #333; font-size: 13px; white-space: pre-wrap; font-family: monospace;">${JSON.stringify(booking.service_details, null, 2)}</pre>
            </div>` : ""}

            <p style="margin-top: 24px; color: #666; font-size: 14px;">Log in to your <a href="https://supabase.com" style="color: #5C1A8C;">Supabase dashboard</a> to view and manage this booking.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

/**
 * Sends a contact form enquiry email to Portia
 */
export async function sendContactEnquiry(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await getResend().emails.send({
    from: `Maphoshy Website <${FROM_EMAIL}>`,
    to: PORTIA_EMAIL,
    replyTo: params.email,
    subject: `New Website Enquiry from ${params.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: system-ui, sans-serif; background: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <h2 style="color: #5C1A8C; font-family: Georgia, serif; margin: 0 0 24px;">New Website Enquiry</h2>
          <p><strong>Name:</strong> ${params.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${params.email}" style="color: #5C1A8C;">${params.email}</a></p>
          <div style="background: #F3EAF9; border-radius: 8px; padding: 16px; margin-top: 16px;">
            <p style="margin: 0; color: #333; white-space: pre-wrap;">${params.message}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

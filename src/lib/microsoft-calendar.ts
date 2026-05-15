/**
 * Microsoft Teams / Outlook Calendar integration via Microsoft Graph API.
 *
 * Setup (one-time, ~10 minutes):
 * 1. Sign in to https://portal.azure.com with Portia's Microsoft 365 account
 * 2. Go to "Azure Active Directory" → "App registrations" → "New registration"
 *    - Name: "Maphoshy Lifestyle Booking"
 *    - Supported account types: "Accounts in this organizational directory only"
 *    - Click Register
 * 3. Note the "Application (client) ID" and "Directory (tenant) ID" on the overview page
 * 4. Go to "Certificates & secrets" → "New client secret"
 *    - Description: "booking-integration", Expires: 24 months → Add
 *    - Copy the secret VALUE immediately (you can't see it again)
 * 5. Go to "API permissions" → "Add a permission" → "Microsoft Graph"
 *    → "Application permissions" → search "Calendars" → tick "Calendars.ReadWrite" → Add
 * 6. Click "Grant admin consent for [tenant]" → Yes
 * 7. Add the 4 env vars below to Vercel (and .env.local for testing)
 *
 * Required env vars:
 *   MICROSOFT_TENANT_ID       — Directory (tenant) ID from step 3
 *   MICROSOFT_CLIENT_ID       — Application (client) ID from step 3
 *   MICROSOFT_CLIENT_SECRET   — Secret value from step 4
 *   MICROSOFT_CALENDAR_USER   — Email whose calendar receives events, e.g. info@maphoshylifestyle.co.za
 *
 * NOTE: This requires a Microsoft 365 Business/Work account (not a personal @outlook.com account).
 * If info@maphoshylifestyle.co.za is hosted on Microsoft 365, this will work directly.
 */

const ENABLED = !!(
  process.env.MICROSOFT_TENANT_ID &&
  process.env.MICROSOFT_CLIENT_ID &&
  process.env.MICROSOFT_CLIENT_SECRET &&
  process.env.MICROSOFT_CALENDAR_USER
);

async function getAccessToken(): Promise<string> {
  const tenantId = process.env.MICROSOFT_TENANT_ID!;
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        scope:         "https://graph.microsoft.com/.default",
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Teams auth failed (${res.status}): ${err}`);
  }
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

function endDateTime(date: string, time: string, durationHours: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + Math.round(durationHours * 60);
  const eH = Math.floor(totalMin / 60);
  const eM = totalMin % 60;
  return `${date}T${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}:00`;
}

export interface TeamsCalendarBooking {
  reference:              string;
  client_name:            string;
  client_email:           string;
  client_phone:           string;
  service_type:           string;
  session_format:         string | null;
  preferred_date:         string;        // "YYYY-MM-DD"
  preferred_time:         string | null; // "HH:MM"
  session_duration_hours: number | null;
  notes:                  string | null;
}

export async function addBookingToTeamsCalendar(booking: TeamsCalendarBooking): Promise<void> {
  if (!ENABLED) return; // silently skip — not configured yet
  if (!booking.preferred_date || !booking.preferred_time) return;

  try {
    const token       = await getAccessToken();
    const calUser     = process.env.MICROSOFT_CALENDAR_USER!;
    const duration    = booking.session_duration_hours ?? 1;
    const formatLabel =
      booking.session_format === "video_call" ? "Video Call 💻" :
      booking.session_format === "in_person"  ? "In-Person 🤝"  : "";

    const serviceLabel = booking.service_type
      .split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    const htmlBody = `
      <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Reference</td><td>${booking.reference}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Client</td><td>${booking.client_name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Email</td><td>${booking.client_email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Phone</td><td>${booking.client_phone}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Service</td><td>${serviceLabel}</td></tr>
        ${formatLabel ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Format</td><td>${formatLabel}</td></tr>` : ""}
        <tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Duration</td><td>${duration} hour${duration !== 1 ? "s" : ""}</td></tr>
        ${booking.notes ? `<tr><td style="padding:4px 12px 4px 0;color:#888;font-weight:bold">Notes</td><td>${booking.notes}</td></tr>` : ""}
      </table>
    `.trim();

    const isVideoCall = booking.session_format === "video_call";

    const event = {
      subject: `${booking.client_name} — ${serviceLabel}${formatLabel ? ` (${formatLabel})` : ""}`,
      body:    { contentType: "html", content: htmlBody },
      start:   { dateTime: `${booking.preferred_date}T${booking.preferred_time}:00`, timeZone: "Africa/Johannesburg" },
      end:     { dateTime: endDateTime(booking.preferred_date, booking.preferred_time, duration), timeZone: "Africa/Johannesburg" },
      attendees: [
        {
          emailAddress: { address: booking.client_email, name: booking.client_name },
          type: "required",
        },
      ],
      // If it's a video call, auto-create a Teams meeting link
      isOnlineMeeting:       isVideoCall,
      onlineMeetingProvider: isVideoCall ? "teamsForBusiness" : undefined,
      categories: ["Maphoshy Lifestyle"],
    };

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${calUser}/events`,
      {
        method:  "POST",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[teams-calendar] event creation failed (${res.status}):`, errBody);
    } else {
      const created = await res.json() as { id: string; onlineMeeting?: { joinUrl: string } };
      console.log(`[teams-calendar] event created: ${created.id}`);
      if (isVideoCall && created.onlineMeeting?.joinUrl) {
        console.log(`[teams-calendar] Teams meeting link: ${created.onlineMeeting.joinUrl}`);
      }
    }
  } catch (err) {
    // Non-fatal: log and continue — calendar failure must not block payment confirmation
    console.error("[teams-calendar] error:", err);
  }
}

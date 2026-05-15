import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET /api/booked-slots?date=YYYY-MM-DD
// Returns occupied time ranges for a date (paid + pending bookings only)
export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("preferred_time, session_duration_hours")
    .eq("preferred_date", date)
    .in("payment_status", ["paid", "pending"])
    .not("preferred_time", "is", null);

  if (error) {
    return NextResponse.json({ bookedRanges: [] });
  }

  const bookedRanges = (data ?? [])
    .filter((b) => b.preferred_time)
    .map((b) => {
      const [h, m] = (b.preferred_time as string).split(":").map(Number);
      const startMin = h * 60 + m;
      const durMin = Math.round((Number(b.session_duration_hours ?? 1)) * 60);
      const endMin = startMin + durMin;
      return {
        start: b.preferred_time as string,
        end: `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`,
      };
    });

  return NextResponse.json({ bookedRanges }, {
    headers: { "Cache-Control": "no-store" },
  });
}

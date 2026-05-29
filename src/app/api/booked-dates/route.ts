import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Business hours in minutes from midnight
const BUSINESS_START = 8 * 60;   // 08:00
const BUSINESS_END   = 18 * 60;  // 18:00
const MIN_SESSION    = 60;        // shortest possible session (1 hour)
const SLOT_STEP      = 30;        // 30-minute intervals

// Every possible start time that can fit at least a 1-hour session
const CANDIDATE_STARTS: number[] = [];
for (let m = BUSINESS_START; m <= BUSINESS_END - MIN_SESSION; m += SLOT_STEP) {
  CANDIDATE_STARTS.push(m);
}

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function hasAvailableSlot(booked: { start: number; end: number }[]): boolean {
  // Returns true if at least one 1-hour window is free
  return CANDIDATE_STARTS.some(s => {
    const e = s + MIN_SESSION;
    return !booked.some(b => s < b.end && e > b.start);
  });
}

// GET /api/booked-dates?year=2025&month=5
// Returns { dates: { "2025-05-15": "partial" | "full" } }
export async function GET(req: NextRequest) {
  const year  = parseInt(req.nextUrl.searchParams.get("year")  ?? "");
  const month = parseInt(req.nextUrl.searchParams.get("month") ?? ""); // 1-indexed

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ dates: {} });
  }

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  // new Date(year, month, 0) = last day of the given 1-indexed month
  const lastDay   = new Date(year, month, 0).toISOString().split("T")[0];

  const supabase = createServerClient();
  const { data } = await supabase
    .from("bookings")
    .select("preferred_date, preferred_time, session_duration_hours")
    .gte("preferred_date", startDate)
    .lte("preferred_date", lastDay)
    .in("payment_status", ["paid", "pending"])
    .not("preferred_date", "is", null);

  // Group bookings by date into time ranges (minutes)
  const byDate: Record<string, { start: number; end: number }[]> = {};
  for (const b of data ?? []) {
    const date = b.preferred_date as string;
    if (!byDate[date]) byDate[date] = [];
    if (b.preferred_time) {
      const s = toMin(b.preferred_time as string);
      const d = Math.round(Number(b.session_duration_hours ?? 1) * 60);
      byDate[date].push({ start: s, end: s + d });
    }
  }

  const result: Record<string, "partial" | "full"> = {};
  for (const [date, ranges] of Object.entries(byDate)) {
    result[date] = hasAvailableSlot(ranges) ? "partial" : "full";
  }

  return NextResponse.json({ dates: result }, {
    headers: { "Cache-Control": "no-store" },
  });
}

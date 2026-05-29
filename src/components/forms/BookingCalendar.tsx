"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DateStatus = "partial" | "full";

interface BookingCalendarProps {
  value: string;
  onChange: (date: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function BookingCalendar({ value, onChange }: BookingCalendarProps) {
  const today = todayMidnight();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [booked,    setBooked]    = useState<Record<string, DateStatus>>({});
  const [loading,   setLoading]   = useState(false);

  const fetchMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/booked-dates?year=${y}&month=${m}`);
      const data = await res.json();
      setBooked(data.dates ?? {});
    } catch {
      setBooked({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMonth(viewYear, viewMonth); }, [viewYear, viewMonth, fetchMonth]);

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  // Monday-first grid
  const firstDow  = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7;
  const daysInMo  = new Date(viewYear, viewMonth, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMo }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function pad2(n: number) { return String(n).padStart(2, "0"); }
  function toISO(day: number) {
    return `${viewYear}-${pad2(viewMonth)}-${pad2(day)}`;
  }

  function isPast(day: number) {
    return new Date(viewYear, viewMonth - 1, day) < today;
  }
  function isToday(day: number) {
    return new Date(viewYear, viewMonth - 1, day).getTime() === today.getTime();
  }

  // Can we go back? Not before current month
  const canPrev = !(viewYear === today.getFullYear() && viewMonth <= today.getMonth() + 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden select-none">
      {/* ── Month header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/60 border-b border-gray-100">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <p className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
          {loading && <span className="ml-1.5 text-xs font-normal text-gray-400">···</span>}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Weekday labels ── */}
      <div className="grid grid-cols-7 border-b border-gray-50 px-1 pt-2 pb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 tracking-wider uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const iso      = toISO(day);
          const past     = isPast(day);
          const tod      = isToday(day);
          const status   = booked[iso];
          const full     = status === "full";
          const partial  = status === "partial";
          const disabled = past || full;
          const selected = value === iso;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              title={full ? "Fully booked" : partial ? "Some slots available" : undefined}
              className={[
                "relative flex flex-col items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
                selected
                  ? "bg-brand-purple text-white shadow-sm"
                  : disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-brand-light-purple hover:text-brand-purple cursor-pointer",
                tod && !selected ? "ring-2 ring-brand-purple/40 ring-offset-1" : "",
              ].join(" ")}
            >
              {day}

              {/* Status dot */}
              {!selected && partial && !disabled && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
              )}
              {!selected && full && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-5 px-4 pb-3 pt-1">
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          Some slots available
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          Fully booked
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-4 h-4 rounded-lg ring-2 ring-brand-purple/40 shrink-0" />
          Today
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Compass } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  body: string;
}

const STEPS: TourStep[] = [
  {
    target: "tour-stats",
    title: "Your business at a glance",
    body: "These 4 cards update automatically. Revenue shows money received from confirmed bookings. Pending shows bookings where the customer hasn't paid yet.",
  },
  {
    target: "tour-bookings-card",
    title: "Bookings",
    body: "Every time a customer books and pays, they appear here. You'll see their name, service, amount paid, email and phone number so you can contact them.",
  },
  {
    target: "tour-portfolio-card",
    title: "Portfolio",
    body: "Upload photos of your work and organise them by category — Styling, Events, Corporate, Vacations and more. Customers browse these on your public site.",
  },
  {
    target: "tour-testimonials-card",
    title: "Testimonials",
    body: "When a customer submits a review on the public site, it lands here for your approval. You can also add reviews you received via WhatsApp or email.",
  },
  {
    target: "tour-services-card",
    title: "Services",
    body: "Edit your service titles, descriptions and what's included. Most importantly, set the Video Call and In-Person consultation prices — customers pay these when booking.",
  },
  {
    target: "tour-faqs-card",
    title: "FAQs",
    body: "Add frequently asked questions and answers that appear on your public website. This helps customers understand your services before they book.",
  },
  {
    target: "tour-recent-bookings",
    title: "Recent bookings",
    body: "Your 6 most recent bookings shown here so you can see activity at a glance. Click 'View all' to open the full bookings page with filters and search.",
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 10;
const TIP_W = 300;

export function AdminTour() {
  const storageKey = "admin_tour_v1_done";
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [tourDone, setTourDone] = useState(true); // start true to avoid SSR flash

  useEffect(() => {
    setTourDone(localStorage.getItem(storageKey) === "1");
  }, []);

  const measure = useCallback((idx: number) => {
    const el = document.querySelector<HTMLElement>(`[data-tour="${STEPS[idx].target}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  }, []);

  const goToStep = useCallback(
    (idx: number) => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${STEPS[idx].target}"]`);
      if (!el) return;

      // Scroll element into view, then re-measure after scroll settles
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setRect(measure(idx)); // immediate (may be off if scroll needed)
      setTimeout(() => setRect(measure(idx)), 380); // after scroll
    },
    [measure],
  );

  useEffect(() => {
    if (active) goToStep(step);
  }, [active, step, goToStep]);

  // Re-measure on resize
  useEffect(() => {
    if (!active) return;
    const handler = () => setRect(measure(step));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [active, step, measure]);

  function start() {
    setStep(0);
    setActive(true);
  }

  function end() {
    setActive(false);
    setRect(null);
    localStorage.setItem(storageKey, "1");
    setTourDone(true);
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else end();
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  // Compute tooltip position relative to the spotlight rect
  function tooltipPos(): React.CSSProperties {
    if (!rect) return { display: "none" };

    const vH = window.innerHeight;
    const vW = window.innerWidth;

    const spotBottom = rect.top + rect.height + PAD;
    const spotTop = rect.top - PAD;
    const centerX = rect.left + rect.width / 2;

    // Show below if more room below, otherwise above
    const belowRoom = vH - spotBottom;
    const aboveRoom = spotTop;
    const showBelow = belowRoom >= 180 || belowRoom >= aboveRoom;

    const top = showBelow ? spotBottom + 12 : Math.max(8, aboveRoom - 180 - 12);
    let left = centerX - TIP_W / 2;
    left = Math.max(12, Math.min(left, vW - TIP_W - 12));

    return { position: "fixed", top, left, width: TIP_W, zIndex: 10001 };
  }

  const cur = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      {/* ── Tour trigger button ── */}
      <button
        onClick={start}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
          tourDone
            ? "text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple"
            : "bg-brand-purple text-white hover:bg-[#4a1470] shadow-sm"
        }`}
      >
        <Compass size={13} />
        {tourDone ? "Replay tour" : "Take a tour"}
      </button>

      {/* ── Tour overlay ── */}
      {active && rect && (
        <>
          {/* Spotlight — box-shadow creates the dark surround */}
          <div
            aria-hidden
            style={{
              position: "fixed",
              top: rect.top - PAD,
              left: rect.left - PAD,
              width: rect.width + PAD * 2,
              height: rect.height + PAD * 2,
              borderRadius: 14,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.52)",
              zIndex: 9999,
              pointerEvents: "none",
              transition: "top 0.28s ease, left 0.28s ease, width 0.28s ease, height 0.28s ease",
            }}
          />

          {/* Pulse ring on spotlight */}
          <div
            aria-hidden
            style={{
              position: "fixed",
              top: rect.top - PAD - 4,
              left: rect.left - PAD - 4,
              width: rect.width + PAD * 2 + 8,
              height: rect.height + PAD * 2 + 8,
              borderRadius: 18,
              border: "2px solid rgba(92,26,140,0.5)",
              zIndex: 9999,
              pointerEvents: "none",
              transition: "top 0.28s ease, left 0.28s ease, width 0.28s ease, height 0.28s ease",
            }}
          />

          {/* Tooltip */}
          <div
            style={tooltipPos()}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Step label + close */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-[10px] font-bold text-brand-purple/50 uppercase tracking-widest">
                {step + 1} / {STEPS.length}
              </span>
              <button
                onClick={end}
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="End tour"
              >
                <X size={13} />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="font-bold text-gray-900 text-sm mb-1 leading-snug">{cur.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{cur.body}</p>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-2">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple to-[#7B22BC] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
              <button
                onClick={prev}
                disabled={step === 0}
                className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} /> Back
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === step
                        ? "w-4 h-1.5 bg-brand-purple"
                        : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="flex items-center gap-1 text-xs font-bold text-brand-purple hover:text-[#4a1470] transition-colors"
              >
                {step === STEPS.length - 1 ? "Done" : "Next"} <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Click backdrop — clicking dark area ends the tour */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={end}
          />
        </>
      )}
    </>
  );
}

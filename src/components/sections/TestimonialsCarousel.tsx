"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  service: string;
  initials: string;
}

const INTERVAL = 5500;

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickStart = useRef(Date.now());
  const rafId = useRef<number | null>(null);
  const count = testimonials.length;

  const goTo = useCallback((idx: number) => {
    setActive(((idx % count) + count) % count);
    tickStart.current = Date.now();
    setProgress(0);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Animated progress bar + auto-advance
  useEffect(() => {
    if (paused || count <= 1) return;
    const tick = () => {
      const p = Math.min((Date.now() - tickStart.current) / INTERVAL, 1);
      setProgress(p);
      if (p < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setActive(a => (a + 1) % count);
        tickStart.current = Date.now();
        setProgress(0);
      }
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [active, paused, count]);

  if (!count) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide track ── */}
      <div className="overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {testimonials.map((t) => (
            <div key={t.id} className="w-full flex-shrink-0 px-1">
              <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A, #5C1A8C)" }} />

                {/* Background quote mark */}
                <div className="absolute -top-4 -left-2 font-heading text-[180px] leading-none font-bold select-none pointer-events-none"
                  style={{ color: "rgba(92,26,140,0.04)" }} aria-hidden="true">
                  &ldquo;
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
                  {/* Quote side */}
                  <div className="space-y-5">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#C9964A" className="text-brand-gold" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <blockquote className="font-heading text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 leading-snug">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                      >
                        {t.initials || t.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.author}</p>
                        {t.service && (
                          <p className="text-sm text-brand-gold font-medium">{t.service}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Decorative right side (desktop only) */}
                  <div className="hidden md:flex flex-col items-center justify-center gap-3 shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(92,26,140,0.08), rgba(92,26,140,0.15))", border: "1px solid rgba(92,26,140,0.12)" }}>
                      <span className="font-heading text-3xl font-bold" style={{ color: "#5C1A8C" }}>ML</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full"
                          style={{ background: i < 4 ? "#C9964A" : "rgba(201,150,74,0.3)" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-brand-purple hover:border-brand-purple/40 hover:shadow-lg transition-all z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-brand-purple hover:border-brand-purple/40 hover:shadow-lg transition-all z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Dots + progress ── */}
      {count > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="transition-all duration-300"
              >
                <span className={`block rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2 bg-brand-purple"
                    : "w-2 h-2 bg-gray-300 hover:bg-brand-purple/40"
                }`} />
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-32 h-0.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-none"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #5C1A8C, #C9964A)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

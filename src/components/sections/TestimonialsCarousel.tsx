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
const GAP = 16; // px gap between slides

// 2.5 slides visible on md+, 1.5 on sm
function computeSlideWidth(w: number) {
  return w >= 768 ? w * 0.4 : w * 0.667;
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const [slideW, setSlideW] = useState(0);
  const tickStart = useRef(Date.now());
  const rafId = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = testimonials.length;

  // Measure container and derive slide width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setContainerW(w);
      setSlideW(computeSlideWidth(w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((idx: number) => {
    setActive(((idx % count) + count) % count);
    tickStart.current = Date.now();
    setProgress(0);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // RAF-driven progress bar + auto-advance
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

  // Offset so the active slide sits centered in the container
  const offset = containerW > 0 ? (containerW - slideW) / 2 : 0;
  const trackX = containerW > 0 ? -(active * (slideW + GAP)) + offset : 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide track ── */}
      <div className="relative">
        <div ref={containerRef} className="overflow-hidden">
          <div
            className="flex py-3"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(${trackX}px)`,
              transition: "transform 700ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="flex-shrink-0 transition-all duration-500"
                style={{
                  width: slideW > 0 ? `${slideW}px` : "66.7%",
                  opacity: i === active ? 1 : 0.45,
                  transform: i === active ? "scale(1)" : "scale(0.95)",
                  cursor: i !== active ? "pointer" : "default",
                }}
                onClick={() => i !== active && goTo(i)}
                aria-hidden={i !== active}
              >
                <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden h-full">
                  {/* Gradient accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A, #5C1A8C)" }}
                  />

                  {/* Watermark quote mark */}
                  <div
                    className="absolute -top-4 -left-2 font-heading text-[160px] leading-none font-bold select-none pointer-events-none"
                    style={{ color: "rgba(92,26,140,0.04)" }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>

                  <div className="relative space-y-4 pt-1">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill="#C9964A" className="text-brand-gold" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="font-heading text-lg md:text-xl font-medium text-gray-900 leading-snug">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                      >
                        {t.initials || t.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                        {t.service && (
                          <p className="text-xs text-brand-gold font-medium">{t.service}</p>
                        )}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-brand-purple hover:border-brand-purple/40 hover:shadow-lg transition-all z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-brand-purple hover:border-brand-purple/40 hover:shadow-lg transition-all z-10"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* ── Dots + progress bar ── */}
      {count > 1 && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="transition-all duration-300"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 h-2 bg-brand-purple"
                      : "w-2 h-2 bg-gray-300 hover:bg-brand-purple/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="w-28 h-0.5 rounded-full bg-gray-200 overflow-hidden">
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

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #1a0530 0%, #3d1160 40%, #5C1A8C 70%, #2a0848 100%)" }}>
        {/* Subtle texture layer */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #C9964A 0px, #C9964A 1px, transparent 1px, transparent 60px)" }} />
        {/* Radial glow top-right */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.18) 0%, transparent 60%)" }} />
        {/* Radial glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(123,34,188,0.3) 0%, transparent 60%)" }} />
      </div>

      {/* Decorative top-right accent */}
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-full"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.12) 0%, transparent 60%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#C9964A" className="text-brand-gold" />
              ))}
            </div>
            <span className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase">
              Personal Styling &amp; Image Consultancy
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.0] mb-6">
            Quality is<br />
            our{" "}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: "2px #C9964A",
                color: "transparent",
              }}
            >
              priority.
            </span>
          </h1>

          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            Helping you show up as the most powerful, confident version of
            yourself — every single day.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-full transition-all duration-200 shadow-xl text-base group"
              style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
            >
              Book a Consult
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/25 hover:bg-white/20 transition-all duration-200 text-base"
            >
              View My Work
            </Link>
          </div>

          {/* Floating stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { value: "200+", label: "Clients styled" },
              { value: "5★", label: "Client rating" },
              { value: "6", label: "Services" },
            ].map((stat) => (
              <div key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <span className="font-heading font-bold text-brand-gold text-sm">{stat.value}</span>
                <span className="text-white/60 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-8 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

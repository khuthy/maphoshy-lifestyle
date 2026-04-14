import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0px,  0px) scale(1);    opacity: 1;    }
          33%       { transform: translate(40px, -30px) scale(1.06); opacity: 0.85; }
          66%       { transform: translate(-25px, 40px) scale(0.96); opacity: 0.9;  }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0px, 0px) scale(1);    }
          40%       { transform: translate(-35px, 25px) scale(1.08); }
          75%       { transform: translate(20px, -35px) scale(0.94); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50%       { transform: translateY(-14px) rotate(var(--rot, 0deg)); }
        }
        @keyframes cardFloat2 {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50%       { transform: translateY(12px) rotate(var(--rot, 0deg)); }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-text-1 { animation: fadeSlideUp 0.8s ease both 0.1s; }
        .hero-text-2 { animation: fadeSlideUp 0.8s ease both 0.3s; }
        .hero-text-3 { animation: fadeSlideUp 0.8s ease both 0.5s; }
        .hero-text-4 { animation: fadeSlideUp 0.8s ease both 0.7s; }
        .hero-mosaic  { animation: fadeSlideRight 1s ease both 0.4s; }
      `}</style>

      {/* ── Deep background ── */}
      <div className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(145deg, #060011 0%, #110228 25%, #1e0742 50%, #2a0a5e 70%, #1a0530 100%)" }} />

      {/* ── Atmospheric orbs ── */}
      {/* Gold orb — top right */}
      <div className="absolute -top-40 -right-20 w-[750px] h-[750px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(201,150,74,0.28) 0%, rgba(201,150,74,0.10) 35%, transparent 65%)",
          filter: "blur(60px)",
          animation: "orbFloat 9s ease-in-out infinite",
        }} />

      {/* Violet orb — mid left */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 60% 50%, rgba(138,43,226,0.35) 0%, rgba(92,26,140,0.18) 40%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orbFloat2 12s ease-in-out infinite",
        }} />

      {/* Rose/magenta orb — bottom right */}
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(180,50,160,0.22) 0%, rgba(140,30,120,0.10) 45%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orbFloat 14s ease-in-out infinite 3s",
        }} />

      {/* Small bright gold accent — near content */}
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(201,150,74,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "orbFloat2 7s ease-in-out infinite 1.5s",
        }} />

      {/* ── Fine grid texture ── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(201,150,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,150,74,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />

      {/* ── Diagonal shimmer sweep ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 bottom-0 w-40 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.018), transparent)",
            animation: "shimmerLine 6s linear infinite 2s",
          }} />
      </div>

      {/* ── Vignette edges ── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(6,0,17,0.7) 100%)" }} />

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(6,0,17,0.6), transparent)" }} />

      {/* ── Top-left decorative corner ── */}
      <div className="absolute top-0 left-0 z-0 pointer-events-none">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <path d="M0 0 L320 0 L0 320 Z" fill="url(#cornerGrad)" fillOpacity="0.06" />
          <defs>
            <linearGradient id="cornerGrad" x1="0" y1="0" x2="320" y2="320">
              <stop offset="0%" stopColor="#C9964A" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Main content grid ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 xl:gap-16 items-center">

          {/* ── Left: Text content ── */}
          <div className="max-w-xl">

            {/* Eyebrow pill */}
            <div className="hero-text-1 inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
              style={{ background: "rgba(201,150,74,0.12)", border: "1px solid rgba(201,150,74,0.30)" }}>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#C9964A" className="text-brand-gold" />
                ))}
              </div>
              <span className="text-brand-gold text-[11px] font-semibold tracking-[0.28em] uppercase">
                Personal Styling &amp; Image Consultancy
              </span>
            </div>

            {/* Main headline */}
            <h1 className="hero-text-2 font-heading font-bold text-white leading-[0.96] mb-6"
              style={{ fontSize: "clamp(3.2rem, 7vw, 5.5rem)" }}>
              Quality is<br />
              <span className="relative">
                our{" "}
                <span
                  className="relative inline-block"
                  style={{ WebkitTextStroke: "2px #C9964A", color: "transparent" }}
                >
                  priority
                </span>
                <span className="text-white">.</span>
              </span>
            </h1>

            {/* Gold rule */}
            <div className="hero-text-2 flex items-center gap-4 mb-6">
              <div className="h-px w-10 rounded-full" style={{ background: "linear-gradient(90deg, #C9964A, transparent)" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            </div>

            {/* Sub-copy */}
            <p className="hero-text-3 text-white/65 text-base md:text-[1.05rem] leading-relaxed mb-10 max-w-md">
              Helping you show up as the most powerful, confident version of
              yourself — through expert styling, custom design and a look
              that is authentically yours.
            </p>

            {/* CTAs */}
            <div className="hero-text-4 flex flex-wrap gap-4 mb-12">
              <Link
                href="/book"
                className="inline-flex items-center gap-2.5 px-8 py-4 font-semibold rounded-full text-white text-sm transition-all duration-200 shadow-2xl group relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #C9964A 0%, #e6b06a 50%, #C9964A 100%)", backgroundSize: "200% auto" }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Book a Consult
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2.5 px-8 py-4 font-semibold rounded-full text-sm transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  color: "rgba(255,255,255,0.90)",
                  backdropFilter: "blur(12px)",
                }}
              >
                View Our Work
              </Link>
            </div>

            {/* Stat pills */}
            <div className="hero-text-4 flex flex-wrap gap-3">
              {[
                { value: "200+", label: "Clients styled" },
                { value: "5★",   label: "Client rating" },
                { value: "6",    label: "Services" },
              ].map((stat) => (
                <div key={stat.label}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                  <span className="font-heading font-bold text-brand-gold text-sm">{stat.value}</span>
                  <span className="text-white/50 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image mosaic ── */}
          <div className="hero-mosaic relative hidden lg:block h-[620px]">

            {/* Soft glow behind images */}
            <div className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: "radial-gradient(ellipse at 55% 50%, rgba(201,150,74,0.18) 0%, rgba(92,26,140,0.12) 50%, transparent 75%)", filter: "blur(24px)" }} />

            {/* ── Card 1: Large left, tall ── */}
            <div className="absolute left-0 top-8 w-[215px] h-[350px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{
                border: "1px solid rgba(201,150,74,0.35)",
                "--rot": "-1.5deg",
                animation: "cardFloat 7s ease-in-out infinite",
              } as React.CSSProperties}>
              <Image src="/assets/image00003.jpeg" alt="Maphoshy Lifestyle — personal styling" fill className="object-cover" sizes="215px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(6,0,17,0.75) 100%)" }} />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Styling</span>
              </div>
            </div>

            {/* ── Card 2: Top centre-right ── */}
            <div className="absolute left-[205px] top-0 w-[175px] h-[255px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                "--rot": "1.2deg",
                animation: "cardFloat2 8s ease-in-out infinite 0.8s",
              } as React.CSSProperties}>
              <Image src="/assets/image00007.jpeg" alt="Maphoshy Lifestyle — event styling" fill className="object-cover" sizes="175px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(6,0,17,0.65) 100%)" }} />
            </div>

            {/* ── Card 3: Far right, mid height ── */}
            <div className="absolute right-0 top-[60px] w-[185px] h-[290px] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.58)]"
              style={{
                border: "1px solid rgba(201,150,74,0.20)",
                "--rot": "2deg",
                animation: "cardFloat 6s ease-in-out infinite 1.6s",
              } as React.CSSProperties}>
              <Image src="/assets/image00011.jpeg" alt="Maphoshy Lifestyle — custom garment" fill className="object-cover" sizes="185px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(6,0,17,0.65) 100%)" }} />
            </div>

            {/* ── Card 4: Bottom, overlapping cards 1+2 ── */}
            <div className="absolute left-[175px] bottom-0 w-[210px] h-[270px] rounded-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.60)]"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                "--rot": "-0.8deg",
                animation: "cardFloat2 9s ease-in-out infinite 2.2s",
              } as React.CSSProperties}>
              <Image src="/assets/image00021.jpeg" alt="Maphoshy Lifestyle — corporate styling" fill className="object-cover" sizes="210px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(6,0,17,0.70) 100%)" }} />
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Corporate</span>
              </div>
            </div>

            {/* ── Vertical gold accent line ── */}
            <div className="absolute left-[198px] top-[16px] bottom-[16px] w-px pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(201,150,74,0.45) 20%, rgba(201,150,74,0.45) 80%, transparent 100%)" }} />

            {/* ── Floating stat badge: top-left of mosaic ── */}
            <div className="absolute -left-5 top-[220px] z-20 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              style={{ animation: "badgeFloat 5s ease-in-out infinite 1s" }}>
              <p className="font-heading text-xl font-bold text-brand-purple leading-none">200+</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Clients Transformed</p>
            </div>

            {/* ── Floating rating badge: bottom-right ── */}
            <div className="absolute right-[-14px] bottom-[130px] z-20 rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              style={{
                background: "rgba(26,5,48,0.95)",
                border: "1px solid rgba(201,150,74,0.45)",
                backdropFilter: "blur(12px)",
                animation: "badgeFloat 6s ease-in-out infinite 2.5s",
              }}>
              <div className="flex gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#C9964A" className="text-brand-gold" />)}
              </div>
              <p className="text-white text-xs font-semibold">5-Star Rated</p>
              <p className="text-white/40 text-[10px]">by 200+ clients</p>
            </div>

            {/* ── Small diamond decoration ── */}
            <div className="absolute top-[10px] right-[175px] z-20 pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="12" y="1" width="15" height="15" rx="1" transform="rotate(45 12 1)" fill="none" stroke="rgba(201,150,74,0.6)" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="absolute bottom-[80px] left-[155px] z-20 pointer-events-none opacity-60">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="12" y="1" width="15" height="15" rx="1" transform="rotate(45 12 1)" fill="rgba(201,150,74,0.5)" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-6 right-8 z-10 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/25 text-[10px] tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>

    </section>
  );
}

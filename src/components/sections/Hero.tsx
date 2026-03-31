import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/image00001.jpeg"
          alt="Maphoshy Lifestyle — Portia Maluleke"
          fill
          priority
          quality={85}
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Dark overlay with brand purple tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a0a42]/90 via-[#2a0a42]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-2xl">
          <p className="text-brand-gold text-sm font-medium tracking-[0.3em] uppercase mb-6">
            Maphoshy Lifestyle
          </p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Quality is our{" "}
            <span className="text-brand-gold">priority.</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Personal styling and image consultancy by Portia Maluleke. Helping
            you show up as the most powerful version of yourself — every day.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all duration-200 shadow-lg hover:shadow-xl text-base"
            >
              Book a Consult
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-200 text-base"
            >
              View My Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PortfolioGrid, type PortfolioImage } from "@/components/sections/PortfolioGrid";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

// Always render fresh — data is managed via the admin panel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse Portia Maluleke's portfolio of personal styling, custom garments, alterations, corporate and event styling work.",
};

async function getPortfolioImages(): Promise<PortfolioImage[]> {
  try {
    const db = createServerClient();
    const { data } = await db
      .from("portfolio_items")
      .select("src, alt, category, label")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (data && data.length > 0) return data as PortfolioImage[];
  } catch {
    // Fall through to empty array — PortfolioGrid will use fallback
  }
  return [];
}

export default async function PortfolioPage() {
  const images = await getPortfolioImages();

  return (
    <>
      {/* ── Page Header ── */}
      <div className="relative pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #7B22BC 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.15) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.3)" }}>
            <Camera size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">Our Work</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Portfolio
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Every image tells a story. Browse transformations across personal
            styling, custom garments, event looks and more.
          </p>
          {/* Gold rule */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Grid section ── */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGrid images={images} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden bg-white">
        {/* Subtle diagonal stripe */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #5C1A8C 0px, #5C1A8C 1px, transparent 1px, transparent 40px)" }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top gold accent */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-brand-gold/50" />
            <div className="w-2 h-2 rounded-full bg-brand-gold" />
            <div className="h-px w-12 bg-brand-gold/50" />
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Love what you see?
          </h2>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">
            Book a consultation and let&apos;s create{" "}
            <span className="text-brand-purple font-semibold">your own transformation.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-base group"
              style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
            >
              Book a Consult
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all duration-200 text-base"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

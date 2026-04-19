import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Star, ArrowRight } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase";
import { ServicesGrid, type ServiceRow } from "@/components/sections/ServicesGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all Maphoshy Lifestyle services: personal styling, wardrobe curation, personal shopping, corporate styling, event styling, and custom design.",
};

const FALLBACK_SERVICES: ServiceRow[] = [
  { id: "1", service_key: "consultation", icon_name: "Sparkles", title: "Personal Style Consultation", description: "Your style journey starts here. In this deep-dive session, we get to know you — your lifestyle, personality, body shape, colour palette and goals. Together we will define your signature style and build a clear roadmap to achieve it.", includes: ["60–90 minute style assessment", "Body shape and colour analysis", "Lifestyle and wardrobe audit", "Personalised style brief", "Shopping list and brand recommendations"], price_from: "R 500", booking_key: "consultation" },
  { id: "2", service_key: "wardrobe", icon_name: "Shirt", title: "Wardrobe Curation & Editing", description: "A cluttered wardrobe leads to decision fatigue and wasted money. We visit your space (or work with you virtually), edit what no longer serves you, organise what stays, and identify the exact pieces that will complete your wardrobe.", includes: ["Full wardrobe audit", "Category-by-category edit", "Styling and outfit mapping", "Gap analysis shopping list", "Storage and organisation tips"], price_from: "R 800", booking_key: "wardrobe" },
  { id: "3", service_key: "shopping", icon_name: "ShoppingBag", title: "Personal Shopping Services", description: "Skip the overwhelm. We do the research, visit the stores, and present you with curated options that fit your style, body and budget — saving you hours and money.", includes: ["Pre-shopping style brief", "In-store or online sourcing", "Budget-aligned selections", "Try-on session and fit review", "Final look approval and care guidance"], price_from: "R 600", booking_key: "shopping" },
  { id: "4", service_key: "corporate", icon_name: "Briefcase", title: "Professional & Corporate Styling", description: "Your appearance is part of your personal brand. We work with professionals and executives to build a wardrobe that reflects their position, communicates confidence and aligns with their industry.", includes: ["Industry and role analysis", "Dress code interpretation", "Power wardrobe building", "Grooming and accessory guidance", "Presentation and interview dressing"], price_from: "R 700", booking_key: "corporate" },
  { id: "5", service_key: "event", icon_name: "Star", title: "Event & Special Occasion Styling", description: "Every milestone deserves an unforgettable look. Whether it is a wedding, graduation, gala, birthday shoot or media appearance — we will make sure you look and feel extraordinary.", includes: ["Event brief and theme consultation", "Outfit sourcing or custom design", "Accessories and hair & makeup direction", "Final outfit approval", "On-the-day styling (optional)"], price_from: "R 650", booking_key: "event" },
  { id: "6", service_key: "custom_garment", icon_name: "Scissors", title: "Custom Design & In-House Alterations", description: "When off-the-rack just will not do. We design and produce bespoke garments from scratch — tailored precisely to your measurements, fabric preferences and occasion. We also offer expert alterations on existing pieces.", includes: ["Design consultation and brief", "Fabric and trim selection", "Full body measurements", "Multiple fitting sessions", "Finished garment with care instructions"], price_from: "R 400", booking_key: "custom_garment" },
];

async function getServices(): Promise<ServiceRow[]> {
  try {
    const db = createPublicServerClient();
    const { data, error } = await db
      .from("service_content")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      const { data: fallbackData, error: fe } = await db
        .from("service_content")
        .select("*")
        .order("service_key");
      if (!fe && fallbackData && fallbackData.length > 0) return fallbackData as ServiceRow[];
    }

    if (data && data.length > 0) {
      const active = (data as ServiceRow[]).filter(s => s.active !== false);
      return active.length > 0 ? active : (data as ServiceRow[]);
    }
  } catch (err) {
    console.error("[services] unexpected error:", err);
  }
  return FALLBACK_SERVICES;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* ── Page Header ── */}
      <div className="relative pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #7B22BC 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.15) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.3)" }}>
            <Sparkles size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">What We Offer</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Our Services
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Every service is built around one goal: helping you show up as
            the most powerful version of yourself.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Services ── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesGrid services={services} />
        </div>
      </section>

      {/* ── Style Discovery CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0530 0%, #3d1160 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,150,74,0.08) 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.25)" }}>
            <Star size={28} className="text-brand-gold" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Not sure what you need?
          </h2>
          <p className="text-white/65 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            That&apos;s perfectly fine. Book a{" "}
            <strong className="text-white font-semibold">Style Discovery Session</strong>{" "}
            and we will guide you through your style identity, your goals
            and the right service for your journey — before you commit to anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book?service=style_discovery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-semibold rounded-full hover:bg-[#b8833e] transition-all shadow-lg text-base"
            >
              Book a Style Discovery Session
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Shirt,
  ShoppingBag,
  Briefcase,
  Star,
  Scissors,
  ArrowRight,
  Check,
  type LucideIcon,
} from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase";

// Always render fresh — data is managed via the admin panel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all Maphoshy Lifestyle services: personal styling, wardrobe curation, personal shopping, corporate styling, event styling, and custom design.",
};

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shirt, ShoppingBag, Briefcase, Star, Scissors,
};

interface ServiceRow {
  id: string;
  service_key: string;
  title: string;
  description: string;
  includes: string[];
  price_from: string;
  booking_key: string;
  icon_name: string;
}

const FALLBACK_SERVICES: ServiceRow[] = [
  { id: "1", service_key: "consultation", icon_name: "Sparkles", title: "Personal Style Consultation", description: "Your style journey starts here. In this deep-dive session, Portia gets to know you — your lifestyle, personality, body shape, colour palette and goals. Together you'll define your signature style and build a clear roadmap to achieve it.", includes: ["60–90 minute style assessment", "Body shape and colour analysis", "Lifestyle and wardrobe audit", "Personalised style brief", "Shopping list and brand recommendations"], price_from: "R 500", booking_key: "consultation" },
  { id: "2", service_key: "wardrobe", icon_name: "Shirt", title: "Wardrobe Curation & Editing", description: "A cluttered wardrobe leads to decision fatigue and wasted money. Portia visits your space (or works with you virtually), edits what no longer serves you, organises what stays, and identifies the exact pieces that will complete your wardrobe.", includes: ["Full wardrobe audit", "Category-by-category edit", "Styling and outfit mapping", "Gap analysis shopping list", "Storage and organisation tips"], price_from: "R 800", booking_key: "wardrobe" },
  { id: "3", service_key: "shopping", icon_name: "ShoppingBag", title: "Personal Shopping Services", description: "Skip the overwhelm. Portia does the research, visits the stores, and presents you with curated options that fit your style, body and budget — saving you hours and money.", includes: ["Pre-shopping style brief", "In-store or online sourcing", "Budget-aligned selections", "Try-on session and fit review", "Final look approval and care guidance"], price_from: "R 600", booking_key: "shopping" },
  { id: "4", service_key: "corporate", icon_name: "Briefcase", title: "Professional & Corporate Styling", description: "Your appearance is part of your personal brand. Portia works with professionals and executives to build a wardrobe that reflects their position, communicates confidence and aligns with their industry.", includes: ["Industry and role analysis", "Dress code interpretation", "Power wardrobe building", "Grooming and accessory guidance", "Presentation and interview dressing"], price_from: "R 700", booking_key: "corporate" },
  { id: "5", service_key: "event", icon_name: "Star", title: "Event & Special Occasion Styling", description: "Every milestone deserves an unforgettable look. Whether it's a wedding, graduation, gala, birthday shoot or media appearance — Portia will make sure you look and feel extraordinary.", includes: ["Event brief and theme consultation", "Outfit sourcing or custom design", "Accessories and hair & makeup direction", "Final outfit approval", "On-the-day styling (optional)"], price_from: "R 650", booking_key: "event" },
  { id: "6", service_key: "custom_garment", icon_name: "Scissors", title: "Custom Design & In-House Alterations", description: "When off-the-rack just won't do. Portia designs and produces bespoke garments from scratch — tailored precisely to your measurements, fabric preferences and occasion. She also offers expert alterations on existing pieces.", includes: ["Design consultation and brief", "Fabric and trim selection", "Full body measurements", "Multiple fitting sessions", "Finished garment with care instructions"], price_from: "R 400", booking_key: "custom_garment" },
];

async function getServices(): Promise<ServiceRow[]> {
  try {
    const db = createPublicServerClient();
    const { data, error } = await db
      .from("service_content")
      .select("*")
      .order("service_key");
    if (error) console.error("[services] service_content error:", error.message);
    if (data && data.length > 0) return data as ServiceRow[];
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
        {/* Decorative blobs */}
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
            Six specialist services, all built around one goal: helping you
            show up as the most powerful version of yourself.
          </p>
          {/* Gold rule */}
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
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = ICON_MAP[service.icon_name] ?? Sparkles;
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80"
                >
                  {/* Top accent bar */}
                  <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A)" }} />

                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left: icon + number */}
                      <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300"
                          style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                        >
                          <Icon size={30} className="text-white" />
                        </div>
                        <span
                          className="font-heading font-bold text-5xl md:text-6xl leading-none select-none"
                          style={{ color: "rgba(92,26,140,0.07)" }}
                        >
                          0{index + 1}
                        </span>
                      </div>

                      {/* Right: content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                            {service.title}
                          </h2>
                          <span
                            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shrink-0"
                            style={{ background: "rgba(201,150,74,0.12)", color: "#9a6e2e" }}
                          >
                            From {service.price_from}
                          </span>
                        </div>

                        <p className="text-gray-500 leading-relaxed mb-7 text-[15px]">
                          {service.description}
                        </p>

                        {/* What's included */}
                        <div className="mb-7">
                          <p className="text-xs font-bold text-brand-purple uppercase tracking-[0.15em] mb-4">
                            What&apos;s included
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ background: "rgba(92,26,140,0.1)" }}>
                                  <Check size={11} className="text-brand-purple" strokeWidth={3} />
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          href={`/book?service=${service.booking_key}`}
                          className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm group/btn"
                          style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                        >
                          Book This Service
                          <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
            and Portia will guide you through your style identity, your goals
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

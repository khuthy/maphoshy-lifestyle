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
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all Maphoshy Lifestyle services: personal styling, wardrobe curation, personal shopping, corporate styling, event styling, and custom design.",
};

const services = [
  {
    id: "consultation",
    icon: Sparkles,
    title: "Personal Style Consultation",
    description:
      "Your style journey starts here. In this deep-dive session, Portia gets to know you — your lifestyle, personality, body shape, colour palette and goals. Together you'll define your signature style and build a clear roadmap to achieve it.",
    includes: [
      "60–90 minute style assessment",
      "Body shape and colour analysis",
      "Lifestyle and wardrobe audit",
      "Personalised style brief",
      "Shopping list and brand recommendations",
    ],
    priceFrom: "R 500",
    booking: "consultation",
  },
  {
    id: "wardrobe",
    icon: Shirt,
    title: "Wardrobe Curation & Editing",
    description:
      "A cluttered wardrobe leads to decision fatigue and wasted money. Portia visits your space (or works with you virtually), edits what no longer serves you, organises what stays, and identifies the exact pieces that will complete your wardrobe.",
    includes: [
      "Full wardrobe audit",
      "Category-by-category edit",
      "Styling and outfit mapping",
      "Gap analysis shopping list",
      "Storage and organisation tips",
    ],
    priceFrom: "R 800",
    booking: "wardrobe",
  },
  {
    id: "shopping",
    icon: ShoppingBag,
    title: "Personal Shopping Services",
    description:
      "Skip the overwhelm. Portia does the research, visits the stores, and presents you with curated options that fit your style, body and budget — saving you hours and money.",
    includes: [
      "Pre-shopping style brief",
      "In-store or online sourcing",
      "Budget-aligned selections",
      "Try-on session and fit review",
      "Final look approval and care guidance",
    ],
    priceFrom: "R 600",
    booking: "shopping",
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Professional & Corporate Styling",
    description:
      "Your appearance is part of your personal brand. Portia works with professionals and executives to build a wardrobe that reflects their position, communicates confidence and aligns with their industry.",
    includes: [
      "Industry and role analysis",
      "Dress code interpretation",
      "Power wardrobe building",
      "Grooming and accessory guidance",
      "Presentation and interview dressing",
    ],
    priceFrom: "R 700",
    booking: "corporate",
  },
  {
    id: "event",
    icon: Star,
    title: "Event & Special Occasion Styling",
    description:
      "Every milestone deserves an unforgettable look. Whether it's a wedding, graduation, gala, birthday shoot or media appearance — Portia will make sure you look and feel extraordinary.",
    includes: [
      "Event brief and theme consultation",
      "Outfit sourcing or custom design",
      "Accessories and hair & makeup direction",
      "Final outfit approval",
      "On-the-day styling (optional)",
    ],
    priceFrom: "R 650",
    booking: "event",
  },
  {
    id: "custom_garment",
    icon: Scissors,
    title: "Custom Design & In-House Alterations",
    description:
      "When off-the-rack just won't do. Portia designs and produces bespoke garments from scratch — tailored precisely to your measurements, fabric preferences and occasion. She also offers expert alterations on existing pieces.",
    includes: [
      "Design consultation and brief",
      "Fabric and trim selection",
      "Full body measurements",
      "Multiple fitting sessions",
      "Finished garment with care instructions",
    ],
    priceFrom: "R 400",
    booking: "custom_garment",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <div className="pt-28 pb-16 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-4">
            What We Offer
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Six specialist services, all built around one goal: helping you
            show up as the most powerful version of yourself.
          </p>
        </div>
      </div>

      {/* Services list */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Icon + number */}
                      <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-2 shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-brand-light-purple flex items-center justify-center">
                          <Icon size={28} className="text-brand-purple" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium md:text-center">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <h2 className="font-heading text-2xl font-bold text-gray-900">
                            {service.title}
                          </h2>
                          <span className="text-brand-gold font-semibold text-sm whitespace-nowrap bg-brand-gold/10 px-3 py-1.5 rounded-full">
                            From {service.priceFrom}
                          </span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-6">
                          {service.description}
                        </p>

                        {/* What's included */}
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-3">
                            What&apos;s included
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.includes.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm text-gray-600"
                              >
                                <span className="text-brand-gold mt-0.5 shrink-0">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          href={`/book?service=${service.booking}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg text-sm"
                        >
                          Book This Service
                          <ArrowRight size={16} />
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

      {/* Style Discovery CTA */}
      <section className="py-16 bg-brand-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <HelpCircle size={32} className="text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                Not sure what you need?
              </h2>
              <p className="text-white/75 text-lg mb-6 md:mb-0">
                That&apos;s perfectly fine. Book a{" "}
                <strong className="text-white">Style Discovery Session</strong>{" "}
                and Portia will guide you through your style identity, your
                goals and the right service for your journey — before you
                commit to anything.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/book?service=style_discovery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-white font-semibold rounded-full hover:bg-[#b8833e] transition-all shadow-lg text-base whitespace-nowrap"
              >
                Book a Style Discovery Session
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing link */}
      <section className="py-12 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            Want a full breakdown of pricing across all services?
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-brand-purple font-semibold hover:gap-3 transition-all"
          >
            View Full Pricing
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

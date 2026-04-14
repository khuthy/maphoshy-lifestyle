import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, TrendingUp, Plus, Minus } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase";

// Always render fresh — data is managed via the admin panel
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for all Maphoshy Lifestyle services. Personal styling, custom garments, alterations and more.",
};

interface PricingEntry {
  id: string;
  name: string;
  description: string;
  price: string;
  note: string | null;
  highlight: boolean;
  booking_key: string;
}

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const FALLBACK_PRICING: PricingEntry[] = [
  { id: "1", name: "Style Discovery Session", description: "For undecided clients — we guide you to the right service.", price: "R 350", note: "Video call or in-person", highlight: false, booking_key: "style_discovery" },
  { id: "2", name: "Personal Style Consultation", description: "60–90 minute deep-dive into your style identity, colour palette and wardrobe goals.", price: "R 500", note: "In-person or virtual", highlight: true, booking_key: "consultation" },
  { id: "3", name: "Wardrobe Curation & Editing", description: "Full wardrobe audit, edit and organisation with a shopping gap list.", price: "From R 800", note: "Duration varies by wardrobe size", highlight: false, booking_key: "wardrobe" },
  { id: "4", name: "Personal Shopping", description: "We source and present curated options aligned to your style and budget.", price: "From R 600", note: "+ travel costs if applicable", highlight: false, booking_key: "shopping" },
  { id: "5", name: "Corporate & Professional Styling", description: "Build a power wardrobe for your career and brand.", price: "From R 700", note: "Includes dress code analysis", highlight: false, booking_key: "corporate" },
  { id: "6", name: "Event & Occasion Styling", description: "One-off look creation for weddings, graduations, galas and more.", price: "From R 650", note: "Custom garment add-on available", highlight: false, booking_key: "event" },
  { id: "7", name: "Custom Garment Design", description: "Bespoke garments designed and made in-house from your measurements.", price: "From R 400", note: "Price excludes fabric cost", highlight: false, booking_key: "custom_garment" },
  { id: "8", name: "In-House Alterations", description: "Expert alterations — hemming, taking in/letting out, zip replacement and more.", price: "From R 400", note: "Price depends on complexity", highlight: false, booking_key: "alteration" },
];

const FALLBACK_FAQS: FaqEntry[] = [
  { id: "1", question: "Why do I pay upfront?", answer: "The consultation fee secures our time and expertise for your session. It ensures that only committed clients are scheduled, which means we can give each client our full attention without last-minute cancellations." },
  { id: "2", question: "Can the consultation fee be deducted from my final service cost?", answer: "Yes — for clients who proceed to a full service (custom garment, wardrobe, etc.) within 30 days of their consultation, the consultation fee is credited towards the total. Reach out to us directly to confirm this arrangement." },
  { id: "3", question: "What payment methods are accepted?", answer: "All payments are processed securely through PayFast. You can pay via credit or debit card (Visa, Mastercard), EFT, Capitec Pay, and SnapScan. Your card details are never shared with Maphoshy Lifestyle." },
  { id: "4", question: "What happens if I need to cancel or reschedule?", answer: "Please give at least 48 hours' notice for cancellations or rescheduling. We will work with you to find a new date. Refunds for cancellations are handled on a case-by-case basis — reach out via WhatsApp or email." },
  { id: "5", question: "Are virtual consultations available?", answer: "Yes! Most consultations can be done via video call. The Style Discovery Session, Personal Style Consultation and Personal Shopping are all available virtually. Custom garment and alteration services require an in-person fitting." },
];

async function getPricingData() {
  try {
    const db = createPublicServerClient();
    const [pricingRes, faqsRes] = await Promise.all([
      db.from("pricing_entries").select("id, name, description, price, note, highlight, booking_key").eq("active", true).order("display_order"),
      db.from("faqs").select("id, question, answer").eq("active", true).order("display_order"),
    ]);

    if (pricingRes.error) console.error("[pricing] pricing_entries error:", pricingRes.error.message);
    if (faqsRes.error) console.error("[pricing] faqs error:", faqsRes.error.message);

    const pricing = pricingRes.data && pricingRes.data.length > 0 ? (pricingRes.data as PricingEntry[]) : FALLBACK_PRICING;
    const faqs = faqsRes.data && faqsRes.data.length > 0 ? (faqsRes.data as FaqEntry[]) : FALLBACK_FAQS;
    return { pricing, faqs };
  } catch (err) {
    console.error("[pricing] unexpected error:", err);
    return { pricing: FALLBACK_PRICING, faqs: FALLBACK_FAQS };
  }
}

export default async function PricingPage() {
  const { pricing, faqs } = await getPricingData();

  return (
    <>
      {/* ── Page Header ── */}
      <div className="relative pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #7B22BC 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.15) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.3)" }}>
            <TrendingUp size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">Transparent Pricing</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Investment in Yourself
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Quality service at clear, honest prices. Every rand you invest in
            your style is an investment in how you show up in the world.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Pricing Cards ── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {pricing.map((service) =>
              service.highlight ? (
                /* ─ Featured / Highlighted card ─ */
                <div
                  key={service.id}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 60%, #7B22BC 100%)" }}
                >
                  {/* shine strip */}
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} />

                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-xl font-bold text-white">
                            {service.name}
                          </h3>
                          <span className="text-xs bg-brand-gold text-white px-3 py-1 rounded-full font-semibold shrink-0">
                            Most Popular
                          </span>
                        </div>
                        <p className="text-white/65 text-sm leading-relaxed">{service.description}</p>
                        {service.note && (
                          <p className="text-white/40 text-xs mt-1.5">{service.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <p className="font-heading text-3xl font-bold text-brand-gold">
                          {service.price}
                        </p>
                        <Link
                          href={`/book?service=${service.booking_key}`}
                          className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-brand-purple hover:bg-brand-gold hover:text-white transition-all shadow-md"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─ Regular card ─ */
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-300"
                >
                  {/* Left colored accent */}
                  <div className="flex">
                    <div className="w-1 rounded-l-2xl shrink-0"
                      style={{ background: "linear-gradient(180deg, #5C1A8C, #C9964A)" }} />
                    <div className="flex-1 p-6 md:p-7">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                          {service.note && (
                            <p className="text-gray-400 text-xs mt-1.5">{service.note}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <p className="font-heading text-2xl font-bold text-brand-purple">
                            {service.price}
                          </p>
                          <Link
                            href={`/book?service=${service.booking_key}`}
                            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Hint box */}
          <div className="mt-10 p-6 rounded-2xl flex gap-4" style={{ background: "rgba(92,26,140,0.06)", border: "1px solid rgba(92,26,140,0.12)" }}>
            <HelpCircle size={20} className="text-brand-purple shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-brand-purple">Not sure where to start?</strong>{" "}
              The Style Discovery Session (R&nbsp;350) is designed for exactly that
              — we will guide you to the right service for your needs.{" "}
              <Link href="/book?service=style_discovery" className="text-brand-purple font-semibold underline underline-offset-2 hover:text-[#4a1470]">
                Book it here.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">Got Questions?</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-brand-bg rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-purple/20 transition-colors"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none gap-4">
                  <span className="font-semibold text-gray-900 text-[15px] leading-snug">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ background: "rgba(92,26,140,0.1)" }}>
                    <Plus size={16} className="text-brand-purple group-open:hidden" />
                    <Minus size={16} className="text-brand-purple hidden group-open:block" />
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-100 mb-4" />
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0530 0%, #3d1160 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(201,150,74,0.08) 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to book?
          </h2>
          <p className="text-white/60 mb-10 text-lg leading-relaxed">
            Choose your service and secure your slot today.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-gold text-white font-semibold rounded-full hover:bg-[#b8833e] transition-all shadow-lg text-base group"
          >
            Book a Consult
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}

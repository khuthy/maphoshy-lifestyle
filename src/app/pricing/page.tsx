import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { createServerClient } from "@/lib/supabase";

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
  { id: "1", name: "Style Discovery Session", description: "For undecided clients — Portia guides you to the right service.", price: "R 350", note: "Video call or in-person", highlight: false, booking_key: "style_discovery" },
  { id: "2", name: "Personal Style Consultation", description: "60–90 minute deep-dive into your style identity, colour palette and wardrobe goals.", price: "R 500", note: "In-person or virtual", highlight: true, booking_key: "consultation" },
  { id: "3", name: "Wardrobe Curation & Editing", description: "Full wardrobe audit, edit and organisation with a shopping gap list.", price: "From R 800", note: "Duration varies by wardrobe size", highlight: false, booking_key: "wardrobe" },
  { id: "4", name: "Personal Shopping", description: "Portia sources and presents curated options aligned to your style and budget.", price: "From R 600", note: "+ travel costs if applicable", highlight: false, booking_key: "shopping" },
  { id: "5", name: "Corporate & Professional Styling", description: "Build a power wardrobe for your career and brand.", price: "From R 700", note: "Includes dress code analysis", highlight: false, booking_key: "corporate" },
  { id: "6", name: "Event & Occasion Styling", description: "One-off look creation for weddings, graduations, galas and more.", price: "From R 650", note: "Custom garment add-on available", highlight: false, booking_key: "event" },
  { id: "7", name: "Custom Garment Design", description: "Bespoke garments designed and made in-house from your measurements.", price: "From R 400", note: "Price excludes fabric cost", highlight: false, booking_key: "custom_garment" },
  { id: "8", name: "In-House Alterations", description: "Expert alterations — hemming, taking in/letting out, zip replacement and more.", price: "From R 400", note: "Price depends on complexity", highlight: false, booking_key: "alteration" },
];

const FALLBACK_FAQS: FaqEntry[] = [
  { id: "1", question: "Why do I pay upfront?", answer: "The consultation fee secures Portia's time and expertise for your session. It ensures that only committed clients are scheduled, which means Portia can give each client her full attention without last-minute cancellations." },
  { id: "2", question: "Can the consultation fee be deducted from my final service cost?", answer: "Yes — for clients who proceed to a full service (custom garment, wardrobe, etc.) within 30 days of their consultation, the consultation fee is credited towards the total. Speak to Portia directly to confirm this arrangement." },
  { id: "3", question: "What payment methods are accepted?", answer: "All payments are processed securely through PayFast. You can pay via credit or debit card (Visa, Mastercard), EFT, Capitec Pay, and SnapScan. Your card details are never shared with Maphoshy Lifestyle." },
  { id: "4", question: "What happens if I need to cancel or reschedule?", answer: "Please give at least 48 hours' notice for cancellations or rescheduling. Portia will work with you to find a new date. Refunds for cancellations are handled on a case-by-case basis — reach out via WhatsApp or email." },
  { id: "5", question: "Are virtual consultations available?", answer: "Yes! Most consultations can be done via video call. The Style Discovery Session, Personal Style Consultation and Personal Shopping are all available virtually. Custom garment and alteration services require an in-person fitting." },
];

async function getPricingData() {
  try {
    const db = createServerClient();
    const [pricingRes, faqsRes] = await Promise.all([
      db.from("pricing_entries").select("id, name, description, price, note, highlight, booking_key").eq("active", true).order("display_order"),
      db.from("faqs").select("id, question, answer").eq("active", true).order("display_order"),
    ]);
    const pricing = pricingRes.data && pricingRes.data.length > 0 ? (pricingRes.data as PricingEntry[]) : FALLBACK_PRICING;
    const faqs = faqsRes.data && faqsRes.data.length > 0 ? (faqsRes.data as FaqEntry[]) : FALLBACK_FAQS;
    return { pricing, faqs };
  } catch {
    return { pricing: FALLBACK_PRICING, faqs: FALLBACK_FAQS };
  }
}

export default async function PricingPage() {
  const { pricing, faqs } = await getPricingData();

  return (
    <>
      {/* Header */}
      <div className="pt-28 pb-16 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Transparent Pricing
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Investment in Yourself
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Quality service at clear, honest prices. Every rand you invest in
            your style is an investment in how you show up in the world.
          </p>
        </div>
      </div>

      {/* Pricing table */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {pricing.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow duration-200 ${
                  service.highlight
                    ? "bg-brand-purple text-white shadow-lg"
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className={`font-heading text-lg font-semibold ${
                        service.highlight ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {service.name}
                    </h3>
                    {service.highlight && (
                      <span className="text-xs bg-brand-gold text-white px-2 py-0.5 rounded-full font-medium">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      service.highlight ? "text-white/75" : "text-gray-600"
                    }`}
                  >
                    {service.description}
                  </p>
                  {service.note && (
                    <p
                      className={`text-xs mt-1 ${
                        service.highlight ? "text-white/50" : "text-gray-400"
                      }`}
                    >
                      {service.note}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p
                    className={`font-heading text-2xl font-bold ${
                      service.highlight ? "text-brand-gold" : "text-brand-purple"
                    }`}
                  >
                    {service.price}
                  </p>
                  <Link
                    href={`/book?service=${service.booking_key}`}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      service.highlight
                        ? "bg-white text-brand-purple hover:bg-brand-gold hover:text-white"
                        : "bg-brand-purple text-white hover:bg-[#4a1470]"
                    }`}
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-brand-light-purple rounded-2xl">
            <div className="flex gap-3">
              <HelpCircle size={20} className="text-brand-purple shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong className="text-brand-purple">Not sure where to start?</strong>{" "}
                The Style Discovery Session (R 350) is designed for exactly that
                — Portia will guide you to the right service for your needs.{" "}
                <Link href="/book?service=style_discovery" className="text-brand-purple font-semibold underline underline-offset-2">
                  Book it here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group bg-brand-bg rounded-2xl border border-gray-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full bg-brand-light-purple flex items-center justify-center text-brand-purple font-bold text-lg leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to book?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Choose your service and secure your slot today.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg text-base"
          >
            Book a Consult
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

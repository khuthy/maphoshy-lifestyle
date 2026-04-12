import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock, Send } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Portia Maluleke at Maphoshy Lifestyle via WhatsApp, email, or the contact form.",
};

const WHATSAPP_NUMBER = "27787513728";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Portia! I found you on your website and I'd like to find out more about your services."
);
const EMAIL = "info@maphoshylifestyle.co.za";
const INSTAGRAM_URL = "https://instagram.com/maphoshylifestyle";
const TIKTOK_URL = "https://tiktok.com/@maphoshylifestyle";

export default function ContactPage() {
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
            <Send size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">Get in Touch</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Let&apos;s Talk
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions before booking? Want to chat about your style goals?
            Portia is here for you.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* ── Left: Contact options ── */}
            <div className="space-y-8">
              <div>
                <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2">Reach Out</p>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mb-7">
                  How to reach Portia
                </h2>

                <div className="space-y-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#25D366]/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:scale-110"
                      style={{ background: "rgba(37,211,102,0.1)" }}>
                      <MessageCircle size={22} className="text-[#25D366]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px]">WhatsApp</p>
                      <p className="text-sm text-gray-400 truncate">Chat directly — quickest way to reach Portia</p>
                    </div>
                    <span className="text-[#25D366] font-semibold text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                      Open →
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: "rgba(92,26,140,0.1)" }}>
                      <Mail size={22} className="text-brand-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px]">Email</p>
                      <p className="text-sm text-gray-400 truncate">{EMAIL}</p>
                    </div>
                    <span className="text-brand-purple font-semibold text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                      Send →
                    </span>
                  </a>

                  {/* Instagram */}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px]">Instagram</p>
                      <p className="text-sm text-gray-400">@maphoshylifestyle</p>
                    </div>
                    <span className="text-pink-500 font-semibold text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                      Follow →
                    </span>
                  </a>

                  {/* TikTok */}
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px]">TikTok</p>
                      <p className="text-sm text-gray-400">@maphoshylifestyle</p>
                    </div>
                    <span className="text-gray-600 font-semibold text-sm shrink-0 group-hover:translate-x-1 transition-transform">
                      Watch →
                    </span>
                  </a>
                </div>
              </div>

              {/* Service area info */}
              <div className="rounded-2xl p-6 space-y-5" style={{ background: "linear-gradient(135deg, rgba(92,26,140,0.06), rgba(92,26,140,0.02))", border: "1px solid rgba(92,26,140,0.12)" }}>
                <p className="font-heading text-base font-bold text-brand-purple">
                  Service Area &amp; Availability
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(92,26,140,0.1)" }}>
                      <MapPin size={16} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Service Area</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Gauteng (in-person) · Nationwide via video call
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(92,26,140,0.1)" }}>
                      <Clock size={16} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Turnaround Time</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                        Portia responds within 24 business hours. Custom
                        garments: 2–4 weeks depending on complexity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Contact form ── */}
            <div>
              <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2">Message Us</p>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-7">
                Send a message
              </h2>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

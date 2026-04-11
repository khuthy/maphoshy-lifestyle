import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
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
      {/* Header */}
      <div className="pt-28 pb-16 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Let&apos;s Talk
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Have questions before booking? Want to chat about your style goals?
            Portia is here for you.
          </p>
        </div>
      </div>

      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact options */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                  How to reach Portia
                </h2>

                <div className="space-y-4">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#25D366]/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle size={24} className="text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-sm text-gray-500">
                        Chat directly — quickest way to reach Portia
                      </p>
                    </div>
                    <span className="ml-auto text-[#25D366] font-semibold text-sm shrink-0">
                      Open Chat →
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-purple/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-light-purple flex items-center justify-center shrink-0">
                      <Mail size={24} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">{EMAIL}</p>
                    </div>
                    <span className="ml-auto text-brand-purple font-semibold text-sm shrink-0">
                      Send Email →
                    </span>
                  </a>

                  {/* Instagram */}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Instagram</p>
                      <p className="text-sm text-gray-500">@maphoshylifestyle</p>
                    </div>
                    <span className="ml-auto text-pink-500 font-semibold text-sm shrink-0">
                      Follow →
                    </span>
                  </a>

                  {/* TikTok */}
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-gray-800"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">TikTok</p>
                      <p className="text-sm text-gray-500">@maphoshylifestyle</p>
                    </div>
                    <span className="ml-auto text-gray-800 font-semibold text-sm shrink-0">
                      Watch →
                    </span>
                  </a>
                </div>
              </div>

              {/* Service area info */}
              <div className="bg-brand-light-purple rounded-2xl p-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold text-brand-purple">
                  Service Area & Availability
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Service Area</p>
                      <p className="text-sm text-gray-600">
                        Gauteng (in-person) · Nationwide via video call
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Turnaround Time</p>
                      <p className="text-sm text-gray-600">
                        Portia responds within 24 business hours. Custom
                        garments: 2–4 weeks depending on complexity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                Or drop a message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

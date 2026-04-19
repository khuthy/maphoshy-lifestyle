import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";

const WHATSAPP_NUMBER = "27673708546";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I found you on your website and I'd like to find out more about your services."
);
const INSTAGRAM_URL = "https://instagram.com/maphoshylifestyle";
const TIKTOK_URL = "https://tiktok.com/@maphoshylifestyle";
const EMAIL = "info@maphoshylifestyle.co.za";

const footerLinks = [
  { href: "/catalog", label: "Catalog" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book", label: "Book a Consult" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0f0f18" }} className="text-white">
      {/* Top CTA strip */}
      <div style={{ background: "linear-gradient(135deg, #5C1A8C, #3d1160)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-2xl font-bold text-white">Ready to transform your look?</p>
            <p className="text-white/60 text-sm mt-1">Book a session with us — spots fill quickly.</p>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-brand-purple bg-white hover:bg-brand-gold hover:text-white transition-all shadow-lg whitespace-nowrap"
          >
            Book a Consult
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="space-y-5">
            <BrandMark theme="light" size="md" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Personal styling and image consultancy based in South Africa.
              Helping you look and feel your absolute best.
            </p>
            <p className="text-gray-600 text-xs">
              Service area: Gauteng &amp; nationwide (virtual consultations)
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-semibold text-white/50 mb-5 text-xs uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-semibold text-white/50 mb-5 text-xs uppercase tracking-widest">
              Get in Touch
            </h3>
            <div className="space-y-3.5">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#25D366] transition-colors group"
              >
                <MessageCircle size={16} className="shrink-0" />
                <span className="text-sm">Chat on WhatsApp</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <Mail size={16} className="shrink-0" />
                <span className="text-sm">{EMAIL}</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span className="text-sm">@maphoshylifestyle</span>
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                </svg>
                <span className="text-sm">@maphoshylifestyle</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Maphoshy Lifestyle. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">Maphoshy Lifestyle</p>
        </div>
      </div>
    </footer>
  );
}

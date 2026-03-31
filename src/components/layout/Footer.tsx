import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "27000000000"; // Replace with Portia's number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Portia! I found you on your website and I'd like to find out more about your services."
);
const INSTAGRAM_URL = "https://instagram.com/maphoshylifestyle";
const TIKTOK_URL = "https://tiktok.com/@maphoshylifestyle";
const EMAIL = "info@maphoshylifestyle.co.za";

const footerLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book", label: "Book a Consult" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-gold">Maphoshy Lifestyle</h2>
              <p className="text-sm text-gray-400 tracking-[0.15em] uppercase mt-1">
                Quality is our priority.
              </p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Personal styling and image consultancy based in South Africa.
              Helping you look and feel your absolute best.
            </p>
            <p className="text-gray-500 text-xs">
              Service area: Gauteng & nationwide (virtual consultations)
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#25D366] transition-colors group"
              >
                <MessageCircle size={18} className="shrink-0" />
                <span className="text-sm">Chat on WhatsApp</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors"
              >
                <Mail size={18} className="shrink-0" />
                <span className="text-sm">{EMAIL}</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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
                {/* TikTok icon (SVG since lucide doesn't have it) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
                </svg>
                <span className="text-sm">@maphoshylifestyle</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Maphoshy Lifestyle. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Owned by Portia Maluleke
          </p>
        </div>
      </div>
    </footer>
  );
}

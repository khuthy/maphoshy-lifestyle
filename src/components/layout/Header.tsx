"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/layout/BrandMark";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-sm border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <BrandMark theme={scrolled ? "dark" : "light"} size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? scrolled
                      ? "bg-brand-light-purple text-brand-purple"
                      : "bg-white/15 text-white"
                    : scrolled
                    ? "text-gray-700 hover:bg-brand-light-purple hover:text-brand-purple"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="ml-4 px-6 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-full hover:bg-[#4a1470] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Book a Consult
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn("md:hidden p-2 rounded-lg transition-colors", scrolled ? "text-brand-purple hover:bg-brand-light-purple" : "text-white hover:bg-white/10")}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 overflow-hidden bg-white border-t border-gray-100",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-brand-light-purple text-brand-purple"
                  : "text-gray-700 hover:bg-brand-light-purple hover:text-brand-purple"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="mt-2 px-6 py-3 bg-brand-purple text-white text-sm font-semibold rounded-full text-center hover:bg-[#4a1470] transition-all shadow-md"
          >
            Book a Consult
          </Link>
        </div>
      </div>
    </header>
  );
}

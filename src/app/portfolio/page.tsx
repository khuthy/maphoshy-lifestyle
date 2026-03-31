import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse Portia Maluleke's portfolio of personal styling, custom garments, alterations, corporate and event styling work.",
};

export default function PortfolioPage() {
  return (
    <>
      {/* Page header */}
      <div className="pt-28 pb-16 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Our Work
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            The Portfolio
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Every image tells a story. Browse transformations across personal
            styling, custom garments, event looks and more.
          </p>
        </div>
      </div>

      {/* Grid section */}
      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGrid />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-light-purple">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-purple mb-4">
            Love what you see?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Book a consultation and let&apos;s create your own transformation.
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

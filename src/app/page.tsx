import Image from "next/image";
import Link from "next/link";
import {
  Shirt,
  ShoppingBag,
  Briefcase,
  Star,
  Scissors,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { createPublicServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const services = [
  {
    icon: Sparkles,
    title: "Personal Style Consultation",
    description:
      "A deep-dive into your style identity. We explore your lifestyle, body shape, colour palette and goals to build a signature look that's authentically you.",
    priceIndicator: "From R 500",
  },
  {
    icon: Shirt,
    title: "Wardrobe Curation & Editing",
    description:
      "We audit your existing wardrobe, remove what no longer serves you and identify the gaps. Walk away with a curated closet that works every morning.",
    priceIndicator: "From R 800",
  },
  {
    icon: ShoppingBag,
    title: "Personal Shopping",
    description:
      "We shop for you — or alongside you. We know exactly where to find the pieces that suit your style, budget and body.",
    priceIndicator: "From R 600",
  },
  {
    icon: Briefcase,
    title: "Corporate Styling",
    description:
      "Dress for the position you want. We help professionals build a wardrobe that commands respect and communicates authority.",
    priceIndicator: "From R 700",
  },
  {
    icon: Star,
    title: "Event & Occasion Styling",
    description:
      "From weddings to graduations to boardroom presentations — look unforgettable for every milestone moment.",
    priceIndicator: "From R 650",
  },
  {
    icon: Scissors,
    title: "Custom Design & Alterations",
    description:
      "Bespoke garments designed and made in-house, plus alterations to transform pieces you already own.",
    priceIndicator: "From R 400",
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    id: "1",
    quote:
      "Maphoshy Lifestyle transformed the way I see myself. I walked out of our session feeling like a completely different woman — confident, put-together and ready for anything.",
    author: "Thandeka M.",
    service: "Personal Style Consultation",
    initials: "TM",
  },
  {
    id: "2",
    quote:
      "I was sceptical about a personal stylist but they just get it. They listened, they understood my lifestyle and the results were beyond anything I imagined.",
    author: "Nomsa K.",
    service: "Wardrobe Curation",
    initials: "NK",
  },
  {
    id: "3",
    quote:
      "The custom dress they made for my daughter's graduation was perfect. Every detail was exactly right. We'll be back for every occasion.",
    author: "Grace D.",
    service: "Custom Design",
    initials: "GD",
  },
];

async function getTestimonials() {
  try {
    const db = createPublicServerClient();
    const { data, error } = await db
      .from("testimonials")
      .select("id, quote, author, service, initials")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) console.error("[home] testimonials error:", error.message);
    if (data && data.length > 0) return data;
  } catch (err) {
    console.error("[home] unexpected error:", err);
  }
  return FALLBACK_TESTIMONIALS;
}

const whyUs = [
  "Personalised to your lifestyle and body — no templates",
  "South African stylist who understands local context",
  "Virtual & in-person sessions available nationwide",
  "Quality guaranteed on every single service",
];

export default async function HomePage() {
  const testimonials = await getTestimonials();
  return (
    <>
      {/* HERO */}
      <Hero />

      {/* ABOUT */}
      <section className="py-24 bg-brand-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="space-y-7">
              <div>
                <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                  About Maphoshy Lifestyle
                </p>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Style is a form of{" "}
                  <span className="relative">
                    self-expression
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold/40 rounded-full" />
                  </span>
                  .
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Maphoshy Lifestyle is a personal styling and image consultancy
                founded by{" "}
                <strong className="text-gray-900">Maphoshy Lifestyle</strong>. We
                believe that when you look good, you feel good — and when you
                feel good, you show up powerfully in every area of your life.
              </p>
              <ul className="space-y-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Explore Services <ArrowRight size={15} />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all text-sm"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Image grid */}
            <div className="relative grid grid-cols-2 gap-3 h-[500px]">
              <div className="relative rounded-2xl overflow-hidden">
                <Image src="/assets/image00010.jpeg" alt="Maphoshy Lifestyle styling" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="grid grid-rows-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden">
                  <Image src="/assets/image00020.jpeg" alt="Maphoshy Lifestyle event styling" fill className="object-cover" sizes="15vw" />
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image src="/assets/image00025.jpeg" alt="Maphoshy Lifestyle wardrobe" fill className="object-cover" sizes="15vw" />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 z-10">
                <p className="font-heading text-3xl font-bold text-brand-purple">200+</p>
                <p className="text-xs text-gray-500 mt-0.5">Clients transformed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-14 overflow-hidden" style={{ background: "#0f0f18" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "200+", label: "Clients Styled" },
              { value: "6", label: "Services Offered" },
              { value: "5★", label: "Client Rating" },
              { value: "100%", label: "Quality Guaranteed" },
            ].map((stat, i) => (
              <div key={stat.label} className="space-y-1 relative">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
                )}
                <p className="font-heading text-3xl md:text-4xl font-bold text-brand-gold">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs tracking-wider uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                What We Offer
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
                Services Built<br className="hidden sm:block" /> Around You
              </h2>
            </div>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
              Every service is personalised to your lifestyle, body and goals.
              No templates. No cookie-cutter solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                priceIndicator={service.priceIndicator}
                href="/services"
                variant={i === 0 ? "featured" : "default"}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all text-sm"
            >
              View All Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Portfolio</p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
                The Work<br className="hidden sm:block" /> Speaks.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-brand-purple font-semibold text-sm hover:gap-3 transition-all shrink-0 group"
            >
              See Full Portfolio
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[480px] md:h-[560px]">
            {/* Large left */}
            <div className="col-span-5 row-span-2 relative rounded-2xl overflow-hidden group">
              <Image src="/assets/image00003.jpeg" alt="Maphoshy Lifestyle portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="42vw" />
              <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/15 transition-all duration-300" />
            </div>
            {/* Top middle */}
            <div className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image src="/assets/image00007.jpeg" alt="Maphoshy Lifestyle portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
            </div>
            {/* Top right */}
            <div className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image src="/assets/image00005.jpeg" alt="Maphoshy Lifestyle portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="25vw" />
            </div>
            {/* Bottom middle */}
            <div className="col-span-3 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image src="/assets/image00009.jpeg" alt="Maphoshy Lifestyle portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="25vw" />
            </div>
            {/* Bottom right */}
            <div className="col-span-4 row-span-1 relative rounded-2xl overflow-hidden group">
              <Image src="/assets/image00013.jpeg" alt="Maphoshy Lifestyle portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-brand-bg relative overflow-hidden">
        {/* Subtle bg decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #F3EAF9 0%, transparent 70%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">
              Client Testimonials
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #3d1160 100%)" }}>
        {/* Decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #C9964A, transparent)" }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #C9964A, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[250px] font-bold text-white/[0.03] leading-none select-none whitespace-nowrap">
            ML
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Get Started</p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to transform<br className="hidden sm:block" /> your style?
          </h2>
          <p className="text-white/60 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Book a consultation today and let us guide you towards a look
            that&apos;s confident, intentional and uniquely yours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-white font-semibold rounded-full hover:bg-[#b8833e] transition-all shadow-xl text-base"
            >
              Book a Consult
            </Link>
            <a
              href={`https://wa.me/27673708546?text=${encodeURIComponent("Hi! I found you on your website and I'd like to find out more about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/25 hover:bg-white/20 transition-all text-base"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

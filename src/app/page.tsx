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
} from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

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
      "Let Portia shop for you — or alongside you. She knows exactly where to find the pieces that suit your style, budget and body.",
    priceIndicator: "From R 600",
  },
  {
    icon: Briefcase,
    title: "Corporate Styling",
    description:
      "Dress for the position you want. Portia helps professionals build a wardrobe that commands respect and communicates authority.",
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

const testimonials = [
  {
    quote:
      "Portia transformed the way I see myself. I walked out of our session feeling like a completely different woman — confident, put-together and ready for anything.",
    author: "Thandeka M.",
    service: "Personal Style Consultation",
    initials: "TM",
  },
  {
    quote:
      "I was sceptical about a personal stylist but Portia just gets it. She listened, she understood my lifestyle and the results were beyond anything I imagined.",
    author: "Nomsa K.",
    service: "Wardrobe Curation",
    initials: "NK",
  },
  {
    quote:
      "The custom dress she made for my daughter's graduation was perfect. Every detail was exactly right. We'll be back for every occasion.",
    author: "Grace D.",
    service: "Custom Design",
    initials: "GD",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <Hero />

      {/* INTRO / ABOUT */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase">
                About Maphoshy Lifestyle
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Style is a form of self-expression.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Maphoshy Lifestyle is a personal styling and image consultancy
                founded by{" "}
                <strong className="text-gray-900">Portia Maluleke</strong>. We
                believe that when you look good, you feel good — and when you
                feel good, you show up powerfully in every area of your life.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From wardrobe curation to custom-made garments, every service
                is delivered with care, intention and an unwavering commitment
                to quality.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg"
                >
                  Explore Services
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Staggered image grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/image00010.jpeg"
                    alt="Maphoshy Lifestyle styling work"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-40 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/image00015.jpeg"
                    alt="Maphoshy Lifestyle — custom garments"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-40 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/image00020.jpeg"
                    alt="Maphoshy Lifestyle — event styling"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/image00025.jpeg"
                    alt="Maphoshy Lifestyle — wardrobe curation"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "200+", label: "Clients Styled" },
              { value: "6", label: "Services Offered" },
              { value: "5★", label: "Client Rating" },
              { value: "100%", label: "Quality Guaranteed" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-heading text-3xl md:text-4xl font-bold text-brand-gold">
                  {stat.value}
                </p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Services Built Around You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Every service is personalised to your lifestyle, body and goals.
              No templates. No cookie-cutter solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all text-base"
            >
              View All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-3">
                Portfolio
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
                The Work Speaks.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-brand-purple font-semibold hover:gap-3 transition-all shrink-0"
            >
              See Full Portfolio
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "/assets/image00003.jpeg",
              "/assets/image00005.jpeg",
              "/assets/image00007.jpeg",
              "/assets/image00009.jpeg",
              "/assets/image00011.jpeg",
              "/assets/image00013.jpeg",
            ].map((src, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[3/4]"
              >
                <Image
                  src={src}
                  alt={`Maphoshy Lifestyle portfolio ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-brand-purple/0 group-hover:bg-brand-purple/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-3">
              Client Testimonials
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.author} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-brand-purple">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your style?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Book a consultation today and let Portia guide you towards a look
            that&apos;s confident, intentional and uniquely yours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-white font-semibold rounded-full hover:bg-[#b8833e] transition-all shadow-lg text-base"
            >
              Book a Consult
            </Link>
            <a
              href={`https://wa.me/27787513728?text=${encodeURIComponent("Hi Portia! I found you on your website and I'd like to find out more about your services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all text-base"
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

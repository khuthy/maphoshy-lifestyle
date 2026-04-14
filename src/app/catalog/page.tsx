import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { createPublicServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse our product catalog — custom garments, styling looks and more with pricing from Maphoshy Lifestyle.",
};

const WHATSAPP_NUMBER = "27673708546";

type Category = "styling" | "custom_garment" | "alteration" | "corporate" | "event";

interface CatalogItem {
  id: string;
  src: string;
  alt: string;
  category: Category;
  label: string;
  price_range: string | null;
  display_order: number;
}

const CATEGORY_LABELS: Record<Category, string> = {
  styling:        "Personal Styling",
  custom_garment: "Custom Garments",
  alteration:     "Alterations",
  corporate:      "Corporate",
  event:          "Events",
};

const CATEGORY_COLORS: Record<Category, string> = {
  styling:        "bg-violet-100 text-violet-700",
  custom_garment: "bg-blue-100 text-blue-700",
  alteration:     "bg-amber-100 text-amber-700",
  corporate:      "bg-slate-100 text-slate-700",
  event:          "bg-emerald-100 text-emerald-700",
};

async function getCatalogItems(): Promise<CatalogItem[]> {
  try {
    const db = createPublicServerClient();
    const { data, error } = await db
      .from("portfolio_items")
      .select("id, src, alt, category, label, price_range, display_order")
      .eq("active", true)
      .eq("show_in_catalog", true)
      .order("display_order", { ascending: true });

    if (error) console.error("[catalog] portfolio_items error:", error.message);
    if (data && data.length > 0) return data as CatalogItem[];
  } catch (err) {
    console.error("[catalog] unexpected error:", err);
  }
  return [];
}

function buildWhatsAppUrl(item: CatalogItem): string {
  const message =
    `Hi! I came across a look on the Maphoshy Lifestyle catalog that I love.\n\n` +
    `*Look:* ${item.label} (${CATEGORY_LABELS[item.category] ?? item.label})\n` +
    (item.price_range ? `*Price range:* ${item.price_range}\n` : "") +
    `\nCould you please let me know how I can order or book this? I am very interested!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default async function CatalogPage() {
  const items = await getCatalogItems();

  // Group by category for display
  const categories = Array.from(new Set(items.map(i => i.category))) as Category[];

  return (
    <>
      {/* ── Page Header ── */}
      <div
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #7B22BC 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.15) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.3)" }}>
            <ShoppingBag size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">Browse &amp; Shop</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Our Catalog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Browse our curated looks and products. See something you love?
            Tap the WhatsApp button to enquire or place an order.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Catalog content ── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {items.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-2xl bg-brand-light-purple flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-brand-purple opacity-50" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">
                Catalog coming soon
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                We are currently curating our catalog. In the meantime, browse our
                portfolio or get in touch via WhatsApp.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white font-semibold rounded-full text-sm hover:bg-[#4a1470] transition-all shadow-md"
                >
                  View Portfolio <ArrowRight size={15} />
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to find out about available products and pricing.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-purple text-brand-purple font-semibold rounded-full text-sm hover:bg-brand-light-purple transition-all"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Category sections */}
              {categories.map((cat) => {
                const catItems = items.filter(i => i.category === cat);
                return (
                  <div key={cat} className="mb-16 last:mb-0">
                    {/* Section heading */}
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                        {CATEGORY_LABELS[cat]}
                      </h2>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[cat]}`}>
                        {catItems.length} {catItems.length === 1 ? "item" : "items"}
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Items grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-purple/20 transition-all duration-300 overflow-hidden"
                        >
                          {/* Image */}
                          <div className="relative aspect-[3/4] bg-brand-light-purple overflow-hidden">
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            {/* Category badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                                {CATEGORY_LABELS[item.category]}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-4">
                            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
                              {item.alt}
                            </p>

                            {item.price_range ? (
                              <div className="flex items-center gap-1.5 mb-3">
                                <Tag size={13} className="text-brand-gold shrink-0" />
                                <span className="text-sm font-bold text-brand-purple">{item.price_range}</span>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 mb-3">Price on request</p>
                            )}

                            <a
                              href={buildWhatsAppUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white text-xs font-semibold rounded-xl hover:bg-[#1da851] transition-colors shadow-sm"
                            >
                              <MessageCircle size={13} fill="currentColor" />
                              Enquire on WhatsApp
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Bottom CTA */}
              <div className="mt-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
                <p className="text-brand-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Custom Orders</p>
                <h3 className="font-heading text-3xl font-bold text-gray-900 mb-4">
                  Don&apos;t see what you&apos;re looking for?
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                  We specialise in custom designs and bespoke looks. Get in touch
                  and we'll create exactly what you have in mind.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-purple text-white font-semibold rounded-full text-sm hover:bg-[#4a1470] transition-all shadow-md"
                  >
                    Book a Consult <ArrowRight size={15} />
                  </Link>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to enquire about a custom order.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-purple text-brand-purple font-semibold rounded-full text-sm hover:bg-brand-light-purple transition-all"
                  >
                    <MessageCircle size={15} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

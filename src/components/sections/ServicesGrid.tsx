"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search, X, ChevronLeft, ChevronRight, ArrowRight, Check,
  Sparkles, Shirt, ShoppingBag, Briefcase, Star, Scissors,
  Heart, Palette, Crown, Gem, Wand2, Camera, Users, Settings,
  type LucideIcon,
} from "lucide-react";

export interface ServiceRow {
  id: string;
  service_key: string;
  title: string;
  description: string;
  includes: string[];
  price_from: string;
  booking_key: string;
  icon_name: string;
  display_order?: number;
  active?: boolean;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, Shirt, ShoppingBag, Briefcase, Star, Scissors,
  Heart, Palette, Crown, Gem, Wand2, Camera, Users, Settings,
};

type SortKey = "order" | "title" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "order",      label: "Featured"          },
  { value: "title",      label: "Title A–Z"         },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const PAGE_SIZE = 4;

function parsePrice(val: string) {
  return parseFloat((val ?? "").replace(/[^0-9.]/g, "") || "0");
}

export function ServicesGrid({ services }: { services: ServiceRow[] }) {
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [page, setPage]       = useState(1);

  useEffect(() => { setPage(1); }, [search, sortKey]);

  const filtered = useMemo(() => {
    let list = [...services];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    if (sortKey === "title")      list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortKey === "price_asc")  list.sort((a, b) => parsePrice(a.price_from) - parsePrice(b.price_from));
    if (sortKey === "price_desc") list.sort((a, b) => parsePrice(b.price_from) - parsePrice(a.price_from));

    return list;
  }, [services, search, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-2xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="px-4 py-3 border border-gray-200 rounded-2xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* ── Results summary ── */}
      {(search || sortKey !== "order") && (
        <p className="text-sm text-gray-400 -mt-4">
          {filtered.length === 0
            ? `No services match "${search}"`
            : `Showing ${filtered.length} service${filtered.length !== 1 ? "s" : ""}${search ? ` for "${search}"` : ""}`}
        </p>
      )}

      {/* ── Service cards ── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-400 text-sm">No services match your search.</p>
          <button onClick={() => setSearch("")} className="mt-3 text-brand-purple text-sm font-medium hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="space-y-8">
          {paginated.map((service, idx) => {
            const Icon = ICON_MAP[service.icon_name] ?? Sparkles;
            const overallIdx = (page - 1) * PAGE_SIZE + idx;
            return (
              <div key={service.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80">
                <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A)" }} />
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: icon + number */}
                    <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300"
                        style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}>
                        <Icon size={30} className="text-white" />
                      </div>
                      <span className="font-heading font-bold text-5xl md:text-6xl leading-none select-none"
                        style={{ color: "rgba(92,26,140,0.07)" }}>
                        {String(overallIdx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Right: content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 leading-snug">{service.title}</h2>
                        {service.price_from && (
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shrink-0"
                            style={{ background: "rgba(201,150,74,0.12)", color: "#9a6e2e" }}>
                            From {service.price_from}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-500 leading-relaxed mb-7 text-[15px]">{service.description}</p>

                      {service.includes?.length > 0 && (
                        <div className="mb-7">
                          <p className="text-xs font-bold text-brand-purple uppercase tracking-[0.15em] mb-4">What&apos;s included</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {service.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(92,26,140,0.1)" }}>
                                  <Check size={11} className="text-brand-purple" strokeWidth={3} />
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Link
                        href={`/book?service=${service.booking_key}`}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm group/btn"
                        style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}
                      >
                        Book This Service
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages} &middot; {filtered.length} service{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    p === page ? "bg-brand-purple text-white shadow-sm" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

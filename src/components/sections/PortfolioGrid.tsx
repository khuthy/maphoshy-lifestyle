"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Badge } from "@/components/ui/Badge";
import { LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";

type FilterCategory = "all" | "styling" | "custom_garment" | "alteration" | "corporate" | "event";
type ViewMode = "grid" | "list";

export interface PortfolioImage {
  src: string;
  alt: string;
  category: FilterCategory;
  label: string;
}

const FILTER_LABELS: Record<FilterCategory, string> = {
  all:            "All",
  styling:        "Personal Styling",
  custom_garment: "Custom Garments",
  alteration:     "Alterations",
  corporate:      "Corporate",
  event:          "Events",
};

const CATEGORY_COLORS: Record<string, string> = {
  styling:        "bg-violet-100 text-violet-700",
  custom_garment: "bg-blue-100   text-blue-700",
  alteration:     "bg-amber-100  text-amber-700",
  corporate:      "bg-slate-100  text-slate-700",
  event:          "bg-emerald-100 text-emerald-700",
};

const FILTERS: FilterCategory[] = ["all", "styling", "custom_garment", "alteration", "corporate", "event"];
const PAGE_SIZE = 12;

const FALLBACK_IMAGES: PortfolioImage[] = Array.from({ length: 47 }, (_, i) => {
  const n = String(i + 1).padStart(5, "0");
  const cats: Array<[FilterCategory, string]> = [
    ["styling", "Personal Styling"], ["styling", "Personal Styling"],
    ["event", "Event Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["corporate", "Corporate Styling"],
    ["event", "Event Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["styling", "Personal Styling"],
    ["event", "Event Styling"], ["alteration", "Alteration"],
    ["corporate", "Corporate Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["event", "Event Styling"],
    ["styling", "Personal Styling"], ["custom_garment", "Custom Garment"],
    ["corporate", "Corporate Styling"], ["styling", "Personal Styling"],
    ["event", "Event Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["alteration", "Alteration"],
    ["styling", "Personal Styling"], ["event", "Event Styling"],
    ["corporate", "Corporate Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["event", "Event Styling"],
    ["styling", "Personal Styling"], ["custom_garment", "Custom Garment"],
    ["corporate", "Corporate Styling"], ["event", "Event Styling"],
    ["styling", "Personal Styling"], ["alteration", "Alteration"],
    ["styling", "Personal Styling"], ["custom_garment", "Custom Garment"],
    ["event", "Event Styling"], ["styling", "Personal Styling"],
    ["corporate", "Corporate Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"], ["event", "Event Styling"],
    ["styling", "Personal Styling"], ["custom_garment", "Custom Garment"],
    ["styling", "Personal Styling"],
  ];
  const [category, label] = cats[i] ?? ["styling", "Personal Styling"];
  return { src: `/assets/image${n}.jpeg`, alt: `Maphoshy Lifestyle — ${label.toLowerCase()}`, category, label };
});

interface PortfolioGridProps {
  images?: PortfolioImage[];
}

export function PortfolioGrid({ images }: PortfolioGridProps) {
  const portfolioImages = images && images.length > 0 ? images : FALLBACK_IMAGES;

  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered = useMemo(() =>
    activeFilter === "all" ? portfolioImages : portfolioImages.filter(img => img.category === activeFilter),
    [portfolioImages, activeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lightboxSlides = filtered.map(img => ({ src: img.src, alt: img.alt }));

  const openLightbox = useCallback((globalIndex: number) => setLightboxIndex(globalIndex), []);

  function handleFilter(f: FilterCategory) { setActiveFilter(f); setPage(1); }
  function handlePage(p: number) { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }

  // Global index for lightbox (so prev/next works across the full filtered set)
  function globalIndex(pageLocalIndex: number) {
    return (page - 1) * PAGE_SIZE + pageLocalIndex;
  }

  return (
    <div>
      {/* ── Filter + view toggle row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 flex-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-brand-purple text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-purple hover:text-brand-purple"
              }`}
            >
              {FILTER_LABELS[filter]}
              {filter !== "all" && (
                <span className={`ml-1.5 text-xs ${activeFilter === filter ? "text-white/70" : "text-gray-400"}`}>
                  ({portfolioImages.filter(img => img.category === filter).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid view"
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "grid" ? "bg-brand-purple text-white" : "text-gray-500 hover:text-brand-purple"}`}
          >
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            title="List view"
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "list" ? "bg-brand-purple text-white" : "text-gray-500 hover:text-brand-purple"}`}
          >
            <List size={15} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* ── Grid view ── */}
      {viewMode === "grid" && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {paginated.map((img, i) => (
            <div
              key={img.src + i}
              className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden bg-brand-light-purple"
              onClick={() => openLightbox(globalIndex(i))}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={600}
                loading={i < 8 ? "eager" : "lazy"}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <Badge variant="gold" size="sm">{img.label}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {paginated.map((img, i) => (
            <div
              key={img.src + i}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-purple/20 transition-all duration-200 flex items-center gap-5 p-4 cursor-pointer"
              onClick={() => openLightbox(globalIndex(i))}
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-brand-light-purple">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="80px"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${CATEGORY_COLORS[img.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {img.label}
                </span>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{img.alt}</p>
              </div>
              {/* Arrow */}
              <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-purple group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>No images in this category yet.</p>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} photos
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-light-purple hover:text-brand-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "…")[]>((acc, n, i, arr) => {
                if (i > 0 && (n as number) - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => handlePage(n as number)}
                    className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-colors ${
                      page === n
                        ? "bg-brand-purple text-white border-brand-purple shadow-md"
                        : "border-gray-200 text-gray-600 hover:bg-brand-light-purple hover:text-brand-purple"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

            <button
              onClick={() => handlePage(page + 1)}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-light-purple hover:text-brand-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        index={lightboxIndex}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.95)" } }}
      />
    </div>
  );
}

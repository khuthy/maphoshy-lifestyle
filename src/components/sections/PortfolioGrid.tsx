"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Badge } from "@/components/ui/Badge";

type FilterCategory =
  | "all"
  | "styling"
  | "custom_garment"
  | "alteration"
  | "corporate"
  | "event";

export interface PortfolioImage {
  src: string;
  alt: string;
  category: FilterCategory;
  label: string;
}

const FILTER_LABELS: Record<FilterCategory, string> = {
  all: "All",
  styling: "Personal Styling",
  custom_garment: "Custom Garments",
  alteration: "Alterations",
  corporate: "Corporate",
  event: "Events",
};

// Fallback data — used only when the DB is empty or unavailable
const FALLBACK_IMAGES: PortfolioImage[] = [
  { src: "/assets/image00001.jpeg", alt: "Maphoshy Lifestyle — personal styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00002.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00003.jpeg", alt: "Maphoshy Lifestyle — event styling", category: "event", label: "Event Styling" },
  { src: "/assets/image00004.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00005.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00006.jpeg", alt: "Maphoshy Lifestyle — corporate styling", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00007.jpeg", alt: "Maphoshy Lifestyle — event styling", category: "event", label: "Event Styling" },
  { src: "/assets/image00008.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00009.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00010.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00011.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00012.jpeg", alt: "Maphoshy Lifestyle — alteration", category: "alteration", label: "Alteration" },
  { src: "/assets/image00013.jpeg", alt: "Maphoshy Lifestyle — corporate", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00014.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00015.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00016.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00017.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00018.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00019.jpeg", alt: "Maphoshy Lifestyle — corporate", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00020.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00021.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00022.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00023.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00024.jpeg", alt: "Maphoshy Lifestyle — alteration", category: "alteration", label: "Alteration" },
  { src: "/assets/image00025.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00026.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00027.jpeg", alt: "Maphoshy Lifestyle — corporate", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00028.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00029.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00030.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00031.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00032.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00033.jpeg", alt: "Maphoshy Lifestyle — corporate", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00034.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00035.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00036.jpeg", alt: "Maphoshy Lifestyle — alteration", category: "alteration", label: "Alteration" },
  { src: "/assets/image00037.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00038.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00039.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00040.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00041.jpeg", alt: "Maphoshy Lifestyle — corporate", category: "corporate", label: "Corporate Styling" },
  { src: "/assets/image00042.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00043.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00044.jpeg", alt: "Maphoshy Lifestyle — event", category: "event", label: "Event Styling" },
  { src: "/assets/image00045.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
  { src: "/assets/image00046.jpeg", alt: "Maphoshy Lifestyle — custom garment", category: "custom_garment", label: "Custom Garment" },
  { src: "/assets/image00047.jpeg", alt: "Maphoshy Lifestyle — styling", category: "styling", label: "Personal Styling" },
];

const FILTERS: FilterCategory[] = [
  "all",
  "styling",
  "custom_garment",
  "alteration",
  "corporate",
  "event",
];

interface PortfolioGridProps {
  images?: PortfolioImage[];
}

export function PortfolioGrid({ images }: PortfolioGridProps) {
  const portfolioImages = images && images.length > 0 ? images : FALLBACK_IMAGES;

  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered =
    activeFilter === "all"
      ? portfolioImages
      : portfolioImages.filter((img) => img.category === activeFilter);

  const lightboxSlides = filtered.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === filter
                ? "bg-brand-purple text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand-purple hover:text-brand-purple"
            }`}
          >
            {FILTER_LABELS[filter]}
            {filter !== "all" && (
              <span className={`ml-2 text-xs ${activeFilter === filter ? "text-white/70" : "text-gray-400"}`}>
                ({portfolioImages.filter((img) => img.category === filter).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((img, index) => (
          <div
            key={img.src}
            className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={400}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <Badge variant="gold" size="sm">{img.label}</Badge>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>No images in this category yet.</p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}
        index={lightboxIndex}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
        }}
      />
    </div>
  );
}

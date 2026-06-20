"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, ImageIcon, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Slot { id?: string | null; src: string; alt: string; label: string }

type Tab = "hero" | "about" | "portfolio_preview";

const TABS: { id: Tab; label: string; description: string }[] = [
  { id: "hero",              label: "Hero Mosaic",       description: "4 floating cards on the dark hero banner at the top of the home page." },
  { id: "about",             label: "About Section",     description: "3 images in the grid next to the 'Style is a form of self-expression' text." },
  { id: "portfolio_preview", label: "Portfolio Section", description: "5 images in the asymmetric 'The Work Speaks' grid on the home page." },
];

const HERO_SLOT_HINTS = [
  "Large left card — most prominent",
  "Top centre-right card",
  "Far right tall card",
  "Bottom overlapping card",
];
const ABOUT_SLOT_HINTS = [
  "Large left image",
  "Top right image",
  "Bottom right image",
];
const PORTFOLIO_SLOT_HINTS = [
  "Large left — spans full height",
  "Top middle",
  "Top right",
  "Bottom middle",
  "Bottom right",
];
const SLOT_HINTS: Record<Tab, string[]> = {
  hero:              HERO_SLOT_HINTS,
  about:             ABOUT_SLOT_HINTS,
  portfolio_preview: PORTFOLIO_SLOT_HINTS,
};

// Fallback values matching the hardcoded images on the home page.
// Pre-filled so the admin can see (and save) the current defaults immediately.
const FALLBACK_SLOTS: Record<Tab, Slot[]> = {
  hero: [
    { src: "/assets/image00003.jpeg", alt: "Maphoshy Lifestyle — personal styling",  label: "Styling"   },
    { src: "/assets/image00007.jpeg", alt: "Maphoshy Lifestyle — event styling",      label: ""          },
    { src: "/assets/image00011.jpeg", alt: "Maphoshy Lifestyle — custom garment",     label: ""          },
    { src: "/assets/image00021.jpeg", alt: "Maphoshy Lifestyle — corporate styling",  label: "Corporate" },
  ],
  about: [
    { src: "/assets/image00010.jpeg", alt: "Maphoshy Lifestyle styling",       label: "" },
    { src: "/assets/image00020.jpeg", alt: "Maphoshy Lifestyle event styling", label: "" },
    { src: "/assets/image00025.jpeg", alt: "Maphoshy Lifestyle wardrobe",      label: "" },
  ],
  portfolio_preview: [
    { src: "/assets/image00003.jpeg", alt: "Maphoshy Lifestyle portfolio", label: "" },
    { src: "/assets/image00007.jpeg", alt: "Maphoshy Lifestyle portfolio", label: "" },
    { src: "/assets/image00005.jpeg", alt: "Maphoshy Lifestyle portfolio", label: "" },
    { src: "/assets/image00009.jpeg", alt: "Maphoshy Lifestyle portfolio", label: "" },
    { src: "/assets/image00013.jpeg", alt: "Maphoshy Lifestyle portfolio", label: "" },
  ],
};

function mergeWithFallback(images: Slot[], tab: Tab): Slot[] {
  const fallback = FALLBACK_SLOTS[tab];
  return fallback.map((fb, i) => {
    const db = images[i];
    return db?.src ? db : { ...fb };
  });
}

export default function HomeImagesPage() {
  const [activeTab, setActiveTab]   = useState<Tab>("hero");
  const [slotMap, setSlotMap]       = useState<Record<Tab, Slot[]>>({
    hero:              [...FALLBACK_SLOTS.hero],
    about:             [...FALLBACK_SLOTS.about],
    portfolio_preview: [...FALLBACK_SLOTS.portfolio_preview],
  });
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set());
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [status, setStatus]         = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading]   = useState<number | null>(null);

  const ref0 = useRef<HTMLInputElement>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);
  const fileRefs = [ref0, ref1, ref2, ref3, ref4];

  useEffect(() => {
    if (loadedTabs.has(activeTab)) return;
    setLoading(true);

    const url = activeTab === "hero"
      ? "/api/admin/hero-images"
      : `/api/admin/home-sections?section=${activeTab}`;

    fetch(url)
      .then(r => r.json())
      .then(({ images }) => {
        const dbSlots: Slot[] = (images ?? []).map((img: Slot) => ({
          id:    img.id ?? null,
          src:   img.src,
          alt:   img.alt,
          label: img.label ?? "",
        }));
        const next = mergeWithFallback(dbSlots, activeTab);
        setSlotMap(prev => ({ ...prev, [activeTab]: next }));
        setLoadedTabs(prev => new Set(prev).add(activeTab));
      })
      .finally(() => setLoading(false));
  }, [activeTab, loadedTabs]);

  const slots = slotMap[activeTab];

  function update(index: number, patch: Partial<Slot>) {
    setSlotMap(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map((s, i) => i === index ? { ...s, ...patch } : s),
    }));
    setStatus("idle");
  }

  async function handleUpload(index: number, file: File) {
    setUploading(index);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/portfolio/upload", { method: "POST", body: fd });
    setUploading(null);
    if (res.ok) {
      const { url } = await res.json();
      update(index, { src: url, id: null });
    } else {
      const body = await res.json().catch(() => ({}));
      alert(`Upload failed: ${body.error ?? "please try again"}`);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");

    let res: Response;
    if (activeTab === "hero") {
      res = await fetch("/api/admin/hero-images", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ slots }),
      });
    } else {
      res = await fetch("/api/admin/home-sections", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ section: activeTab, slots }),
      });
    }

    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
  }

  const hints = SLOT_HINTS[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Page Images</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the photos that appear in each section of your home page.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="shrink-0 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-brand-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStatus("idle"); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-white text-brand-purple shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <Info size={15} className="shrink-0 mt-0.5" />
        {TABS.find(t => t.id === activeTab)?.description}
      </div>

      {/* Status banners */}
      {status === "saved" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle size={16} className="shrink-0" />
          Saved — your home page now shows the updated images.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          Save failed — please try again.
        </div>
      )}

      {/* Slots grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-sm">Loading…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {slots.map((slot, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {/* Slot header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Image {i + 1}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{hints[i]}</p>
                </div>
                <span className="text-xs font-bold text-brand-purple bg-brand-light-purple px-2 py-1 rounded-lg">
                  Slot {i + 1}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Preview / upload area */}
                <div
                  className="relative w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-brand-purple/50 hover:bg-brand-light-purple/10 transition-all"
                  style={{ aspectRatio: "4/3" }}
                  onClick={() => fileRefs[i].current?.click()}
                >
                  {slot.src ? (
                    <>
                      <Image
                        src={slot.src}
                        alt={slot.alt || "Home page image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={slot.src.startsWith("http") && !slot.src.includes("supabase")}
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="bg-white/90 rounded-xl px-3 py-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Upload size={14} />
                          Replace image
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                      {uploading === i ? (
                        <p className="text-sm">Uploading…</p>
                      ) : (
                        <>
                          <ImageIcon size={28} className="text-gray-300" />
                          <p className="text-sm font-medium">Click to upload</p>
                          <p className="text-xs">JPG, PNG, WebP up to 10 MB</p>
                        </>
                      )}
                    </div>
                  )}
                  {uploading === i && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Uploading…</p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileRefs[i]}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(i, f);
                    e.target.value = "";
                  }}
                />

                {/* URL input */}
                <input
                  type="url"
                  placeholder="Or paste an image URL…"
                  value={slot.src}
                  onChange={e => update(i, { src: e.target.value, id: null })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white"
                />

                {/* Alt text */}
                <input
                  type="text"
                  placeholder="Alt text, e.g. Maphoshy Lifestyle — event styling"
                  value={slot.alt}
                  onChange={e => update(i, { alt: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-3 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-brand-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

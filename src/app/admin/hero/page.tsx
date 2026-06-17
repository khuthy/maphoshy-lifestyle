"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, ImageIcon, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Slot {
  id:    string | null;
  src:   string;
  alt:   string;
  label: string;
}

const EMPTY_SLOT: Slot = { id: null, src: "", alt: "", label: "" };

const SLOT_LABELS = [
  { name: "Image 1", hint: "Large left card — most prominent" },
  { name: "Image 2", hint: "Top centre-right card"           },
  { name: "Image 3", hint: "Far right tall card"             },
  { name: "Image 4", hint: "Bottom overlapping card"         },
];

export default function HeroImagesPage() {
  const [slots, setSlots]       = useState<Slot[]>([EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    fetch("/api/admin/hero-images")
      .then(r => r.json())
      .then(({ images }) => {
        const next: Slot[] = [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT].map((_, i) => {
          const img = images[i];
          return img ? { id: img.id, src: img.src, alt: img.alt, label: img.label ?? "" } : { ...EMPTY_SLOT };
        });
        setSlots(next);
      })
      .finally(() => setLoading(false));
  }, []);

  function update(index: number, patch: Partial<Slot>) {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, ...patch } : s));
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
    const res = await fetch("/api/admin/hero-images", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slots }),
    });
    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-400 text-sm">Loading hero images…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Page Images</h1>
          <p className="text-sm text-gray-500 mt-1">
            These 4 images appear in the photo mosaic on your home page. Upload or paste a URL for each slot, then click Save.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-brand-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Status banner */}
      {status === "saved" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle size={16} className="shrink-0" />
          Changes saved — your home page now shows the updated images.
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          Save failed — please try again.
        </div>
      )}

      {/* Info note */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>
          The mosaic is visible on larger screens. On mobile, only the text section of the hero is shown.
          You need all 4 slots filled for the mosaic to appear.
        </span>
      </div>

      {/* 4 Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slots.map((slot, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Slot header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
              <div>
                <p className="text-sm font-semibold text-gray-800">{SLOT_LABELS[i].name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{SLOT_LABELS[i].hint}</p>
              </div>
              <span className="text-xs font-bold text-brand-purple bg-brand-light-purple px-2 py-1 rounded-lg">
                Slot {i + 1}
              </span>
            </div>

            {/* Image preview / upload area */}
            <div className="p-4 space-y-3">
              <div
                className="relative w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 cursor-pointer hover:border-brand-purple/50 hover:bg-brand-light-purple/10 transition-all"
                style={{ aspectRatio: "4/3" }}
                onClick={() => fileRefs[i].current?.click()}
              >
                {slot.src ? (
                  <>
                    <Image
                      src={slot.src}
                      alt={slot.alt || "Hero image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Alt text <span className="text-gray-300 normal-case font-normal">(describes the image)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maphoshy Lifestyle — custom garment"
                  value={slot.alt}
                  onChange={e => update(i, { alt: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Card label <span className="text-gray-300 normal-case font-normal">(optional overlay text)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Styling, Corporate, Events…"
                  value={slot.label}
                  onChange={e => update(i, { label: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-brand-purple/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

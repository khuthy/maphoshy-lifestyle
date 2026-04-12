"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Check, Upload, ImageIcon } from "lucide-react";

type Category = "styling" | "custom_garment" | "alteration" | "corporate" | "event";

interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: Category;
  label: string;
  display_order: number;
  active: boolean;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "styling", label: "Personal Styling" },
  { value: "custom_garment", label: "Custom Garments" },
  { value: "alteration", label: "Alterations" },
  { value: "corporate", label: "Corporate" },
  { value: "event", label: "Events" },
];

const CATEGORY_LABELS: Record<Category, string> = {
  styling: "Personal Styling",
  custom_garment: "Custom Garments",
  alteration: "Alterations",
  corporate: "Corporate",
  event: "Events",
};

const CATEGORY_COLORS: Record<Category, string> = {
  styling: "bg-violet-100 text-violet-700",
  custom_garment: "bg-blue-100 text-blue-700",
  alteration: "bg-amber-100 text-amber-700",
  corporate: "bg-slate-100 text-slate-700",
  event: "bg-emerald-100 text-emerald-700",
};

const EMPTY_FORM = { src: "", alt: "", category: "styling" as Category, label: "Personal Styling", display_order: 0 };

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/portfolio");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditItem(item);
    setForm({ src: item.src, alt: item.alt, category: item.category, label: item.label, display_order: item.display_order });
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditItem(null);
    setUploadProgress(null);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress("Uploading…");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/portfolio/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, src: url }));
      setUploadProgress("Uploaded successfully");
    } else {
      setUploadProgress("Upload failed — please try again");
    }
  }

  async function handleSave() {
    if (!form.src || !form.alt) {
      setError("Image URL and alt text are required");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = { ...form };
    let res: Response;

    if (editItem) {
      res = await fetch(`/api/admin/portfolio/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      closeForm();
      load();
    } else {
      const d = await res.json();
      setError(d.error ?? "Save failed");
    }
    setSaving(false);
  }

  async function toggleActive(item: PortfolioItem) {
    await fetch(`/api/admin/portfolio/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    await fetch(`/api/admin/portfolio/${item.id}`, { method: "DELETE" });
    load();
  }

  function handleCategoryChange(cat: Category) {
    setForm((f) => ({ ...f, category: cat, label: CATEGORY_LABELS[cat] }));
  }

  const activeCount = items.filter((i) => i.active).length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${items.length} images · ${activeCount} visible`}
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-3 text-gray-400">
          <ImageIcon size={40} className="opacity-30" />
          <p className="text-sm">No images yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden group border transition-all ${item.active ? "border-gray-100 shadow-sm" : "border-gray-200 opacity-60"}`}
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="200px" />
              </div>

              {/* Category badge */}
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>

              {/* Hidden badge */}
              {!item.active && (
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-900/70 text-white">Hidden</span>
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(item)}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-brand-purple shadow-sm transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-brand-purple shadow-sm transition-colors"
                  title={item.active ? "Hide" : "Show"}
                >
                  {item.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-red-500 shadow-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form — slide-in panel */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Image" : "Add New Image"}</h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Upload */}
              <div>
                <label className={labelCls}>Image</label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-light-purple/10 transition-all"
                >
                  <Upload size={18} />
                  Click to upload image file
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {uploadProgress && (
                  <p className={`text-xs mt-1.5 ${uploadProgress.includes("fail") ? "text-red-500" : "text-emerald-600"}`}>
                    {uploadProgress}
                  </p>
                )}
                <div className="mt-3">
                  <input
                    type="text"
                    value={form.src}
                    onChange={(e) => setForm((f) => ({ ...f, src: e.target.value }))}
                    placeholder="Or paste image URL"
                    className={inputCls}
                  />
                </div>
                {form.src && (
                  <div className="mt-3 relative w-20 h-28 rounded-xl overflow-hidden border border-gray-100">
                    <Image src={form.src} alt="preview" fill className="object-cover" sizes="80px" />
                  </div>
                )}
              </div>

              {/* Alt text */}
              <div>
                <label className={labelCls}>Alt text</label>
                <input
                  type="text"
                  value={form.alt}
                  onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                  placeholder="Maphoshy Lifestyle — event styling"
                  className={inputCls}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  className={inputCls}
                >
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Display order */}
              <div>
                <label className={labelCls}>Display order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm"
              >
                <Check size={15} /> {saving ? "Saving…" : editItem ? "Save changes" : "Add image"}
              </button>
              <button
                onClick={closeForm}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

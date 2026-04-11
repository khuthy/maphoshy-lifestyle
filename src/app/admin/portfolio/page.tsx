"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Check, Upload } from "lucide-react";

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

const EMPTY_FORM = { src: "", alt: "", category: "styling" as Category, label: "Personal Styling", display_order: 0 };

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
      setUploadProgress("Uploaded ✓");
    } else {
      setUploadProgress("Upload failed");
    }
  }

  async function handleSave() {
    if (!form.src || !form.alt) {
      setError("Image and alt text are required");
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
    if (!confirm(`Delete this image? This cannot be undone.`)) return;
    await fetch(`/api/admin/portfolio/${item.id}`, { method: "DELETE" });
    load();
  }

  function handleCategoryChange(cat: Category) {
    setForm((f) => ({ ...f, category: cat, label: CATEGORY_LABELS[cat] }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} images total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">{editItem ? "Edit Image" : "Add New Image"}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
              <div className="flex gap-3 items-start">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-brand-purple hover:text-brand-purple transition-colors"
                >
                  <Upload size={15} /> Upload file
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.src}
                    onChange={(e) => setForm((f) => ({ ...f, src: e.target.value }))}
                    placeholder="Or paste image URL / path"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
                  />
                  {uploadProgress && <p className="text-xs text-gray-500 mt-1">{uploadProgress}</p>}
                </div>
              </div>
              {form.src && (
                <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100">
                  <Image src={form.src} alt="preview" fill className="object-cover" sizes="96px" />
                </div>
              )}
            </div>

            {/* Alt text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Alt text</label>
              <input
                type="text"
                value={form.alt}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                placeholder="Maphoshy Lifestyle — event styling"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple bg-white"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Display order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
              />
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50"
              >
                <Check size={15} /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden border group ${item.active ? "border-gray-100" : "border-gray-200 opacity-50"}`}
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="200px" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openEdit(item)}
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-brand-purple transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-brand-purple transition-colors"
                  title={item.active ? "Hide" : "Show"}
                >
                  {item.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[10px] text-white/80">{CATEGORY_LABELS[item.category]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

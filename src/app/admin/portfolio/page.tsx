"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Plus, Trash2, Eye, EyeOff, Pencil, X, Check, Upload,
  ImageIcon, Search, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";

type Category = "styling" | "custom_garment" | "alteration" | "corporate" | "event";
type SortKey = "display_order" | "created_at_asc" | "created_at_desc" | "label";
type ViewMode = "grid" | "list";

interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: Category;
  label: string;
  display_order: number;
  active: boolean;
  price_range: string | null;
  show_in_catalog: boolean;
  show_in_hero: boolean;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "styling",       label: "Personal Styling"  },
  { value: "custom_garment",label: "Custom Garments"   },
  { value: "alteration",    label: "Alterations"       },
  { value: "corporate",     label: "Corporate"         },
  { value: "event",         label: "Events"            },
];

const CATEGORY_LABELS: Record<Category, string> = {
  styling:        "Personal Styling",
  custom_garment: "Custom Garments",
  alteration:     "Alterations",
  corporate:      "Corporate",
  event:          "Events",
};

const CATEGORY_COLORS: Record<Category, string> = {
  styling:        "bg-violet-100 text-violet-700",
  custom_garment: "bg-blue-100   text-blue-700",
  alteration:     "bg-amber-100  text-amber-700",
  corporate:      "bg-slate-100  text-slate-700",
  event:          "bg-emerald-100 text-emerald-700",
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "display_order",  label: "Display order" },
  { value: "created_at_desc",label: "Newest first"  },
  { value: "created_at_asc", label: "Oldest first"  },
  { value: "label",          label: "Category A–Z"  },
];

const PAGE_SIZES = [12, 24, 48];
const EMPTY_FORM = { src: "", alt: "", category: "styling" as Category, label: "Personal Styling", display_order: 0, price_range: "", show_in_catalog: false, show_in_hero: false };
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

  // Filters / sort / view
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [sortKey, setSortKey] = useState<SortKey>("display_order");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/portfolio");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, categoryFilter, statusFilter, sortKey]);

  function openNew() { setEditItem(null); setForm(EMPTY_FORM); setError(null); setShowForm(true); }
  function openEdit(item: PortfolioItem) {
    setEditItem(item);
    setForm({ src: item.src, alt: item.alt, category: item.category, label: item.label, display_order: item.display_order, price_range: item.price_range ?? "", show_in_catalog: item.show_in_catalog, show_in_hero: item.show_in_hero });
    setError(null);
    setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditItem(null); setUploadProgress(null); }

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
    if (!form.src || !form.alt) { setError("Image URL and alt text are required"); return; }
    setSaving(true); setError(null);
    const res = editItem
      ? await fetch(`/api/admin/portfolio/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch("/api/admin/portfolio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { closeForm(); load(); }
    else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    setSaving(false);
  }

  async function toggleActive(item: PortfolioItem) {
    await fetch(`/api/admin/portfolio/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !item.active }) });
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

  // ── Derived data ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let out = [...items];
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(i => i.alt.toLowerCase().includes(q) || i.label.toLowerCase().includes(q));
    }
    // Category
    if (categoryFilter !== "all") out = out.filter(i => i.category === categoryFilter);
    // Status
    if (statusFilter === "active") out = out.filter(i => i.active);
    if (statusFilter === "hidden") out = out.filter(i => !i.active);
    // Sort
    out.sort((a, b) => {
      if (sortKey === "display_order") return a.display_order - b.display_order;
      if (sortKey === "label")         return a.label.localeCompare(b.label);
      if (sortKey === "created_at_asc") return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id); // created_at_desc (uuid is ordered)
    });
    return out;
  }, [items, search, categoryFilter, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = items.filter(i => i.active).length;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${filtered.length} of ${items.length} images · ${activeCount} visible`}
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm shrink-0">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by label or description…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
        </div>

        {/* Row 2: filters + sort + view toggle */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category filter */}
          <div className="relative">
            <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as Category | "all")}
              className="pl-8 pr-7 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple appearance-none cursor-pointer">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as "all" | "active" | "hidden")}
              className="pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple appearance-none cursor-pointer">
              <option value="all">All status</option>
              <option value="active">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
              className="pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple appearance-none cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Page size */}
          <div className="relative">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs font-medium bg-white focus:outline-none appearance-none cursor-pointer">
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s} per page</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center w-9 h-9 transition-colors ${viewMode === "grid" ? "bg-brand-purple text-white" : "text-gray-400 hover:text-brand-purple"}`}>
              <LayoutGrid size={14} />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`flex items-center justify-center w-9 h-9 transition-colors ${viewMode === "list" ? "bg-brand-purple text-white" : "text-gray-400 hover:text-brand-purple"}`}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-3 text-gray-400">
          <ImageIcon size={40} className="opacity-30" />
          <p className="text-sm">{items.length === 0 ? "No images yet. Add your first one." : "No images match your filters."}</p>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid view ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {paginated.map((item) => (
            <div key={item.id}
              className={`relative rounded-2xl overflow-hidden group border transition-all ${item.active ? "border-gray-100 shadow-sm" : "border-gray-200 opacity-60"}`}>
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="200px" />
              </div>
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                {!item.active && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-900/70 text-white">Hidden</span>
                )}
                {item.show_in_catalog && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-gold/90 text-white">Catalog</span>
                )}
                {item.show_in_hero && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/90 text-white">Hero</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => openEdit(item)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-brand-purple shadow-sm transition-colors" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => toggleActive(item)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-brand-purple shadow-sm transition-colors" title={item.active ? "Hide" : "Show"}>{item.active ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                <button onClick={() => handleDelete(item)} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-700 hover:text-red-500 shadow-sm transition-colors" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List view ── */
        <div className="space-y-2">
          {paginated.map((item) => (
            <div key={item.id}
              className={`bg-white rounded-2xl border shadow-sm flex items-center gap-4 p-3 transition-all ${item.active ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
              {/* Thumbnail */}
              <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="56px" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                    {CATEGORY_LABELS[item.category]}
                  </span>
                  {!item.active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Hidden</span>}
                  {item.show_in_catalog && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Catalog</span>}
                  {item.show_in_hero && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">Hero</span>}
                </div>
                <p className="text-sm text-gray-600 truncate">{item.alt}</p>
                <p className="text-xs text-gray-400 mt-0.5">Order: {item.display_order}</p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"><Pencil size={13} /></button>
                <button onClick={() => toggleActive(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors">{item.active ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                <button onClick={() => handleDelete(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > pageSize && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-light-purple hover:text-brand-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
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
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button key={n} onClick={() => setPage(n as number)}
                    className={`w-9 h-9 rounded-xl border text-sm font-medium transition-colors ${page === n ? "bg-brand-purple text-white border-brand-purple" : "border-gray-200 text-gray-600 hover:bg-brand-light-purple hover:text-brand-purple"}`}>
                    {n}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-brand-light-purple hover:text-brand-purple disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Add / Edit drawer ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Image" : "Add New Image"}</h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Upload */}
              <div>
                <label className={labelCls}>Image</label>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-brand-purple hover:text-brand-purple hover:bg-brand-light-purple/10 transition-all">
                  <Upload size={18} />Click to upload image file
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {uploadProgress && (
                  <p className={`text-xs mt-1.5 ${uploadProgress.includes("fail") ? "text-red-500" : "text-emerald-600"}`}>{uploadProgress}</p>
                )}
                <div className="mt-3">
                  <input type="text" value={form.src} onChange={(e) => setForm((f) => ({ ...f, src: e.target.value }))} placeholder="Or paste image URL" className={inputCls} />
                </div>
                {form.src && (
                  <div className="mt-3 relative w-20 h-28 rounded-xl overflow-hidden border border-gray-100">
                    <Image src={form.src} alt="preview" fill className="object-cover" sizes="80px" />
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Alt text</label>
                <input type="text" value={form.alt} onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))} placeholder="Maphoshy Lifestyle — event styling" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value as Category)} className={inputCls}>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Display order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all" />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>

              {/* ── Catalog & Hero section ── */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Visibility Settings</p>

                {/* Show in catalog toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Show in Catalog</p>
                    <p className="text-xs text-gray-400 mt-0.5">Display this item on the public catalog page</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, show_in_catalog: !f.show_in_catalog }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      form.show_in_catalog ? "bg-brand-purple" : "bg-gray-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      form.show_in_catalog ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {/* Show in hero toggle */}
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl border border-violet-100 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Feature on Home Page</p>
                    <p className="text-xs text-gray-400 mt-0.5">Show this design in the hero section on the home page (max 4)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, show_in_hero: !f.show_in_hero }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      form.show_in_hero ? "bg-violet-600" : "bg-gray-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                      form.show_in_hero ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {/* Price range */}
                <div>
                  <label className={labelCls}>Price Range</label>
                  <input
                    type="text"
                    value={form.price_range}
                    onChange={(e) => setForm((f) => ({ ...f, price_range: e.target.value }))}
                    placeholder="e.g. R 800 – R 1 500"
                    className={inputCls}
                  />
                  <p className="text-xs text-gray-400 mt-1">Shown on the catalog card (optional)</p>
                </div>
              </div>

              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
            </div>
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm">
                <Check size={15} /> {saving ? "Saving…" : editItem ? "Save changes" : "Add image"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

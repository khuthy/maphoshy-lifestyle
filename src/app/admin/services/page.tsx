"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus, Trash2, Eye, EyeOff, Pencil, X, Check,
  Settings, Sparkles, Shirt, ShoppingBag, Briefcase,
  Star, Scissors, Heart, Palette, Crown, Gem, Wand2,
  Camera, Users, Search, ChevronLeft, ChevronRight,
} from "lucide-react";

interface ServiceContent {
  id: string;
  service_key: string;
  title: string;
  description: string;
  includes: string[];
  price_from: string;
  booking_key: string;
  icon_name: string;
  display_order: number;
  active: boolean;
}

type FilterStatus = "all" | "visible" | "hidden";
type SortKey = "order" | "title" | "price";

const ICON_OPTIONS = [
  "Sparkles", "Shirt", "ShoppingBag", "Briefcase", "Star", "Scissors",
  "Heart", "Palette", "Crown", "Gem", "Wand2", "Camera", "Users", "Settings",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
  Sparkles, Shirt, ShoppingBag, Briefcase, Star, Scissors,
  Heart, Palette, Crown, Gem, Wand2, Camera, Users, Settings,
};

const EMPTY_FORM = {
  title: "", service_key: "", description: "", includes: [] as string[],
  price_from: "", booking_key: "", icon_name: "Sparkles", display_order: 0,
};

const PAGE_SIZES = [4, 8, 12];

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function parsePrice(val: string) {
  return parseFloat((val ?? "").replace(/[^0-9.]/g, "") || "0");
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ServiceContent | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Toolbar state ──
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Reset to page 1 whenever filters / sort / page-size change
  useEffect(() => { setPage(1); }, [search, filterStatus, sortKey, pageSize]);

  const filtered = useMemo(() => {
    let list = [...services];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.service_key.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q)
      );
    }

    if (filterStatus === "visible") list = list.filter(s => s.active !== false);
    if (filterStatus === "hidden")  list = list.filter(s => s.active === false);

    if (sortKey === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortKey === "price") list.sort((a, b) => parsePrice(a.price_from) - parsePrice(b.price_from));

    return list;
  }, [services, search, filterStatus, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const counts = {
    all:     services.length,
    visible: services.filter(s => s.active !== false).length,
    hidden:  services.filter(s => s.active === false).length,
  };

  // ── Form helpers ──
  function openNew() {
    setEditItem(null); setForm({ ...EMPTY_FORM, includes: [] }); setFormError(null); setShowForm(true);
  }
  function openEdit(s: ServiceContent) {
    setEditItem(s);
    setForm({ title: s.title, service_key: s.service_key, description: s.description, includes: [...s.includes], price_from: s.price_from, booking_key: s.booking_key, icon_name: s.icon_name, display_order: s.display_order ?? 0 });
    setFormError(null); setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditItem(null); }

  async function handleSave() {
    if (!form.title.trim() || (!editItem && !form.service_key.trim())) {
      setFormError("Title and service key are required"); return;
    }
    setSaving(true); setFormError(null);
    const res = editItem
      ? await fetch(`/api/admin/services/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setFormError(d.error ?? "Save failed"); return; }
    closeForm(); load();
  }

  async function toggleActive(s: ServiceContent) {
    await fetch(`/api/admin/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !s.active }) });
    load();
  }

  async function handleDelete(s: ServiceContent) {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    load();
  }

  function updateInclude(idx: number, val: string) { setForm(f => { const a = [...f.includes]; a[idx] = val; return { ...f, includes: a }; }); }
  function addInclude()            { setForm(f => ({ ...f, includes: [...f.includes, ""] })); }
  function removeInclude(idx: number) { setForm(f => { const a = [...f.includes]; a.splice(idx, 1); return { ...f, includes: a }; }); }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Add, edit and manage the services shown on the public site.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        {/* Search + Sort row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, key or description…"
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
          >
            <option value="order">Sort: Display Order</option>
            <option value="title">Sort: Title A–Z</option>
            <option value="price">Sort: Price Low → High</option>
          </select>

          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
          >
            {PAGE_SIZES.map(n => <option key={n} value={n}>Show {n}</option>)}
          </select>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "visible", "hidden"] as FilterStatus[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterStatus === tab ? "bg-brand-purple/10 text-brand-purple" : "bg-gray-200 text-gray-400"}`}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : paginated.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-brand-light-purple flex items-center justify-center mx-auto mb-4">
            <Settings size={24} className="text-brand-purple opacity-40" />
          </div>
          <p className="text-gray-500 text-sm mb-4">
            {search ? `No services match "${search}"` : "No services yet."}
          </p>
          {!search && (
            <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors">
              <Plus size={14} /> Add Service
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((s) => {
            const Icon = ICON_MAP[s.icon_name] ?? Sparkles;
            return (
              <div key={s.id} className={`bg-white rounded-2xl border shadow-sm transition-all ${s.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}>
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900 text-sm">{s.title}</h2>
                      {!s.active && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Hidden</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="text-xs font-semibold text-brand-gold bg-amber-50 px-2 py-0.5 rounded-full">{s.price_from || "No price set"}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">{s.service_key}</span>
                      <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">#{s.display_order ?? 0}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{s.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(s)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => toggleActive(s)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${s.active ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : "text-gray-500 bg-gray-100 hover:bg-gray-200"}`}>
                      {s.active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                    </button>
                    <button onClick={() => handleDelete(s)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-400">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} service{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  p === page ? "bg-brand-purple text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Side drawer ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <aside className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Service" : "Add Service"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-5">
              {formError && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">{formError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input className={inputCls} placeholder="e.g. Personal Style Consultation" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Service Key *</label>
                  <input
                    className={inputCls + (editItem ? " bg-gray-50 text-gray-400 cursor-not-allowed" : "")}
                    placeholder="e.g. consultation"
                    value={form.service_key}
                    readOnly={!!editItem}
                    onChange={e => !editItem && setForm(f => ({ ...f, service_key: e.target.value }))}
                  />
                  {!editItem && <p className="mt-1 text-xs text-gray-400">Unique slug, lowercase. Cannot change after saving.</p>}
                </div>
                <div>
                  <label className={labelCls}>Booking Key</label>
                  <input className={inputCls} placeholder="e.g. consultation" value={form.booking_key} onChange={e => setForm(f => ({ ...f, booking_key: e.target.value }))} />
                  <p className="mt-1 text-xs text-gray-400">Defaults to service key if blank.</p>
                </div>
                <div>
                  <label className={labelCls}>Price From</label>
                  <input className={inputCls} placeholder="e.g. R 500" value={form.price_from} onChange={e => setForm(f => ({ ...f, price_from: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" className={inputCls} value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))} />
                  <p className="mt-1 text-xs text-gray-400">Lower = appears first.</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {ICON_OPTIONS.map(name => {
                    const IC = ICON_MAP[name];
                    const sel = form.icon_name === name;
                    return (
                      <button key={name} type="button" title={name} onClick={() => setForm(f => ({ ...f, icon_name: name }))}
                        className={`flex items-center justify-center p-2 rounded-xl border-2 transition-all ${sel ? "border-brand-purple bg-brand-light-purple" : "border-gray-100 hover:border-gray-300"}`}>
                        <IC size={18} className={sel ? "text-brand-purple" : "text-gray-400"} />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Selected: <strong>{form.icon_name}</strong></p>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="Describe this service…" />
              </div>

              <div>
                <label className={labelCls}>What&apos;s Included</label>
                <div className="space-y-2">
                  {form.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-brand-purple" />
                      </div>
                      <input value={item} onChange={e => updateInclude(idx, e.target.value)} className={inputCls} placeholder="Included item…" />
                      <button onClick={() => removeInclude(idx)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0"><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={addInclude} className="flex items-center gap-1.5 text-sm text-brand-purple hover:text-[#4a1470] font-medium transition-colors">
                    <Plus size={14} /> Add item
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-60">
                {saving ? "Saving…" : <><Check size={15} /> Save</>}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

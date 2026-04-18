"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, Eye, EyeOff, Pencil, X, Check,
  Settings, Sparkles, Shirt, ShoppingBag, Briefcase,
  Star, Scissors, Heart, Palette, Crown, Gem, Wand2,
  Camera, Users,
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

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ServiceContent | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditItem(null);
    setForm({ ...EMPTY_FORM, includes: [] });
    setError(null);
    setShowForm(true);
  }

  function openEdit(s: ServiceContent) {
    setEditItem(s);
    setForm({
      title: s.title,
      service_key: s.service_key,
      description: s.description,
      includes: [...s.includes],
      price_from: s.price_from,
      booking_key: s.booking_key,
      icon_name: s.icon_name,
      display_order: s.display_order ?? 0,
    });
    setError(null);
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditItem(null); }

  async function handleSave() {
    if (!form.title.trim() || (!editItem && !form.service_key.trim())) {
      setError("Title and service key are required");
      return;
    }
    setSaving(true);
    setError(null);

    const res = editItem
      ? await fetch(`/api/admin/services/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    setSaving(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
    closeForm();
    load();
  }

  async function toggleActive(s: ServiceContent) {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  }

  async function handleDelete(s: ServiceContent) {
    if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    load();
  }

  function updateInclude(idx: number, value: string) {
    setForm(f => { const arr = [...f.includes]; arr[idx] = value; return { ...f, includes: arr }; });
  }
  function addInclude() {
    setForm(f => ({ ...f, includes: [...f.includes, ""] }));
  }
  function removeInclude(idx: number) {
    setForm(f => { const arr = [...f.includes]; arr.splice(idx, 1); return { ...f, includes: arr }; });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit and manage the services shown on the public site.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-light-purple flex items-center justify-center mx-auto mb-4">
            <Settings size={28} className="text-brand-purple opacity-40" />
          </div>
          <p className="text-gray-500 text-sm mb-4">No services yet.</p>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors">
            <Plus size={14} /> Add Service
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => {
            const Icon = ICON_MAP[s.icon_name] ?? Sparkles;
            return (
              <div
                key={s.id}
                className={`bg-white rounded-2xl border shadow-sm transition-all ${s.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}
              >
                <div className="p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}>
                    <Icon size={18} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900 text-sm">{s.title}</h2>
                      {!s.active && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Hidden</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="text-xs font-semibold text-brand-gold bg-amber-50 px-2 py-0.5 rounded-full">
                        {s.price_from || "No price set"}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                        {s.service_key}
                      </span>
                      <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">
                        Order: {s.display_order ?? 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 leading-relaxed">{s.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => toggleActive(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        s.active
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {s.active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <aside className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Service" : "Add Service"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Personal Style Consultation"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
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
                  {!editItem && (
                    <p className="mt-1 text-xs text-gray-400">Unique slug, lowercase, no spaces. Cannot be changed after saving.</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Booking Key</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. consultation"
                    value={form.booking_key}
                    onChange={e => setForm(f => ({ ...f, booking_key: e.target.value }))}
                  />
                  <p className="mt-1 text-xs text-gray-400">Used in booking links. Defaults to service key.</p>
                </div>

                <div>
                  <label className={labelCls}>Price From</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. R 500"
                    value={form.price_from}
                    onChange={e => setForm(f => ({ ...f, price_from: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={labelCls}>Display Order</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={form.display_order}
                    onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                  />
                  <p className="mt-1 text-xs text-gray-400">Lower numbers appear first.</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>Icon</label>
                <div className="grid grid-cols-7 gap-2">
                  {ICON_OPTIONS.map((name) => {
                    const IconComp = ICON_MAP[name];
                    const selected = form.icon_name === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, icon_name: name }))}
                        title={name}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                          selected
                            ? "border-brand-purple bg-brand-light-purple"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <IconComp size={18} className={selected ? "text-brand-purple" : "text-gray-400"} />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Selected: <strong>{form.icon_name}</strong></p>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="Describe this service…"
                />
              </div>

              <div>
                <label className={labelCls}>What&apos;s Included</label>
                <div className="space-y-2">
                  {form.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-brand-purple" />
                      </div>
                      <input
                        value={item}
                        onChange={e => updateInclude(idx, e.target.value)}
                        className={inputCls}
                        placeholder="Included item…"
                      />
                      <button onClick={() => removeInclude(idx)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addInclude}
                    className="flex items-center gap-1.5 text-sm text-brand-purple hover:text-[#4a1470] font-medium transition-colors"
                  >
                    <Plus size={14} /> Add item
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : <><Check size={15} /> Save</>}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

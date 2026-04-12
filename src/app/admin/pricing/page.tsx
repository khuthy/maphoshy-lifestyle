"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Star, Tag } from "lucide-react";

interface PricingEntry {
  id: string;
  name: string;
  description: string;
  price: string;
  note: string | null;
  highlight: boolean;
  booking_key: string;
  display_order: number;
  active: boolean;
}

const EMPTY_FORM = {
  name: "", description: "", price: "", note: "", highlight: false, booking_key: "", display_order: 0,
};

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

export default function AdminPricingPage() {
  const [entries, setEntries] = useState<PricingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<PricingEntry | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/pricing");
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditEntry(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(e: PricingEntry) {
    setEditEntry(e);
    setForm({ name: e.name, description: e.description, price: e.price, note: e.note ?? "", highlight: e.highlight, booking_key: e.booking_key, display_order: e.display_order });
    setError(null);
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditEntry(null); }

  async function handleSave() {
    if (!form.name || !form.price || !form.booking_key) {
      setError("Name, price and booking key are required");
      return;
    }
    setSaving(true);
    setError(null);

    let res: Response;
    if (editEntry) {
      res = await fetch(`/api/admin/pricing/${editEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    if (res.ok) { closeForm(); load(); }
    else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    setSaving(false);
  }

  async function handleDelete(entry: PricingEntry) {
    if (!confirm(`Delete "${entry.name}"?`)) return;
    await fetch(`/api/admin/pricing/${entry.id}`, { method: "DELETE" });
    load();
  }

  async function toggleHighlight(entry: PricingEntry) {
    await fetch(`/api/admin/pricing/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlight: !entry.highlight }),
    });
    load();
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${entries.length} pricing entries`}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Slide-in form drawer */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editEntry ? "Edit Entry" : "New Pricing Entry"}</h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Name + Price on separate rows on mobile, side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Consultation" />
                </div>
                <div>
                  <label className={labelCls}>Price</label>
                  <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="R 500" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} className={`${inputCls} resize-none`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Note <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                  <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    placeholder="In-person or virtual" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Booking key</label>
                  <input value={form.booking_key} onChange={(e) => setForm((f) => ({ ...f, booking_key: e.target.value }))}
                    placeholder="consultation" className={inputCls} />
                  <p className="text-xs text-gray-400 mt-1">Used in ?service= URL param</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>Display order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-28 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.highlight ? "bg-brand-gold" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.highlight ? "left-6" : "left-1"}`} />
                  <input type="checkbox" checked={form.highlight}
                    onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.checked }))}
                    className="sr-only" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Mark as &quot;Most Popular&quot;</span>
              </label>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm">
                <Check size={15} /> {saving ? "Saving…" : editEntry ? "Save changes" : "Add entry"}
              </button>
              <button onClick={closeForm}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3 text-gray-400">
          <Tag size={36} className="opacity-30" />
          <p className="text-sm">No pricing entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${entry.highlight ? "border-brand-gold/40 bg-amber-50/30" : "border-gray-100"}`}
            >
              <div className="p-4 sm:p-5">
                {/* Top row: star + name + actions */}
                <div className="flex items-start gap-3 min-w-0">
                  {/* Highlight star */}
                  <button
                    onClick={() => toggleHighlight(entry)}
                    title="Toggle most popular"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${entry.highlight ? "text-brand-gold bg-amber-100" : "text-gray-300 hover:text-brand-gold hover:bg-amber-50"}`}
                  >
                    <Star size={15} fill={entry.highlight ? "currentColor" : "none"} />
                  </button>

                  {/* Name + description — flex-1 + min-w-0 prevents overflow */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm break-words">{entry.name}</span>
                      {entry.highlight && (
                        <span className="text-xs font-medium text-brand-gold bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Most Popular</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{entry.description}</p>
                    {entry.note && <p className="text-xs text-gray-400 mt-0.5 italic">{entry.note}</p>}
                  </div>

                  {/* Action buttons — always shrink, never push card wider */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(entry)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Price on its own row — never causes horizontal overflow */}
                <div className="mt-2 pl-11">
                  <span className="font-bold text-brand-purple text-sm">{entry.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

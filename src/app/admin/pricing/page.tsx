"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pricing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage pricing entries shown on the Pricing page.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">{editEntry ? "Edit Entry" : "New Pricing Entry"}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="R 500 or From R 800"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Note <span className="text-gray-400">(optional)</span></label>
              <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="In-person or virtual"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking key</label>
              <input value={form.booking_key} onChange={(e) => setForm((f) => ({ ...f, booking_key: e.target.value }))}
                placeholder="consultation"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
              <p className="text-xs text-gray-400 mt-1">Used in the booking URL (?service=…)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="highlight" checked={form.highlight}
                onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.checked }))}
                className="w-4 h-4 accent-brand-purple" />
              <label htmlFor="highlight" className="text-sm text-gray-700">Mark as &quot;Most Popular&quot;</label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50">
              <Check size={15} /> {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className={`bg-white border rounded-2xl p-4 flex items-center gap-4 ${entry.highlight ? "border-brand-gold" : "border-gray-200"}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900 text-sm">{entry.name}</span>
                  {entry.highlight && <span className="flex items-center gap-0.5 text-xs text-brand-gold"><Star size={11} fill="currentColor" /> Most Popular</span>}
                </div>
                <p className="text-xs text-gray-500">{entry.description}</p>
              </div>
              <span className="font-bold text-brand-purple text-sm whitespace-nowrap">{entry.price}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => toggleHighlight(entry)} title="Toggle most popular"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${entry.highlight ? "text-brand-gold bg-amber-50" : "text-gray-400 hover:text-brand-gold hover:bg-amber-50"}`}>
                  <Star size={14} fill={entry.highlight ? "currentColor" : "none"} />
                </button>
                <button onClick={() => openEdit(entry)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(entry)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

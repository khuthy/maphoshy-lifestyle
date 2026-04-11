"use client";

import { useState, useEffect } from "react";
import { Pencil, X, Check, Plus, Trash2 } from "lucide-react";

interface ServiceContent {
  id: string;
  service_key: string;
  title: string;
  description: string;
  includes: string[];
  price_from: string;
  booking_key: string;
  icon_name: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ServiceContent>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openEdit(s: ServiceContent) {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, includes: [...s.includes], price_from: s.price_from });
    setError(null);
  }

  function closeEdit() { setEditId(null); setForm({}); }

  async function handleSave(id: string) {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { closeEdit(); load(); }
    else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    setSaving(false);
  }

  function updateInclude(idx: number, value: string) {
    setForm((f) => {
      const arr = [...(f.includes ?? [])];
      arr[idx] = value;
      return { ...f, includes: arr };
    });
  }

  function addInclude() {
    setForm((f) => ({ ...f, includes: [...(f.includes ?? []), ""] }));
  }

  function removeInclude(idx: number) {
    setForm((f) => {
      const arr = [...(f.includes ?? [])];
      arr.splice(idx, 1);
      return { ...f, includes: arr };
    });
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Services</h1>
        <p className="text-sm text-gray-500 mt-0.5">Edit service descriptions, inclusions and starting prices.</p>
      </div>

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{s.service_key}</p>
                <h2 className="font-semibold text-gray-900">{s.title}</h2>
                <span className="text-brand-gold text-sm font-medium">From {s.price_from}</span>
              </div>
              {editId !== s.id && (
                <button
                  onClick={() => openEdit(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:border-brand-purple hover:text-brand-purple transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {/* Edit form */}
            {editId === s.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input
                    value={form.title ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Starting price</label>
                  <input
                    value={form.price_from ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))}
                    placeholder="R 500"
                    className="w-40 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What&apos;s included</label>
                  <div className="space-y-2">
                    {(form.includes ?? []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateInclude(idx, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-purple"
                        />
                        <button onClick={() => removeInclude(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addInclude}
                      className="flex items-center gap-1.5 text-sm text-brand-purple hover:text-[#4a1470] transition-colors"
                    >
                      <Plus size={14} /> Add item
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSave(s.id)}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50"
                  >
                    <Check size={15} /> {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button onClick={closeEdit} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-100 transition-colors">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

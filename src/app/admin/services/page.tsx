"use client";

import { useState, useEffect } from "react";
import { Pencil, X, Check, Plus, Trash2, Settings } from "lucide-react";

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

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

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

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Loading…</p>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit service descriptions, inclusions and starting prices. {services.length} services total.
        </p>
      </div>

      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
            {/* Card header */}
            <div className="flex items-start gap-3 p-5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand-light-purple flex items-center justify-center shrink-0 mt-0.5">
                <Settings size={18} className="text-brand-purple" />
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h2 className="font-semibold text-gray-900 truncate">{s.title}</h2>
                  <span className="text-xs font-medium text-brand-gold bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">{s.price_from}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-mono whitespace-nowrap shrink-0">{s.service_key}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{s.description}</p>
              </div>
              {editId !== s.id && (
                <button
                  onClick={() => openEdit(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-brand-purple hover:text-brand-purple transition-colors shrink-0"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {/* Edit form */}
            {editId === s.id && (
              <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/50 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      value={form.title ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Starting price</label>
                    <input
                      value={form.price_from ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, price_from: e.target.value }))}
                      placeholder="R 500"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <div>
                  <label className={labelCls}>What&apos;s included</label>
                  <div className="space-y-2">
                    {(form.includes ?? []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-brand-purple/10 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-brand-purple" />
                        </div>
                        <input
                          value={item}
                          onChange={(e) => updateInclude(idx, e.target.value)}
                          className={inputCls}
                          placeholder="Include item…"
                        />
                        <button onClick={() => removeInclude(idx)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addInclude}
                      className="flex items-center gap-1.5 text-sm text-brand-purple hover:text-[#4a1470] font-medium transition-colors mt-1"
                    >
                      <Plus size={14} /> Add item
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleSave(s.id)}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Check size={15} /> {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    onClick={closeEdit}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
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

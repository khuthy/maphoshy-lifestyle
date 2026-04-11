"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
}

const EMPTY_FORM = { question: "", answer: "", display_order: 0 };

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/faqs");
    if (res.ok) setFaqs(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditFaq(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(f: FAQ) {
    setEditFaq(f);
    setForm({ question: f.question, answer: f.answer, display_order: f.display_order });
    setError(null);
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditFaq(null); }

  async function handleSave() {
    if (!form.question || !form.answer) {
      setError("Question and answer are required");
      return;
    }
    setSaving(true);
    setError(null);

    let res: Response;
    if (editFaq) {
      res = await fetch(`/api/admin/faqs/${editFaq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    if (res.ok) { closeForm(); load(); }
    else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    setSaving(false);
  }

  async function handleDelete(faq: FAQ) {
    if (!confirm(`Delete this FAQ?`)) return;
    await fetch(`/api/admin/faqs/${faq.id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(faq: FAQ) {
    await fetch(`/api/admin/faqs/${faq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !faq.active }),
    });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage questions shown on the Pricing page.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">{editFaq ? "Edit FAQ" : "New FAQ"}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
              <input
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Answer</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50">
                <Check size={15} /> {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? <p className="text-gray-400 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className={`bg-white border border-gray-200 rounded-2xl p-5 ${!faq.active ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{faq.question}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                  <p className="text-gray-400 text-xs mt-2">Order: {faq.display_order}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleActive(faq)} title={faq.active ? "Hide" : "Show"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors">
                    {faq.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(faq)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(faq)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-gray-400 text-sm">No FAQs yet. Add one above.</p>}
        </div>
      )}
    </div>
  );
}

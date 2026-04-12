"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, MessageCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
}

const EMPTY_FORM = { question: "", answer: "", display_order: 0 };

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

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
    if (!confirm("Delete this FAQ?")) return;
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

  const activeCount = faqs.filter((f) => f.active).length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${faqs.length} questions · ${activeCount} visible on site`}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editFaq ? "Edit FAQ" : "New FAQ"}</h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className={labelCls}>Question</label>
                <input
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  placeholder="What does a wardrobe session include?"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Answer</label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  rows={5}
                  placeholder="Write a clear, concise answer…"
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>Display order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-28 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm">
                <Check size={15} /> {saving ? "Saving…" : editFaq ? "Save changes" : "Add FAQ"}
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
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3 text-gray-400">
          <MessageCircle size={36} className="opacity-30" />
          <p className="text-sm">No FAQs yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all ${!faq.active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Order badge */}
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${faq.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {faq.active ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleActive(faq)}
                    title={faq.active ? "Hide" : "Show"}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                  >
                    {faq.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(faq)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

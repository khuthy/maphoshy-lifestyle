"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Check, Star, Quote, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  service: string;
  initials: string;
  display_order: number;
  active: boolean;
  submitted_by_customer?: boolean;
  pending_approval?: boolean;
  expires_at?: string | null;
}

const EMPTY_FORM = { quote: "", author: "", service: "", initials: "", display_order: 0 };
const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function isExpired(t: Testimonial) {
  return t.expires_at ? new Date(t.expires_at) < new Date() : false;
}

function expiryLabel(t: Testimonial) {
  if (!t.expires_at) return null;
  const d = new Date(t.expires_at);
  if (d < new Date()) return "Expired";
  return `Expires ${d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [serviceTitles, setServiceTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [tRes, sRes] = await Promise.all([
      fetch("/api/admin/testimonials"),
      fetch("/api/admin/services"),
    ]);
    if (tRes.ok) setItems(await tRes.json());
    if (sRes.ok) {
      const svcs = await sRes.json();
      setServiceTitles(svcs.map((s: { title: string }) => s.title));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const pending  = items.filter(i => i.pending_approval);
  const approved = items.filter(i => !i.pending_approval);
  const activeCount = approved.filter(i => i.active && !isExpired(i)).length;

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(item: Testimonial) {
    setEditItem(item);
    setForm({ quote: item.quote, author: item.author, service: item.service, initials: item.initials, display_order: item.display_order });
    setError(null);
    setShowForm(true);
  }

  function closeForm() { setShowForm(false); setEditItem(null); }

  async function handleSave() {
    if (!form.quote.trim() || !form.author.trim()) {
      setError("Quote and author name are required"); return;
    }
    setSaving(true); setError(null);
    const res = editItem
      ? await fetch(`/api/admin/testimonials/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { closeForm(); load(); }
    else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    setSaving(false);
  }

  async function toggleActive(item: Testimonial) {
    await fetch(`/api/admin/testimonials/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function handleDelete(item: Testimonial) {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    await fetch(`/api/admin/testimonials/${item.id}`, { method: "DELETE" });
    load();
  }

  async function handleApprove(item: Testimonial) {
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    await fetch(`/api/admin/testimonials/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true, pending_approval: false, expires_at: expiresAt }),
    });
    load();
  }

  async function handleReject(item: Testimonial) {
    if (!confirm(`Reject and delete "${item.author}"'s submission?`)) return;
    await fetch(`/api/admin/testimonials/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="w-full max-w-full space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${approved.length} reviews · ${activeCount} visible on site${pending.length > 0 ? ` · ${pending.length} pending approval` : ""}`}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* ── Pending approval section ── */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
              <Clock size={13} className="text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">{pending.length} Pending Approval</span>
            </div>
            <div className="flex-1 h-px bg-amber-100" />
          </div>

          {pending.map(item => (
            <div key={item.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-amber-700 font-bold text-xs">{item.initials || item.author.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-semibold text-gray-900 text-sm">{item.author}</span>
                    {item.service && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{item.service}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-600 font-medium">Customer submission</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Approved list ── */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : approved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center gap-3 text-gray-400">
          <Quote size={40} className="opacity-30" />
          <p className="text-sm">No testimonials yet. Add your first review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approved.map((item) => {
            const expired = isExpired(item);
            const expiry = expiryLabel(item);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${item.active && !expired ? "border-gray-100" : "border-gray-200 opacity-60"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-light-purple flex items-center justify-center shrink-0">
                    <span className="text-brand-purple font-bold text-xs">{item.initials || item.author.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{item.author}</span>
                      {item.service && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">{item.service}</span>}
                      {!item.active && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">Hidden</span>}
                      {expired && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Expired</span>}
                      {!expired && expiry && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{expiry}</span>}
                      {item.submitted_by_customer && !expired && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">Customer</span>}
                      <div className="flex ml-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#C9964A" className="text-brand-gold" />)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">&ldquo;{item.quote}&rdquo;</p>
                    <p className="text-xs text-gray-400 mt-1.5">Order: {item.display_order}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => toggleActive(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-light-purple transition-colors" title={item.active ? "Hide" : "Show"}>
                      {item.active ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => handleDelete(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit drawer ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeForm} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Review" : "Add New Review"}</h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div>
                <label className={labelCls}>Review / Quote <span className="text-red-400 normal-case font-normal">*</span></label>
                <textarea rows={4} value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} placeholder="Share what your client said…" className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>Client Name <span className="text-red-400 normal-case font-normal">*</span></label>
                <input type="text" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Thandeka M." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Initials (for avatar)</label>
                <input type="text" value={form.initials} onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value.slice(0, 3) }))} placeholder="TM" maxLength={3}
                  className="w-24 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all" />
                <p className="text-xs text-gray-400 mt-1">2–3 letters, auto-derived from name if blank</p>
              </div>
              <div>
                <label className={labelCls}>Service Used</label>
                <select value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} className={inputCls}>
                  <option value="">Select a service…</option>
                  {serviceTitles.map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-32 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all" />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>
              {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm">
                <Check size={15} /> {saving ? "Saving…" : editItem ? "Save changes" : "Add review"}
              </button>
              <button onClick={closeForm} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

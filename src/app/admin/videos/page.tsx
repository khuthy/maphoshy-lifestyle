"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Check, Video, ExternalLink } from "lucide-react";

interface PortfolioVideo {
  id: string;
  tiktok_url: string;
  title: string;
  display_order: number;
  active: boolean;
}

const EMPTY_FORM = { tiktok_url: "", title: "", display_order: 0 };
const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

/** Extract TikTok video ID from a URL like https://www.tiktok.com/@user/video/1234567890 */
function extractVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

export default function AdminVideosPage() {
  const [items, setItems] = useState<PortfolioVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioVideo | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/videos");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  }

  function openEdit(item: PortfolioVideo) {
    setEditItem(item);
    setForm({ tiktok_url: item.tiktok_url, title: item.title, display_order: item.display_order });
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditItem(null);
  }

  async function handleSave() {
    if (!form.tiktok_url.trim()) {
      setError("TikTok URL is required");
      return;
    }
    if (!extractVideoId(form.tiktok_url)) {
      setError("Could not find a video ID in that URL. Make sure it looks like https://www.tiktok.com/@user/video/1234567890");
      return;
    }
    setSaving(true);
    setError(null);

    const res = editItem
      ? await fetch(`/api/admin/videos/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    setSaving(false);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Something went wrong");
      return;
    }
    closeForm();
    load();
  }

  async function toggleActive(item: PortfolioVideo) {
    await fetch(`/api/admin/videos/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    load();
  }

  async function handleDelete(item: PortfolioVideo) {
    if (!confirm(`Delete "${item.title || item.tiktok_url}"?`)) return;
    await fetch(`/api/admin/videos/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Videos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage TikTok &ldquo;Get Ready With Me&rdquo; clips shown on the portfolio page.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Video
        </button>
      </div>

      {/* How to get a TikTok URL hint */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3">
        <Video size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">How to add a TikTok video</p>
          <ol className="list-decimal list-inside space-y-0.5 text-amber-700">
            <li>Open TikTok and find the video you want to feature</li>
            <li>Tap <strong>Share</strong> → <strong>Copy link</strong></li>
            <li>Paste the link here — it should look like <code className="bg-amber-100 px-1 rounded text-xs">https://www.tiktok.com/@maphoshy/video/1234567890</code></li>
          </ol>
          <p className="mt-2 text-amber-600 text-xs">Videos must be public on TikTok to display correctly.</p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-light-purple flex items-center justify-center mx-auto mb-4">
            <Video size={28} className="text-brand-purple opacity-40" />
          </div>
          <p className="text-gray-500 text-sm mb-4">No videos yet. Add your first TikTok clip.</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors"
          >
            <Plus size={14} /> Add Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const videoId = extractVideoId(item.tiktok_url);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  item.active ? "border-gray-100" : "border-gray-100 opacity-50"
                }`}
              >
                {/* TikTok embed preview */}
                <div className="relative bg-black" style={{ paddingBottom: "177.78%" }}>
                  {videoId ? (
                    <iframe
                      src={`https://www.tiktok.com/embed/v2/${videoId}`}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen
                      allow="encrypted-media"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/40 text-xs text-center px-4">Invalid URL — no video ID found</p>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="p-4">
                  {item.title && (
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1 line-clamp-1">
                      {item.title}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 truncate mb-3">{item.tiktok_url}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => toggleActive(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        item.active
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {item.active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                    </button>
                    <a
                      href={item.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button
                      onClick={() => handleDelete(item)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
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
          <aside className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-gray-900">{editItem ? "Edit Video" : "Add Video"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 py-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className={labelCls}>TikTok URL *</label>
                <input
                  className={inputCls}
                  placeholder="https://www.tiktok.com/@maphoshy/video/1234567890"
                  value={form.tiktok_url}
                  onChange={e => setForm(f => ({ ...f, tiktok_url: e.target.value }))}
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  Paste the full TikTok video link. The video must be public.
                </p>
              </div>

              <div>
                <label className={labelCls}>Title / Caption (optional)</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Get Ready With Me — Wedding Guest Look"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
                <p className="mt-1.5 text-xs text-gray-400">Lower numbers appear first.</p>
              </div>

              {/* Live preview */}
              {form.tiktok_url && extractVideoId(form.tiktok_url) && (
                <div>
                  <label className={labelCls}>Preview</label>
                  <div className="rounded-2xl overflow-hidden bg-black" style={{ maxWidth: 280 }}>
                    <div className="relative" style={{ paddingBottom: "177.78%" }}>
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${extractVideoId(form.tiktok_url)}`}
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen
                        allow="encrypted-media"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={closeForm}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
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

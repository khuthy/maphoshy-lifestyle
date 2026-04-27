"use client";

import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent text-gray-900 placeholder:text-gray-400 text-sm bg-white transition-all";

export function TestimonialSubmitForm() {
  const [form, setForm] = useState({ author: "", service: "", quote: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author.trim() || !form.quote.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-10 px-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Your review has been received and will appear on the site once approved. We truly appreciate your feedback.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Your Name <span className="text-red-400 normal-case font-normal">*</span>
          </label>
          <input
            value={form.author}
            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            placeholder="Thandeka M."
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Service You Used
          </label>
          <input
            value={form.service}
            onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            placeholder="e.g. Wardrobe Curation"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Your Review <span className="text-red-400 normal-case font-normal">*</span>
        </label>
        <textarea
          value={form.quote}
          onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
          rows={4}
          placeholder="Tell us about your experience with Maphoshy Lifestyle…"
          className={`${inputCls} resize-none`}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !form.author.trim() || !form.quote.trim()}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-purple text-white font-semibold rounded-full text-sm hover:bg-[#4a1470] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : <><Send size={15} /> Submit Review</>}
      </button>
    </form>
  );
}

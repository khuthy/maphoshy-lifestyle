"use client";

import { useState, useEffect } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp } from "lucide-react";

interface HelpItem {
  title: string;
  body: string;
}

interface AdminHelpProps {
  page: string;          // unique key used to persist dismissed state
  heading: string;
  items: HelpItem[];
}

export function AdminHelp({ page, heading, items }: AdminHelpProps) {
  const storageKey = `admin_help_dismissed_${page}`;
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash

  useEffect(() => {
    setDismissed(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setDismissed(true);
  }

  function restore() {
    localStorage.removeItem(storageKey);
    setDismissed(false);
    setOpen(true);
  }

  if (dismissed) {
    return (
      <div className="flex justify-end mb-1">
        <button
          onClick={restore}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-purple transition-colors"
        >
          <HelpCircle size={13} /> Show guide
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-brand-purple/20 bg-brand-light-purple/40 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <HelpCircle size={16} className="text-brand-purple shrink-0" />
          <span className="text-sm font-semibold text-brand-purple">{heading}</span>
          <span className="text-xs text-brand-purple/60 font-normal">— click to {open ? "collapse" : "expand"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={e => { e.stopPropagation(); dismiss(); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            title="Hide this guide"
          >
            <X size={12} /> Hide
          </button>
          {open ? <ChevronUp size={14} className="text-brand-purple/60" /> : <ChevronDown size={14} className="text-brand-purple/60" />}
        </div>
      </button>

      {/* Content */}
      {open && (
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-brand-purple/10">
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-brand-purple/10">
              <p className="text-xs font-bold text-brand-purple mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

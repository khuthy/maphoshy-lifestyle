"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Mail, Phone, Calendar, CreditCard, X, Send,
  ChevronDown, TrendingUp, Clock, CheckCircle, AlertCircle, Filter,
} from "lucide-react";
import { formatRand, getServiceLabel, formatPhone } from "@/lib/utils";

interface Booking {
  id: string;
  reference: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  preferred_date: string | null;
  amount: number;
  payment_status: "pending" | "paid" | "failed" | "cancelled";
  session_format: "video_call" | "in_person" | null;
  notes: string | null;
}

const STATUS_CONFIG = {
  paid:      { label: "Paid",      bg: "bg-emerald-100",  text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:   { label: "Pending",   bg: "bg-amber-100",    text: "text-amber-700",   dot: "bg-amber-500"   },
  failed:    { label: "Failed",    bg: "bg-red-100",      text: "text-red-700",     dot: "bg-red-500"     },
  cancelled: { label: "Cancelled", bg: "bg-gray-100",     text: "text-gray-600",    dot: "bg-gray-400"    },
};

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Pre-fill subject when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setReplySubject(`Re: Your Maphoshy Lifestyle Booking — ${selectedBooking.reference}`);
      setReplyMessage("");
      setSendSuccess(false);
      setSendError(null);
    }
  }, [selectedBooking]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "all" || b.payment_status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        b.client_name.toLowerCase().includes(q) ||
        b.client_email.toLowerCase().includes(q) ||
        b.reference.toLowerCase().includes(q) ||
        getServiceLabel(b.service_type).toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, search, statusFilter]);

  // Stats
  const totalPaid = bookings.filter(b => b.payment_status === "paid").reduce((s, b) => s + b.amount, 0);
  const paidCount = bookings.filter(b => b.payment_status === "paid").length;
  const pendingCount = bookings.filter(b => b.payment_status === "pending").length;

  async function handleSendReply() {
    if (!selectedBooking || !replySubject.trim() || !replyMessage.trim()) return;
    setSending(true);
    setSendError(null);
    const res = await fetch(`/api/admin/bookings/${selectedBooking.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: replySubject, message: replyMessage }),
    });
    setSending(false);
    if (res.ok) {
      setSendSuccess(true);
      setReplyMessage("");
    } else {
      const d = await res.json();
      setSendError(d.error ?? "Failed to send. Please try again.");
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${bookings.length} total bookings`}
          </p>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp,   label: "Total Revenue",  value: formatRand(totalPaid),       color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: CheckCircle,  label: "Paid Bookings",  value: String(paidCount),            color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Clock,        label: "Pending",        value: String(pendingCount),          color: "text-amber-600",   bg: "bg-amber-50"   },
            { icon: CreditCard,   label: "All Bookings",   value: String(bookings.length),       color: "text-brand-purple",bg: "bg-brand-light-purple" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or reference…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple appearance-none cursor-pointer transition-all"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center gap-3 text-gray-400">
          <AlertCircle size={32} className="opacity-30" />
          <p className="text-sm">{bookings.length === 0 ? "No bookings yet." : "No bookings match your search."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const status = STATUS_CONFIG[booking.payment_status] ?? STATUS_CONFIG.pending;
            const bookedOn = new Date(booking.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
            const preferredDate = booking.preferred_date
              ? new Date(booking.preferred_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
              : null;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-purple/20 transition-all duration-200"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Status dot */}
                  <div className={`hidden sm:flex w-2.5 h-2.5 rounded-full shrink-0 ${status.dot}`} />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-[15px]">{booking.client_name}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} sm:hidden`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 font-mono">{booking.reference}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={11} className="shrink-0" />
                        {booking.client_email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={11} className="shrink-0" />
                        {formatPhone(booking.client_phone)}
                      </span>
                      {preferredDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="shrink-0" />
                          {preferredDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Service + amount */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                    <span className="text-xs text-gray-500 text-right">{getServiceLabel(booking.service_type)}</span>
                    <span className="font-bold text-brand-purple text-base">{formatRand(booking.amount)}</span>
                    <span className="text-xs text-gray-400">{bookedOn}</span>
                  </div>

                  {/* Reply button */}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded-xl hover:bg-[#4a1470] transition-colors shadow-sm shrink-0"
                  >
                    <Mail size={13} />
                    Reply
                  </button>
                </div>

                {/* Notes row */}
                {booking.notes && (
                  <div className="px-5 pb-4">
                    <p className="text-xs text-gray-400 italic bg-gray-50 rounded-xl px-3 py-2">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reply drawer ── */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedBooking(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Reply to Client</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedBooking.client_name} · {selectedBooking.reference}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Client summary */}
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: "To",       value: `${selectedBooking.client_name} <${selectedBooking.client_email}>` },
                  { label: "Service",  value: getServiceLabel(selectedBooking.service_type) },
                  { label: "Amount",   value: formatRand(selectedBooking.amount) },
                  { label: "Status",   value: STATUS_CONFIG[selectedBooking.payment_status]?.label ?? selectedBooking.payment_status },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px] mb-0.5">{label}</p>
                    <p className="text-gray-700 font-medium truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {sendSuccess && (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700 font-medium">Email sent successfully!</p>
                </div>
              )}
              {sendError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {sendError}
                </div>
              )}

              <div>
                <label className={labelCls}>Subject</label>
                <input
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  className={inputCls}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  rows={12}
                  className={`${inputCls} resize-none leading-relaxed`}
                  placeholder={`Hi ${selectedBooking.client_name},\n\nThank you for your booking…`}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  This will be sent as a professional branded email from Portia.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSendReply}
                disabled={sending || !replySubject.trim() || !replyMessage.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white text-sm font-semibold rounded-xl hover:bg-[#4a1470] transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send size={14} />
                {sending ? "Sending…" : "Send Email"}
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

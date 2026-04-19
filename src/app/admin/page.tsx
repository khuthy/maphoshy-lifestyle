import Link from "next/link";
import {
  Images, Settings, Tag, HelpCircle, ArrowUpRight,
  CalendarCheck, TrendingUp, Clock, CheckCircle, CreditCard,
  Mail, Phone, Calendar, Star, Video,
} from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import { formatRand, getServiceLabel, formatPhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

// ── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  reference: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  amount: number;
  payment_status: "pending" | "paid" | "failed" | "cancelled";
  preferred_date: string | null;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getDashboardData() {
  try {
    const db = createServerClient();
    const { data: bookings } = await db
      .from("bookings")
      .select("id, reference, created_at, client_name, client_email, client_phone, service_type, amount, payment_status, preferred_date")
      .order("created_at", { ascending: false });

    const all = (bookings ?? []) as Booking[];
    const paid      = all.filter(b => b.payment_status === "paid");
    const pending   = all.filter(b => b.payment_status === "pending");
    const revenue   = paid.reduce((s, b) => s + Number(b.amount), 0);
    const recent    = all.slice(0, 6);

    return { all, paid, pending, revenue, recent };
  } catch {
    return { all: [], paid: [], pending: [], revenue: 0, recent: [] };
  }
}

// ── Status badge helper ───────────────────────────────────────────────────────

const STATUS = {
  paid:      { label: "Paid",      cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  pending:   { label: "Pending",   cls: "bg-amber-100   text-amber-700",   dot: "bg-amber-500"   },
  failed:    { label: "Failed",    cls: "bg-red-100     text-red-700",     dot: "bg-red-500"     },
  cancelled: { label: "Cancelled", cls: "bg-gray-100    text-gray-500",    dot: "bg-gray-400"    },
} as const;

// ── Quick-nav sections ────────────────────────────────────────────────────────

const SECTIONS = [
  { href: "/admin/bookings",     icon: CalendarCheck, title: "Bookings",     description: "View all bookings, revenue and reply to clients.",              color: "bg-brand-light-purple text-brand-purple" },
  { href: "/admin/portfolio",    icon: Images,        title: "Portfolio",    description: "Upload, organise and toggle visibility of portfolio images.",     color: "bg-violet-50 text-violet-600" },
  { href: "/admin/testimonials", icon: Star,          title: "Testimonials", description: "Add, edit and manage client reviews shown on the home page.",    color: "bg-amber-50 text-amber-600" },
  { href: "/admin/videos",       icon: Video,         title: "Videos",       description: "Add TikTok Get Ready With Me clips to the portfolio page.",      color: "bg-pink-50 text-pink-600" },
  { href: "/admin/services",     icon: Settings,      title: "Services",     description: "Edit service titles, descriptions and inclusions.",              color: "bg-blue-50 text-blue-600" },
  { href: "/admin/pricing",      icon: Tag,           title: "Pricing",      description: "Manage prices and highlight the most popular entry.",            color: "bg-sky-50 text-sky-600" },
  { href: "/admin/faqs",         icon: HelpCircle,    title: "FAQs",         description: "Add, edit and reorder frequently asked questions.",              color: "bg-emerald-50 text-emerald-600" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const { all, paid, pending, revenue, recent } = await getDashboardData();

  const stats = [
    { icon: TrendingUp,  label: "Total Revenue",   value: formatRand(revenue),      sub: "from paid bookings",  color: "text-emerald-600", bg: "bg-emerald-50"          },
    { icon: CheckCircle, label: "Paid Bookings",   value: String(paid.length),      sub: "confirmed & paid",    color: "text-emerald-600", bg: "bg-emerald-50"          },
    { icon: Clock,       label: "Pending",         value: String(pending.length),   sub: "awaiting payment",    color: "text-amber-600",   bg: "bg-amber-50"            },
    { icon: CreditCard,  label: "All Bookings",    value: String(all.length),       sub: "across all statuses", color: "text-brand-purple", bg: "bg-brand-light-purple" },
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your bookings.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color} leading-none mb-1`}>{value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
{/* ── Quick-nav cards ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Manage Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map(({ href, icon: Icon, title, description, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-purple/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 group-hover:text-brand-purple group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* ── Recent bookings ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900 text-[15px]">Recent Bookings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest {Math.min(6, all.length)} of {all.length} total</p>
          </div>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:text-[#4a1470] transition-colors"
          >
            View all <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* List */}
        {recent.length === 0 ? (
          <div className="py-14 flex flex-col items-center gap-2 text-gray-400">
            <CalendarCheck size={28} className="opacity-25" />
            <p className="text-sm">No bookings yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((booking) => {
              const st = STATUS[booking.payment_status] ?? STATUS.pending;
              const date = new Date(booking.created_at).toLocaleDateString("en-ZA", {
                day: "numeric", month: "short", year: "numeric",
              });
              return (
                <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">{booking.client_name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                      <span className="font-mono text-[10px]">{booking.reference}</span>
                      <span className="flex items-center gap-1">
                        <Mail size={10} />{booking.client_email}
                      </span>
                      <span className="flex items-center gap-1 hidden sm:flex">
                        <Phone size={10} />{formatPhone(booking.client_phone)}
                      </span>
                      {booking.preferred_date && (
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Calendar size={10} />
                          {new Date(booking.preferred_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: service + amount + date */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{getServiceLabel(booking.service_type)}</p>
                    <p className="font-bold text-brand-purple text-sm mt-0.5">{formatRand(booking.amount)}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{date}</p>
                  </div>

                  {/* Mobile: just amount */}
                  <div className="sm:hidden text-right shrink-0">
                    <p className="font-bold text-brand-purple text-sm">{formatRand(booking.amount)}</p>
                    <p className="text-[10px] text-gray-300">{date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      

    </div>
  );
}

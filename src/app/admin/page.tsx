import Link from "next/link";
import { Images, Settings, Tag, HelpCircle, ArrowUpRight } from "lucide-react";

const sections = [
  {
    href: "/admin/portfolio",
    icon: Images,
    title: "Portfolio",
    description: "Upload, organise and toggle visibility of portfolio images.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    href: "/admin/services",
    icon: Settings,
    title: "Services",
    description: "Edit service titles, descriptions, inclusions and pricing.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/admin/pricing",
    icon: Tag,
    title: "Pricing",
    description: "Manage prices, notes and highlight the most popular entry.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    href: "/admin/faqs",
    icon: HelpCircle,
    title: "FAQs",
    description: "Add, edit and reorder frequently asked questions.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, Portia. All changes go live immediately.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ href, icon: Icon, title, description, color }) => (
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
            <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quick tip</p>
        <p className="text-sm text-gray-600">
          Changes made here are reflected on the live site immediately. Portfolio images marked as hidden will not appear on the public gallery.
        </p>
      </div>
    </div>
  );
}

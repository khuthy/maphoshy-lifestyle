import Link from "next/link";
import { Images, Settings, Tag, HelpCircle, ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/admin/portfolio",
    icon: Images,
    title: "Portfolio",
    description: "Add, remove or toggle visibility of portfolio photos. Upload new images directly.",
  },
  {
    href: "/admin/services",
    icon: Settings,
    title: "Services",
    description: "Edit service titles, descriptions, included items and starting prices.",
  },
  {
    href: "/admin/pricing",
    icon: Tag,
    title: "Pricing",
    description: "Manage the pricing table — update prices, notes and highlight the most popular entry.",
  },
  {
    href: "/admin/faqs",
    icon: HelpCircle,
    title: "FAQs",
    description: "Add, edit, reorder and delete frequently asked questions on the Pricing page.",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
        <p className="text-gray-500 mt-1">
          Manage all website content from here. Changes go live immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-brand-purple hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-brand-light-purple flex items-center justify-center mb-4">
                <Icon size={22} className="text-brand-purple" />
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-purple transition-colors mt-0.5" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Reminder:</strong> After running new Supabase migrations, make sure to also create the{" "}
          <code className="bg-amber-100 px-1 rounded text-xs">portfolio</code> storage bucket in your
          Supabase dashboard (Storage → New bucket → name: <code className="bg-amber-100 px-1 rounded text-xs">portfolio</code> → Public).
        </p>
      </div>
    </div>
  );
}

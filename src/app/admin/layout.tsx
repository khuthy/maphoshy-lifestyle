"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Images, Settings, Tag, HelpCircle, LogOut, LayoutDashboard, Menu, X, CalendarCheck, ExternalLink } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/admin/bookings", label: "Bookings",  icon: CalendarCheck,   exact: false },
  { href: "/admin/portfolio",label: "Portfolio", icon: Images,          exact: false },
  { href: "/admin/services", label: "Services",  icon: Settings,        exact: false },
  { href: "/admin/pricing",  label: "Pricing",   icon: Tag,             exact: false },
  { href: "/admin/faqs",     label: "FAQs",      icon: HelpCircle,      exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoginPage) return <>{children}</>;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/assets/transparent-logo-png.png"
              alt="Maphoshy Lifestyle"
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white font-heading font-semibold text-sm leading-tight tracking-wide truncate">
              Maphoshy Lifestyle
            </p>
            <p className="text-white/35 text-[10px] tracking-[0.15em] uppercase">Admin Studio</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand-purple text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} className={active ? "text-white" : "text-white/40"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink size={16} />
          View public site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#111827] shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#111827] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 shrink-0">
                  <Image
                    src="/assets/transparent-logo-png.png"
                    alt="Maphoshy Lifestyle"
                    fill
                    className="object-contain"
                    sizes="28px"
                  />
                </div>
                <span className="text-white font-semibold text-sm">ML Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-[#111827] px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src="/assets/transparent-logo-png.png"
                alt="Maphoshy Lifestyle"
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
            <span className="text-white font-semibold text-sm">ML Admin</span>
          </div>
          <button onClick={handleLogout} className="text-white/40 hover:text-white">
            <LogOut size={18} />
          </button>
        </header>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-b border-gray-200 bg-white">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-brand-purple border border-gray-200 hover:border-brand-purple/40 rounded-xl transition-all"
          >
            <ExternalLink size={14} />
            View public site
          </Link>
        </div>

        <main className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

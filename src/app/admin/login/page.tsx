"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(next);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand artwork ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f0720]">
        {/* Layered gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-brand-purple/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9964A]/20 blur-[100px]" />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[80px]" />
        </div>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top — logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/assets/transparent-logo-png.png"
                alt="Maphoshy Lifestyle"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <p className="font-heading text-white font-semibold text-sm tracking-wide">Maphoshy Lifestyle</p>
              <p className="text-white/35 text-[10px] tracking-[0.2em] uppercase">Admin Studio</p>
            </div>
          </div>

          {/* Centre — headline */}
          <div>
            <p className="text-brand-gold/60 text-sm tracking-[0.2em] uppercase mb-4">
              Admin Studio
            </p>
            <h1 className="font-heading text-5xl font-bold text-white leading-tight mb-6">
              Curate.<br />
              Create.<br />
              <span className="text-brand-gold">Inspire.</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Manage your portfolio, services, pricing and content from one
              beautifully crafted workspace.
            </p>
          </div>

          {/* Bottom — decorative dots */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-1 rounded-full bg-white/20" style={{ width: i === 0 ? 24 : 8 }} />
            ))}
          </div>
        </div>

        {/* Floating decorative circles */}
        <div className="absolute top-[20%] right-[10%] w-24 h-24 rounded-full border border-white/5" />
        <div className="absolute top-[22%] right-[12%] w-16 h-16 rounded-full border border-brand-gold/10" />
        <div className="absolute bottom-[25%] left-[8%] w-32 h-32 rounded-full border border-white/5" />
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#0a0a0a]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/assets/transparent-logo-png.png"
                alt="Maphoshy Lifestyle"
                fill
                className="object-contain"
                sizes="36px"
              />
            </div>
            <div>
              <p className="font-heading text-white/80 text-sm tracking-wide">Maphoshy Lifestyle</p>
              <p className="text-white/35 text-[10px] tracking-[0.15em] uppercase">Admin Studio</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="font-heading text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-white/40 text-sm">Sign in to your admin panel to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/50 tracking-wider uppercase mb-2">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/8 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full relative overflow-hidden py-4 rounded-2xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              style={{ background: loading ? "#3d1260" : "linear-gradient(135deg, #5C1A8C 0%, #7a22b8 100%)" }}
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative text-white flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                ) : "Sign In"}
              </span>
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-10">
            <p className="text-white/20 text-xs">
              Maphoshy Lifestyle &copy; {new Date().getFullYear()} &middot; Admin Access Only
            </p>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              <ExternalLink size={11} />
              Public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

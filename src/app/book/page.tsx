import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/forms/BookingForm";
import { Shield, Clock, CreditCard, CalendarCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Consult",
  description:
    "Book your personal styling consultation with Maphoshy Lifestyle.",
};

function BookingFormFallback() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-100 rounded-xl" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      {/* ── Page Header ── */}
      <div className="relative pt-32 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d1160 0%, #5C1A8C 50%, #7B22BC 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(201,150,74,0.15) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,150,74,0.15)", border: "1px solid rgba(201,150,74,0.3)" }}>
            <CalendarCheck size={12} className="text-brand-gold" />
            <span className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase">Let&apos;s Work Together</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Book a Consult
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Complete the form below and pay your consultation fee to lock in
            your booking. We will reach out within 24 hours to confirm.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-brand-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/40" />
          </div>
        </div>
      </div>

      {/* ── Booking section ── */}
      <section className="py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Form ── */}
            <div className="lg:col-span-2">
              <Suspense fallback={<BookingFormFallback />}>
                <BookingForm />
              </Suspense>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              {/* Why pay upfront card */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 sticky top-24">
                {/* Top accent */}
                <div className="h-0.5 w-full rounded-full mb-6"
                  style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A)" }} />

                <h3 className="font-heading text-lg font-bold text-gray-900 mb-6">
                  Why pay upfront?
                </h3>

                <div className="space-y-5">
                  {[
                    {
                      icon: Shield,
                      title: "Secure your slot",
                      body: "Your payment reserves our time specifically for you.",
                      color: "rgba(92,26,140,0.1)",
                      iconColor: "text-brand-purple",
                    },
                    {
                      icon: Clock,
                      title: "Confirmation within 24 hours",
                      body: "We will personally reach out to confirm your session details.",
                      color: "rgba(201,150,74,0.12)",
                      iconColor: "text-brand-gold",
                    },
                    {
                      icon: CreditCard,
                      title: "Flexible payment options",
                      body: "Pay via credit/debit card, EFT, Capitec Pay or SnapScan through PayFast.",
                      color: "rgba(92,26,140,0.1)",
                      iconColor: "text-brand-purple",
                    },
                  ].map(({ icon: Icon, title, body, color, iconColor }) => (
                    <div key={title} className="flex gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: color }}
                      >
                        <Icon size={18} className={iconColor} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <Shield size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Payments are processed securely by{" "}
                      <strong className="text-gray-600">PayFast</strong>. Your
                      card details are never shared with Maphoshy Lifestyle.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick reassurance pill */}
              <div className="rounded-2xl p-5 text-center"
                style={{ background: "linear-gradient(135deg, rgba(92,26,140,0.06), rgba(92,26,140,0.02))", border: "1px solid rgba(92,26,140,0.10)" }}>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-brand-purple">200+ clients styled</span> and counting.
                  We have a 5-star record of delivering transformations that last.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

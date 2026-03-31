import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/forms/BookingForm";
import { Shield, Clock, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Consult",
  description:
    "Book your personal styling consultation with Portia Maluleke at Maphoshy Lifestyle.",
};

function BookingFormFallback() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse">
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
      {/* Header */}
      <div className="pt-28 pb-16 bg-brand-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gold text-sm font-medium tracking-[0.25em] uppercase mb-4">
            Let&apos;s Work Together
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6">
            Book a Consult
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto">
            Complete the form below and pay your consultation fee to lock in
            your booking. Portia will reach out within 24 hours to confirm.
          </p>
        </div>
      </div>

      <section className="py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <Suspense fallback={<BookingFormFallback />}>
                <BookingForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-heading text-lg font-semibold text-gray-900 mb-5">
                  Why pay upfront?
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Shield,
                      title: "Secure your slot",
                      body: "Your payment reserves Portia's time specifically for you.",
                    },
                    {
                      icon: Clock,
                      title: "Confirmation within 24 hours",
                      body: "Portia will personally reach out to confirm your session details.",
                    },
                    {
                      icon: CreditCard,
                      title: "Flexible payment options",
                      body: "Pay via credit/debit card, EFT, Capitec Pay or SnapScan through PayFast.",
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-light-purple flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={18} className="text-brand-purple" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Payments are processed securely by{" "}
                    <strong className="text-gray-700">PayFast</strong>. Your
                    card details are never shared with Maphoshy Lifestyle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

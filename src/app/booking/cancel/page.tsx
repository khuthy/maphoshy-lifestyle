import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Cancelled",
  description: "Your payment was not completed.",
  robots: { index: false },
};

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-16 flex items-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 p-10 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-white/80" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              Payment not completed
            </h1>
            <p className="text-white/60">No charge was made to your account.</p>
          </div>

          <div className="p-8 md:p-10 space-y-6">
            <p className="text-gray-600 text-center leading-relaxed">
              It looks like the payment was cancelled or didn&apos;t go through.
              Your booking has not been created and you have not been charged.
            </p>

            <div className="bg-brand-light-purple rounded-2xl p-5">
              <p className="text-sm text-brand-purple font-semibold mb-2">
                Want to try again?
              </p>
              <p className="text-sm text-gray-600">
                You can go back to the booking form and try a different payment
                method, or contact us directly if you need help.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/book"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md text-sm"
              >
                Try Again
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/27673708546?text=${encodeURIComponent("Hi! I tried to book a consultation on your website but had trouble with the payment. Can you help?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-brand-purple hover:text-brand-purple transition-all text-sm"
              >
                <MessageCircle size={16} />
                Get Help
              </a>
            </div>

            <p className="text-xs text-gray-400 text-center">
              No money has been taken from your account. If you believe this is
              an error, please contact us directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

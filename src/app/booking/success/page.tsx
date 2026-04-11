import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Mail, MessageCircle, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  description: "Your Maphoshy Lifestyle booking is confirmed.",
  robots: { index: false },
};

interface Props {
  searchParams: { ref?: string };
}

export default function BookingSuccessPage({ searchParams }: Props) {
  const reference = searchParams.ref;

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-16 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top banner */}
          <div className="bg-brand-purple p-10 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              You&apos;re booked!
            </h1>
            <p className="text-white/75">Payment successful. Your session is reserved.</p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 space-y-8">
            {/* Reference number */}
            {reference && (
              <div className="bg-brand-light-purple rounded-2xl p-6 text-center">
                <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">
                  Booking Reference
                </p>
                <p className="font-mono text-2xl font-bold text-brand-purple">
                  {reference}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Save this — you&apos;ll receive it in your confirmation email too.
                </p>
              </div>
            )}

            {/* What happens next */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-gray-900 mb-5">
                What happens next?
              </h2>
              <ol className="space-y-4">
                {[
                  {
                    icon: Mail,
                    step: "Check your inbox",
                    detail:
                      "A confirmation email with your booking details is on its way.",
                  },
                  {
                    icon: MessageCircle,
                    step: "Portia will reach out",
                    detail:
                      "Within 24 hours, Portia will contact you via WhatsApp or email to confirm your session date and time.",
                  },
                  {
                    icon: Calendar,
                    step: "Prepare for your session",
                    detail:
                      "You&apos;ll receive a brief questionnaire to help Portia make the most of your time together.",
                  },
                ].map(({ icon: Icon, step, detail }, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-brand-light-purple flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-brand-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{step}</p>
                      <p className="text-sm text-gray-500 mt-0.5"
                        dangerouslySetInnerHTML={{ __html: detail }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-purple text-white font-semibold rounded-full hover:bg-[#4a1470] transition-all shadow-md text-sm"
              >
                Back to Home
              </Link>
              <a
                href={`https://wa.me/27787513728?text=${encodeURIComponent("Hi Portia! I just completed my booking. My reference is " + (reference ?? ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-purple text-brand-purple font-semibold rounded-full hover:bg-brand-light-purple transition-all text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Portia
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

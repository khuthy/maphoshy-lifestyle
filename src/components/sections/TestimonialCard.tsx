import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  service: string;
  initials: string;
}

export function TestimonialCard({
  quote,
  author,
  service,
  initials,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition-shadow duration-200">
      <Quote size={32} className="text-brand-light-purple shrink-0" />
      <p className="text-gray-700 leading-relaxed text-base italic flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{author}</p>
          <p className="text-xs text-brand-gold">{service}</p>
        </div>
      </div>
    </div>
  );
}

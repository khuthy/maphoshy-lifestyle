import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  service: string;
  initials: string;
}

export function TestimonialCard({ quote, author, service, initials }: TestimonialCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #5C1A8C, #C9964A)" }} />

      {/* Large quote mark */}
      <div className="font-heading text-7xl leading-none text-brand-light-purple font-bold select-none" aria-hidden="true">
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 -mt-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={13} fill="#C9964A" className="text-brand-gold" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed text-[15px] flex-1">
        {quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}>
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{author}</p>
          <p className="text-xs text-brand-gold font-medium">{service}</p>
        </div>
      </div>
    </div>
  );
}

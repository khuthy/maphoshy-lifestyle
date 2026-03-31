import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  priceIndicator: string;
  href?: string;
  variant?: "default" | "featured";
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  priceIndicator,
  href = "/services",
  variant = "default",
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1",
        variant === "default"
          ? "bg-white border border-gray-100 hover:border-brand-light-purple hover:shadow-lg"
          : "bg-brand-purple text-white hover:bg-[#4a1470] hover:shadow-xl"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "default"
            ? "bg-brand-light-purple text-brand-purple"
            : "bg-white/15 text-white"
        )}
      >
        <Icon size={24} />
      </div>

      <div className="flex-1">
        <h3
          className={cn(
            "font-heading text-lg font-semibold mb-2",
            variant === "default" ? "text-gray-900" : "text-white"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm leading-relaxed",
            variant === "default" ? "text-gray-600" : "text-white/80"
          )}
        >
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={cn(
            "text-xs font-medium",
            variant === "default" ? "text-brand-gold" : "text-brand-gold"
          )}
        >
          {priceIndicator}
        </span>
        <Link
          href={href}
          className={cn(
            "text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all",
            variant === "default"
              ? "text-brand-purple"
              : "text-white/90 hover:text-white"
          )}
        >
          Learn more
          <span className="text-lg leading-none">→</span>
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
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
    <Link
      href={href}
      className={cn(
        "group rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 block",
        variant === "default"
          ? "bg-white border border-gray-100 hover:border-brand-purple/20 hover:shadow-xl hover:shadow-brand-purple/5"
          : "text-white hover:shadow-2xl"
      )}
      style={variant === "featured" ? {
        background: "linear-gradient(135deg, #5C1A8C 0%, #3d1160 100%)",
      } : {}}
    >
      {/* Icon + arrow row */}
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
          variant === "default"
            ? "bg-brand-light-purple text-brand-purple group-hover:bg-brand-purple group-hover:text-white"
            : "bg-white/15 text-white"
        )}>
          <Icon size={22} />
        </div>
        <ArrowUpRight
          size={18}
          className={cn(
            "transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            variant === "default" ? "text-gray-200 group-hover:text-brand-purple" : "text-white/30 group-hover:text-white"
          )}
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className={cn(
          "font-heading text-lg font-semibold mb-2.5 leading-snug",
          variant === "default" ? "text-gray-900" : "text-white"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed",
          variant === "default" ? "text-gray-500" : "text-white/70"
        )}>
          {description}
        </p>
      </div>

      {/* Price pill */}
      <div className="flex items-center justify-between pt-1">
        <span className={cn(
          "text-xs font-semibold px-3 py-1.5 rounded-full",
          variant === "default"
            ? "bg-amber-50 text-brand-gold"
            : "bg-white/10 text-brand-gold"
        )}>
          {priceIndicator}
        </span>
        <span className={cn(
          "text-xs font-semibold transition-all duration-200",
          variant === "default"
            ? "text-brand-purple group-hover:underline"
            : "text-white/80 group-hover:text-white"
        )}>
          Learn more →
        </span>
      </div>
    </Link>
  );
}

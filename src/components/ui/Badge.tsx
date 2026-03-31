import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "purple" | "gold" | "light" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "light",
  size = "sm",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        {
          "bg-brand-purple text-white": variant === "purple",
          "bg-brand-gold text-white": variant === "gold",
          "bg-brand-light-purple text-brand-purple": variant === "light",
          "border border-brand-purple text-brand-purple bg-transparent": variant === "outline",
          "text-xs px-2.5 py-0.5": size === "sm",
          "text-sm px-3 py-1": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

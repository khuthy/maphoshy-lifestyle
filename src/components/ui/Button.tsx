"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Variants
          "bg-brand-purple text-white hover:bg-[#4a1470] active:bg-[#3d1160] shadow-md hover:shadow-lg":
            variant === "primary",
          "border-2 border-brand-purple text-brand-purple hover:bg-brand-light-purple active:bg-[#e8d5f5]":
            variant === "secondary",
          "text-brand-purple hover:bg-brand-light-purple active:bg-[#e8d5f5]":
            variant === "ghost",
          "bg-brand-gold text-white hover:bg-[#b8833e] active:bg-[#a77535] shadow-md hover:shadow-lg":
            variant === "gold",
          // Sizes
          "text-sm px-4 py-2": size === "sm",
          "text-base px-6 py-3": size === "md",
          "text-lg px-8 py-4": size === "lg",
          // Full width
          "w-full": fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "bordered";
  padding?: "sm" | "md" | "lg" | "none";
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white",
        {
          "shadow-sm hover:shadow-md transition-shadow duration-200": variant === "default",
          "shadow-lg hover:shadow-xl transition-shadow duration-200": variant === "elevated",
          "border border-brand-light-purple hover:border-brand-purple transition-colors duration-200":
            variant === "bordered",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
          "p-0": padding === "none",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

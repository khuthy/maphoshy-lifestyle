import Image from "next/image";

interface BrandMarkProps {
  /** "dark"  = purple text (light backgrounds)
   *  "light" = white text (dark backgrounds) */
  theme?: "dark" | "light";
  /** Controls overall scale */
  size?: "sm" | "md" | "lg";
}

export function BrandMark({ theme = "dark", size = "sm" }: BrandMarkProps) {
  const nameColor = theme === "dark" ? "text-brand-purple" : "text-white";

  // Text sizes — scales up at md breakpoint
  const textCls = {
    sm: "text-[10px] md:text-[12px]",
    md: "text-[12px] md:text-[14px]",
    lg: "text-[14px] md:text-[17px]",
  }[size];

  // Icon wrapper — scales up at md breakpoint
  const iconCls = {
    sm: "w-5 h-5 md:w-6 md:h-6",
    md: "w-6 h-6 md:w-8 md:h-8",
    lg: "w-8 h-8 md:w-11 md:h-11",
  }[size];

  // Gap between the three items
  const rowGap = {
    sm: "gap-1.5 md:gap-2",
    md: "gap-2 md:gap-2.5",
    lg: "gap-2.5 md:gap-3",
  }[size];

  // Tagline size
  const tagCls = {
    sm: "text-[6.5px] md:text-[7.5px]",
    md: "text-[7.5px] md:text-[8.5px]",
    lg: "text-[8.5px] md:text-[10px]",
  }[size];

  return (
    <div className="flex flex-col items-center gap-0.5 leading-none select-none">

      {/* ── Row: Maphoshy  [icon]  Lifestyle ── */}
      <div className={`flex items-center ${rowGap}`}>

        <span
          className={`
            font-heading font-bold uppercase tracking-[0.2em]
            ${nameColor} ${textCls}
            transition-colors duration-300
          `}
        >
          Maphoshy
        </span>

        {/* PNG icon */}
        <div className={`relative shrink-0 ${iconCls}`}>
          <Image
            src="/assets/transparent-logo-png.png"
            alt="Maphoshy Lifestyle"
            fill
            className="object-contain"
            sizes="44px"
            priority
          />
        </div>

        <span
          className={`
            font-heading font-bold uppercase tracking-[0.2em]
            ${nameColor} ${textCls}
            transition-colors duration-300
          `}
        >
          Lifestyle
        </span>

      </div>

      {/* ── Tagline ── */}
      <span
        className={`
          uppercase font-semibold tracking-[0.2em] text-brand-gold
          ${tagCls}
        `}
      >
        Quality is our priority | Service is our passion
      </span>

    </div>
  );
}

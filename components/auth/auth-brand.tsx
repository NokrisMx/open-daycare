export type AuthBrandProps = {
  variant: "hero" | "compact" | "activation";
};

const iconClassNames = {
  hero: "flex size-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[rgba(255,255,255,0.22)] text-white",
  compact:
    "flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FBE3D8] text-[#EC7E62]",
  activation:
    "flex size-[58px] shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] text-white shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]",
} satisfies Record<AuthBrandProps["variant"], string>;

const iconSizes = {
  hero: 26,
  compact: 23,
  activation: 30,
} satisfies Record<AuthBrandProps["variant"], number>;

export function AuthBrand({ variant }: AuthBrandProps) {
  const iconSize = iconSizes[variant];
  const icon = (
    <div className={iconClassNames[variant]}>
      <svg
        aria-hidden="true"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </div>
  );

  if (variant === "activation") {
    return icon;
  }

  return (
    <div className={`flex items-center ${variant === "hero" ? "gap-[13px]" : "gap-[11px]"}`}>
      {icon}

      <span
        className={
          variant === "hero"
            ? "font-display text-[21px] font-semibold tracking-[0.5px] text-white"
            : "font-display text-[19px] font-semibold tracking-[0.3px] text-[#3F362E]"
        }
      >
        OpenDayCare
      </span>
    </div>
  );
}

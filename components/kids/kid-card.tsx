import Link from "next/link";

export type KidAvatarTone = "sky" | "pink" | "green" | "yellow" | "purple";

export type KidBadgeTone = "allergy" | "link";

export type KidSummary = {
  id: number;
  name: string;
  initial: string;
  ageLabel: string;
  linkedParentsLabel: string;
  avatarTone: KidAvatarTone;
  badge?: {
    label: string;
    tone: KidBadgeTone;
  };
};

export type KidCardProps = {
  kid: KidSummary;
  href?: string;
};

const avatarToneClasses: Record<KidAvatarTone, string> = {
  sky: "bg-[#A9D9E8] text-[#1F7A93]",
  pink: "bg-[#F4B8CC] text-[#C44A7A]",
  green: "bg-[#B9DEC4] text-[#3E8B62]",
  yellow: "bg-[#F4DC8E] text-[#9A7B1E]",
  purple: "bg-[#C9B6E8] text-[#7B5FC0]",
};

const badgeToneClasses: Record<KidBadgeTone, string> = {
  allergy: "bg-[#FBD8CC] text-[#D9684A]",
  link: "bg-[#F9D2DE] text-[#C56486]",
};

export function KidCard({ kid, href }: KidCardProps) {
  const cardContent = (
    <>
      <div
        className={`font-display flex size-12 shrink-0 items-center justify-center rounded-full text-[19px] font-semibold ${avatarToneClasses[kid.avatarTone]}`}
      >
        {kid.initial}
      </div>

      <div className="min-w-0 flex-1 break-words md:break-normal">
        <div className="font-display text-base font-semibold text-[#3F362E]">
          {kid.name}
        </div>
        <div className="text-[13px] text-[#A89A8B]">
          {kid.ageLabel} · {kid.linkedParentsLabel}
        </div>
      </div>

      {kid.badge ? (
        <span
          className={`shrink-0 rounded-full px-[9px] py-[5px] text-[11px] font-extrabold ${badgeToneClasses[kid.badge.tone]}`}
        >
          {kid.badge.label}
        </span>
      ) : href ? (
        <svg
          aria-hidden="true"
          className="shrink-0"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBB89F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      ) : null}
    </>
  );

  return href ? (
    <Link
      href={href}
      className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)] transition duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E]"
    >
      {cardContent}
    </Link>
  ) : (
    <div className="flex min-w-0 items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)]">
      {cardContent}
    </div>
  );
}

import Link from "next/link";

import type { KidSummary } from "@/components/kids/kid-card";

import { LinkedParentsCard } from "./linked-parents-card";

export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  id: number;
  name: string;
  initial: string;
  relationshipLabel: string;
  statusLabel: string;
  status: ParentStatus;
  avatarTone: "purple" | "blue";
};

export type KidProfileData = KidSummary & {
  roomName: string;
  birthDateLabel: string;
  enrollmentLabel: string;
  note?: {
    title: string;
    body: string;
  };
  linkedParents: readonly LinkedParent[];
};

export type KidProfileProps = {
  profile: KidProfileData;
};

const kidAvatarToneClasses: Record<KidSummary["avatarTone"], string> = {
  sky: "bg-[#A9D9E8] text-[#1F7A93]",
  pink: "bg-[#F4B8CC] text-[#C44A7A]",
  green: "bg-[#B9DEC4] text-[#3E8B62]",
  yellow: "bg-[#F4DC8E] text-[#9A7B1E]",
  purple: "bg-[#C9B6E8] text-[#7B5FC0]",
};

export function KidProfile({ profile }: KidProfileProps) {
  const roomLabel = profile.roomName.replace(/^Sala\s+/i, "");

  return (
    <div className="mx-auto max-w-[740px]">
      <Link
        href="/kids"
        className="mb-5 flex items-center gap-[7px] text-sm leading-[normal] font-bold text-[#94887B]"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver a Niños
      </Link>

      <div className="flex flex-col items-stretch gap-[26px] md:flex-row md:flex-wrap md:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-[18px] md:min-w-[300px]">
          <div className="flex flex-wrap items-center gap-[18px] md:flex-nowrap">
            <div
              className={`font-display flex size-[84px] shrink-0 items-center justify-center rounded-full text-[34px] font-semibold ${kidAvatarToneClasses[profile.avatarTone]}`}
            >
              {profile.initial}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-[28px] font-semibold text-[#3F362E]">
                {profile.name}
              </h1>
              <p className="mt-[3px] text-[15px] text-[#94887B]">
                {profile.ageLabel} · Sala {roomLabel}
              </p>
            </div>
            <button
              type="button"
              className="w-full basis-full rounded-xl border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-sm leading-[normal] font-bold text-[#6E6359] md:w-auto md:basis-auto"
            >
              Editar
            </button>
          </div>

          {profile.note ? (
            <div className="flex gap-3.5 rounded-2xl bg-[#FBDAD6] px-[18px] py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-[#F4A8A0]">
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
                  {profile.note.title}
                </div>
                <div className="text-[14.5px] leading-[1.5] text-[#B25249]">
                  {profile.note.body}
                </div>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-[#ECE0D0] bg-[#FFFDF9]">
            <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px] text-[14.5px]">
              <span className="text-[#94887B]">Fecha de nacimiento</span>
              <span className="font-extrabold text-[#3F362E]">
                {profile.birthDateLabel}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px] text-[14.5px]">
              <span className="text-[#94887B]">Sala</span>
              <span className="font-extrabold text-[#3F362E]">{roomLabel}</span>
            </div>
            <div className="flex justify-between px-[18px] py-[15px] text-[14.5px]">
              <span className="text-[#94887B]">Ingreso</span>
              <span className="font-extrabold text-[#3F362E]">
                {profile.enrollmentLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3.5 md:w-[300px]">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#3F362E] p-[13px] text-[15px] font-extrabold text-white"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            Resumen del día
          </button>

          <LinkedParentsCard
            parents={profile.linkedParents}
            kidName={profile.name}
          />
        </div>
      </div>
    </div>
  );
}

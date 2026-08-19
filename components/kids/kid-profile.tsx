import Link from "next/link";

import type { KidSummary } from "@/components/kids/kid-card";

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

const parentAvatarToneClasses: Record<LinkedParent["avatarTone"], string> = {
  purple: "bg-[#C9B6E8]",
  blue: "bg-[#A9C7E8]",
};

const parentStatusClasses: Record<ParentStatus, string> = {
  active: "bg-[#CFEBD8] text-[#3E9B6C]",
  pending: "bg-[#F7E7A6] text-[#9A7B1E]",
};

export function KidProfile({ profile }: KidProfileProps) {
  const roomLabel = profile.roomName.replace(/^Sala\s+/i, "");

  return (
    <div className="mx-auto max-w-[740px]">
      <Link
        href="/kids"
        className="mb-5 flex items-center gap-[7px] text-sm font-bold text-[#94887B]"
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

      <div className="flex flex-wrap items-start gap-[26px]">
        <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
          <div className="flex items-center gap-[18px]">
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
              className="rounded-xl border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-sm font-bold text-[#6E6359]"
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

        <div className="flex w-[300px] shrink-0 flex-col gap-3.5">
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

          <section className="rounded-2xl border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
            <h2 className="mb-3.5 text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
              PADRES VINCULADOS
            </h2>
            <div className="flex flex-col gap-3.5">
              {profile.linkedParents.map((parent) => (
                <div key={parent.id} className="flex items-center gap-3">
                  <div
                    className={`font-display flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${parentAvatarToneClasses[parent.avatarTone]}`}
                  >
                    {parent.initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-extrabold text-[#3F362E]">
                      {parent.name}
                    </div>
                    <div className="text-[12.5px] text-[#A89A8B]">
                      {parent.relationshipLabel} · {parent.statusLabel}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${parentStatusClasses[parent.status]}`}
                  >
                    {parent.status === "pending"
                      ? "PENDIENTE"
                      : parent.statusLabel.toUpperCase()}
                  </span>
                </div>
              ))}

              <button
                type="button"
                className="flex items-center gap-3 pt-2 text-left"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
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
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span className="text-[14.5px] font-extrabold text-[#C5503A]">
                  Vincular otro padre
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

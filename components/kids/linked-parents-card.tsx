"use client";

import { useCallback, useRef, useState } from "react";

import { LinkParentDialog, type NewParentDraft } from "./link-parent-dialog";
import type { LinkedParent, ParentStatus } from "./kid-profile";

const parentAvatarToneClasses: Record<LinkedParent["avatarTone"], string> = {
  purple: "bg-[#C9B6E8]",
  blue: "bg-[#A9C7E8]",
};

const parentStatusClasses: Record<ParentStatus, string> = {
  active: "bg-[#CFEBD8] text-[#3E9B6C]",
  pending: "bg-[#F7E7A6] text-[#9A7B1E]",
};

const AVATAR_TONES: LinkedParent["avatarTone"][] = ["purple", "blue"];

export type LinkedParentsCardProps = {
  parents: readonly LinkedParent[];
  kidName: string;
};

export function LinkedParentsCard({ parents, kidName }: LinkedParentsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ephemeralParents, setEphemeralParents] = useState<LinkedParent[]>([]);
  const nextIdRef = useRef(-1);

  const handleOpen = useCallback(() => setIsDialogOpen(true), []);
  const handleClose = useCallback(() => setIsDialogOpen(false), []);

  const handleLinkParent = useCallback((draft: NewParentDraft) => {
    const trimmedName = draft.fullName.trim();
    const id = nextIdRef.current;
    nextIdRef.current -= 1;

    const newParent: LinkedParent = {
      id,
      name: trimmedName,
      initial: trimmedName.charAt(0).toUpperCase(),
      relationshipLabel: draft.relationship,
      statusLabel: "invitación enviada",
      status: "pending",
      avatarTone: AVATAR_TONES[Math.abs(id + 1) % AVATAR_TONES.length],
    };

    setEphemeralParents((previous) => [...previous, newParent]);
  }, []);

  const allParents = [...parents, ...ephemeralParents];

  return (
    <section className="rounded-2xl border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
      <h2 className="mb-3.5 text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
        PADRES VINCULADOS
      </h2>

      <div className="flex flex-col gap-3.5">
        {allParents.map((parent) => (
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
          onClick={handleOpen}
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

      <LinkParentDialog
        isOpen={isDialogOpen}
        kidName={kidName}
        onClose={handleClose}
        onLinkParent={handleLinkParent}
      />
    </section>
  );
}

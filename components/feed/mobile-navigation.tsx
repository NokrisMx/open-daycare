"use client";

import { useState } from "react";

import {
  SidebarContent,
  type SidebarProps,
} from "@/components/feed/sidebar";

export type MobileNavigationProps = SidebarProps;

function MobileBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
        <svg
          aria-hidden="true"
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </div>
      <span className="font-display text-[17px] font-semibold text-[#3F362E]">
        OpenDayCare
      </span>
    </div>
  );
}

export function MobileNavigation(props: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3 md:hidden">
        <MobileBrand />
        <button
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-xl bg-[#F6ECDF] text-[#6E6359]"
        >
          <svg
            aria-hidden="true"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-[#3F362E]/35 md:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-[248px] flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] px-4 py-6 md:hidden">
            <SidebarContent {...props} />
          </aside>
        </>
      ) : null}
    </>
  );
}

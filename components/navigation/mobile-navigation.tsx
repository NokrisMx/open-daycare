"use client";

import { useEffect, useRef, useState } from "react";

import {
  SidebarContent,
  type SidebarProps,
} from "@/components/navigation/sidebar";

export type MobileNavigationProps = SidebarProps;

const drawerId = "mobile-navigation-drawer";
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setIsOpen(false);
      }
    }

    desktopQuery.addEventListener("change", handleBreakpointChange);

    return () =>
      desktopQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        menuButtonRef.current?.focus();
        wasOpenRef.current = false;
      }

      return;
    }

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-page-scroll-container]",
    );
    const pageContent = scrollContainer?.querySelector<HTMLElement>(
      "[data-page-content]",
    );
    const previousOverflowY = scrollContainer?.style.overflowY;
    const wasPageContentInert = pageContent?.inert ?? false;
    const previousAriaHidden =
      pageContent?.getAttribute("aria-hidden") ?? null;

    if (scrollContainer) {
      scrollContainer.style.overflowY = "hidden";
    }

    if (pageContent) {
      pageContent.inert = true;
      pageContent.setAttribute("aria-hidden", "true");
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const drawer = drawerRef.current;

      if (!drawer) {
        return;
      }

      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        drawer.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!drawer.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (scrollContainer) {
        scrollContainer.style.overflowY = previousOverflowY ?? "";
      }

      if (pageContent) {
        pageContent.inert = wasPageContentInert;

        if (previousAriaHidden === null) {
          pageContent.removeAttribute("aria-hidden");
        } else {
          pageContent.setAttribute("aria-hidden", previousAriaHidden);
        }
      }
    };
  }, [isOpen]);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#ECE0D0] bg-[#FFFDF9] pt-[calc(0.75rem+env(safe-area-inset-top))] pr-[calc(1rem+env(safe-area-inset-right))] pb-3 pl-[calc(1rem+env(safe-area-inset-left))] md:hidden">
        <MobileBrand />
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls={drawerId}
          aria-haspopup="dialog"
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

      <button
        type="button"
        aria-label="Cerrar menú"
        aria-hidden="true"
        inert={!isOpen}
        tabIndex={-1}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[45] bg-[#3F362E]/35 transition-opacity duration-200 ease-out motion-reduce:transition-none md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        id={drawerId}
        role={isOpen ? "dialog" : undefined}
        aria-modal={isOpen ? "true" : undefined}
        aria-hidden={isOpen ? undefined : "true"}
        aria-label={isOpen ? "Navegación principal móvil" : undefined}
        inert={!isOpen}
        tabIndex={-1}
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[calc(248px+env(safe-area-inset-left))] flex-col overflow-y-auto overscroll-contain border-r border-[#ECE0D0] bg-[#FFFDF9] pt-[calc(1.5rem+env(safe-area-inset-top))] pr-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] transition-transform duration-200 ease-out motion-reduce:transition-none md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          {...props}
          headerAction={
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setIsOpen(false)}
              className="flex size-9 items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#6E6359]"
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
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          }
        />
      </aside>
    </>
  );
}

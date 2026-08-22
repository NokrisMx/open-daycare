"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LinkParentRelationship = "Mamá" | "Papá" | "Tutor/a";

export type NewParentDraft = {
  fullName: string;
  email: string;
  relationship: LinkParentRelationship;
};

export type LinkParentDialogProps = {
  isOpen: boolean;
  kidName: string;
  onClose: () => void;
  onLinkParent: (draft: NewParentDraft) => void;
};

const RELATIONSHIPS: readonly LinkParentRelationship[] = ["Mamá", "Papá", "Tutor/a"];

type FieldErrors = {
  fullName?: string;
  email?: string;
};

function formatKidFirstName(kidName: string): string {
  return kidName.trim().split(/\s+/)[0] ?? "";
}

function isValidEmail(value: string): boolean {
  // Simple format check: text @ text . text
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const emptyForm = () => ({
  fullName: "",
  email: "",
  relationship: "Mamá" as LinkParentRelationship,
});

export function LinkParentDialog({
  isOpen,
  kidName,
  onClose,
  onLinkParent,
}: LinkParentDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const element = previouslyFocusedRef.current;
      if (element && typeof element.focus === "function") {
        element.focus();
      }
      return;
    }

    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-page-scroll-container]"
    );
    const pageContent = document.querySelector<HTMLElement>("[data-page-content]");
    const previousOverflowY = scrollContainer?.style.overflowY ?? "";
    const wasPageContentInert = pageContent?.inert ?? false;
    const previousAriaHidden = pageContent?.getAttribute("aria-hidden") ?? null;

    if (scrollContainer) {
      scrollContainer.style.overflowY = "hidden";
    }

    if (pageContent) {
      pageContent.inert = true;
      pageContent.setAttribute("aria-hidden", "true");
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.style.overflowY = previousOverflowY;
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

  const handleClose = useCallback(() => {
    setForm(emptyForm());
    setErrors({});
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = overlayRef.current?.querySelector<HTMLElement>(
        "[data-dialog-panel]"
      );
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "input, button, [tabindex]:not([tabindex='-1'])"
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [isOpen, handleClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const updateField = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((previous) => ({ ...previous, [field]: value }));
      if (errors[field as keyof FieldErrors]) {
        setErrors((previous) => ({ ...previous, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleRelationshipSelect = useCallback(
    (relationship: LinkParentRelationship) => {
      setForm((previous) => ({ ...previous, relationship }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const newErrors: FieldErrors = {};

      if (!form.fullName.trim()) {
        newErrors.fullName = "Ingresa el nombre del padre o madre.";
      }

      const trimmedEmail = form.email.trim();
      if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
        newErrors.email = "Ingresa un email válido.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);

        if (newErrors.fullName && nameRef.current) {
          nameRef.current.focus();
        } else if (newErrors.email && emailRef.current) {
          emailRef.current.focus();
        }

        return;
      }

      onLinkParent({
        fullName: form.fullName.trim(),
        email: trimmedEmail,
        relationship: form.relationship,
      });
      handleClose();
    },
    [form, onLinkParent, handleClose]
  );

  if (!mounted || !isOpen) return null;

  const trimmedKidName = kidName.trim();
  const firstName = formatKidFirstName(kidName);

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[45] flex items-start justify-center overflow-y-auto bg-[#3F362E]/35 p-4 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-parent-title"
    >
      <div
        data-dialog-panel
        className="w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <header className="flex items-center justify-between border-b border-[#ECE0D0] px-[18px] py-5 md:px-[26px]">
          <div>
            <h2
              id="link-parent-title"
              className="font-display text-[18px] font-semibold text-[#3F362E]"
            >
              Vincular padre
            </h2>
            <p className="text-[13px] text-[#A89A8B]">a {trimmedKidName}</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={handleClose}
            className="flex size-[34px] items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B]"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="px-[18px] py-[22px] md:px-[26px]"
        >
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
            <svg
              aria-hidden="true"
              className="mt-[1px] shrink-0"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E72C8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {firstName}.
            </span>
          </div>

          <label
            htmlFor="parent-name"
            className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
          >
            NOMBRE DEL PADRE/MADRE
          </label>
          <input
            ref={nameRef}
            id="parent-name"
            type="text"
            placeholder="Ej. Diego Fernández"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.currentTarget.value)}
            className={`mb-4 block w-full rounded-[14px] bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E] ${
              errors.fullName
                ? "border-[1.5px] border-[#D9583C]"
                : "border-[1.5px] border-[#EADFD0]"
            }`}
          />
          {errors.fullName && (
            <p className="-mt-3 mb-4 text-[13px] text-[#D9583C]">
              {errors.fullName}
            </p>
          )}

          <label
            htmlFor="parent-email"
            className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
          >
            EMAIL
          </label>
          <input
            ref={emailRef}
            id="parent-email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={(event) => updateField("email", event.currentTarget.value)}
            className={`mb-4 block w-full rounded-[14px] bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E] ${
              errors.email
                ? "border-[1.5px] border-[#D9583C]"
                : "border-[1.5px] border-[#EADFD0]"
            }`}
          />
          {errors.email && (
            <p className="-mt-3 mb-4 text-[13px] text-[#D9583C]">
              {errors.email}
            </p>
          )}

          <div className="mb-5">
            <div className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
              PARENTESCO
            </div>
            <div
              className="flex gap-[9px]"
              role="radiogroup"
              aria-label="Parentesco"
            >
              {RELATIONSHIPS.map((relationship) => {
                const active = form.relationship === relationship;
                return (
                  <button
                    key={relationship}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleRelationshipSelect(relationship)}
                    className={`flex-1 rounded-[999px] border-[1.5px] px-[11px] py-[11px] text-[14px] font-extrabold ${
                      active
                        ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                    }`}
                  >
                    {relationship}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] p-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-[#A88526]">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-display text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
              7K4P9
            </div>
            <div className="mt-[6px] text-[13px] text-[#A88526]">
              Vence en 7 días
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
          >
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
            Enviar invitación
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

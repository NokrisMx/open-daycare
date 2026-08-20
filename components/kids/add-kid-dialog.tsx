"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type AddKidDialogRoom = "Soles" | "Lunas" | "Estrellas";

export type NewKidDraft = {
  fullName: string;
  birthDate: string;
  room: AddKidDialogRoom;
  allergies: string;
  medicalNotes: string;
};

export type AddKidDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddKid: (draft: NewKidDraft) => void;
};

const AVATAR_TONES = ["sky", "pink", "green", "yellow", "purple"] as const;

type AvatarTone = (typeof AVATAR_TONES)[number];

type FieldErrors = {
  fullName?: string;
  birthDate?: string;
  room?: string;
};

function calculateAgeLabel(birthDate: string): string {
  const today = new Date();
  const birth = new Date(birthDate + "T00:00:00");
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
  }

  if (years >= 1) {
    return `${years} ${years === 1 ? "año" : "años"}`;
  }

  let months = monthDiff;
  if (months < 0) {
    months += 12;
  }
  if (dayDiff < 0) {
    months--;
  }
  if (months < 1) {
    months = 0;
  }

  return `${months} ${months === 1 ? "mes" : "meses"}`;
}

function deriveEphemeralKid(draft: NewKidDraft, nextId: number) {
  const fullName = draft.fullName.trim();
  const initial = fullName.charAt(0).toUpperCase();
  const ageLabel = calculateAgeLabel(draft.birthDate);
  const avatarTone =
    AVATAR_TONES[Math.abs(nextId - 1) % AVATAR_TONES.length];

  const allergies = draft.allergies.trim();
  const badge = allergies
    ? { label: allergies.split(",")[0].trim().toUpperCase(), tone: "allergy" as const }
    : { label: "VINCULAR", tone: "link" as const };

  return {
    id: nextId,
    name: fullName,
    initial,
    ageLabel,
    linkedParentsLabel: "sin padres vinculados",
    avatarTone,
    badge,
  };
}

const emptyForm = () => ({
  fullName: "",
  birthDate: "",
  room: "",
  allergies: "",
  medicalNotes: "",
});

export function AddKidDialog({ isOpen, onClose, onAddKid }: AddKidDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const pageContent = document.querySelector("[data-page-content]");
    if (pageContent) {
      pageContent.setAttribute("inert", "");
      pageContent.setAttribute("aria-hidden", "true");
    }

    return () => {
      document.body.style.overflow = original;
      if (pageContent) {
        pageContent.removeAttribute("inert");
        pageContent.removeAttribute("aria-hidden");
      }
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab") {
        const dialog = overlayRef.current?.querySelector("[data-dialog-panel]");
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll(
            "input, select, textarea, button, [tabindex]:not([tabindex='-1'])"
          )
        ).filter(
          (el): el is HTMLElement =>
            el instanceof HTMLElement && !el.hasAttribute("disabled")
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleClose = useCallback(() => {
    setForm(emptyForm());
    setErrors({});
    onClose();
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleChange = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors: FieldErrors = {};

      if (!form.fullName.trim()) {
        newErrors.fullName = "Ingresa el nombre completo.";
      }
      if (!form.birthDate) {
        newErrors.birthDate = "Ingresa la fecha de nacimiento.";
      }
      if (!form.room) {
        newErrors.room = "Selecciona una sala.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        if (newErrors.fullName && nameRef.current) {
          nameRef.current.focus();
        } else if (newErrors.birthDate) {
          document.getElementById("birthDate")?.focus();
        } else if (newErrors.room) {
          document.getElementById("room")?.focus();
        }
        return;
      }

      const draft: NewKidDraft = {
        fullName: form.fullName.trim(),
        birthDate: form.birthDate,
        room: form.room as AddKidDialogRoom,
        allergies: form.allergies,
        medicalNotes: form.medicalNotes,
      };

      onAddKid(draft);
      handleClose();
    },
    [form, onAddKid, handleClose]
  );

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[45] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Agregar niño"
    >
      <div
        data-dialog-panel
        className="w-full max-w-[520px] rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <header className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            type="button"
            onClick={handleClose}
            className="text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <h2 className="font-display text-lg font-semibold text-[#3F362E]">
            Agregar niño
          </h2>
          <button
            type="submit"
            form="add-kid-form"
            className="text-[15px] font-extrabold text-[#D9583C]"
          >
            Guardar
          </button>
        </header>

        <form
          id="add-kid-form"
          onSubmit={handleSubmit}
          className="px-[26px] py-6"
        >
          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            NOMBRE COMPLETO
          </label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Ej. Martina López"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.currentTarget.value)}
            className={`mb-[18px] block w-full rounded-[14px] border bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E] ${
              errors.fullName
                ? "border-[#D9583C]"
                : "border-[1.5px] border-[#EADFD0]"
            }`}
          />
          {errors.fullName && (
            <p className="-mt-[14px] mb-[14px] text-[13px] text-[#D9583C]">
              {errors.fullName}
            </p>
          )}

          <div className="mb-[18px] flex flex-col gap-[14px] md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="birthDate"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
              >
                FECHA DE NACIMIENTO
              </label>
              <input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.currentTarget.value)}
                className={`block w-full rounded-[14px] border bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E] ${
                  errors.birthDate
                    ? "border-[#D9583C]"
                    : "border-[1.5px] border-[#EADFD0]"
                }`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-[13px] text-[#D9583C]">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="room"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
              >
                SALA
              </label>
              <select
                id="room"
                value={form.room}
                onChange={(e) => handleChange("room", e.currentTarget.value)}
                className={`block w-full rounded-[14px] border bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E] ${
                  errors.room
                    ? "border-[#D9583C]"
                    : "border-[1.5px] border-[#EADFD0]"
                }`}
              >
                <option value="" disabled>
                  Selecciona una sala
                </option>
                <option value="Soles">Soles</option>
                <option value="Lunas">Lunas</option>
                <option value="Estrellas">Estrellas</option>
              </select>
              {errors.room && (
                <p className="mt-1 text-[13px] text-[#D9583C]">{errors.room}</p>
              )}
            </div>
          </div>

          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            ALERGIAS (ETIQUETAS)
          </label>
          <input
            type="text"
            placeholder="Ej. Maní, Lactosa"
            value={form.allergies}
            onChange={(e) => handleChange("allergies", e.currentTarget.value)}
            className="mb-[18px] block w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-[#fff] px-4 py-[13px] text-[15px] text-[#3F362E]"
          />

          <label className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]">
            NOTAS MÉDICAS
          </label>
          <textarea
            placeholder="Indicaciones, medicación, contactos…"
            value={form.medicalNotes}
            onChange={(e) => handleChange("medicalNotes", e.currentTarget.value)}
            rows={3}
            className="block min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-[#fff] px-4 py-[13px] text-[15px] leading-relaxed text-[#3F362E]"
          />
        </form>
      </div>
    </div>,
    document.body
  );
}

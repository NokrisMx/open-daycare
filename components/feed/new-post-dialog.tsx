"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { KidAvatarTone } from "@/components/kids/kid-card";

export type NewPostType =
  | "comida"
  | "siesta"
  | "actividad"
  | "logro"
  | "animo"
  | "foto"
  | "anuncio";

export type NewPostRecipientKid = {
  id: number;
  firstName: string;
  initial: string;
  avatarTone: KidAvatarTone;
};

export type NewPostDraft = {
  kidIds: number[];
  isWholeRoom: boolean;
  type: NewPostType;
  description: string;
  photoCount: number;
};

export type NewPostDialogProps = {
  isOpen: boolean;
  kids: readonly NewPostRecipientKid[];
  onClose: () => void;
  onPublish: (draft: NewPostDraft) => void;
};

type FormErrors = {
  recipients: boolean;
  type: boolean;
  description: boolean;
};

const initialErrors: FormErrors = {
  recipients: false,
  type: false,
  description: false,
};

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const avatarToneClasses: Record<KidAvatarTone, string> = {
  sky: "bg-[#A9D9E8] text-[#1F7A93]",
  pink: "bg-[#F4B8CC] text-[#C44A7A]",
  green: "bg-[#B9DEC4] text-[#3E8B62]",
  yellow: "bg-[#F4DC8E] text-[#9A7B1E]",
  purple: "bg-[#C9B6E8] text-[#7B5FC0]",
};

const postTypes: ReadonlyArray<{
  id: NewPostType;
  label: string;
  className: string;
}> = [
  { id: "comida", label: "Comida", className: "bg-[#9A7B1E] text-white" },
  {
    id: "siesta",
    label: "Siesta",
    className: "bg-[#E7DCF6] text-[#7B5FC0]",
  },
  {
    id: "actividad",
    label: "Actividad",
    className: "bg-[#2E89A6] text-white",
  },
  {
    id: "logro",
    label: "Logro",
    className: "bg-[#CFEBD8] text-[#3E9B6C]",
  },
  {
    id: "animo",
    label: "Ánimo",
    className: "bg-[#F9D2DE] text-[#C56486]",
  },
  {
    id: "foto",
    label: "Foto",
    className: "bg-[#FBD8CC] text-[#D9684A]",
  },
  {
    id: "anuncio",
    label: "Anuncio",
    className: "bg-[#CCD8F4] text-[#4E72C8]",
  },
];

export function NewPostDialog({
  isOpen,
  kids,
  onClose,
  onPublish,
}: NewPostDialogProps) {
  const [kidIds, setKidIds] = useState<number[]>([]);
  const [isWholeRoom, setIsWholeRoom] = useState(false);
  const [type, setType] = useState<NewPostType | null>(null);
  const [description, setDescription] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const panelRef = useRef<HTMLFormElement>(null);
  const firstRecipientRef = useRef<HTMLButtonElement>(null);
  const firstTypeRef = useRef<HTMLButtonElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      firstRecipientRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      previouslyFocusedRef.current?.focus();
      return;
    }

    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-page-scroll-container]",
    );
    const pageContent = document.querySelector<HTMLElement>(
      "[data-page-content]",
    );
    const previousOverflowY = scrollContainer?.style.overflowY ?? "";
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

  const resetForm = useCallback(() => {
    setKidIds([]);
    setIsWholeRoom(false);
    setType(null);
    setDescription("");
    setPhotoCount(0);
    setErrors(initialErrors);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      const focusableElements = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        panel.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isOpen]);

  function handleRecipientClick(kidId: number) {
    setIsWholeRoom(false);
    setKidIds((currentKidIds) =>
      currentKidIds.includes(kidId)
        ? currentKidIds.filter((currentKidId) => currentKidId !== kidId)
        : [...currentKidIds, kidId],
    );

    if (errors.recipients) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        recipients: false,
      }));
    }
  }

  function handleWholeRoomClick() {
    setIsWholeRoom((currentValue) => !currentValue);
    setKidIds([]);

    if (errors.recipients) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        recipients: false,
      }));
    }
  }

  function handleTypeClick(nextType: NewPostType) {
    setType((currentType) => (currentType === nextType ? null : nextType));

    if (errors.type) {
      setErrors((currentErrors) => ({ ...currentErrors, type: false }));
    }
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);

    if (errors.description) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        description: false,
      }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      recipients: kidIds.length === 0 && !isWholeRoom,
      type: type === null,
      description: description.trim().length === 0,
    };

    if (nextErrors.recipients || nextErrors.type || nextErrors.description) {
      setErrors(nextErrors);

      if (nextErrors.recipients) {
        firstRecipientRef.current?.focus();
      } else if (nextErrors.type) {
        firstTypeRef.current?.focus();
      } else {
        descriptionRef.current?.focus();
      }

      return;
    }

    onPublish({
      kidIds,
      isWholeRoom,
      type: type as NewPostType,
      description: description.trim(),
      photoCount,
    });
    handleClose();
  }

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-post-dialog-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[45] flex items-start justify-center overflow-hidden bg-[#3F362E]/35 p-3 md:items-center md:p-6"
    >
      <form
        ref={panelRef}
        data-dialog-panel
        noValidate
        tabIndex={-1}
        onSubmit={handleSubmit}
        className="relative z-50 max-h-[calc(100dvh-1.5rem)] w-full max-w-[580px] overflow-x-hidden overflow-y-auto rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)] md:max-h-[calc(100dvh-3rem)]"
      >
        <header className="flex items-center justify-between border-b border-[#ECE0D0] px-[18px] py-5 md:px-[26px]">
          <button
            type="button"
            onClick={handleClose}
            className="text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <h2
            id="new-post-dialog-title"
            className="font-display text-[18px] font-semibold text-[#3F362E]"
          >
            Nueva publicación
          </h2>
          <button
            type="submit"
            className="text-[15px] font-extrabold text-[#D9583C]"
          >
            Publicar
          </button>
        </header>

        <div className="px-[18px] py-5 md:px-[26px] md:py-6">
          <section className="mb-[22px]" aria-labelledby="new-post-recipients-label">
            <h3
              id="new-post-recipients-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
            >
              PARA
            </h3>
            <div className="flex flex-wrap gap-[9px]">
              {kids.map((kid, index) => {
                const active = kidIds.includes(kid.id);

                return (
                  <button
                    ref={index === 0 ? firstRecipientRef : undefined}
                    key={kid.id}
                    type="button"
                    aria-pressed={active}
                    aria-describedby={
                      errors.recipients ? "new-post-recipients-error" : undefined
                    }
                    onClick={() => handleRecipientClick(kid.id)}
                    className={`flex items-center gap-2 rounded-full border-[1.5px] py-1.5 pr-3.5 pl-1.5 text-[14px] font-bold ${
                      active
                        ? "border-[#3F362E] bg-[#3F362E] text-white"
                        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                    }`}
                  >
                    <span
                      className={`font-display flex size-[26px] items-center justify-center rounded-full text-[13px] font-semibold ${avatarToneClasses[kid.avatarTone]}`}
                    >
                      {kid.initial}
                    </span>
                    {kid.firstName}
                  </button>
                );
              })}
              <button
                ref={kids.length === 0 ? firstRecipientRef : undefined}
                type="button"
                aria-pressed={isWholeRoom}
                aria-describedby={
                  errors.recipients ? "new-post-recipients-error" : undefined
                }
                onClick={handleWholeRoomClick}
                className={`rounded-full border-[1.5px] px-4 py-1.5 text-[14px] font-bold ${
                  isWholeRoom
                    ? "border-[#3F362E] bg-[#3F362E] text-white"
                    : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                }`}
              >
                Toda la sala
              </button>
            </div>
            {errors.recipients ? (
              <p
                id="new-post-recipients-error"
                className="mt-2 text-[13px] text-[#D9583C]"
              >
                Selecciona al menos un destinatario.
              </p>
            ) : null}
          </section>

          <section className="mb-[22px]" aria-labelledby="new-post-type-label">
            <h3
              id="new-post-type-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
            >
              TIPO
            </h3>
            <div className="flex flex-wrap gap-[9px]">
              {postTypes.map((postType, index) => {
                const active = type === postType.id;

                return (
                  <button
                    ref={index === 0 ? firstTypeRef : undefined}
                    key={postType.id}
                    type="button"
                    aria-pressed={active}
                    aria-describedby={
                      errors.type ? "new-post-type-error" : undefined
                    }
                    onClick={() => handleTypeClick(postType.id)}
                    className={`rounded-full px-4 py-2 text-[13.5px] font-extrabold transition-opacity ${postType.className} ${
                      active ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    {postType.label}
                  </button>
                );
              })}
            </div>
            {errors.type ? (
              <p
                id="new-post-type-error"
                className="mt-2 text-[13px] text-[#D9583C]"
              >
                Selecciona un tipo de publicación.
              </p>
            ) : null}
          </section>

          <section className="mb-[22px]">
            <label
              htmlFor="new-post-description"
              className="mb-[10px] block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
            >
              DESCRIPCIÓN
            </label>
            <textarea
              ref={descriptionRef}
              id="new-post-description"
              value={description}
              aria-invalid={errors.description}
              aria-describedby={
                errors.description ? "new-post-description-error" : undefined
              }
              placeholder="Contá cómo le fue hoy…"
              onChange={(event) =>
                handleDescriptionChange(event.currentTarget.value)
              }
              className={`block min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] leading-[1.5] text-[#3F362E] placeholder:text-[#B6A99B] ${
                errors.description
                  ? "border-[#D9583C]"
                  : "border-[#EADFD0]"
              }`}
            />
            {errors.description ? (
              <p
                id="new-post-description-error"
                className="mt-2 text-[13px] text-[#D9583C]"
              >
                Ingresa una descripción.
              </p>
            ) : null}
          </section>

          <section aria-labelledby="new-post-photos-label">
            <h3
              id="new-post-photos-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
            >
              FOTOS
            </h3>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: photoCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Quitar foto ${index + 1}`}
                  onClick={() =>
                    setPhotoCount((currentCount) => currentCount - 1)
                  }
                  className="flex size-24 items-center justify-center rounded-[14px] border border-[#ECE0D0] bg-[#F4ECE1] text-[#CBB89F]"
                >
                  <svg
                    aria-hidden="true"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
                  </svg>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPhotoCount((currentCount) => currentCount + 1)}
                className="flex size-24 flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[12px] text-[#B0A290]"
              >
                <svg
                  aria-hidden="true"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C5503A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Agregar
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>,
    document.body,
  );
}

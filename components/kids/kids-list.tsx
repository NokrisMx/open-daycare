"use client";

import { useEffect, useState } from "react";

import { KidCard, type KidSummary } from "@/components/kids/kid-card";

export type KidsListProps = {
  roomName: string;
  kids: readonly KidSummary[];
};

function normalizeText(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function KidsList({ roomName, kids }: KidsListProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (query.trim() === "") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const normalizedQuery = normalizeText(debouncedQuery);
  const visibleKids = normalizedQuery
    ? kids.filter((kid) => normalizeText(kid.name).includes(normalizedQuery))
    : kids;

  return (
    <section>
      <header className="mb-[22px] flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
            GESTIÓN
          </div>
          <h1 className="font-display text-[30px] font-semibold text-[#3F362E]">
            Niños
          </h1>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
        >
          <svg
            aria-hidden="true"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar niño
        </button>
      </header>

      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3">
        <svg
          aria-hidden="true"
          className="shrink-0"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B0A290"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          aria-label="Buscar niño"
          placeholder="Buscar niño…"
          value={query}
          onChange={(event) => {
            const nextQuery = event.currentTarget.value;

            setQuery(nextQuery);
            if (nextQuery.trim() === "") {
              setDebouncedQuery("");
            }
          }}
          className="min-w-0 flex-1 border-0 bg-transparent px-0.5 py-px text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B]"
        />
      </div>

      <div className="mb-3.5 flex items-center gap-3">
        <h2 className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#3F362E]">
          {roomName.toUpperCase()}
        </h2>
        <span
          aria-live="polite"
          aria-atomic="true"
          className="text-[13px] text-[#A89A8B]"
        >
          {visibleKids.length} {visibleKids.length === 1 ? "niño" : "niños"}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#E7DAC8]" />
      </div>

      {visibleKids.length === 0 ? (
        <div className="w-full rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-6 py-10 text-center shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)]">
          <p className="font-display text-base font-semibold text-[#3F362E]">
            No se encontraron niños.
          </p>
          <p className="mt-1 text-[13px] text-[#A89A8B]">
            Prueba con otro nombre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {visibleKids.map((kid) => (
            <KidCard key={kid.id} kid={kid} />
          ))}
        </div>
      )}
    </section>
  );
}

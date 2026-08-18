export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <aside className="sticky top-0 flex h-screen w-[248px] shrink-0 flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] px-4 py-6">
        <div className="flex items-center gap-[11px] px-2 pt-1 pb-[22px]">
          <div className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
            <svg
              aria-hidden="true"
              width="21"
              height="21"
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
          <div>
            <div className="font-display text-[17px] leading-none font-semibold text-[#3F362E]">
              OpenDayCare
            </div>
            <div className="mt-0.5 text-[11.5px] text-[#A89A8B]">
              Sala Soles
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]"
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
          Nueva publicación
        </button>

        <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-1">
          <button
            type="button"
            aria-current="page"
            className="flex items-center gap-3 rounded-xl bg-[#FBE3D8] px-3 py-[11px] text-left text-[14.5px] font-extrabold text-[#D9583C]"
          >
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
            </svg>
            Feed
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-[11px] text-left text-[14.5px] font-semibold text-[#6E6359]"
          >
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="7" r="3" />
              <circle cx="17" cy="9" r="2.4" />
              <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
            </svg>
            Niños
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-[11px] text-left text-[14.5px] font-semibold text-[#6E6359]"
          >
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            Avisos
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-[11px] text-left text-[14.5px] font-semibold text-[#6E6359]"
          >
            <svg
              aria-hidden="true"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mi cuenta
          </button>
        </nav>

        <div className="mt-2.5 border-t border-[#ECE0D0] pt-3.5">
          <div className="flex items-center gap-[11px] px-2 py-1.5">
            <div className="font-display flex size-[38px] shrink-0 items-center justify-center rounded-full bg-[#F2937A] text-base font-semibold text-white">
              C
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold text-[#3F362E]">
                Caro Giménez
              </div>
              <div className="text-xs text-[#A89A8B]">Maestra · Soles</div>
            </div>
            <button
              type="button"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
          <header className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C]">
              GUARDERÍA · SALA SOLES
            </div>
            <h1 className="font-display text-[30px] font-semibold text-[#3F362E]">
              Buenas, Caro
            </h1>
            <p className="mt-[5px] text-[14.5px] text-[#94887B]">
              12 niños · martes 17 jun
            </p>
          </header>

          <button
            type="button"
            className="mb-6 flex w-full items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-3.5 text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]"
          >
            <span className="font-display flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2937A] text-base font-semibold text-white">
              C
            </span>
            <span className="flex-1 text-[15px] text-[#A89A8B]">
              Compartí un momento…
            </span>
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-[#FBE3D8] text-[#E0654A]">
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
          </button>

          <div className="mb-3.5 flex items-center gap-3.5">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>
        </div>
      </main>
    </div>
  );
}

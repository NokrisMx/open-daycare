import { FeedHeader } from "@/components/feed/feed-header";
import { Sidebar } from "@/components/feed/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar
        roomName="Sala Soles"
        userName="Caro Giménez"
        userRole="Maestra · Soles"
        userInitial="C"
        activeItem="feed"
      />

      <main className="h-screen w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-4 pt-6 pb-12 md:px-10 md:pt-[34px] md:pb-20">
          <FeedHeader
            daycareName="GUARDERÍA"
            roomName="SALA SOLES"
            greeting="Buenas, Caro"
            summary="12 niños · martes 17 jun"
          />

          <button
            type="button"
            className="mb-6 flex w-full items-center gap-3.5 rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-3.5 py-3.5 text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)] md:px-[18px]"
          >
            <span className="font-display flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2937A] text-[16px] font-semibold text-white">
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

          <div className="flex flex-col gap-4">
            <article className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)] md:px-[22px]">
              <header className="mb-3.5 flex items-center gap-3">
                <div className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-[#A9D9E8] text-[17px] font-semibold text-[#1F7A93]">
                  M
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16.5px] font-semibold text-[#3F362E]">
                    Mateo
                  </div>
                  <div className="text-[12.5px] text-[#A89A8B]">
                    14:20 · publicado por vos
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[7px] rounded-full bg-[#CFEBD8] px-3 py-1.5">
                  <span className="size-2 rounded-full bg-[#3E9B6C]" />
                  <span className="text-xs font-extrabold tracking-[0.5px] text-[#3E9B6C]">
                    LOGRO
                  </span>
                </div>
              </header>

              <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">
                Para: familia de Mateo
              </div>
              <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">
                ¡Usó el orinal solito por primera vez! Estaba feliz de
                contárselo a todos. Un gran paso.
              </p>

              <footer className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
                <span className="flex items-center gap-[7px] text-[14px] font-bold text-[#E0654A]">
                  <svg
                    aria-hidden="true"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                  3
                </span>
                <button
                  type="button"
                  aria-label="1 comentario"
                  className="flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                  </svg>
                  1
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  className="text-[14px] font-extrabold text-[#C5503A]"
                >
                  Editar
                </button>
              </footer>
            </article>

            <article className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)] md:px-[22px]">
              <header className="mb-3.5 flex items-center gap-3">
                <div className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-[#A9D9E8] text-[17px] font-semibold text-[#1F7A93]">
                  M
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16.5px] font-semibold text-[#3F362E]">
                    Mateo
                  </div>
                  <div className="text-[12.5px] text-[#A89A8B]">
                    09:40 · publicado por vos
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[7px] rounded-full bg-[#C7E7F1] px-3 py-1.5">
                  <span className="size-2 rounded-full bg-[#2E89A6]" />
                  <span className="text-xs font-extrabold tracking-[0.5px] text-[#2E89A6]">
                    ACTIVIDAD
                  </span>
                </div>
              </header>

              <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">
                Para: familia de Mateo
              </div>
              <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">
                Pintamos con témperas esta mañana. Mateo eligió el azul para
                todo y se concentró un montón mezclando colores.
              </p>

              <button
                type="button"
                className="mt-3.5 flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
              >
                <svg
                  aria-hidden="true"
                  width="30"
                  height="30"
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
                <span className="text-[13.5px]">
                  Foto · pintando con témperas
                </span>
              </button>

              <footer className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
                <span className="flex items-center gap-[7px] text-[14px] font-bold text-[#E0654A]">
                  <svg
                    aria-hidden="true"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                  5
                </span>
                <button
                  type="button"
                  aria-label="2 comentarios"
                  className="flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                  </svg>
                  2
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  className="text-[14px] font-extrabold text-[#C5503A]"
                >
                  Editar
                </button>
              </footer>
            </article>

            <article className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)] md:px-[22px]">
              <header className="mb-3.5 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#CCD8F4] text-[#4E72C8]">
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16.5px] font-semibold text-[#3F362E]">
                    Anuncio general
                  </div>
                  <div className="text-[12.5px] text-[#A89A8B]">
                    07:50 · publicado por vos
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[7px] rounded-full bg-[#CCD8F4] px-3 py-1.5">
                  <span className="size-2 rounded-full bg-[#4E72C8]" />
                  <span className="text-xs font-extrabold tracking-[0.5px] text-[#4E72C8]">
                    ANUNCIO
                  </span>
                </div>
              </header>

              <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">
                Para: toda la sala
              </div>
              <p className="text-[15.5px] leading-[1.55] text-[#4A4038]">
                El viernes salimos al parque por la mañana. Recuerden mandar
                gorra y una botellita de agua.
              </p>

              <footer className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-3.5">
                <span className="flex items-center gap-[7px] text-[14px] font-bold text-[#E0654A]">
                  <svg
                    aria-hidden="true"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                  8
                </span>
                <button
                  type="button"
                  aria-label="0 comentarios"
                  className="flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                  </svg>
                  0
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  className="text-[14px] font-extrabold text-[#C5503A]"
                >
                  Editar
                </button>
              </footer>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}

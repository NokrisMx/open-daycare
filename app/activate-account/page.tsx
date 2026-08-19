import Link from "next/link";

import { AuthBrand } from "@/components/auth/auth-brand";
import { AuthField } from "@/components/auth/auth-field";

export default function ActivateAccountPage() {
  return (
    <main className="flex min-h-dvh min-w-0 items-start justify-center overflow-x-hidden bg-[#FBF4EC] pt-[calc(1.5rem+env(safe-area-inset-top))] pr-[calc(1.25rem+env(safe-area-inset-right))] pb-[calc(2rem+env(safe-area-inset-bottom))] pl-[calc(1.25rem+env(safe-area-inset-left))] md:min-h-screen md:items-center md:p-10">
      <div className="min-w-0 w-full max-w-[440px]">
        <div className="mb-[22px]">
          <AuthBrand variant="activation" />
        </div>

        <h1 className="mb-2 font-display text-[32px] leading-[1.15] font-semibold text-[#3F362E]">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] text-[15.5px] leading-[1.55] text-[#94887B]">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar
          la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-3.5 rounded-2xl border-[1.5px] border-[#EADFD0] bg-white px-4 py-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#A9D9E8] font-display text-[19px] font-semibold text-[#1F7A93]">
            M
          </div>
          <div>
            <p className="text-[13px] text-[#94887B]">
              Te invitaron a seguir a
            </p>
            <p className="font-display text-[17px] font-semibold text-[#3F362E]">
              Mateo · Sala Soles
            </p>
          </div>
        </div>

        <div className="mb-[18px]">
          <AuthField
            id="invitation-code"
            name="invitationCode"
            label="CÓDIGO DE INVITACIÓN"
            type="text"
            autoComplete="one-time-code"
            defaultValue="7K4P9"
            appearance="code"
          />
        </div>

        <div className="mb-[18px]">
          <AuthField
            id="activation-email"
            name="email"
            label="EMAIL"
            type="email"
            autoComplete="email"
            defaultValue="lucia.fernandez@gmail.com"
          />
        </div>

        <div className="mb-[18px]">
          <AuthField
            id="activation-password"
            name="password"
            label="CREAR CONTRASEÑA"
            type="password"
            autoComplete="new-password"
            defaultValue="contraseña"
            appearance="accent"
          />
        </div>

        <label
          htmlFor="photo-consent"
          className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-[#FBF1D6] px-4 py-3.5"
        >
          <input
            id="photo-consent"
            name="photoConsent"
            type="checkbox"
            defaultChecked
            className="peer sr-only"
          />
          <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-lg border-2 border-[#CDBE93] bg-white text-transparent peer-checked:border-[#5FB97E] peer-checked:bg-[#5FB97E] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8A7234]">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-sm leading-[1.45] text-[#8A7234]">
            Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de
            la app.
          </span>
        </label>

        <Link
          href="/"
          className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-base [line-height:normal] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
        >
          Activar mi cuenta
        </Link>

        <p className="mt-[22px] text-center text-[14.5px] text-[#94887B]">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="rounded-sm font-extrabold text-[#C5503A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

import { AuthBrand } from "@/components/auth/auth-brand";
import { AuthField } from "@/components/auth/auth-field";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-[1.05fr_1fr] bg-[#FBF4EC]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] px-[60px] py-14 text-white">
        <div className="absolute -top-[140px] -right-[120px] size-[420px] rounded-full bg-white/12" />
        <div className="absolute -bottom-[110px] -left-20 size-[300px] rounded-full bg-white/10" />

        <div className="relative">
          <AuthBrand variant="hero" />
        </div>

        <div className="relative">
          <h1 className="mb-[18px] font-display text-[42px] leading-[1.12] font-semibold">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="max-w-[430px] text-[17px] leading-[1.6] text-white/92">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <p className="relative text-sm text-white/90">
          🌿 Guardería Sala Soles
        </p>
      </section>

      <section className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="mb-1.5 font-display text-[30px] font-semibold text-[#3F362E]">
            Iniciar sesión
          </h2>
          <p className="mb-7 text-[15px] text-[#94887B]">
            Ingresá para ver el día de hoy.
          </p>

          <div className="mb-[18px]">
            <AuthField
              id="login-email"
              name="email"
              label="EMAIL"
              type="email"
              autoComplete="email"
              defaultValue="caro@opendaycare.com"
            />
          </div>

          <div className="mb-2.5">
            <AuthField
              id="login-password"
              name="password"
              label="CONTRASEÑA"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-5 text-right">
            <button
              type="button"
              className="cursor-pointer rounded-sm text-[13.5px] font-bold text-[#C5503A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Link
            href="/"
            className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
          >
            Iniciar sesión
          </Link>

          <p className="mt-6 text-center text-[14.5px] text-[#94887B]">
            ¿Te invitó la guardería?{" "}
            <Link
              href="/activate-account"
              className="rounded-sm font-extrabold text-[#C5503A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5503A]"
            >
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

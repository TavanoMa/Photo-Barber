"use client"

import LoginButton from "@/src/components/LoginButton"
import LogoutButton from "@/src/components/LogoutButton"
import ThemeSettingsButton from "@/src/components/ThemeSettingsButton"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useUser } from "../hooks/useUser"

type HeaderProps =
  | { mode: "marketing" }
  | {
      mode: "public"
      barbershop: {
        name: string
        logoUrl: string
      }
    }

export default function Header(props: HeaderProps) {
  const { data: session, status } = useSession()
  const isPublic = props.mode === "public"

  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    if (!session) return

    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits))
  }, [session])

  const user = useUser()

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur border-b border-white/5 bg-[#07070c]/80">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-32">

        {/* LOGO */}
        <div className="flex items-center gap-3 font-semibold text-lg">

          {isPublic ? (
  <>
   <>
 <>
  <div className="h-32 flex items-center">
    <Image
      src={props.barbershop.logoUrl}
      alt={props.barbershop.name}
      width={650}
      height={200}
      className="h-28 w-auto max-w-[650px] object-contain mr-5"
    />
  </div>
</>

  <span>{props.barbershop.name}</span>
</>

    
  </>
) : (
  <div className="flex items-center"> 
  <Image src="/photobarber-logo-transparente.png" alt="PhotoBarber" width={650} height={200} priority className="h-32 md:h-36 w-auto object-contain" /> 
  </div>
)}
        </div>

        {/* MENU MARKETING */}
        {!isPublic && (
          <nav className="hidden md:flex gap-10 text-sm text-white/70">
            <a href="#how" className="hover:text-white transition">
              Como funciona
            </a>

            <a href="#contact" className="hover:text-white transition">
              Contato
            </a>

            {/* FUTURO PLANO PAGO */}
            {/*
            <a href="#features" className="hover:text-white transition">
              Recursos
            </a>
            */}
          </nav>
        )}

        <div className="flex items-center gap-4">

          {/* CUSTOMIZAÇÃO DA LANDING DO BARBEIRO */}
          {isPublic && <ThemeSettingsButton />}

          {/* FUTURO PLANO PAGO - EXIBIÇÃO DE CRÉDITOS */}
          {/*
          {isPublic && session && credits !== null && (
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              ✨ {user.credits} créditos
            </div>
          )}
          */}

          {status !== "loading" && (
            <>
              {!!session ? (
                <LogoutButton className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition cursor-pointer">
                  Sair
                </LogoutButton>
              ) : (
                <LoginButton className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition cursor-pointer">
                  Entrar
                </LoginButton>
              )}
            </>
          )}

          {/* FUTURO PLANO PAGO */}
          {/*
          {!isPublic && (
            <a
              href="#pricing"
              className="gradient-primary px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
            >
              Ver planos
            </a>
          )}
          */}
        </div>
      </div>
    </header>
  )
}
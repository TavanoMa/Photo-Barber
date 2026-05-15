"use client"

import LoginButton from "@/src/components/LoginButton"
import LogoutButton from "@/src/components/LogoutButton"
import ThemeSettingsButton from "@/src/components/ThemeSettingsButton"
import { useSession } from "next-auth/react"
import Image from "next/image"

type HeaderProps =
  | { mode: "marketing" }
  | { 
      mode: "public";
      barbershop: { 
        name: string; 
        logoUrl: string 
      } 
    }

export default function Header(props: HeaderProps) {
  const { data: session, status } = useSession()
  const isPublic = props.mode === "public"

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur border-b border-white/5 bg-[#07070c]/80">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3 font-semibold text-lg">
          {isPublic ? (
            <>
              <Image
                src={props.barbershop.logoUrl}
                alt={props.barbershop.name}
                width={34}
                height={34}
                className="rounded-lg object-cover"
              />
              <span>{props.barbershop.name}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                📷
              </div>
              Photo<span className="text-primary">Barber</span>
            </>
          )}
        </div>

        {!isPublic && (
          <nav className="hidden md:flex gap-10 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Recursos</a>
            <a href="#how" className="hover:text-white transition">Como funciona</a>
          </nav>
        )}

        <div className="flex items-center gap-4">
          
          {/* 🔥 BOTÃO CONFIGURAÇÃO (apenas no modo public) */}
          {isPublic && <ThemeSettingsButton />}

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

          {!isPublic && (
            <a
              href="#pricing"
              className="gradient-primary px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
            >
              Ver planos
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
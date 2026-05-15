"use client"
import { useEffect, useState, useTransition, useRef } from "react"
import ThemeProvider from "./ThemeProvider"
import { saveTheme } from "@/src/actions/saveTheme"

const presets = [
  { name: "Roxo", primary: "#8B5CF6", secondary: "#EC4899" },
  { name: "Azul", primary: "#3B82F6", secondary: "#06B6D4" },
  { name: "Verde", primary: "#22C55E", secondary: "#14B8A6" },
  { name: "Laranja", primary: "#F97316", secondary: "#EF4444" },
  { name: "Preto Luxo", primary: "#A6A6A6", secondary: "#2A2A2A" },
]

interface ThemePickerProps {
  initialPrimary: string
  initialSecondary: string
}

export default function ThemePicker({ initialPrimary, initialSecondary }: ThemePickerProps) {
  // 1. Iniciamos o estado diretamente com o que veio do banco de dados (via Props)
  const [primary, setPrimary] = useState(initialPrimary)
  const [secondary, setSecondary] = useState(initialSecondary)
  const [isPending, startTransition] = useTransition()
  
  // Ref para evitar o salvamento na primeira renderização
  const isFirstRender = useRef(true)

  useEffect(() => {
    // 2. Bloqueia o salvamento automático no carregamento da página
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // 3. Debounce: Espera 500ms sem alterações para enviar ao banco
    // Isso evita 50 chamadas por segundo enquanto você arrasta o mouse no color picker
    const timer = setTimeout(() => {
      startTransition(async () => {
        await saveTheme(primary, secondary)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [primary, secondary])

  return (
    <>
      {/* O Provider aqui garante que a UI mude em tempo real enquanto você escolhe */}
      <ThemeProvider primary={primary} secondary={secondary} />

      <div className="w-fit rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-2 rounded-full bg-primary ${isPending ? 'animate-ping' : 'animate-pulse'}`}></div>
          <p className="text-sm font-semibold text-white">
            Cores da barbearia {isPending && <span className="opacity-50 ml-1">• salvando</span>}
          </p>
        </div>

        <div className="flex gap-3 mb-4">
          {presets.map((p) => (
            <button
              key={p.name}
              title={p.name}
              onClick={() => {
                setPrimary(p.primary)
                setSecondary(p.secondary)
              }}
              className="relative group outline-none cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full border border-white/20 shadow-lg group-hover:scale-110 group-active:scale-95 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/20"
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="color"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/20"
            />
          </div>
        </div>
      </div>
    </>
  )
}
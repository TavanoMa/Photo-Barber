"use client"
import { useState, useEffect } from "react"
import ThemePicker from "./ThemePicker"
import { getTheme } from "@/src/actions/getTheme"

export default function ThemeSettingsButton() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<{ theme_primary: string; theme_secondary: string } | null>(null)

  // 1. Carregamos o tema quando o componente for montado (no cliente)
  useEffect(() => {
    async function loadInitialTheme() {
      const data = await getTheme()
      if (data) setTheme(data)
    }
    loadInitialTheme()
  }, [])

  return (
    <div className="relative">
      {/* BOTÃO ENGRENAGEM */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur flex items-center justify-center transition"
      >
        ⚙️
      </button>

      {/* POPOVER */}
      {open && (
        <div className="absolute right-0 top-14 animate-in fade-in zoom-in duration-200 z-50">
          <ThemePicker
            // 2. Passamos os valores buscados ou os padrões enquanto carrega
            initialPrimary={theme?.theme_primary || "#8B5CF6"} 
            initialSecondary={theme?.theme_secondary || "#EC4899"}
          />
        </div>
      )}
    </div>
  )
}
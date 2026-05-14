"use client"
import { useEffect } from "react"

interface Props {
  primary: string
  secondary: string
}

function hexToRgb(hex: string) {
  hex = hex.replace("#", "")
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r} ${g} ${b}`
}

export default function ThemeProvider({ primary, secondary }: Props) {
  useEffect(() => {
    // Esse código só vai rodar quando o usuário MUDAR a cor no Picker.
    // O carregamento inicial agora é feito pelo <style> no layout.tsx
    const root = document.documentElement
    root.style.setProperty("--primary", hexToRgb(primary))
    root.style.setProperty("--secondary", hexToRgb(secondary))
  }, [primary, secondary])

  return null
}
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import ThemeProvider from "@/src/components/ThemeProvider"
import { getTheme } from "@/src/actions/getTheme"

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r} ${g} ${b}`
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const theme = await getTheme()

  // 1. Define os valores Hex (padrão ou do banco)
  const primary = theme?.theme_primary || "#8B5CF6"
  const secondary = theme?.theme_secondary || "#EC4899"

  // 2. CONVERSÃO: Aqui é onde criamos as variáveis que estavam faltando
  const primaryRGB = hexToRgb(primary)
  const secondaryRGB = hexToRgb(secondary)

  return (
    <div className="min-h-screen flex">
      {/* Injeção direta no Servidor para evitar o "flash" de 0.5s */}
      <style>{`
          :root {
            --primary: ${primaryRGB};
            --secondary: ${secondaryRGB};
          }
        `}</style>
        
      <ThemeProvider primary={primary} secondary={secondary} />
      
      <main className="flex-1">{children}</main>
    </div>
  );
}
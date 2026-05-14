"use server"

import { supabaseAdmin } from "@/src/lib/supabase"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"

// 🔥 IMPORTANTE: Importe o seu objeto de configuração do NextAuth aqui.
// O caminho abaixo é um exemplo, ajuste para onde seu authOptions está exportado:
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function saveTheme(primary: string, secondary: string) {
  try {
    // 1. Passa o authOptions para o servidor conseguir ler os cookies de sessão
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.warn("Tentativa de salvar tema sem usuário autenticado.")
      return { success: false, error: "Não autorizado" }
    }

    // 2. Captura a variável 'error' retornada pelo Supabase
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        theme_primary: primary,
        theme_secondary: secondary,
      })
      .eq("email", session.user.email)

    // 3. Verifica se o Supabase reportou alguma falha
    if (error) {
      console.error("Erro do Supabase ao salvar tema:", error.message)
      return { success: false, error: error.message }
    }

    // Deu tudo certo
    return { success: true }

  } catch (err) {
    // 4. Captura qualquer outro erro inesperado (ex: banco fora do ar, erro de rede)
    console.error("Erro inesperado na server action saveTheme:", err)
    return { success: false, error: "Erro interno do servidor" }
  }
}
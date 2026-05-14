"use server"

import { supabaseAdmin } from "@/src/lib/supabase"
import { getServerSession } from "next-auth"
// Importe o authOptions de onde você o definiu (exemplo abaixo):
// import { authOptions } from "@/app/api/auth/[...nextauth]/route" 

export async function getTheme() {
  // Adicione o authOptions aqui dentro dos parênteses
  const session = await getServerSession(/* authOptions */) 

  if (!session?.user?.email) return null

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("theme_primary, theme_secondary")
    .eq("email", session.user.email)
    .single()

  if (error) {
    console.error("Erro ao buscar tema:", error.message)
    return null
  }

  return data
}
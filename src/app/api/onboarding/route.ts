import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"
import { generateSlug } from "@/src/lib/slug"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  // Garantimos que o e-mail existe, evitando o erro de 'any' ou 'undefined'
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userEmail = session.user.email
  const formData = await req.formData()

  const barbershopName = formData.get("barbershopName") as string
  const phone = formData.get("phone") as string
  const city = formData.get("city") as string
  const logoFile = formData.get("logo") as File | null

  // 1. Processamento da Imagem (Apenas Bucket)
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop()
    // Nome do arquivo baseado no email para facilitar a busca manual depois
    const fileName = `${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`
    
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from("logos") // Nome do bucket solicitado
      .upload(fileName, logoFile, {
        upsert: true // Se o usuário enviar de novo, substitui a antiga
      })

    if (uploadError) {
      console.error("Erro no upload:", uploadError.message)
      // Opcional: decidir se trava o processo ou continua sem a logo
    }
  }

  // 2. Lógica do Slug
  let slug = generateSlug(barbershopName)

  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("slug")
    .like("slug", `${slug}%`)

  if (existing && existing.length > 0) {
    slug = `${slug}-${existing.length + 1}`
  }

  // 3. Atualização da Tabela Users (Sem a coluna de imagem)
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .update({
      barbershop_name: barbershopName,
      phone,
      city,
      slug,
    })
    .eq("email", userEmail)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
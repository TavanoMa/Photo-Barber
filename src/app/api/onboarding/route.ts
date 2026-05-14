import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"
import { generateSlug } from "@/src/lib/slug"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()

  const barbershopName = formData.get("barbershopName") as string
  const phone = formData.get("phone") as string
  const city = formData.get("city") as string

  // gerar slug base
  let slug = generateSlug(barbershopName)

  // verificar se já existe
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("slug")
    .like("slug", `${slug}%`)

  if (existing && existing.length > 0) {
    slug = `${slug}-${existing.length + 1}`
  }

  // salvar no banco
  await supabaseAdmin
    .from("users")
    .update({
      barbershop_name: barbershopName,
      phone,
      city,
      slug,
    })
    .eq("email", session.user.email)

  return NextResponse.json({ success: true })
}
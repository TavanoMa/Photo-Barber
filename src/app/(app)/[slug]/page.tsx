import { supabaseAdmin } from "@/src/lib/supabase"
import HeaderLanding from "@/src/components/HeaderLanding"
import GeneratePage from "./GeneratePage"

interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params // Em versões recentes do Next, params deve ser awaitado

  const { data: barbershop, error } = await supabaseAdmin
    .from("users")
    .select("name, email")
    .eq("slug", slug)
    .single()

  if (!barbershop || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Barbearia não encontrada
      </div>
    )
  }

  const logoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/logos/${barbershop.email}.png`

  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      <HeaderLanding
        mode="public" // Agora o tipo bate com o Header
        barbershop={{
          name: barbershop.name,
          logoUrl: logoUrl, // Passando a URL já montada
        }}
      />

      <GeneratePage logoUrl={logoUrl}/>
    </div>
  )
}
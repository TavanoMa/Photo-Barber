import { supabaseAdmin } from "@/src/lib/supabase"
import HeaderLanding from "@/src/components/HeaderLanding"
import GeneratePage from "./GeneratePage"
import { notFound } from "next/navigation"

interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  // 1. Await params (Boa prática no Next.js 14/15)
  const { slug } = await params

  // 2. Busca os dados da barbearia
  const { data: barbershop, error } = await supabaseAdmin
    .from("users")
    .select("barbershop_name, email") // Use o nome correto da coluna: barbershop_name
    .eq("slug", slug)
    .single()

  // 3. Se não existir, dispara o 404 nativo do Next
  if (error || !barbershop) {
    return notFound()
  }

  // 4. Formata o e-mail para bater com o nome do arquivo salvo no bucket
  // Deve ser EXATAMENTE a mesma lógica usada no seu route.ts
  const safeEmail = barbershop.email.replace(/[^a-zA-Z0-9]/g, '_')
  
  // 5. Monta a URL pública (ajuste a extensão se necessário, ex: .png ou .jpg)
  // Certifique-se que o bucket "logos" está público no Supabase
  const supabaseUrl = process.env.SUPABASE_URL
  const logoUrl = `${supabaseUrl}/storage/v1/object/public/logos/${safeEmail}.png`

  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      <HeaderLanding
        mode="public"
        barbershop={{
          name: barbershop.barbershop_name || "Barbearia", 
          logoUrl: logoUrl,
        }}
      />

      <main className="pt-20">
         <GeneratePage logoUrl={logoUrl} />
      </main>
    </div>
  )
}
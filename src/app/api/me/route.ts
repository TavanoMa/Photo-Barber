import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    )
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select(`
      credits,
      plan,
      has_active_subscription,
      last_payment_at
    `)
    .eq("email", session.user.email)
    .single()

  return NextResponse.json(user)
}
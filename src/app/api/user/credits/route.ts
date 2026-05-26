import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ credits: null })
  }

  const { data } = await supabaseAdmin
    .from("users")
    .select("credits")
    .eq("email", session.user.email)
    .single()

  return NextResponse.json({
    credits: data?.credits ?? 0,
  })
}
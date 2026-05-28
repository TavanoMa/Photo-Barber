import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"
import { plans, PlanName } from "@/src/lib/plans"
import crypto from "crypto"

// Força o Next.js a não cachear as respostas desta rota em produção
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Faça login primeiro" },
        { status: 401 }
      )
    }

    const { plan } = await req.json()

    console.log("PLAN RECEBIDO:", plan)

    if (!plan || !(plan in plans)) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      )
    }

    const selectedPlan = plans[plan as PlanName]

    console.log("SELECTED PLAN:", selectedPlan)
    console.log("PRODUCT ID:", selectedPlan.productId)

    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email, name")
      .eq("email", session.user.email)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Gera um ID único para esta transação específica, evitando a trava de segurança/cache do gateway
    const purchaseId = crypto.randomUUID()

    const payload = {
  items: [
    {
      id: selectedPlan.productId,
      quantity: 1,
    },
  ],
  externalId: purchaseId,
  completionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
  
  // ADICIONE ESTE BLOCO DO CUSTOMER AQUI:
 

  metadata: {
    userId: user.id,
    plan,
    credits: selectedPlan.credits,
    quantity: 1
  },
  methods: ["CARD"],
}

    console.log("PAYLOAD ENVIADO:")
    console.log(JSON.stringify(payload, null, 2))

    const response = await fetch(
      "https://api.abacatepay.com/v2/subscriptions/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()

    console.log("ABACATE RESPONSE:")
    console.dir(data, { depth: null })

    if (!data.success) {
      return NextResponse.json(
        {
          error: data.error,
          details: data,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      checkoutUrl: data.data.url,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    )
  }
}
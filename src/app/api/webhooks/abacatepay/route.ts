import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  console.log("=================================")
  console.log("WEBHOOK ABACATE")
  console.log("=================================")

  console.dir(body, { depth: null })

  return NextResponse.json({
    success: true,
  })
}
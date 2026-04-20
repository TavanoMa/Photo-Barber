import { NextResponse } from "next/server"

export const runtime = "nodejs"

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

interface OpenRouterImageUrl {
  url: string
}

interface OpenRouterRequestContent {
  type: string
  text?: string
  image_url?: OpenRouterImageUrl
}

interface OpenRouterRequestBody {
  model: string
  messages: { role: string; content: OpenRouterRequestContent[] }[]
  modalities: string[]
}

interface OpenRouterResponse {
  choices: {
    message: { images?: { image_url?: { url: string } }[] }
  }[]
}

async function fileToDataUri(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString("base64")
  const mime = file.type || "image/png"
  return `data:${mime};base64,${base64}`
}

async function generateHaircut(
  prompt: string,
  imageDataUri: string,
  apiKey: string
) {
  const body: OpenRouterRequestBody = {
    model: "google/gemini-3-pro-image-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageDataUri } },
        ],
      },
    ],
    modalities: ["image", "text"],
  }

  const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const data = (await res.json()) as OpenRouterResponse
  return data.choices?.[0]?.message?.images?.[0]?.image_url?.url
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const haircut = formData.get("haircut") as string
    const file = formData.get("image") as File

    if (!file || !haircut) {
      return NextResponse.json(
        { error: "Imagem ou corte não enviados" },
        { status: 400 }
      )
    }

    const apiKey =
      process.env.NANOBANANA_API_KEY || process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API KEY não configurada" },
        { status: 500 }
      )
    }

    const imageDataUri = await fileToDataUri(file)

    const prompt = `
Fotografia hiper-realista de rosto masculino.

IMPORTANTE:
- preservar 100% identidade da pessoa
- NÃO alterar rosto
- NÃO mudar idade ou etnia
- NÃO mudar expressão facial
- NÃO mudar a cor do cabelo do cliente

Tarefa:
Aplicar um corte de cabelo REALISTA: ${haircut}

Regras:
- cabelo deve parecer natural
- iluminação realista
- qualidade profissional
- fotografia de estúdio
`

    const imageUrl = await generateHaircut(prompt, imageDataUri, apiKey)

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Falha ao gerar imagem" },
        { status: 500 }
      )
    }

    return NextResponse.json({ image: imageUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
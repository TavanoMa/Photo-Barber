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
You are a professional photo retoucher specialized in realistic hair editing.
Your task is to edit the uploaded photo by applying a new haircut while keeping the person exactly the same.
IDENTITY RULES (very important):


Keep the same person and same face.


Do not change facial features.


Do not change skin tone or ethnicity.


Do not change age or gender.


Do not change facial expression.


Do not change face shape.


Do not beautify or stylize the face.


Do not change hair color.


Preserve identity 100%.


Only the hair and background can be modified.
TASK
Apply this haircut in a realistic way: ${haircut}
HAIR EDITING GUIDELINES:


The haircut must look natural and believable.


Respect the original hairline and hair direction.


Adapt the haircut to the current hair length.


If the hair is longer, realistically shorten it.


If the hair is very short, shape it naturally.


Avoid wigs or artificial textures.


Blend the haircut naturally with the scalp.


BACKGROUND CHANGE:


Replace the background with a neutral light gray studio background.


Keep realistic studio lighting.


Do not blur the person excessively.


Keep natural shadows around the head and shoulders.


SUBTLE PHOTO ENHANCEMENT:


Slightly improve sharpness and clarity.


Slightly improve lighting and contrast.


Keep skin texture natural (no plastic skin).


Keep the result realistic and natural.


The final image must look like the same person after a real haircut in a professional studio photo.
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
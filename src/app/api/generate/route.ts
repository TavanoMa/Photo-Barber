import { NextResponse } from "next/server"

export const runtime = "nodejs"
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

/* -------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------- */

interface ORImageUrl {
  url: string
}

interface ORContent {
  type: "text" | "image_url"
  text?: string
  image_url?: ORImageUrl
}

interface ORBody {
  model: string
  messages: { role: "user"; content: ORContent[] }[]
  modalities: ["image", "text"]
}

interface ORResponse {
  choices: {
    message: {
      images?: { image_url?: { url: string } }[]
    }
  }[]
}

/* -------------------------------------------------- */
/* UTILS */
/* -------------------------------------------------- */

async function fileToDataUri(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString("base64")
  return `data:${file.type || "image/jpeg"};base64,${base64}`
}

async function callOpenRouter(
  prompt: string,
  frontUri: string,
  sideUri: string,
  apiKey: string
) {
  const body: ORBody = {
    model: "google/gemini-3-pro-image-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: frontUri } }, // foto frente
          { type: "image_url", image_url: { url: sideUri } },  // foto lado
        ],
      },
    ],
    modalities: ["image", "text"],
  }

  const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = (await res.json()) as ORResponse
  return data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null
}

/* -------------------------------------------------- */
/* PROMPTS */
/* -------------------------------------------------- */

// 🔒 REGRAS GLOBAIS (NUNCA MUDA)
const BASE_PROMPT = `
You are a PROFESSIONAL BARBER PHOTO RETOUCHER.

This is NOT image generation.
This is a SURGICAL photo edit using TWO real photos of the SAME PERSON.

IMAGE #1 = FRONT VIEW  
IMAGE #2 = SIDE VIEW (used to understand fade, taper and head shape)

━━━━━━━━━━━━━━━━━━━
PRIMARY GOAL
━━━━━━━━━━━━━━━━━━━

Create ONE FINAL PHOTO of the SAME PERSON with the requested haircut.

The result must look like a REAL PHOTO taken right after a real haircut.
No AI look. No stylization.

The head should be slightly turned (10–20 degrees) so the fade is visible.

━━━━━━━━━━━━━━━━━━━
IDENTITY LOCK (ABSOLUTE)
━━━━━━━━━━━━━━━━━━━

The person MUST remain identical.

DO NOT change:
face, eyes, eyebrows, nose, mouth, ears  
skin tone, ethnicity, age, gender  
expression, face shape, head shape

NO beautification.
NO smoothing.
NO makeup.
NO "AI face".

━━━━━━━━━━━━━━━━━━━
SCENE LOCK (CRITICAL)
━━━━━━━━━━━━━━━━━━━

Keep the ORIGINAL BACKGROUND from the FRONT photo.

Do NOT change:
background, lighting, shadows, camera angle,
lens, framing, depth of field.

It must look like the SAME photo moment.

━━━━━━━━━━━━━━━━━━━
HAIR EDIT RULES
━━━━━━━━━━━━━━━━━━━

You may change ONLY the hair.

Allowed:
• hair length
• volume
• texture
• direction
• density
• fade / taper / neckline

Preserve:
• natural hairline
• realistic growth patterns
• believable barber blending

NO wigs  
NO painted hair  
NO fake strands  
NO over sharpening  
NO beauty filters
`

// 🎯 PROMPT DINÂMICO (RECEBE O CORTE)
function buildHaircutPrompt(haircut: string) {
  return `
━━━━━━━━━━━━━━━━━━━
REQUESTED HAIRCUT
━━━━━━━━━━━━━━━━━━━

Simulate EXACTLY this haircut:

${haircut}

This haircut OVERRIDES the current hairstyle.

The fade and side blending MUST be clearly visible thanks to the slight head turn.

Return ONLY the edited image.
`
}

/* -------------------------------------------------- */
/* ROUTE */
/* -------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey)
      return NextResponse.json({ error: "API KEY não configurada" }, { status: 500 })

    const formData = await req.formData()

    const promptsString = formData.get("haircut") as string
    const frontFile = formData.get("frontImage") as File
    const sideFile = formData.get("sideImage") as File

    if (!promptsString || !frontFile || !sideFile) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const [frontUri, sideUri] = await Promise.all([
      fileToDataUri(frontFile),
      fileToDataUri(sideFile),
    ])

    const prompts = promptsString.split("|")

    // gera múltiplos cortes
    const images = await Promise.all(
      prompts.map(async (haircut) => {
        const finalPrompt = BASE_PROMPT + buildHaircutPrompt(haircut)
        return callOpenRouter(finalPrompt, frontUri, sideUri, apiKey)
      })
    )

    const validImages = images.filter(Boolean)

    if (!validImages.length) {
      return NextResponse.json({ error: "Falha ao gerar imagens" }, { status: 500 })
    }

    return NextResponse.json({ images: validImages })
  } catch (err) {
    console.error("GENERATE ERROR:", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
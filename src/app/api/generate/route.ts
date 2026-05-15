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

The head MUST be turned EXACTLY 20 degrees to the right — not 10, not 15, always exactly 20 degrees.
This is fixed and non-negotiable.

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
BACKGROUND LOCK (ABSOLUTE)
━━━━━━━━━━━━━━━━━━━

The background MUST be 100% identical to IMAGE #1.

DO NOT change, replace, blur, or alter:
- background colors, walls, objects
- lighting direction and shadows on the background
- depth of field
- camera framing and zoom level

The final photo must look like it was taken in the EXACT SAME PLACE and MOMENT as IMAGE #1.
If anything in the background changes, the edit has FAILED.

━━━━━━━━━━━━━━━━━━━
SCENE LOCK
━━━━━━━━━━━━━━━━━━━

Keep EVERYTHING from IMAGE #1 except the hair:
- background (absolute)
- lighting on the person
- camera angle and lens
- clothing

━━━━━━━━━━━━━━━━━━━
HAIR EDIT RULES
━━━━━━━━━━━━━━━━━━━

You may change ONLY the hair.

Allowed:
- hair length
- volume
- texture
- direction
- density
- fade / taper / neckline

Preserve:
- natural hairline
- realistic growth patterns
- believable barber blending

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

Simulate EXACTLY this haircut on the person:

${haircut}

CRITICAL RULES FOR THIS EDIT:
- This haircut COMPLETELY REPLACES the current hairstyle
- If the style includes a fade or taper: the gradient transition MUST be clearly and realistically visible
- If the style includes a beard or mustache: ADD the facial hair even if the person has none — this is the primary goal
- The head should be turned slightly (20°) so the fade/sides are visible
- Hair length and texture on top must match the description exactly — do NOT over-shave

Return ONLY the final edited photo.
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
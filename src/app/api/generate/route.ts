import { NextResponse } from "next/server"
import sharp from "sharp"
import { getServerSession } from "next-auth"
import { authOptions } from "@/src/lib/auth"
import { supabaseAdmin } from "@/src/lib/supabase"

export const runtime = "nodejs"

// Aumenta o tempo máximo da rota (Vercel Pro: até 300s, Hobby: 60s)
export const maxDuration = 120

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

/* -------------------------------------------------- */
/* TYPES                                              */
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
  id?: string
  error?: { message: string; code?: number }
  choices?: {
    message: {
      content?: string
      images?: { image_url?: { url: string } }[]
    }
  }[]
}

/* -------------------------------------------------- */
/* IMAGE UTILS                                        */
/* -------------------------------------------------- */

const MAX_DIMENSION = 1920 // Aumentado para Full HD (ideal para texturas de cabelo)
const JPEG_QUALITY  = 95   // Aumentado para evitar artefatos (reduz aspecto borrado)

/**
 * Redimensiona e comprime a imagem usando sharp.
 * Funciona como segunda barreira caso o cliente envie imagem grande.
 */
async function compressImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const compressed = await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",        // mantém proporção, nunca amplia
      withoutEnlargement: true,
    })
    .sharpen({ sigma: 1.0, m1: 2.0, x1: 2.0 }) // Força nitidez nos fios antes de enviar pra IA
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer()

  const base64 = compressed.toString("base64")

  const sizeMB = (base64.length * 0.75 / 1024 / 1024).toFixed(2)
  console.log(`[compress] ${file.name} → ${sizeMB} MB após compressão`)

  return `data:image/jpeg;base64,${base64}`
}

/* -------------------------------------------------- */
/* OPENROUTER CALL                                    */
/* -------------------------------------------------- */

async function callOpenRouter(
  prompt: string,
  frontUri: string,
  sideUri: string,
  apiKey: string
): Promise<string | null> {
  const body: ORBody = {
    model: "google/gemini-3-pro-image-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text",      text: prompt },
          { type: "image_url", image_url: { url: frontUri } },
          { type: "image_url", image_url: { url: sideUri  } },
        ],
      },
    ],
    modalities: ["image", "text"],
  }

  // Timeout explícito de 90s para não travar silenciosamente
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 90_000)

  let res: Response
  try {
    res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Haircut Simulator",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  // ─── Log de status HTTP ───────────────────────────
  console.log(`[openrouter] status: ${res.status}`)

  const data = (await res.json()) as ORResponse

  // ─── Log do erro da API (se houver) ──────────────
  if (data.error) {
    console.error("[openrouter] erro da API:", JSON.stringify(data.error))
    return null
  }

  // ─── Log do choices completo ──────────────────────
  if (!data.choices?.length) {
    console.error("[openrouter] resposta sem choices:", JSON.stringify(data))
    return null
  }

  const message = data.choices[0].message
  console.log("[openrouter] message keys:", Object.keys(message))

  const imageUrl = message.images?.[0]?.image_url?.url ?? null

  if (!imageUrl) {
    console.error(
      "[openrouter] sem imagem no retorno. content:",
      message.content?.slice(0, 200) // primeiros 200 chars do texto, se vier
    )
  }

  return imageUrl
}

/* -------------------------------------------------- */
/* PROMPTS (HIGH-FIDELITY REFACTORED)                 */
/* -------------------------------------------------- */

const BASE_PROMPT = `
You are an ELITE COMMERCIAL PHOTOGRAPHY RETOUCHER and Master Barber Editor.

This is a SURGICAL, ULTRA-HIGH-RESOLUTION photo edit using TWO real photos of the SAME PERSON.
Your output must match the quality of a high-end fashion magazine or commercial hair product advertisement.

IMAGE #1 = FRONT VIEW (Primary composition reference)
IMAGE #2 = SIDE VIEW (Used strictly for head shape, fade gradient, and neckline reference)

━━━━━━━━━━━━━━━━━━━
PRIMARY QUALITY & RENDER RULES
━━━━━━━━━━━━━━━━━━━
- CAMERA SPECIFICATION: Render the output as if captured with a professional full-frame mirrorless camera, 85mm prime lens, f/4 aperture for maximum sharpness and tack-sharp focus on the hair.
- MICRO-TEXTURES: Every single individual strand of hair, stubble fiber, and hair follicle must be crystal clear, crisp, and sharply defined. 
- NO SMOOTHING: Absolute ban on plastic skin textures, AI smudging, or painting effects. Retain natural skin pores and hair density.
- LIGHTING: Premium barber studio lighting. Rich contrast, clean specular highlights on the hair contours, and natural, realistic shadows.
- HEAD ANGLE: The head MUST be turned EXACTLY 20 degrees to the right in the final output to display both the facial features and the side haircut profile beautifully.

━━━━━━━━━━━━━━━━━━━
IDENTITY LOCK (ABSOLUTE)
━━━━━━━━━━━━━━━━━━━
The person's face MUST remain 100% identical to IMAGE #1.
- DO NOT alter or touch: eyes, eyebrows, nose, mouth, ears, skin tone, ethnicity, age, bone structure, expression, or facial shape.
- No facial distortion, no AI-beautification, no artificial makeup.

━━━━━━━━━━━━━━━━━━━
BACKGROUND & SCENE LOCK (ABSOLUTE)
━━━━━━━━━━━━━━━━━━━
The background MUST be a 100% pixel-perfect match to IMAGE #1.
- DO NOT replace, blur, re-render, or shift any background objects, colors, walls, or depth of field.
- Keep the exact same camera framing, zoom level, clothing, and environment from IMAGE #1.

━━━━━━━━━━━━━━━━━━━
HAIR EDIT EXECUTION
━━━━━━━━━━━━━━━━━━━
Modify ONLY the hair and facial hair space. 
- Seamlessly blend the new hairstyle into the person's natural hairline and head shape.
- The transition between the edited hair and the untouched skin must look completely organic, with realistic baby hairs and natural follicle growth patterns.
`

function buildHaircutPrompt(haircut: string) {
  return `
━━━━━━━━━━━━━━━━━━━
REQUESTED HAIRCUT DESIGN
━━━━━━━━━━━━━━━━━━━
Execute the following style with absolute precision, maximum sharpness, and cinematic fidelity:

${haircut}

CRITICAL EXECUTION DIRECTIVES:
1. This style COMPLETELY REPLACES the original hair.
2. If the style includes a fade, taper, or shave: the gradient must transition flawlessly with high-definition texture from bare skin to hair.
3. If the style includes a beard/mustache: render realistic, individual facial hair strands growing naturally from the jaw/lip skin, even if the original person is clean-shaven.
4. Maintain extreme clarity on the edges (sharp line-up) but keep the hair fibers looking soft, organic, and realistic.

Return exclusively the final high-resolution edited photograph.
`
}

/* -------------------------------------------------- */
/* ROUTE                                              */
/* -------------------------------------------------- */

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error("[route] OPENROUTER_API_KEY não configurada")
      return NextResponse.json({ error: "API KEY não configurada" }, { status: 500 })
    }

    // ─── 1. Autenticação ────────────────────────────────
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Faça login para gerar imagens." },
        { status: 401 }
      )
    }

    // ─── 2. Busca do Usuário e Créditos ────────────────
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, credits")
      .eq("email", session.user.email)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      )
    }

    // ─── 3. Validação dos Dados do Formulário ──────────
    const formData = await req.formData()

    const promptsString = formData.get("haircut")  as string | null
    const frontFile     = formData.get("frontImage") as File | null
    const sideFile      = formData.get("sideImage")  as File | null

    if (!promptsString || !frontFile || !sideFile) {
      const missing = [
        !promptsString && "haircut",
        !frontFile     && "frontImage",
        !sideFile      && "sideImage",
      ].filter(Boolean)

      console.error("[route] campos faltando:", missing)
      return NextResponse.json(
        { error: `Campos obrigatórios ausentes: ${missing.join(", ")}` },
        { status: 400 }
      )
    }

    console.log(`[route] frontImage: ${frontFile.name} (${(frontFile.size / 1024).toFixed(0)} KB)`)
    console.log(`[route] sideImage:  ${sideFile.name}  (${(sideFile.size / 1024).toFixed(0)} KB)`)
    
    const prompts = promptsString.split("|").filter(Boolean)
    console.log(`[route] prompts: ${prompts.length} corte(s)`)

    // ─── 4. Verificação de Créditos ────────────────────
    const creditsNeeded = prompts.length

    if (user.credits < creditsNeeded) {
      return NextResponse.json(
        { error: `Você possui ${user.credits} crédito(s), mas precisa de ${creditsNeeded}.` },
        { status: 400 }
      )
    }

    // ─── 5. Compressão de imagens (backend) ────────────
    const [frontUri, sideUri] = await Promise.all([
      compressImage(frontFile),
      compressImage(sideFile),
    ])

    // ─── 6. Chamadas paralelas ao OpenRouter ───────────
    const results = await Promise.allSettled(
      prompts.map(async (haircut, i) => {
        console.log(`[route] iniciando corte ${i + 1}/${prompts.length}`)
        const finalPrompt = BASE_PROMPT + buildHaircutPrompt(haircut)
        const url = await callOpenRouter(finalPrompt, frontUri, sideUri, apiKey)
        if (!url) throw new Error(`Corte ${i + 1} não retornou imagem`)
        return url
      })
    )

    const images  = results.filter(r => r.status === "fulfilled").map(r => (r as PromiseFulfilledResult<string>).value)
    const failed  = results.filter(r => r.status === "rejected").length

    console.log(`[route] geradas: ${images.length} | falhas: ${failed}`)

    if (!images.length) {
      return NextResponse.json(
        { error: "Nenhuma imagem foi gerada. Verifique os logs do servidor." },
        { status: 500 }
      )
    }

    // ─── 7. Atualização dos Créditos (pós-sucesso) ─────
    const remainingCredits = Math.max(0, user.credits - images.length)

    await supabaseAdmin
      .from("users")
      .update({ credits: remainingCredits })
      .eq("id", user.id)

    // ─── 8. Retorno de Sucesso ─────────────────────────
    return NextResponse.json({
      images,
      failed,
      remainingCredits,
    })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[route] erro não tratado:", message)
    return NextResponse.json({ error: `Erro interno: ${message}` }, { status: 500 })
  }
}
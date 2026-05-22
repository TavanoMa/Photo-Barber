"use client"
import { useRef, useState } from "react"

interface Props {
  onComplete: (front: File, side: File) => void
}

type Step = "front" | "side" | "done"

type FixedImageResult = {
  file: File
  preview: string
}

async function flattenImage(file: File): Promise<FixedImageResult> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        resolve({ file, preview: url })
        return
      }

      // ✅ Limita resolução — câmera gera 3000-4000px, Vercel aceita até 4.5MB
      const MAX_SIZE = 800
      let w = img.naturalWidth
      let h = img.naturalHeight

      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w > h) {
          h = Math.round((h * MAX_SIZE) / w)
          w = MAX_SIZE
        } else {
          w = Math.round((w * MAX_SIZE) / h)
          h = MAX_SIZE
        }
      }

      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)

      const previewBase64 = canvas.toDataURL("image/jpeg", 0.8)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ file, preview: previewBase64 })
            return
          }

          const fixedFile = new File([blob], file.name, { type: "image/jpeg" })

          URL.revokeObjectURL(url)
          resolve({ file: fixedFile, preview: previewBase64 })
        },
        "image/jpeg",
        0.75 // ✅ gera ~150-300 KB por foto, bem abaixo do limite da Vercel
      )
    }

    img.onerror = () => reject(new Error("Erro ao carregar a imagem"))
    img.src = url
  })
}

export default function UploadPhoto({ onComplete }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>("front")
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [sidePreview, setSidePreview] = useState<string | null>(null)
  const [frontFile, setFrontFile] = useState<File | null>(null)

  const isDone = step === "done"

  async function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    const fixed = await flattenImage(originalFile)

    if (step === "front") {
      setFrontPreview(fixed.preview)
      setFrontFile(fixed.file)
      setStep("side")
    } else if (step === "side") {
      setSidePreview(fixed.preview)
      setStep("done")
      onComplete(frontFile!, fixed.file)
    }

    e.target.value = ""
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-white/80 font-medium">
            {step === "front" ? "Passo 1: Frente" : step === "side" ? "Passo 2: Lado" : "Concluído"}
          </p>
          <p className="text-xs text-white/40">
            {step === "front" ? "Olhe direto para a câmera" : step === "side" ? "Vire 45 graus para o lado" : "Fotos processadas"}
          </p>
        </div>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/60">
          {step === "front" ? "1/2" : step === "side" ? "2/2" : "✓"}
        </span>
      </div>

      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleSelectImage} />
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage} />

        {!isDone && (
          <div className="flex flex-col items-center">
            {frontPreview ? (
              <div className="relative mb-6">
                <img src={frontPreview} className="w-32 h-32 object-cover rounded-full border-2 border-primary shadow-xl shadow-primary/20" />
                <div className="absolute -bottom-2 bg-primary text-[10px] px-2 py-1 rounded-full text-white uppercase font-bold">Frente OK</div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl text-primary mb-6">📸</div>
            )}

            <h3 className="text-lg font-semibold mb-2">
              {step === "front" ? "Tire a foto de frente" : "Agora a foto de lado"}
            </h3>
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              {step === "front"
                ? "Mantenha o rosto centralizado e boa iluminação."
                : "Vire levemente a cabeça para mostrar a lateral do cabelo."}
            </p>
          </div>
        )}

        {isDone && (
          <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
            <div className="flex flex-col gap-2">
              <img src={frontPreview!} className="w-full h-full object-cover bg-black rounded-xl border border-white/10" />
              <span className="text-[10px] text-white/40 text-center uppercase">Frente</span>
            </div>
            <div className="flex flex-col gap-2">
              <img src={sidePreview!} className="w-full h-full object-cover bg-black rounded-xl border border-white/10" />
              <span className="text-[10px] text-white/40 text-center uppercase">Lado</span>
            </div>
          </div>
        )}
      </div>

      {!isDone && (
        <div className="flex gap-3 mt-4">
          <button onClick={() => cameraRef.current?.click()} className="flex-1 px-6 py-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition shadow-lg shadow-primary/20">
            Tirar Foto
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition">
            Galeria
          </button>
        </div>
      )}
    </div>
  )
}
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

// Achata a imagem (remove EXIF / corrige rotação)
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

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      const previewBase64 = canvas.toDataURL("image/jpeg", 0.9)

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve({ file, preview: previewBase64 })
          return
        }

        const fixedFile = new File([blob], file.name, {
          type: "image/jpeg",
        })

        URL.revokeObjectURL(url)
        resolve({ file: fixedFile, preview: previewBase64 })
      }, "image/jpeg", 0.95)
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
  const [sideFile, setSideFile] = useState<File | null>(null)

  const isFront = step === "front"
  const isSide = step === "side"
  const isDone = step === "done"

  const title =
    isFront ? "Foto de frente" :
    isSide ? "Foto de lado" :
    "Fotos enviadas"

  const description =
    isFront
      ? "Olhe para frente, mantenha o rosto centralizado e boa iluminação."
      : isSide
      ? "Vire levemente a cabeça para mostrar a lateral e o degradê."
      : "Perfeito! Agora vamos gerar seus cortes."

  async function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    const fixed = await flattenImage(originalFile)

    // PRIMEIRA FOTO → FRONTAL
    if (step === "front") {
      setFrontPreview(fixed.preview)
      setFrontFile(fixed.file)
      setStep("side")
      return
    }

    // SEGUNDA FOTO → LATERAL
    if (step === "side") {
      setSidePreview(fixed.preview)
      setSideFile(fixed.file)
      setStep("done")

      // envia as duas para o componente pai
      onComplete(frontFile!, fixed.file)
    }
  }

  return (
    <div>
      <p className="mb-4 text-white/80">Envie duas fotos</p>

      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleSelectImage}/>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleSelectImage}/>

        {!isDone && !frontPreview && !sidePreview && (
          <>
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl text-primary mb-6">
              📸
            </div>

            <h3 className="text-lg font-semibold mb-2">Envie as fotos</h3>

            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Tire uma foto de frente e outra de lado com boa iluminação.
            </p>
          </>
        )}

        {isDone && (
          <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
            <img src={frontPreview!} className="w-full h-full object-contain bg-black rounded-xl"/>
            <img src={sidePreview!} className="w-full h-full object-contain bg-black rounded-xl"/>
          </div>
        )}
      </div>

      {!isDone && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 px-6 py-3 rounded-lg bg-primary hover:opacity-90 transition cursor-pointer"
          >
            Tirar foto
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 px-6 py-3 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition cursor-pointer"
          >
            Escolher imagem
          </button>
        </div>
      )}
    </div>
  )
}
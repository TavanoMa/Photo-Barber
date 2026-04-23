"use client"
import { useRef, useState } from "react"
import EXIF from "exif-js"

interface Props {
  onSelect: (file: File) => void
}

type FixedImageResult = {
  file: File
  preview: string
}

// ⭐ Corrige rotação + já gera preview correto
async function fixImageOrientation(file: File): Promise<FixedImageResult> {
  return new Promise((resolve) => {

    // ⭐ ler EXIF diretamente do FILE (não do img!)
    EXIF.getData(file as any, function (this: any) {

  const orientation: number = EXIF.getTag(this, "Orientation") || 1

  const reader = new FileReader()
  const img = new Image()

  reader.onload = (e) => {
    img.src = e.target?.result as string
  }

  img.onload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      resolve({ file, preview: URL.createObjectURL(file) })
      return
    }

    const width = img.width
    const height = img.height

    if ([5, 6, 7, 8].includes(orientation)) {
      canvas.width = height
      canvas.height = width
    } else {
      canvas.width = width
      canvas.height = height
    }

    switch (orientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break
      case 3: ctx.transform(-1, 0, 0, -1, width, height); break
      case 4: ctx.transform(1, 0, 0, -1, 0, height); break
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break
      case 6: ctx.transform(0, 1, -1, 0, height, 0); break
      case 7: ctx.transform(0, -1, -1, 0, height, width); break
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break
    }

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

      resolve({ file: fixedFile, preview: previewBase64 })
    }, "image/jpeg", 0.95)
  }

  reader.readAsDataURL(file)
})
  })
}

export default function UploadPhoto({ onSelect }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    // ⭐ agora retorna file + preview já corrigidos
    const fixed = await fixImageOrientation(originalFile)

    setPreview(fixed.preview)
    onSelect(fixed.file)
  }

  return (
    <div>
      <p className="mb-4 text-white/80">Sua foto</p>

      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleSelectImage}
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelectImage}
        />

        {!preview && (
          <>
            <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl text-purple-400 mb-6">
              📸
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Envie sua foto
            </h3>

            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Use uma foto frontal com boa iluminação para melhores resultados
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => cameraRef.current?.click()}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
              >
                Tirar foto
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                className="px-6 py-3 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition"
              >
                Escolher imagem
              </button>
            </div>
          </>
        )}

        {preview && (
          <img
            src={preview}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {preview && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => cameraRef.current?.click()}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
          >
            Tirar outra foto
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="px-6 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition"
          >
            Escolher outra imagem
          </button>
        </div>
      )}
    </div>
  )
}
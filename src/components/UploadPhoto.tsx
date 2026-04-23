"use client"
import { useRef, useState } from "react"

interface Props {
  onSelect: (file: File) => void
}

type FixedImageResult = {
  file: File
  preview: string
}

// ⭐ Não precisamos mais do EXIF. O navegador moderno já auto-rotaciona.
// O Canvas apenas "achata" a imagem para limpar o EXIF e enviar pro backend em pé.
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

      // Pega as dimensões reais da imagem (o navegador já inverteu width/height se precisava)
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      // Desenha a imagem na posição correta
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

        URL.revokeObjectURL(url) // Libera memória
        resolve({ file: fixedFile, preview: previewBase64 })
      }, "image/jpeg", 0.95)
    }

    img.onerror = () => reject(new Error("Erro ao carregar a imagem"))
    img.src = url
  })
}

export default function UploadPhoto({ onSelect }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    // ⭐ Passamos pelo processo de "achatar" a imagem
    const fixed = await flattenImage(originalFile)

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
          capture="environment" // Muda para 'user' se quiser focar na câmera frontal por padrão
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

            <h3 className="text-lg font-semibold mb-2">Envie sua foto</h3>

            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Use uma foto frontal com boa iluminação para melhores resultados
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => cameraRef.current?.click()}
                className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
              >
                Tirar foto
              </button>

              <button
                onClick={() => fileRef.current?.click()}
                className="px-6 py-3 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition cursor-pointer"
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
            alt="Preview"
          />
        )}
      </div>

      {preview && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition cursor-pointer text-sm font-medium"
          >
            Tirar outra
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 px-4 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition cursor-pointer text-sm font-medium"
          >
            Escolher outra
          </button>
        </div>
      )}
    </div>
  )
}
"use client"
import { useRef, useState } from "react"
import EXIF from "exif-js"

interface Props {
  onSelect: (file: File) => void
}

// ⭐ Corrige rotação de fotos do iPhone (EXIF orientation)
async function fixImageOrientation(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(file)
        return
      }
      img.src = e.target.result as string
    }

    img.onload = () => {
      // 👇 TIPAGEM DO THIS AQUI
      EXIF.getData(img, function (this: any) {
        const orientation = EXIF.getTag(this, "Orientation") as number | undefined

        // Se não houver orientação → retorna original
        if (!orientation || orientation === 1) {
          resolve(file)
          return
        }

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          resolve(file)
          return
        }

        const width = img.width
        const height = img.height

        // Fotos giradas trocam largura/altura
        if ([5, 6, 7, 8].includes(orientation)) {
          canvas.width = height
          canvas.height = width
        } else {
          canvas.width = width
          canvas.height = height
        }

        switch (orientation) {
          case 3:
            ctx.rotate(Math.PI)
            ctx.drawImage(img, -width, -height)
            break

          case 6:
            ctx.rotate(Math.PI / 2)
            ctx.drawImage(img, 0, -height)
            break

          case 8:
            ctx.rotate(-Math.PI / 2)
            ctx.drawImage(img, -width, 0)
            break

          default:
            ctx.drawImage(img, 0, 0)
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file)
            return
          }

          const fixedFile = new File([blob], file.name, {
            type: "image/jpeg",
          })

          resolve(fixedFile)
        }, "image/jpeg", 0.95)
      })
    }

    reader.readAsDataURL(file)
  })
}

export default function UploadPhoto({ onSelect }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const originalFile = e.target.files?.[0]
    if (!originalFile) return

    // ⭐ Corrige rotação antes do preview e upload
    const fixedFile = await fixImageOrientation(originalFile)

    const url = URL.createObjectURL(fixedFile)
    setPreview(url)
    onSelect(fixedFile)
  }

  return (
    <div>
      <p className="mb-4 text-white/80">Sua foto</p>

      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        {/* CAMERA */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleSelectImage}
        />

        {/* GALERIA */}
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
          />
        )}
      </div>

      {preview && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => cameraRef.current?.click()}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
          >
            Tirar outra foto
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="px-6 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            Escolher outra imagem
          </button>
        </div>
      )}
    </div>
  )
}
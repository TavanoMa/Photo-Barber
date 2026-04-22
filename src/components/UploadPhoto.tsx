"use client"
import { useRef, useState } from "react"

interface Props {
  onSelect: (file: File) => void
}

export default function UploadPhoto({ onSelect }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleSelectImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview(url)
    onSelect(file)
  }

  return (
    <div>
      <p className="mb-4 text-white/80">Sua foto</p>

      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        {/* INPUT CAMERA */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleSelectImage}
        />

        {/* INPUT GALERIA */}
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
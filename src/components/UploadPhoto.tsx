"use client"
import { useRef, useState } from "react"

interface Props {
  onSelect: (file: File) => void
}

export default function UploadPhoto({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
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

      {/* CARD */}
      <div className="border border-white/10 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-[420px] relative overflow-hidden">

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleSelectImage}
        />

        {!preview && (
          <>
            <div className="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl text-purple-400 mb-6">
              ⬆️
            </div>

            <h3 className="text-lg font-semibold mb-2">
              Envie sua foto
            </h3>

            <p className="text-white/60 text-sm mb-6 max-w-xs">
              Use uma foto frontal com boa iluminação para melhores resultados
            </p>

            {/* BOTÃO DENTRO (SÓ SEM IMAGEM) */}
            <button
              onClick={() => inputRef.current?.click()}
              className="px-6 py-3 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition cursor-pointer mt-4 relative z-10"
            >
              Selecionar imagem
            </button>
          </>
        )}

        {preview && (
          <img
            src={preview}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* BOTÃO FORA (SÓ COM IMAGEM) */}
      {preview && (
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 px-6 py-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition cursor-pointer"
        >
          Escolher outra imagem
        </button>
      )}
    </div>
  )
}
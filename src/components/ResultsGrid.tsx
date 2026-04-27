"use client"

import { useState } from "react"

interface Props {
  result: string | null
}

export default function ResultsGrid({ result }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  function downloadImage() {
    if (!result) return

    const link = document.createElement("a")
    link.href = result
    link.download = "foto-com-famoso.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Seu resultado <span className="text-pink-400">aparecerá aqui</span>
        </h2>

        {!result ? (
          <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse" />
        ) : (
          <div className="flex flex-col items-center gap-6">
            
            {/* CARD DA IMAGEM */}
            <div 
              className="relative group cursor-zoom-in"
              onClick={() => setIsOpen(true)}
            >
              <img 
                src={result} 
                className="rounded-2xl max-h-[520px] border border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]" 
                alt="Resultado da simulação"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm border border-white/20">
                  Clique para ampliar 🔍
                </span>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-4">
              <button
                onClick={downloadImage}
                className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 transition font-semibold"
              >
                Baixar imagem
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Visualizar grande
              </button>
            </div>

          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {isOpen && result && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-pink-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
          
          <img 
            src={result} 
            className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            alt="Resultado ampliado"
          />
        </div>
      )}
    </section>
  )
}
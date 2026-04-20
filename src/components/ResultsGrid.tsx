"use client"

import { useState } from "react"

interface Props {
  result: string | null
}

export default function ResultsGrid({ result }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Suas simulações <span className="text-pink-400">aparecerão aqui</span>
        </h2>

        {!result ? (
          <div className="grid md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            {/* Imagem clicável */}
            <div 
              className="relative group cursor-zoom-in"
              onClick={() => setIsOpen(true)}
            >
              <img 
                src={result} 
                className="rounded-2xl max-h-[500px] transition-transform duration-300 group-hover:scale-[1.02] border border-white/10" 
                alt="Resultado da simulação"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm border border-white/20">
                  Click para ampliar 🔍
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Lightbox */}
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
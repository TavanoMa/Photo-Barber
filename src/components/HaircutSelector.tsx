"use client"
import { useState } from "react"
import haircutsData from "@/src/data/haircuts.json" 

interface Props {
  onGenerate: () => void
  onSelectHaircut: (promptText: string) => void
  loading: boolean
}

const fallbackImage =
  "https://cdn.leroymerlin.com.br/products/papel_de_parede_liso_preto_com_glitter_1567181465_30e0_300x300.jpg"

// Criando uma tipagem para facilitar
type ItemType = {
  id: string
  name: string
  category: string
  image: string
  prompt?: string // Opcional, porque alguns podem não ter
}

export default function HaircutSelector({
  onGenerate,
  onSelectHaircut,
  loading,
}: Props) {
  // Agora guardamos o objeto inteiro no estado, e não só o nome
  const [selectedHaircut, setSelectedHaircut] = useState<ItemType | null>(null)
  const [selectedBeard, setSelectedBeard] = useState<ItemType | null>(null)
  
  const [activeFilter, setActiveFilter] = useState<string>("Curto")

  const categories = ["Curto", "Médio", "Grande", "Barba"]

  function handleSelect(item: ItemType) {
    let newHaircut = selectedHaircut
    let newBeard = selectedBeard

    if (item.category === "Barba") {
      newBeard = selectedBeard?.id === item.id ? null : item
    } else {
      newHaircut = selectedHaircut?.id === item.id ? null : item
    }

    setSelectedHaircut(newHaircut)
    setSelectedBeard(newBeard)

    // A MÁGICA ACONTECE AQUI:
    // Pega o 'prompt' se existir. Se não existir, pega o 'name'.
    const haircutText = newHaircut ? (newHaircut.prompt + newHaircut.name || newHaircut.name) : null
    const beardText = newBeard ? (newBeard.prompt + newBeard.name || newBeard.name) : null

    // Junta as descrições pro backend
    const combination = [haircutText, beardText].filter(Boolean).join(" and ")
    
    onSelectHaircut(combination) 
  }

  const filteredHaircuts = haircutsData.filter(
    (cut) => cut.category === activeFilter
  )

  const canGenerate = selectedHaircut || selectedBeard

  return (
    <div className="flex flex-col h-full">
      <p className="mb-4 text-white/80 font-medium">Escolha o estilo</p>

      {/* Botões de Filtro */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-sm rounded-full border transition cursor-pointer ${
              activeFilter === cat
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Cortes */}
      <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredHaircuts.map((cut) => {
          const isSelected = selectedHaircut?.id === cut.id || selectedBeard?.id === cut.id
          const imageSrc = cut.image || fallbackImage

          return (
            <div
              key={cut.id}
              // Passamos o objeto 'cut' inteiro agora
              onClick={() => handleSelect(cut as ItemType)} 
              className={`relative h-40 rounded-xl overflow-hidden cursor-pointer border transition
                ${isSelected ? "border-purple-500 ring-2 ring-purple-500/50" : "border-white/10 hover:border-purple-500/40"}
              `}
            >
              <img
                src={imageSrc}
                alt={cut.name}
                className="absolute inset-0 w-full h-full object-cover bg-black"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              <span className="absolute bottom-3 left-3 right-3 text-sm font-medium leading-tight text-white drop-shadow-md">
                {cut.name}
              </span>
              
              {isSelected && (
                <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Resumo da Escolha */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/50">Cabelo:</span>
          <span className="text-white font-medium">{selectedHaircut?.name || "Nenhum"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50">Barba:</span>
          <span className="text-white font-medium">{selectedBeard?.name || "Nenhuma"}</span>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !canGenerate}
        className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Gerando..." : "✨ Gerar simulação"}
      </button>

      <p className="text-xs text-white/40 mt-3 text-center">
        Suas fotos são privadas e usadas apenas para gerar as simulações.
      </p>
    </div>
  )
}
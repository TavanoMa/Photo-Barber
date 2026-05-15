"use client"
import { useState } from "react"
import haircutsData from "@/src/data/haircuts.json"

interface Props {
  onGenerate: (prompts: string) => void; // 🔥 Agora recebe a string diretamente
  loading: boolean;
}
const fallbackImage =
  "https://cdn.leroymerlin.com.br/products/papel_de_parede_liso_preto_com_glitter_1567181465_30e0_300x300.jpg"

type ItemType = {
  id: string
  name: string
  category: string
  image: string
  prompt?: string
}

type Combination = {
  haircut: ItemType
  beard?: ItemType | null
}

export default function HaircutSelector({
  onGenerate,
  loading,
}: Props) {

  // seleção atual
  const [currentHaircut, setCurrentHaircut] = useState<ItemType | null>(null)
  const [currentBeard, setCurrentBeard] = useState<ItemType | null>(null)

  // lista de comparações
  const [combinations, setCombinations] = useState<Combination[]>([])

  const [activeFilter, setActiveFilter] = useState<string>("Curto")
  const categories = ["Curto", "Médio", "Grande", "Barba"]

  function handleSelect(item: ItemType) {
    if (item.category === "Barba") {
      setCurrentBeard(prev => prev?.id === item.id ? null : item)
    } else {
      setCurrentHaircut(prev => prev?.id === item.id ? null : item)
    }
  }

  // adiciona combinação para comparar
  function addCombination() {
    if (!currentHaircut) return

    const exists = combinations.find(
      c => c.haircut.id === currentHaircut.id && c.beard?.id === currentBeard?.id
    )
    if (exists) return

    setCombinations(prev => [
      ...prev,
      { haircut: currentHaircut, beard: currentBeard }
    ])
  }

  // gerar prompts finais
  // gerar prompts finais
  function handleGenerateAll() {
    if (combinations.length === 0) return

    // 1. Definimos modificadores globais para garantir qualidade
    const prefix = "Apply this exact style to the person in the reference photo: "
const suffix = ", keep the original face strictly identical, hyper-realistic, barber shop lighting, 8k resolution"

    const prompts = combinations.map(c => {
      // 2. Prioriza o prompt técnico do JSON
      const haircutDescription = c.haircut.prompt || c.haircut.name
      
      let finalItemPrompt = `${prefix}${haircutDescription}`

      // 3. Se tiver barba, adiciona com um conector natural
      if (c.beard) {
        const beardDescription = c.beard.prompt || c.beard.name
        finalItemPrompt += `, with ${beardDescription}`
      }

      // 4. Fecha com os modificadores de qualidade
      return finalItemPrompt + suffix
    })

    // 🔥 Envia a string gigante separada por "|" para o backend
    onGenerate(prompts.join("|")) 
  }

  const filteredHaircuts = haircutsData.filter(
    cut => cut.category === activeFilter
  )

  const canAddCombination = currentHaircut !== null
  const canGenerate = combinations.length > 0

  return (
     <div className="flex flex-col h-full">
      <p className="mb-4 text-white/80 font-medium">Escolha o estilo</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-sm rounded-full border transition cursor-pointer${
              activeFilter === cat
                ? "bg-primary border-primary text-white cursor-pointer"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 cursor-pointer" 
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
        {filteredHaircuts.map((cut) => {
          const isSelected =
            currentHaircut?.id === cut.id || currentBeard?.id === cut.id

          const imageSrc = cut.image || fallbackImage

          return (
            <div
              key={cut.id}
              onClick={() => handleSelect(cut as ItemType)}
              className={`relative h-40 rounded-xl overflow-hidden cursor-pointer border transition
                ${isSelected
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-white/10 hover:border-primary/40"}
              `}
            >
              <img
                src={imageSrc}
                alt={cut.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white">
                {cut.name}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={addCombination}
        disabled={!canAddCombination}
        className="mt-4 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-40 cursor-pointer"
      >
         Adicionar corte e barba para simulação
      </button>

      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm space-y-3">
        <p className="text-white/50">Simulações selecionadas:</p>

        {combinations.length === 0 && (
          <p className="text-white/40">Nenhuma ainda</p>
        )}

        {combinations.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 border border-white/10"
          >
            <div className="text-white font-medium">
              • {c.haircut.name}
              {c.beard && ` + ${c.beard.name}`}
            </div>

            <button
              onClick={() => setCombinations(prev => prev.filter((_, index) => index !== i))}
              className="text-white/40 hover:text-red-400 transition text-sm"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerateAll}
        disabled={loading || !canGenerate}
        className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Gerando..." : "✨ Gerar simulações"}
      </button>

      <p className="text-xs text-white/40 mt-3 text-center">
        Suas fotos são privadas e usadas apenas para gerar as simulações.
      </p>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import haircutsData from "@/src/data/haircuts.json"

interface Props {
  onGenerate: (prompts: string) => void
  loading: boolean
  mode?: "landing" | "premium"
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
  haircut: ItemType | null
  beard?: ItemType | null
  customText?: string
}

export default function HaircutSelector({
  onGenerate,
  loading,
  mode = "premium",
}: Props) {
  const isLanding = mode === "landing"

  // IDs permitidos na landing
  // AJUSTE conforme os IDs reais do seu JSON
  const landingHaircuts = ["buzz-cut", "man-bun-samurai"]

  const [currentHaircut, setCurrentHaircut] = useState<ItemType | null>(null)
  const [currentBeard, setCurrentBeard] = useState<ItemType | null>(null)
  const [customText, setCustomText] = useState("")

  const [combinations, setCombinations] = useState<Combination[]>([])

  const [activeFilter, setActiveFilter] = useState<string>("Curto")
  const categories = ["Curto", "Médio", "Grande", "Barba"]

  const [credits, setCredits] = useState<number | null>(null)

  // PREMIUM
  const requiredCredits = combinations.length

  // LANDING
  const landingRequiredCredits = 1

  const hasEnoughCredits =
    credits !== null &&
    credits >= (isLanding ? landingRequiredCredits : requiredCredits) &&
    credits !== 0

  function handleSelect(item: ItemType) {
    // Landing não permite barba
    if (isLanding && item.category === "Barba") return

    if (item.category === "Barba") {
      setCurrentBeard((prev) =>
        prev?.id === item.id ? null : item
      )
    } else {
      setCurrentHaircut((prev) =>
        prev?.id === item.id ? null : item
      )
    }
  }

  // PREMIUM → múltiplas combinações
  function addCombination() {
    const trimmedCustom = customText.trim()

    // Precisa de pelo menos um corte, uma barba OU uma descrição personalizada
    if (!currentHaircut && !currentBeard && !trimmedCustom) return

    const exists = combinations.find(
      (c) =>
        c.haircut?.id === currentHaircut?.id &&
        c.beard?.id === currentBeard?.id &&
        (c.customText || "") === trimmedCustom
    )

    if (exists) return

    setCombinations((prev) => [
      ...prev,
      {
        haircut: currentHaircut,
        beard: currentBeard,
        customText: trimmedCustom || undefined,
      },
    ])

    setCustomText("")
  }

  // LANDING → geração direta
  function handleLandingGenerate() {
    if (!currentHaircut) return

    const prefix =
      "Apply this exact style to the person in the reference photo: "

    const suffix =
      ", keep the original face strictly identical, hyper-realistic, barber shop lighting, 8k resolution"

    const haircutDescription =
      currentHaircut.prompt || currentHaircut.name

    const finalPrompt =
      `${prefix}${haircutDescription}${suffix}`

    onGenerate(finalPrompt)
  }

  // PREMIUM → múltiplas gerações
  function handleGenerateAll() {
    if (combinations.length === 0) return

    const prefix =
      "Apply this exact style to the person in the reference photo: "

    const suffix =
      ", keep the original face strictly identical, hyper-realistic, barber shop lighting, 8k resolution"

    const prompts = combinations.map((c) => {
      const parts: string[] = []

      if (c.haircut) {
        parts.push(c.haircut.prompt || c.haircut.name)
      }

      if (c.beard) {
        const beardDescription = c.beard.prompt || c.beard.name
        parts.push(c.haircut ? `with ${beardDescription}` : beardDescription)
      }

      let finalItemPrompt =
        parts.length > 0
          ? `${prefix}${parts.join(", ")}`
          : "Apply the following custom haircut instructions to the person in the reference photo"

      if (c.customText) {
        finalItemPrompt += `. Barber's custom instructions (highest priority, follow precisely): ${c.customText}`
      }

      return finalItemPrompt + suffix
    })

    onGenerate(prompts.join("|"))
  }

  const filteredHaircuts = isLanding
    ? haircutsData.filter((cut) =>
        landingHaircuts.includes(cut.id)
      )
    : haircutsData.filter(
        (cut) => cut.category === activeFilter
      )

  const canAddCombination =
    currentHaircut !== null || currentBeard !== null || customText.trim().length > 0
  const canGenerate = combinations.length > 0

  useEffect(() => {
    if (loading) return

    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits))
  }, [loading])

  return (
    <div className="flex flex-col h-full">
      <p className="mb-4 text-white/80 font-medium">
        {isLanding
          ? "Escolha um estilo para testar"
          : "Escolha o estilo"}
      </p>

      {/* PREMIUM ONLY */}
      {!isLanding && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-sm rounded-full border transition cursor-pointer ${
                activeFilter === cat
                  ? "bg-primary border-primary text-white"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div
        className={`grid gap-4 overflow-y-auto pr-2 ${
          isLanding
            ? "grid-cols-2"
            : "grid-cols-2 max-h-[350px]"
        }`}
      >
        {filteredHaircuts.map((cut) => {
          const isSelected =
            currentHaircut?.id === cut.id ||
            currentBeard?.id === cut.id

          const imageSrc = cut.image || fallbackImage

          return (
            <div
              key={cut.id}
              onClick={() => handleSelect(cut as ItemType)}
              className={`relative h-40 rounded-xl overflow-hidden cursor-pointer border transition
                ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-white/10 hover:border-primary/40"
                }
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

      {/* PREMIUM */}
      {!isLanding && (
        <>
          <div className="mt-4">
            <label className="text-sm text-white/60 mb-2 block">
              Detalhes personalizados (opcional)
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ex: deixar o cabelo liso, comprimento até a nuca, mudar a cor para grafite..."
              rows={2}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-primary/50"
            />
            <p className="text-xs text-white/30 mt-1">
              Pode usar sozinho (sem escolher um corte acima) ou somar a um estilo selecionado.
            </p>
          </div>

          <button
            onClick={addCombination}
            disabled={!canAddCombination}
            className="mt-4 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-40 cursor-pointer"
          >
            Adicionar para simulação
          </button>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm space-y-3">
            <p className="text-white/50">
              Simulações selecionadas:
            </p>

            {combinations.length === 0 && (
              <p className="text-white/40">
                Nenhuma ainda
              </p>
            )}

            {combinations.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 border border-white/10"
              >
                <div className="text-white font-medium">
                  • {c.haircut?.name ?? c.beard?.name ?? "Corte personalizado"}
                  {c.haircut && c.beard && ` + ${c.beard.name}`}
                  {c.customText && (
                    <span className="block text-xs text-white/40 font-normal mt-0.5">
                      &ldquo;{c.customText}&rdquo;
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    setCombinations((prev) =>
                      prev.filter(
                        (_, index) => index !== i
                      )
                    )
                  }
                  className="text-white/40 hover:text-red-400 transition text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BOTÃO LANDING */}
      {isLanding && (
        <button
          onClick={handleLandingGenerate}
          disabled={
            loading ||
            !currentHaircut ||
            !hasEnoughCredits
          }
          className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Gerando..."
            : !hasEnoughCredits
            ? "Seu teste grátis acabou"
            : "✨ Gerar teste grátis"}
        </button>
      )}

      {/* BOTÃO PREMIUM */}
      {!isLanding && (
        <button
          onClick={handleGenerateAll}
          disabled={
            loading ||
            !canGenerate ||
            !hasEnoughCredits
          }
          className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Gerando..."
            : !hasEnoughCredits
            ? "Seus créditos acabaram"
            : `✨ Gerar ${requiredCredits} simulação${
                requiredCredits > 1 ? "ões" : ""
              }`}
        </button>
      )}

      <p className="text-xs text-white/40 mt-3 text-center">
        Suas fotos são privadas e usadas apenas para gerar as
        simulações.
      </p>
    </div>
  )
}
"use client"

import { useState } from "react"
import HaircutSelector from "@/src/components/HaircutSelector"
import ResultsGrid from "@/src/components/ResultsGrid"
import UploadPhoto from "@/src/components/UploadPhoto"
import HowItWorks from "@/src/components/HowItWorks"

interface Props {
    logoUrl: string
}

export default function GeneratePage({logoUrl}: Props) {
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [sideImage, setSideImage] = useState<File | null>(null)

  const [results, setResults] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  function handlePhotos(front: File, side: File) {
    setFrontImage(front)
    setSideImage(side)
  }

  async function generateHaircut(prompts: string) {
    if (!frontImage || !sideImage) {
      alert("Envie as duas fotos e selecione um corte")
      return
    }

    try {
      setLoading(true)
      setResults(null)

      const formData = new FormData()
      formData.append("frontImage", frontImage)
      formData.append("sideImage", sideImage)
      formData.append("haircut", prompts)

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setResults(data.images)
    } catch (err) {
      console.error(err)
      alert("Erro ao gerar imagens")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#07070c] text-white mt-10">

        <HowItWorks></HowItWorks>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <UploadPhoto onComplete={handlePhotos} />

          <HaircutSelector
            onGenerate={generateHaircut}
            loading={loading}
          />
        </div>
      </section>

      <ResultsGrid results={results} loading={loading} logoUrl={logoUrl}/>
    </div>
  )
}
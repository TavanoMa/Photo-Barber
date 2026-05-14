"use client"

import { useState, useEffect } from "react"

interface Props {
  results: string[] | null
  loading: boolean
  logoUrl: string // Nova prop
}

export default function ResultsGrid({ results, loading, logoUrl }: Props) {
  const [watermarkedResults, setWatermarkedResults] = useState<string[] | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [timer, setTimer] = useState(40)

  // Função mágica para aplicar a marca d'água
  async function applyWatermark(imageSrc: string, logoSrc: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      const logo = new Image()
      img.crossOrigin = "anonymous"
      logo.crossOrigin = "anonymous"

      img.src = imageSrc
      img.onload = () => {
        logo.src = logoSrc
        logo.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) return resolve(imageSrc)

          // Ajusta tamanho do canvas para a imagem da IA
          canvas.width = img.width
          canvas.height = img.height

          // Desenha a foto principal
          ctx.drawImage(img, 0, 0)

          // Configura a logo (ex: 20% da largura da foto)
          const logoWidth = img.width * 0.20
          const ratio = logo.width / logo.height
          const logoHeight = logoWidth / ratio

          // Posição: Canto inferior direito (margem de 40px)
          const x = img.width - logoWidth - 40
          const y = img.height - logoHeight - 40

          // Aplica um pouco de transparência se quiser (0.8 = 80% opaco)
          ctx.globalAlpha = 0.8
          ctx.drawImage(logo, x, y, logoWidth, logoHeight)

          resolve(canvas.toDataURL("image/jpeg", 0.9))
        }
        logo.onerror = () => resolve(imageSrc) // Se der erro na logo, retorna a imagem limpa
      }
      img.onerror = () => resolve(imageSrc)
    })
  }

  // Sempre que chegarem novos resultados, aplica a marca d'água
  useEffect(() => {
    if (results && results.length > 0) {
      const processImages = async () => {
        const processed = await Promise.all(
          results.map(url => applyWatermark(url, logoUrl))
        )
        setWatermarkedResults(processed)
      }
      processImages()
    } else {
      setWatermarkedResults(null)
    }
  }, [results, logoUrl])

  // Timer (Mantido da sua versão anterior)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000)
    } else if (!loading) {
      setTimer(40)
    }
    return () => clearInterval(interval)
  }, [loading, timer])

  function downloadImage(url: string) {
    const link = document.createElement("a")
    link.href = url
    link.download = "simulacao-barbearia.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!loading && !watermarkedResults) return null

  return (
    <section className="px-6 pb-24 mt-8">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-bold">Gerando sua arte...</h3>
            <p className="text-primary font-mono text-lg">
              {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : "Quase pronto..."}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Seus resultados</h2>
              <p className="text-white/60">Imagens com a marca da sua barbearia prontas para compartilhar.</p>
            </div>

            <div className={`grid gap-6 ${watermarkedResults?.length === 1 ? "max-w-sm mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {watermarkedResults?.map((img, i) => (
                <div key={i} className="group animate-in fade-in zoom-in duration-500">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-[3/4] cursor-pointer" onClick={() => setSelectedImage(img)}>
                    <img src={img} alt="Resultado" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <button
                    onClick={() => downloadImage(img)}
                    className="w-full mt-3 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition-colors text-sm font-bold"
                  >
                    Baixar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 p-4 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </section>
  )
}
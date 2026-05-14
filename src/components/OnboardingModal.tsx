"use client"

import { useState } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: Props) {
  const [barbershopName, setBarbershopName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLogo(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!barbershopName || !phone || !city) {
      alert("Preencha todos os campos")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("barbershopName", barbershopName)
    formData.append("phone", phone)
    formData.append("city", city)
    if (logo) formData.append("logo", logo)

    await fetch("/api/onboarding", {
      method: "POST",
      body: formData,
    })

    setLoading(false)
    onClose()
    location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-br from-purple-500/40 to-fuchsia-500/40">
        
        <div className="bg-[#0b0b12] rounded-3xl p-8 text-white border border-white/10 shadow-2xl">
          
          <h2 className="text-2xl font-bold mb-1">
            Complete seu cadastro
          </h2>
          <p className="text-white/60 mb-6 text-sm">
            Precisamos de algumas informações da sua barbearia
          </p>

          <div className="space-y-4">

            <input
              placeholder="Nome da barbearia"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500"
              value={barbershopName}
              onChange={(e) => setBarbershopName(e.target.value)}
            />

            <input
              placeholder="Telefone"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              placeholder="Cidade"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            {/* Upload logo */}
            <div className="space-y-3">
  <label className="block text-sm font-medium text-white/70">
    Logo da barbearia <span className="text-white/40">(opcional)</span>
  </label>

  {/* input escondido */}
  <input
    id="logo-upload"
    type="file"
    accept="image/*"
    onChange={handleLogoChange}
    className="hidden"
  />

  {/* área clicável */}
  <label
    htmlFor="logo-upload"
    className="
      flex flex-col items-center justify-center
      w-full h-32
      rounded-2xl
      border border-dashed border-white/15
      bg-white/[0.03]
      hover:bg-white/[0.06]
      hover:border-white/25
      transition cursor-pointer
      text-center px-4
    "
  >
    <span className="text-sm text-white/70">
      Clique para enviar a logo
    </span>
    <span className="text-xs text-white/40 mt-1">
      PNG, JPG ou WEBP
    </span>
  </label>

  {preview && (
    <div className="pt-2">
      <p className="text-xs text-white/40 mb-2">Pré-visualização</p>
      <img
        src={preview}
        className="
          h-24 rounded-xl object-cover
          border border-white/10
          shadow-sm
        "
      />
    </div>
  )}
</div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 p-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar e continuar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
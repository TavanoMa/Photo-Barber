"use client"

import Image from "next/image"

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-[#07070c]/80 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-[84px] flex items-center justify-between">
        
        {/* LOGO + NOME */}
        <div className="flex items-center gap-4 group cursor-pointer">
          
          {/* Logo com glow */}
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-purple-600/10 blur-2xl rounded-full opacity-70 group-hover:opacity-100 transition" />
            
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-white/10 bg-black transition group-hover:scale-105">
              <Image 
                src="/logo_cacique.png" 
                alt="Cacique's Logo"
                fill
                className="object-contain p-1.5"
              />
            </div>
          </div>

          {/* Nome */}
          <div className="leading-tight">
            <p className="text-lg font-semibold tracking-wide">
              Cacique´s
            </p>
            <p className="text-xs text-white/50 tracking-[0.25em]">
              BARBEARIA
            </p>
          </div>
        </div>

        

      </div>
    </header>
  )
}
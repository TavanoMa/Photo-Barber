import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative w-full bg-[#07070c] pt-20 pb-28 px-6 overflow-hidden">
      
      {/* --- EFEITOS DE GLOW (BACKGROUND) --- */}
      {/* Luz Principal (Roxa) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full -z-0 pointer-events-none" />
      
      {/* Luz Secundária (Rosa/Lateral) */}
      <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] bg-pink-500/10 blur-[100px] rounded-full -z-0 pointer-events-none hide-on-mobile" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                        bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-8
                        animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          AI-Powered
        </div>

        {/* title */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
          Teste seu corte antes{" "}
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            de vir para a Cacique’s
          </span>
        </h1>

        {/* subtitle */}
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Envie uma foto do seu rosto e receba simulações realistas de cortes de
          cabelo geradas por inteligência artificial. Escolha com confiança.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
            <Link href={"/generate"}>
            
          <button
            className="group cursor-pointer px-10 py-5 rounded-2xl font-bold text-white text-xl
                       bg-gradient-to-r from-purple-600 to-pink-500 
                       hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            TESTAR MEU CORTE 
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
            </Link>
        </div>

        {/* benefits */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 text-white/50 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-base">✨</span> Resultados realistas
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-base">⚡</span> Geração rápida
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-base">🔗</span> Compartilhamento fácil
          </div>
        </div>

      </div>
    </section>
  );
}
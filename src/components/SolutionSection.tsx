export default function SolutionSection() {
  const items = [
    "Tire uma foto do cliente na cadeira",
    "Escolha o estilo de corte e barba",
    "A IA gera uma prévia realista do resultado",
    "Cliente aprova com confiança antes da tesoura",
    "Menos retrabalho, mais clientes satisfeitos",
  ];

  // a
  return (
    <section
      id="features"
      className="py-32 bg-gradient-to-b from-[#07070c] via-[#0b0b15] to-[#07070c]"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        
        {/* LEFT */}
        <div>
          <p className="text-purple-400 text-sm mb-4">A SOLUÇÃO</p>

          <h2 className="text-4xl font-bold mb-6">
            Mostre o resultado antes de cortar.
          </h2>

          <p className="text-white/70 mb-8">
            Uma simulação realista em segundos. O cliente vê como vai ficar e
            decide com você — sem achismo, sem surpresa.
          </p>

          <ul className="space-y-4 mb-10">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm shadow-lg shadow-purple-600/30">
                  ✓
                </div>
                {item}
              </li>
            ))}
          </ul>

          <a
            href="#pricing"
            className="inline-block bg-gradient-to-r from-purple-500 to-fuchsia-600 px-7 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/20"
          >
            Ver planos →
          </a>
        </div>

        {/* RIGHT MOCKUP */}
        <div className="relative">
          {/* glow */}
          <div className="absolute -inset-10 bg-purple-600/20 blur-3xl opacity-40 rounded-full" />

          <div className="relative bg-[#0c0c14]/90 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl">
            
            {/* top dots */}
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full"/>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"/>
              <div className="w-3 h-3 bg-green-400 rounded-full"/>
            </div>

            {/* before after */}
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl h-64 flex flex-col items-center justify-center text-white/40 text-sm border border-white/10">
                <span className="text-xs text-white/30 mb-2">ANTES</span>
                Foto do cliente
              </div>

              <div className="bg-gradient-to-br from-purple-500/40 to-fuchsia-600/40 rounded-2xl h-64 flex flex-col items-center justify-center text-white text-sm border border-purple-400/30 shadow-lg shadow-purple-600/20">
                <span className="text-xs text-purple-200 mb-2">DEPOIS</span>
                Prévia do corte
              </div>
            </div>

            {/* bottom bar */}
            <div className="bg-white/5 rounded-xl px-5 py-4 flex justify-between items-center">
              <div>
                <p className="text-white/60 text-sm">Tempo médio de simulação</p>
              </div>
              <span className="text-purple-400 font-bold text-2xl">29s</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
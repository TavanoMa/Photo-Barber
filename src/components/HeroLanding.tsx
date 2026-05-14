import LoginButton from "./LoginButton";

export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      {/* grid background com fade */}
      <div
        className="absolute inset-0 pointer-events-none
        bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
        bg-[size:40px_40px]
        [mask-image:linear-gradient(to_bottom,black_60%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
      />

      <div className="max-w-6xl mx-auto px-6 text-center relative">
        {/* badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full text-sm mb-8">
          ✨ Pré-visualize o corte antes da tesoura
        </div>

        {/* headline */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Mostre ao cliente como ele vai ficar{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            antes do corte
          </span>
          .
        </h1>

        {/* sub */}
        <p className="text-white/70 mt-6 max-w-2xl mx-auto text-lg">
          Tire uma foto na cadeira, escolha o estilo e a IA gera uma prévia
          realista em segundos. Mais confiança para o cliente, menos retrabalho
          para o barbeiro.
        </p>

        {/* buttons */}
        <div className="flex gap-4 justify-center mt-10">
            <a href="#pricing">

          <button className="bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition">
            Ver planos →
          </button>
            </a>

          <LoginButton className="border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/5 transition">
            Entrar
          </LoginButton>
        </div>

        <p className="text-white/40 text-sm mt-4">
          Sem instalação • Funciona no celular da barbearia
        </p>

        {/* video card */}
        <div className="mt-20 rounded-3xl border border-white/10 bg-[#0c0c14] h-[420px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
              ▶
            </div>
            <p className="text-white/40">
              Espaço reservado para o vídeo de apresentação
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
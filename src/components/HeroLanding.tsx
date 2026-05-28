import LoginButton from "./LoginButton";

export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden pt-54 pb-32">
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
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm mb-8">
          🚀 100% gratuito para barbeiros
        </div>

        {/* headline */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
          Mostre ao cliente como ele vai ficar{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
            antes do corte
          </span>
        </h1>

        {/* sub */}
        <p className="text-white/70 mt-6 max-w-3xl mx-auto text-lg">
          Tire duas fotos, escolha um estilo e nossa IA gera uma simulação
          realista em segundos. Tudo isso de forma totalmente gratuita para sua
          barbearia.
        </p>

        {/* buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <LoginButton className="bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-4 rounded-full font-semibold hover:opacity-90 transition">
            Criar conta grátis
          </LoginButton>

          <a
            href="#how"
            className="border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/5 transition"
          >
            Como funciona
          </a>
        </div>

        <p className="text-white/40 text-sm mt-4">
          Sem instalação • Funciona no celular • Uso gratuito
        </p>

        {/* vídeo (futuro) */}
        
      </div>
    </section>
  );
}
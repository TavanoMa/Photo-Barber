import ThemePicker from "./ThemePicker"

export default function HowItWorks() {
  return (
    <section className="px-6 pt-24 pb-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Simulador de Cortes
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Veja como seu cliente vai ficar antes mesmo de pegar a tesoura. É simples e rápido.
          </p>
         
        </div>

        <div className="relative">
          {/* linha conectiva agora usa tema */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] opacity-40 gradient-primary -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            <Step number="1" title="📸 Envie as fotos" description="Tire uma foto de frente e outra de perfil do cliente com boa iluminação."/>
            <Step number="2" title="✂️ Escolha o estilo" description="Navegue pelo catálogo e adicione cortes e barbas para testar."/>
            <Step number="3" title="✨ Veja a mágica" description="Nossa IA gera prévias hiper-realistas para o cliente aprovar na hora."/>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
     <div className="flex flex-col items-center text-center group">
      <div className="w-12 h-12 rounded-full bg-[#07070c] border-2 border-primary/40 text-primary font-bold flex items-center justify-center text-lg mb-4 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.4)] transition-all duration-300">
        {number}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-white/90">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed max-w-[250px]">
        {description}
      </p>
    </div>
  )
}
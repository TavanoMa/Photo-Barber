export default function HowItWorks() {
  return (
    <section className="w-full bg-[#07070c] px-6 pt-14 pb-16">
      <div className="max-w-6xl mx-auto text-center w-full">
        
        {/* title */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Como <span className="text-purple-400">funciona</span>
        </h2>

        <p className="text-white/60 mb-16">
          Três passos simples para visualizar seu novo visual.
        </p>

        {/* cards */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* card 1 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 text-purple-400 text-xl">
              📷
            </div>

            <p className="text-purple-400 text-xs tracking-widest mb-2">
              PASSO 01
            </p>

            <h3 className="text-white text-lg font-semibold mb-3">
              Envie sua foto
            </h3>

            <p className="text-white/60 text-sm">
              Tire uma selfie ou envie uma foto do seu rosto de frente.
            </p>
          </div>

          {/* card 2 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 text-purple-400 text-xl">
              ✂️
            </div>

            <p className="text-purple-400 text-xs tracking-widest mb-2">
              PASSO 02
            </p>

            <h3 className="text-white text-lg font-semibold mb-3">
              Escolha um corte
            </h3>

            <p className="text-white/60 text-sm">
              Navegue por dezenas de estilos e selecione o que mais combina com você.
            </p>
          </div>

          {/* card 3 */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 text-purple-400 text-xl">
              🖼️
            </div>

            <p className="text-purple-400 text-xs tracking-widest mb-2">
              PASSO 03
            </p>

            <h3 className="text-white text-lg font-semibold mb-3">
              Receba as simulações
            </h3>

            <p className="text-white/60 text-sm">
              A IA gera imagens realistas mostrando como você ficaria com o corte escolhido.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
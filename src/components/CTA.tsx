import LoginButton from "./LoginButton";

export default function CTA() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">

        <div className="rounded-3xl border border-white/10 
                        bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 
                        p-14 text-center">

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Pare de cortar no escuro.
            <br />
            <span className="text-purple-400">Mostre antes</span> de cortar.
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Simule o corte do seu cliente em segundos e entregue exatamente o que ele espera.
          </p>

          <div className="flex  justify-center mt-10">
            <LoginButton className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition font-medium">
              Entrar
            </LoginButton>
          </div>

        </div>
      </div>
    </section>
  )
}
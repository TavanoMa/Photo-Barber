export default function Pricing() {
  return (
    <section className="px-6 py-24 bg-[#07070c]" id="pricing">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-purple-400 text-sm tracking-widest">PLANOS</span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Escolha o plano ideal para sua barbearia
          </h2>

          <p className="text-gray-400 mt-4 text-lg">
            Simule cortes antes de cortar. Evite erros e aumente a confiança dos clientes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Starter */}
          <div className="rounded-3xl border border-white/10 p-8 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <p className="text-gray-400 mb-6">Para barbearias começando a usar simulação.</p>

            <div className="text-4xl font-bold mb-6">
              R$89 <span className="text-lg text-gray-400">/mês</span>
            </div>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✔ 80 simulações por mês</li>
              <li>✔ Todos os estilos de corte</li>
              <li>✔ Resultado em segundos</li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
              Começar agora
            </button>
          </div>

          {/* Growth - Mais popular */}
          <div className="rounded-3xl border border-purple-500 p-8 bg-gradient-to-b from-purple-600/20 to-transparent relative">

            <span className="absolute -top-3 right-6 bg-purple-600 text-sm px-3 py-1 rounded-full">
              MAIS POPULAR
            </span>

            <h3 className="text-xl font-semibold mb-2">Growth</h3>
            <p className="text-gray-300 mb-6">Perfeito para barbearias movimentadas.</p>

            <div className="text-4xl font-bold mb-6 text-purple-400">
              R$189 <span className="text-lg text-gray-300">/mês</span>
            </div>

            <ul className="space-y-3 text-gray-200 mb-8">
              <li>✔ 200 simulações por mês</li>
              <li>✔ Atendimento rápido ao cliente</li>
              <li>✔ Mais vendas e menos erros</li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition">
              Assinar Growth
            </button>
          </div>

          {/* Scale */}
          <div className="rounded-3xl border border-white/10 p-8 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-xl font-semibold mb-2">Scale</h3>
            <p className="text-gray-400 mb-6">Para barbearias com cadeira cheia todos os dias.</p>

            <div className="text-4xl font-bold mb-6">
              R$349 <span className="text-lg text-gray-400">/mês</span>
            </div>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li>✔ 500 simulações por mês</li>
              <li>✔ Ideal para alto volume de clientes</li>
              <li>✔ Escale sua barbearia com IA</li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
              Assinar Scale
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
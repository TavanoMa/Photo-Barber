export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#07070c] text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Termos de Uso
        </h1>

        <div className="space-y-6 text-white/70 leading-relaxed">
          <p>
            Última atualização: Maio de 2026
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              1. Aceitação dos Termos
            </h2>

            <p>
              Ao utilizar o PhotoBarber, você concorda com os presentes
              Termos de Uso. Caso não concorde com qualquer condição,
              recomendamos não utilizar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              2. Sobre o Serviço
            </h2>

            <p>
              O PhotoBarber utiliza inteligência artificial para gerar
              simulações visuais de cortes de cabelo e barba a partir
              das imagens enviadas pelos usuários.
            </p>

            <p>
              Os resultados possuem caráter ilustrativo e podem não
              representar exatamente o resultado final de um serviço
              realizado presencialmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              3. Uso Permitido
            </h2>

            <p>
              O usuário compromete-se a utilizar a plataforma de forma
              lícita, respeitando a legislação vigente e os direitos de
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              4. Disponibilidade
            </h2>

            <p>
              O PhotoBarber poderá sofrer interrupções, manutenções ou
              atualizações sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              5. Limitação de Responsabilidade
            </h2>

            <p>
              O PhotoBarber não se responsabiliza por decisões tomadas
              com base exclusiva nas simulações geradas pela plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">
              6. Alterações
            </h2>

            <p>
              Estes Termos poderão ser alterados a qualquer momento para
              refletir melhorias ou mudanças no serviço.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
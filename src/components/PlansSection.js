import { Shield, Star, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PlansSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Elementos de Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full filter blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[100px]" />

      <div className="container mx-auto px-4 relative">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Planos para Todos os Perfis
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Escolha o plano ideal para você e sua família. Todos incluem acesso à nossa plataforma
            de telemedicina e rede de profissionais qualificados.
          </p>
        </div>

        {/* Preview dos Planos */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: "Básico",
              price: "99.90",
              description: "Para quem busca cobertura essencial",
              features: ["Telemedicina ilimitada", "Rede básica de especialistas"],
              color: "from-blue-500/10 to-blue-600/10",
              hover: "hover:border-blue-500/50"
            },
            {
              name: "Plus",
              price: "199.90",
              description: "O mais escolhido para famílias",
              features: ["Telemedicina ilimitada", "Rede ampla de especialistas"],
              popular: true,
              color: "from-purple-500/10 to-purple-600/10",
              hover: "hover:border-purple-500/50"
            },
            {
              name: "Premium",
              price: "349.90",
              description: "Cobertura completa e diferenciada",
              features: ["Telemedicina ilimitada", "Rede completa de especialistas"],
              color: "from-pink-500/10 to-pink-600/10",
              hover: "hover:border-pink-500/50"
            }
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`
                relative p-8 rounded-2xl backdrop-blur-sm
                bg-gradient-to-br ${plan.color}
                border border-white/10 ${plan.hover}
                transition-all duration-300 hover:-translate-y-1
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                    px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2 text-gray-900">Plano {plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                <span className="text-gray-600 ml-2">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
            rounded-2xl filter blur-[50px] -z-10" />

          <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 
            shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Pronto para cuidar melhor da sua saúde?
            </h3>
            <p className="text-gray-600 mb-8">
              Compare todos os benefícios e escolha o plano perfeito para você.
            </p>

            <Link
              href="/planos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 
                text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 
                transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 
                hover:-translate-y-1"
            >
              Ver Todos os Planos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Diferenciais */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Star,
                title: "Profissionais Qualificados",
                description: "Acesso aos melhores especialistas"
              },
              {
                icon: Shield,
                title: "Cobertura Garantida",
                description: "Proteção para toda família"
              },
              {
                icon: Award,
                title: "Reconhecimento",
                description: "98% de satisfação dos pacientes"
              }
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 
                  rounded-full bg-blue-500/10 mb-4">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
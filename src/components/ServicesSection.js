'use client';

import { useState } from 'react';
import { Stethoscope, Heart, Microscope, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: "Cuidados Primários",
    description: "Agende uma consulta com nossos experientes profissionais de cuidados primários.",
    features: ["Clínica Geral", "Pediatria", "Geriatria", "Medicina Familiar"],
  },
  {
    icon: Stethoscope,
    title: "Cuidados Especializados",
    description: "Acesse nossa rede de especialistas para cuidados médicos avançados.",
    features: ["Cardiologia", "Dermatologia", "Ortopedia", "Ginecologia"],
  },
  {
    icon: Microscope,
    title: "Exames Diagnósticos",
    description: "Agende exames laboratoriais e de imagem com facilidade.",
    features: ["Exames de Sangue", "Raio-X", "Ultrassom", "Ressonância"],
  }
];

export function ServicesSection() {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <section className="w-full py-24 bg-gray-900 relative overflow-hidden">
      {/* Efeitos de Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-900 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent" />

      {/* Círculos de Luz */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse delay-700" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Nossos Serviços
          </h2>
          <p className="text-gray-400 text-lg">
            Oferecemos uma ampla gama de serviços de saúde para atender às suas necessidades,
            com profissionais altamente qualificados e tecnologia de ponta.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.title}
              className="relative group"
              onMouseEnter={() => setHoveredService(idx)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className={`
                relative p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700
                transition-all duration-300 hover:border-blue-500/50 hover:translate-y-[-4px]
                ${hoveredService === idx ? 'bg-gray-800/70' : ''}
              `}>
                {/* Ícone */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                  flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-blue-400" />
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300 group-hover:text-gray-200">
                      <ArrowRight className="w-4 h-4 text-blue-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}